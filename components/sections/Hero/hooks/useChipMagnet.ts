import { useEffect } from 'react';
import type { RefObject } from 'react';

// Пилюля мягко тянется за курсором: смещение = отступ курсора от центра, урезанный
// множителем и потолком в долях высоты. Возврат transform к нулю на уходе, сам пробег
// сглаживает transition в модуле — получается «преследование». Только тонкий указатель,
// уважает prefers-reduced-motion.
const STRENGTH = 0.16;
const MAX_RATIO = 0.1;

const useChipMagnet = (ref: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let point: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!point) return;
      const rect = node.getBoundingClientRect();
      const cap = rect.height * MAX_RATIO;
      const clamp = (value: number) => Math.max(-cap, Math.min(cap, value));
      const x = clamp((point.x - (rect.left + rect.width / 2)) * STRENGTH);
      const y = clamp((point.y - (rect.top + rect.height / 2)) * STRENGTH);
      node.style.setProperty('--chip-x', `${x}px`);
      node.style.setProperty('--chip-y', `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      point = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      node.style.setProperty('--chip-x', '0px');
      node.style.setProperty('--chip-y', '0px');
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
};

export default useChipMagnet;
