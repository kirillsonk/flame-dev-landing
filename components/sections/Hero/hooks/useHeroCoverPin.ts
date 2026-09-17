import { useEffect } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Те же условия, что у перехода к кейсам (useHomeTransition): без них накрытия нет.
const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

/**
 * Пин первого экрана-ленты под накрывающие переходы. Кейсы поднимаются поверх hero
 * с отрицательным отступом на высоту окна (data-cover), поэтому hero должен стоять
 * закреплённым ровно эту высоту — как продлённый пин у HeroOverlay (coverNext).
 * Без пина кейсы накрывали ленту сразу, и первый экран не было видно.
 */
const useHeroCoverPin = (ref: RefObject<HTMLElement | null>, coverNext: boolean) => {
  useEffect(() => {
    const section = ref.current;
    if (!section || !coverNext) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!desktop || !motion) return;

      // По нижней кромке: лента помещается в окно, и пин начинается сразу, с верха страницы.
      // Если лента выше окна (data-free), сначала докручивается её низ.
      const pin = ScrollTrigger.create({
        trigger: section,
        start: 'bottom bottom',
        end: '+=100%',
        pin: true,
        invalidateOnRefresh: true,
      });

      return () => pin.kill();
    });

    return () => mm.revert();
  }, [ref, coverNext]);
};

export default useHeroCoverPin;
