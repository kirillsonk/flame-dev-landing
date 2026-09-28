import { useEffect } from 'react';
import type { RefObject } from 'react';
import { morphState } from './useHeroMorph';

/**
 * Парение и наклон за курсором для `[data-float]` внутри корня. Параметры на элементе:
 * `data-depth` сила реакции на курсор, `data-amp` амплитуда дрейфа в px, `data-tilt` базовый поворот.
 * Все смещения гаснут вместе с прогрессом перелета, к посадке в галерею слой без трансформаций
 */
const useFloat = (rootRef: RefObject<HTMLElement | null>, key: string) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-float]')).map((element, index) => ({
      element,
      depth: Number(element.dataset.depth ?? 1),
      amp: Number(element.dataset.amp ?? 6),
      tilt: Number(element.dataset.tilt ?? 0),
      phase: index * 1.7,
      speed: .00035 + index * .00004,
    }));
    if (items.length === 0) return;

    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;

    const render = (time: number) => {
      frame = 0;
      smooth.x += (pointer.x - smooth.x) * .06;
      smooth.y += (pointer.y - smooth.y) * .06;
      // Гаснет к 80% перелета, чтобы к посадке в галерею слой уже стоял ровно
      const calm = Math.max(0, 1 - morphState.progress * 1.25);
      items.forEach(({ element, depth, amp, tilt, phase, speed }) => {
        const drift = Math.sin(time * speed + phase);
        const x = (drift * amp + smooth.x * depth * 14) * calm;
        const y = (Math.cos(time * speed * 1.3 + phase) * amp + smooth.y * depth * 10) * calm;
        const rx = (-smooth.y * depth * 7 + drift * 1.2) * calm;
        const ry = smooth.x * depth * 9 * calm;
        element.style.transform = `perspective(1400px) translate3d(${x}px, ${y}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${tilt * calm}deg)`;
      });
      if (visible && !document.hidden) frame = requestAnimationFrame(render);
    };
    const start = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };

    // При уменьшении движения слой стоит в базовом повороте
    if (motion.matches) {
      items.forEach(({ element, tilt }) => { element.style.transform = `rotateZ(${tilt}deg)`; });
      return () => items.forEach(({ element }) => { element.style.transform = ''; });
    }

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.y = event.clientY / window.innerHeight * 2 - 1;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const visibility = () => (document.hidden ? stop() : start());
    // Слой уже вне окна, но еще летит в галерею: кадр на каждый скролл, чтобы наклон погас вместе с перелетом
    const scroll = () => { if (!frame) frame = requestAnimationFrame(render); };
    observer.observe(root);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', visibility);
      items.forEach(({ element }) => { element.style.transform = ''; });
    };
  }, [rootRef, key]);
};

export default useFloat;
