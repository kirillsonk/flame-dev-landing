'use client';

import { useEffect, useRef } from 'react';
import styles from './PageGlow.module.scss';

const PageGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * window.innerWidth * 0.45;
      targetY = (e.clientY / window.innerHeight - 0.5) * window.innerHeight * 0.35;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
      currentX += dx * 0.06;
      currentY += dy * 0.06;
      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={styles.glow} aria-hidden="true" />;
};

export default PageGlow;
