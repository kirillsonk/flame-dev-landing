import { useRef } from 'react';
import type { RefObject } from 'react';
import { CTA_REEL } from '@/data/site';
import { easeInOut, easeOut, lerp, seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaReel {
  sectionRef: RefObject<HTMLElement | null>;
  windowRef: RefObject<HTMLSpanElement | null>;
  stripRef: RefObject<HTMLSpanElement | null>;
  bindWord: (index: number) => (node: HTMLSpanElement | null) => void;
}

// Высота строки барабана в em — совпадает с line-height заголовка в CtaReel.module.scss.
const LINE = 1.15;
const STEPS = CTA_REEL.words.length;

const useCtaReel = (): IUseCtaReel => {
  const windowRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const widths = useRef<number[]>([]);

  const { sectionRef } = useCtaScroll(
    (progress) => {
      const win = windowRef.current;
      const strip = stripRef.current;
      const words = wordRefs.current;
      if (!win || !strip) return;

      // Каждый шаг: сначала зачёркивается текущий срок, потом барабан докручивается к следующему.
      let position = 0;
      for (let step = 0; step < STEPS; step += 1) {
        const local = seg(progress, 0.02 + step * 0.2, 0.22 + step * 0.2);
        words[step]?.style.setProperty('--strike', String(easeOut(seg(local, 0, 0.45))));
        position += easeInOut(seg(local, 0.55, 1));
      }
      strip.style.transform = `translateY(${-position * LINE}em)`;

      // Окно барабана подстраивается под ширину слова, чтобы после «дня.» не оставалось дыры.
      const index = Math.min(STEPS - 1, Math.floor(position));
      if (widths.current.length) {
        win.style.width = `${lerp(widths.current[index], widths.current[index + 1], position - index)}px`;
      }
    },
    {
      length: 2,
      measure: () => {
        const win = windowRef.current;
        if (!win) return;
        win.style.width = '';
        widths.current = wordRefs.current.map((word) => word?.offsetWidth ?? 0);
      },
    },
  );

  const bindWord = (index: number) => (node: HTMLSpanElement | null) => {
    wordRefs.current[index] = node;
  };

  return { sectionRef, windowRef, stripRef, bindWord };
};

export default useCtaReel;
