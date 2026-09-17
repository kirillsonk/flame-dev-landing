import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Дополнение к `mobile` из styles/_mixins.scss: пин только на широких экранах.
const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Доля пина, за которую анимация заканчивается; остаток — пауза с собранным блоком.
const HOLD = 0.85;

/** Кадр варианта: прогресс 0…1 и признак пина. Без пина приходит только финальный кадр. */
export type CtaFrame = (progress: number, pinned: boolean) => void;

export interface IUseCtaScrollOptions {
  /** Длина пина в высотах окна. */
  length?: number;
  /** Замеры размеров: перед первым кадром, на refresh и на resize. */
  measure?: () => void;
}

export interface IUseCtaScroll {
  sectionRef: RefObject<HTMLElement | null>;
}

/**
 * Общий пин вариантов блока «Есть задача?»: секция закрепляется, прогресс прокрутки
 * сглаживается scrub и отдаётся кадру варианта. На мобильном и при reduced motion пина нет,
 * вариант сразу рисует собранное состояние.
 */
const useCtaScroll = (frame: CtaFrame, { length = 1.6, measure }: IUseCtaScrollOptions = {}): IUseCtaScroll => {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef(frame);
  const measureRef = useRef(measure);

  useEffect(() => {
    frameRef.current = frame;
    measureRef.current = measure;
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };

      if (!desktop || !motion) {
        const still = () => {
          measureRef.current?.();
          frameRef.current(1, false);
        };
        still();
        window.addEventListener('resize', still);
        return () => window.removeEventListener('resize', still);
      }

      const state = { progress: 0 };
      const apply = () => frameRef.current(gsap.utils.clamp(0, 1, state.progress / HOLD), true);
      const tween = gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${Math.round(length * 100)}%`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measureRef.current?.();
            apply();
          },
        },
      });
      measureRef.current?.();
      apply();

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [length]);

  return { sectionRef };
};

export default useCtaScroll;
