import { useRef } from 'react';
import type { RefObject } from 'react';
import { easeInOut, easeOut, lerp, seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaSplit {
  sectionRef: RefObject<HTMLElement | null>;
  seamRef: RefObject<HTMLDivElement | null>;
  topRef: RefObject<HTMLDivElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  underRef: RefObject<HTMLDivElement | null>;
}

const useCtaSplit = (): IUseCtaSplit => {
  const seamRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const underRef = useRef<HTMLDivElement>(null);

  const { sectionRef } = useCtaScroll(
    (progress) => {
      const seam = seamRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;
      const under = underRef.current;
      if (!seam || !top || !bottom || !under) return;

      // Сначала линия разреза прочерчивается слева направо, потом половины расходятся с наклоном.
      seam.style.transform = `scaleX(${easeOut(seg(progress, 0, 0.2))})`;
      seam.style.opacity = String(1 - seg(progress, 0.3, 0.42));
      const t = easeInOut(seg(progress, 0.24, 0.84));
      top.style.transform = `translateY(${-t * 104}%) rotate(${-t * 5}deg)`;
      bottom.style.transform = `translateY(${t * 104}%) rotate(${-t * 5}deg)`;
      under.style.transform = `scale(${lerp(0.88, 1, easeOut(seg(progress, 0.3, 0.9)))})`;
    },
    { length: 1.8 },
  );

  return { sectionRef, seamRef, topRef, bottomRef, underRef };
};

export default useCtaSplit;
