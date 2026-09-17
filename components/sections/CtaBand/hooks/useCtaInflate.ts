import { useRef } from 'react';
import type { RefObject } from 'react';
import { easeInOut, easeOut, lerp, seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaInflate {
  sectionRef: RefObject<HTMLElement | null>;
  areaRef: RefObject<HTMLDivElement | null>;
  blobRef: RefObject<HTMLDivElement | null>;
  gradientRef: RefObject<HTMLDivElement | null>;
  labelRef: RefObject<HTMLSpanElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

interface IInflateBox {
  startWidth: number;
  startHeight: number;
  width: number;
  height: number;
  radius: number;
}

// Предел высоты раскрытого блока в rem: на высоких окнах он не растягивается во весь экран.
const MAX_HEIGHT = 56;

const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
const rootRem = (name: string) => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0) * remPx();

const useCtaInflate = (): IUseCtaInflate => {
  const areaRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const box = useRef<IInflateBox>({ startWidth: 0, startHeight: 0, width: 0, height: 0, radius: 0 });

  const { sectionRef } = useCtaScroll(
    (progress, pinned) => {
      const blob = blobRef.current;
      const gradient = gradientRef.current;
      const label = labelRef.current;
      const content = contentRef.current;
      if (!blob || !gradient || !label || !content) return;

      // Без пина блок сразу раскрыт и лежит в потоке: размеры задаёт CSS.
      if (!pinned) {
        [blob, gradient, label, content].forEach((el) => el.removeAttribute('style'));
        return;
      }

      const { startWidth, startHeight, width, height, radius } = box.current;
      const t = easeInOut(seg(progress, 0.06, 0.62));
      const currentHeight = lerp(startHeight, height, t);
      blob.style.width = `${lerp(startWidth, width, t)}px`;
      blob.style.height = `${currentHeight}px`;
      blob.style.borderRadius = `${lerp(currentHeight / 2, radius, seg(t, 0.1, 0.7))}px`;
      blob.style.boxShadow = `0 0 ${4 + t * 8}rem rgba(0, 225, 253, ${0.12 + 0.1 * Math.sin(t * Math.PI)})`;
      gradient.style.opacity = String(seg(t, 0.2, 0.9));
      label.style.opacity = String(1 - seg(progress, 0.04, 0.16));

      const shown = easeOut(seg(progress, 0.56, 0.8));
      content.style.width = `${width}px`;
      content.style.opacity = String(shown);
      content.style.visibility = shown > 0.01 ? 'visible' : 'hidden';
      content.style.transform = `translate(-50%, -50%) translateY(${(1 - shown) * 2.4}rem)`;
    },
    {
      length: 1.8,
      measure: () => {
        const area = areaRef.current;
        const label = labelRef.current;
        if (!area || !label) return;
        box.current = {
          startWidth: label.offsetWidth + rootRem('--size-button-hero'),
          startHeight: rootRem('--size-button-hero'),
          width: area.clientWidth,
          height: Math.min(area.clientHeight, MAX_HEIGHT * remPx()),
          radius: rootRem('--radius-panel'),
        };
      },
    },
  );

  return { sectionRef, areaRef, blobRef, gradientRef, labelRef, contentRef };
};

export default useCtaInflate;
