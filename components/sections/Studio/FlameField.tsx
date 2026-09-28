'use client';

import { useEffect, useRef } from 'react';
import styles from './FlameField.module.scss';

// Soft light filaments respond to scroll and stop drawing while idle
const FlameField = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, ratio = 1, frame = 0;
    let current = window.scrollY, target = current;
    let blue = '', cyan = '', light = false;
    const readColors = () => {
      const tokens = getComputedStyle(document.documentElement);
      blue = tokens.getPropertyValue('--color-action-primary').trim();
      cyan = tokens.getPropertyValue('--color-action-accent').trim();
      light = document.documentElement.dataset.theme === 'light';
    };
    const draw = () => {
      frame = 0;
      current += (target - current) * .09;
      if (Math.abs(target - current) < .2) current = target;
      const phase = media.matches ? 0 : current / Math.max(height, 1);
      const mobile = width <= 900;
      const center = width * (mobile ? .86 : .79) + Math.sin(phase * .72) * width * .2;
      const spread = Math.min(width * .48, 650);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const halo = context.createRadialGradient(center, height * .48, 0, center, height * .48, spread * .95);
      halo.addColorStop(0, blue + (light ? '13' : '26'));
      halo.addColorStop(1, blue + '00');
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, blue);
      gradient.addColorStop(.58, blue);
      gradient.addColorStop(.83, cyan);
      gradient.addColorStop(1, blue);
      context.strokeStyle = gradient;
      context.lineWidth = mobile ? .7 : .85;
      const lines = mobile ? 24 : 42;
      for (let line = 0; line < lines; line++) {
        const ribbon = line / (lines - 1);
        context.globalAlpha = (light ? .17 : mobile ? .22 : .38) * (.35 + Math.sin(ribbon * Math.PI) * .65);
        context.beginPath();
        for (let point = 0; point <= 96; point++) {
          const t = point / 96;
          const twist = t * Math.PI * 2.1 + phase * .36;
          const envelope = Math.sin(t * Math.PI);
          const x = center + Math.sin(twist) * spread * .35 + Math.cos(twist * 1.25 + ribbon * 1.8) * spread * envelope * .3 + (ribbon - .5) * spread * (.2 + envelope * .65);
          const y = (t * 1.6 - .3) * height + Math.sin(twist + ribbon * 2.8) * height * .1;
          if (point === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.globalAlpha = 1;
      if (!media.matches && !document.hidden && current !== target) frame = requestAnimationFrame(draw);
    };
    const request = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); };
    const scroll = () => { target = window.scrollY; if (!media.matches) request(); };
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
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
    media.addEventListener('change', request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('flame-theme-change', theme);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', request);
    };
  }, []);
  return <div className={styles.field} aria-hidden="true"><canvas ref={ref} /></div>;
};
export default FlameField;
