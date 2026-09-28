'use client';

import { useEffect, useRef } from 'react';
import { FLAME_BASE } from '@/components/sections/Services/flame';
import styles from './FlameField.module.scss';

// The logo contour is rendered only while scroll interpolation is moving
const FlameField = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const shape = new Path2D(FLAME_BASE);
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
      const size = Math.min(width * (mobile ? 1.35 : .72), 1040);
      const centerX = width * (mobile ? .78 : .67) + Math.sin(phase * .85) * width * .12;
      const centerY = height * .52 + Math.sin(phase * .55) * height * .13;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const halo = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * .65);
      halo.addColorStop(0, blue + (light ? '13' : '22'));
      halo.addColorStop(1, blue + '00');
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);
      context.translate(centerX, centerY);
      context.rotate(-.14 + Math.sin(phase * .38) * .15);
      context.scale(size, size);
      context.translate(-.5, -.59);
      const shimmer = context.createLinearGradient(-.2 + Math.sin(phase * .8) * .3, .05, 1.1, 1.2);
      shimmer.addColorStop(0, blue);
      shimmer.addColorStop(.42, blue);
      shimmer.addColorStop(.67, cyan);
      shimmer.addColorStop(1, blue);
      context.fillStyle = shimmer;
      context.globalAlpha = light ? .035 : .045;
      context.fill(shape);
      context.strokeStyle = shimmer;
      const count = mobile ? 20 : 32;
      for (let line = 0; line < count; line++) {
        const t = line / (count - 1);
        const scale = .48 + t * .68;
        context.save();
        context.translate(.5, .78);
        context.rotate(Math.sin(phase * .4 + t * 1.4) * .07);
        context.scale(scale, scale);
        context.translate(-.5, -.78);
        context.lineWidth = (mobile ? .7 : .9) / size / scale;
        context.globalAlpha = (light ? .15 : .3) * (.3 + Math.sin(t * Math.PI) * .7);
        context.stroke(shape);
        context.restore();
      }
      // A single moving highlight follows the same recognizable brand silhouette
      context.globalAlpha = light ? .2 : .45;
      context.lineWidth = 1.3 / size;
      context.setLineDash([.12, .08, .025, 3]);
      context.lineDashOffset = -phase * .18;
      context.stroke(shape);
      context.setLineDash([]);
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
