import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Блок плавно меняет высоту, когда меняется `trigger` (шаг брифа, отправка).
// Последнюю высоту держит ResizeObserver: к моменту layout-эффекта он еще не видел новую разметку,
// поэтому в ref лежит высота до изменения. Высота при вводе текста не анимируется
const useSmoothHeight = (ref: RefObject<HTMLElement | null>, trigger: unknown, duration = 480) => {
  const last = useRef(0);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(() => { last.current = node.getBoundingClientRect().height; });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  useLayoutEffect(() => {
    const node = ref.current;
    const from = last.current;
    if (!node || !from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    node.getAnimations().forEach(animation => animation.cancel());
    const to = node.getBoundingClientRect().height;
    if (Math.abs(from - to) < 2) return;
    node.animate([{ height: `${from}px`, overflow: 'clip' }, { height: `${to}px`, overflow: 'clip' }], { duration, easing: EASE });
  }, [ref, trigger, duration]);
};

export default useSmoothHeight;
