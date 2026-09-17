import { createRef, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Дополнение к `mobile` из styles/_mixins.scss: пин только на широких экранах.
const PINNED_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

export interface IUseCasesMarqueeOptions {
  /** Доля пробега каждой строки: 1 — от первой карточки до последней, меньше — медленнее. */
  speeds?: number[];
  /** Пустой участок пина в начале (px): секция уже стоит, строки ещё не едут. Нужен переходу от hero. */
  lead?: () => number;
}

export interface IUseCasesMarquee {
  sectionRef: RefObject<HTMLElement | null>;
  rowRefs: RefObject<HTMLDivElement | null>[];
}

/**
 * Секция кейсов пинится, и строки проезжают по скроллу навстречу друг другу: нечётные
 * из начального положения уходят влево, чётные стартуют с конца и приезжают к началу.
 * Длина пина равна большему из пробегов, поэтому пин заканчивается ровно тогда, когда
 * самая длинная строка показала все карточки. На мобильном и при reduced motion пина нет.
 */
const useCasesMarquee = (count: number, { speeds, lead }: IUseCasesMarqueeOptions = {}): IUseCasesMarquee => {
  const sectionRef = useRef<HTMLElement | null>(null);
  // Массив ref под строки создаётся один раз: количество строк задано данными и не меняется.
  const [rowRefs] = useState<RefObject<HTMLDivElement | null>[]>(() =>
    Array.from({ length: count }, () => createRef<HTMLDivElement>()),
  );

  useEffect(() => {
    const section = sectionRef.current;
    const rows = rowRefs.map((ref) => ref.current);
    if (!section || rows.some((row) => !row)) return;

    const mm = gsap.matchMedia();
    mm.add({ pinned: PINNED_QUERY, motion: MOTION_QUERY }, (context) => {
      const { pinned, motion } = context.conditions as { pinned: boolean; motion: boolean };
      if (!pinned || !motion) return;

      const distance = (row: HTMLDivElement, index: number) =>
        Math.max(0, row.scrollWidth - section.clientWidth) * (speeds?.[index] ?? 1);
      const travel = () => Math.max(...rows.map((row, index) => distance(row as HTMLDivElement, index)));
      const vh = () => window.innerHeight;

      // Пин: секция стоит, пока самая длинная строка не проедет весь путь (плюс пустой участок lead).
      const pin = ScrollTrigger.create({
        trigger: section,
        pin: true,
        start: 'top top',
        end: () => `+=${(lead ? lead() : 0) + travel()}`,
        invalidateOnRefresh: true,
      });

      // Движение строк сквозное: начинается, когда секция показывается снизу, идёт весь пин
      // и продолжается, пока секция уходит под следующий блок. Длительности в пикселях
      // прокрутки: scrub растягивает их на весь отрезок.
      const leadPx = lead ? lead() : 0;
      const travelPx = travel();
      const enterPx = vh();
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: () => `+=${vh() + (lead ? lead() : 0) + travel() + vh()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // Пустой участок (переход от hero): секция уже у верха, строки ещё стоят.
      if (leadPx > 0) timeline.to({}, { duration: leadPx }, enterPx);
      rows.forEach((row, index) => {
        const el = row as HTMLDivElement;
        const total = enterPx + leadPx + travelPx + enterPx;
        if (index % 2 === 0) {
          timeline.fromTo(el, { x: 0 }, { x: () => -distance(el, index), duration: total }, 0);
        } else {
          timeline.fromTo(el, { x: () => -distance(el, index) }, { x: 0, duration: total }, 0);
        }
      });

      return () => {
        pin.kill();
        timeline.scrollTrigger?.kill();
        timeline.revert().kill();
      };
    });

    return () => mm.revert();
  }, [rowRefs, speeds, lead]);

  return { sectionRef, rowRefs };
};

export default useCasesMarquee;
