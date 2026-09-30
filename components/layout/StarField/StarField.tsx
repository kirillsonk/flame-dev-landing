'use client';

import { useEffect, useRef } from 'react';
import styles from './StarField.module.scss';

interface IStar {
  x: number;
  y: number;
  radius: number;
  /** Слой глубины: доля прокрутки, на которую звезда смещается */
  depth: number;
  alpha: number;
  phase: number;
  speed: number;
  bright: boolean;
}

// Плотность: звезд на миллион пикселей окна
const DENSITY = 150;
const LAYERS = [.06, .16, .32];
// Высота полотна в окнах: звезды бесконечно повторяются по вертикали
const SPAN = 1.6;

// Детерминированный генератор: небо одинаковое при каждом заходе, без прыжков после гидрации
const random = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

// Звездное небо за каталогом кейсов: слои едут с разной скоростью при прокрутке, звезды мягко мерцают.
// Цвета из токенов темы, при уменьшении движения небо неподвижно
const StarField = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, ratio = 1, frame = 0, last = 0;
    let current = window.scrollY, target = current;
    let stars: IStar[] = [];
    let base = '', accent = '', light = false;

    const readColors = () => {
      const tokens = getComputedStyle(document.documentElement);
      base = tokens.getPropertyValue('--color-text').trim();
      accent = tokens.getPropertyValue('--color-action-accent').trim();
      light = document.documentElement.dataset.theme === 'light';
    };

    const seed = () => {
      const next = random(20260930);
      const count = Math.round(width * height * SPAN / 1e6 * DENSITY);
      stars = Array.from({ length: count }, () => {
        const layer = Math.floor(next() * LAYERS.length);
        const bright = next() > .93;
        return {
          x: next() * width,
          y: next() * height * SPAN,
          radius: (bright ? 1.4 : .5) + next() * (layer + 1) * .35,
          depth: LAYERS[layer],
          alpha: .25 + next() * .55,
          phase: next() * Math.PI * 2,
          speed: .0006 + next() * .0012,
          bright,
        };
      });
    };

    const draw = (time: number) => {
      frame = 0;
      current += (target - current) * .08;
      if (Math.abs(target - current) < .2) current = target;
      const still = motion.matches;
      const span = height * SPAN;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const offset = still ? 0 : current * star.depth;
        const y = ((star.y - offset) % span + span) % span;
        if (y > height + 8) continue;
        const twinkle = still ? 1 : .72 + Math.sin(time * star.speed + star.phase) * .28;
        const alpha = star.alpha * twinkle * (light ? .5 : 1);
        context.globalAlpha = alpha;
        context.fillStyle = star.bright ? accent : base;
        if (star.bright) {
          // Яркая звезда: мягкое свечение вокруг ядра
          const glow = context.createRadialGradient(star.x, y, 0, star.x, y, star.radius * 5);
          glow.addColorStop(0, accent);
          glow.addColorStop(1, 'transparent');
          context.globalAlpha = alpha * .35;
          context.fillStyle = glow;
          context.fillRect(star.x - star.radius * 5, y - star.radius * 5, star.radius * 10, star.radius * 10);
          context.globalAlpha = alpha;
          context.fillStyle = accent;
        }
        context.beginPath();
        context.arc(star.x, y, star.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      last = time;
      if (!still && !document.hidden) frame = requestAnimationFrame(tick);
    };
    // Мерцанию хватает 30 кадров в секунду, прокрутка рисуется на каждом кадре
    const tick = (time: number) => {
      if (current === target && time - last < 33) { frame = requestAnimationFrame(tick); return; }
      draw(time);
    };
    const request = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); };
    const scroll = () => { target = window.scrollY; request(); };
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      seed();
      request();
    };
    const theme = () => { readColors(); request(); };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else { target = window.scrollY; request(); }
    };

    readColors(); resize();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('flame-theme-change', theme);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('flame-theme-change', theme);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', request);
    };
  }, []);

  return <div className={styles.field} aria-hidden="true"><canvas ref={ref} /></div>;
};

export default StarField;
