import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Дополнение к `mobile` из styles/_mixins.scss: пин только на широких экранах.
const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

export interface IProcessScene {
  root: HTMLElement;
  /** true — широкий экран, секцию можно пинить; false — мобильная версия без пина. */
  desktop: boolean;
}

/** Сборка анимации варианта. Твины и триггеры внутри откатываются сами, возврат — ручной откат DOM. */
export type ProcessSetup = (scene: IProcessScene) => (() => void) | void;

export interface IUseProcessSceneOptions {
  /** Запускать ли сборку на мобильном; по умолчанию там статичный собранный блок. */
  mobile?: boolean;
}

export interface IUseProcessScene {
  sectionRef: RefObject<HTMLElement | null>;
}

/**
 * Общий каркас вариантов «Как проходит проект». Без JS и при reduced motion разметка показывает
 * собранное состояние; анимация включает `data-live` на секции, и только под ним в стилях
 * появляются начальные скрытые состояния.
 */
const useProcessScene = (setup: ProcessSetup, { mobile = false }: IUseProcessSceneOptions = {}): IUseProcessScene => {
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
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!motion || (!desktop && !mobile)) return;

      root.setAttribute('data-live', '');
      const cleanup = setupRef.current({ root, desktop });
      return () => {
        cleanup?.();
        root.removeAttribute('data-live');
      };
    });

    return () => mm.revert();
  }, [mobile]);

  return { sectionRef };
};

export default useProcessScene;
