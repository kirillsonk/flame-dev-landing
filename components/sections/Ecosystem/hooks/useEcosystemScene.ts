import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Дополнение к `mobile` из styles/_mixins.scss: пин только на широких экранах.
const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

// Сглаживание прокрутки для всех вариантов блока.
export const ECOSYSTEM_SCRUB = 0.6;

/** Элементы варианта по `data-part`: классы модулей хешируются, поэтому ищем по атрибуту. */
export const parts = <T extends Element = HTMLElement>(root: Element, name: string) =>
  Array.from(root.querySelectorAll<T>(`[data-part="${name}"]`));

export const part = <T extends Element = HTMLElement>(root: Element, name: string) =>
  root.querySelector<T>(`[data-part="${name}"]`);

/** Пин секции на `length` процентов высоты окна. */
export const pinTrigger = (root: HTMLElement, length: number): ScrollTrigger.Vars => ({
  trigger: root,
  start: 'top top',
  end: `+=${length}%`,
  pin: true,
  scrub: ECOSYSTEM_SCRUB,
  invalidateOnRefresh: true,
});

/** Сборка анимации варианта. Твины и триггеры внутри откатываются сами, возврат — ручной откат DOM. */
export type EcosystemSetup = (root: HTMLElement) => (() => void) | void;

export interface IUseEcosystemScene {
  sectionRef: RefObject<HTMLElement | null>;
}

/**
 * Общий каркас вариантов «Flame — это ещё и». Без JS, на мобильном и при reduced motion
 * разметка показывает собранное состояние; анимация включает `data-live` на секции,
 * и только под ним в стилях появляются начальные скрытые состояния.
 */
const useEcosystemScene = (setup: EcosystemSetup): IUseEcosystemScene => {
  const sectionRef = useRef<HTMLElement>(null);
  const setupRef = useRef(setup);

  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as {
        desktop: boolean;
        motion: boolean;
      };
      if (!desktop || !motion) return;

      root.setAttribute('data-live', '');
      const cleanup = setupRef.current(root);
      return () => {
        cleanup?.();
        root.removeAttribute('data-live');
      };
    });

    return () => mm.revert();
  }, []);

  return { sectionRef };
};

export default useEcosystemScene;
