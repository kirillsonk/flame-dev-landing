import { useRef } from 'react';
import type { RefObject } from 'react';
import { easeInOut, easeOut, lerp, seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaCurve {
  sectionRef: RefObject<HTMLElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  gradientRef: RefObject<SVGLinearGradientElement | null>;
  bindPath: (index: number) => (node: SVGPathElement | null) => void;
  bindText: (index: number) => (node: SVGTextElement | null) => void;
  bindOffset: (index: number) => (node: SVGTextPathElement | null) => void;
}

interface ICurveLayout {
  width: number;
  height: number;
  fontSize: number;
  inset: number;
  lines: [number, number];
  amplitude: number;
}

// Сцена в единицах viewBox: на широком экране 1440 по ширине макета, на портретном — узкая.
// Кегль совпадает с --type-display в пересчёте на ширину сцены.
const DESKTOP: ICurveLayout = { width: 1440, height: 440, fontSize: 80, inset: 4, lines: [190, 290], amplitude: 110 };
const MOBILE: ICurveLayout = { width: 620, height: 400, fontSize: 44, inset: 8, lines: [160, 230], amplitude: 90 };
const MOBILE_QUERY = '(max-width: 768px) and (orientation: portrait)';
const POINTS = 90;
// Полторы волны по ширине сцены.
const WAVES = 3 * Math.PI;

const useCtaCurve = (): IUseCtaCurve => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const textRefs = useRef<(SVGTextElement | null)[]>([]);
  const offsetRefs = useRef<(SVGTextPathElement | null)[]>([]);
  const layout = useRef<ICurveLayout>(DESKTOP);

  const wave = (base: number, phase: number, amplitude: number) => {
    const { width, inset } = layout.current;
    let d = '';
    for (let i = 0; i <= POINTS; i += 1) {
      const u = i / POINTS;
      const x = inset + (width - inset * 2) * u;
      const y = base + amplitude * Math.sin(u * WAVES + phase);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };

  const { sectionRef } = useCtaScroll(
    (progress) => {
      const { lines, amplitude } = layout.current;
      const flat = easeInOut(seg(progress, 0.22, 0.84));
      pathRefs.current.forEach((path, index) => {
        path?.setAttribute('d', wave(lines[index], progress * 5 + index * Math.PI, amplitude * (1 - flat)));
      });
      // Строки втекают с правого конца пути, вторая чуть позже первой.
      offsetRefs.current.forEach((textPath, index) => {
        const t = easeOut(seg(progress, index * 0.06, 0.66 + index * 0.06));
        textPath?.setAttribute('startOffset', `${lerp(100, 0, t)}%`);
      });
    },
    {
      length: 1.8,
      measure: () => {
        const next = window.matchMedia(MOBILE_QUERY).matches ? MOBILE : DESKTOP;
        layout.current = next;
        svgRef.current?.setAttribute('viewBox', `0 0 ${next.width} ${next.height}`);
        gradientRef.current?.setAttribute('x2', String(next.width * 0.6));
        textRefs.current.forEach((text) => text?.setAttribute('font-size', String(next.fontSize)));
      },
    },
  );

  const bindPath = (index: number) => (node: SVGPathElement | null) => {
    pathRefs.current[index] = node;
  };
  const bindText = (index: number) => (node: SVGTextElement | null) => {
    textRefs.current[index] = node;
  };
  const bindOffset = (index: number) => (node: SVGTextPathElement | null) => {
    offsetRefs.current[index] = node;
  };

  return { sectionRef, svgRef, gradientRef, bindPath, bindText, bindOffset };
};

export default useCtaCurve;
