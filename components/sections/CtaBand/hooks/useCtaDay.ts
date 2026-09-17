import { useRef } from 'react';
import type { RefObject } from 'react';
import { seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaDay {
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  itemsRef: RefObject<HTMLOListElement | null>;
  fillRef: RefObject<HTMLSpanElement | null>;
  /** Ref-колбэк шага ленты по индексу. */
  bindStep: (index: number) => (node: HTMLLIElement | null) => void;
}

// Заливка идёт чуть дальше середины окна: шаг загорается, когда подъезжает к центру.
const REACH = 0.55;
const ACTIVE = 'data-active';

const useCtaDay = (): IUseCtaDay => {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const travel = useRef(0);

  const { sectionRef } = useCtaScroll(
    (progress, pinned) => {
      const track = trackRef.current;
      const items = itemsRef.current;
      const fill = fillRef.current;
      if (!track || !items || !fill) return;

      // Без пина лента прокручивается пальцем, поэтому стоит на месте и залита целиком.
      const t = pinned ? seg(progress, 0.04, 0.88) : 1;
      items.style.transform = pinned ? `translateX(${-travel.current * t}px)` : '';
      const reach = pinned ? Math.min(items.scrollWidth, travel.current * t + track.clientWidth * REACH) : items.scrollWidth;
      fill.style.width = `${reach}px`;
      stepRefs.current.forEach((step) => step?.toggleAttribute(ACTIVE, step.offsetLeft < reach));
    },
    {
      length: 2.4,
      measure: () => {
        const track = trackRef.current;
        const items = itemsRef.current;
        if (!track || !items) return;
        travel.current = Math.max(0, items.scrollWidth - track.clientWidth);
      },
    },
  );

  const bindStep = (index: number) => (node: HTMLLIElement | null) => {
    stepRefs.current[index] = node;
  };

  return { sectionRef, trackRef, itemsRef, fillRef, bindStep };
};

export default useCtaDay;
