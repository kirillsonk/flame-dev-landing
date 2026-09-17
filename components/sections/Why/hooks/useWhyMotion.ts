import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_QUERY, MOTION_QUERY } from '../motion';

gsap.registerPlugin(ScrollTrigger);

/** Сборка анимации варианта: на десктопе с пином секции, на мобильном без него. */
export type WhyMotionSetup = (root: HTMLElement, desktop: boolean) => void | (() => void);

export interface IUseWhyMotion {
  rootRef: RefObject<HTMLElement | null>;
}

/**
 * Общая обвязка вариантов «Почему мы»: `gsap.matchMedia` по ширине и reduced motion.
 * Начальные состояния задаёт сам setup внутри matchMedia, поэтому без JS и при reduced motion
 * контент стоит в финальном виде. `setup` — функция уровня модуля, ссылка стабильна.
 */
const useWhyMotion = (setup: WhyMotionSetup): IUseWhyMotion => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      return setup(root, desktop);
    });

    return () => mm.revert();
  }, [setup]);

  return { rootRef };
};

export default useWhyMotion;
