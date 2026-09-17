import { useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaRoute {
  sectionRef: RefObject<HTMLElement | null>;
  accentRef: RefObject<HTMLSpanElement | null>;
  graphRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  bindTrack: (index: number) => (node: SVGPathElement | null) => void;
  bindLine: (index: number) => (node: SVGPathElement | null) => void;
  bindNode: (index: number) => (node: HTMLDivElement | null) => void;
  runnerRef: RefObject<HTMLDivElement | null>;
}

// Узлы зигзагом в долях графа; подписи уходят вправо от точки.
const POSITIONS: [number, number][] = [
  [0.06, 0.06],
  [0.4, 0.36],
  [0.06, 0.66],
  [0.36, 0.94],
];
const ACTIVE = 'data-active';

const useCtaRoute = (): IUseCtaRoute => {
  const accentRef = useRef<HTMLSpanElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRefs = useRef<(SVGPathElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runnerRef = useRef<HTMLDivElement>(null);
  const lengths = useRef<number[]>([]);

  const { sectionRef } = useCtaScroll(
    (progress) => {
      const lines = lineRefs.current;
      const runner = runnerRef.current;
      const count = lines.length;
      if (!runner || !count || lengths.current.length !== count) return;

      const travel = seg(progress, 0.04, 0.84) * count;
      lines.forEach((line, index) => {
        const drawn = gsap.utils.clamp(0, 1, travel - index);
        if (line) line.style.strokeDashoffset = String(lengths.current[index] * (1 - drawn));
        nodeRefs.current[index + 1]?.toggleAttribute(ACTIVE, drawn >= 1);
      });
      nodeRefs.current[0]?.toggleAttribute(ACTIVE, travel > 0);
      accentRef.current?.toggleAttribute(ACTIVE, travel >= count);

      // Точка бежит по текущему отрезку и гаснет на последнем узле.
      const index = Math.min(count - 1, Math.floor(travel));
      const line = lines[index];
      if (!line) return;
      const point = line.getPointAtLength(lengths.current[index] * gsap.utils.clamp(0, 1, travel - index));
      runner.style.transform = `translate(${point.x}px, ${point.y}px)`;
      runner.style.opacity = travel > 0 && travel < count ? '1' : '0';
    },
    {
      length: 2,
      measure: () => {
        const graph = graphRef.current;
        const svg = svgRef.current;
        if (!graph || !svg) return;
        const width = graph.clientWidth;
        const height = graph.clientHeight;
        const firstDot = nodeRefs.current[0]?.firstElementChild as HTMLElement | null;
        const radius = (firstDot?.offsetWidth ?? 0) / 2;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        const points = POSITIONS.map(([x, y]) => [x * width + radius, y * height]);
        nodeRefs.current.forEach((node, index) => {
          if (!node) return;
          node.style.left = `${points[index][0] - radius}px`;
          node.style.top = `${points[index][1]}px`;
        });
        lengths.current = lineRefs.current.map((line, index) => {
          const [x1, y1] = points[index];
          const [x2, y2] = points[index + 1];
          const middle = (y1 + y2) / 2;
          const d = `M${x1} ${y1} C${x1} ${middle} ${x2} ${middle} ${x2} ${y2}`;
          trackRefs.current[index]?.setAttribute('d', d);
          if (!line) return 0;
          line.setAttribute('d', d);
          const total = line.getTotalLength();
          line.style.strokeDasharray = String(total);
          return total;
        });
      },
    },
  );

  const bindTrack = (index: number) => (node: SVGPathElement | null) => {
    trackRefs.current[index] = node;
  };
  const bindLine = (index: number) => (node: SVGPathElement | null) => {
    lineRefs.current[index] = node;
  };
  const bindNode = (index: number) => (node: HTMLDivElement | null) => {
    nodeRefs.current[index] = node;
  };

  return { sectionRef, accentRef, graphRef, svgRef, bindTrack, bindLine, bindNode, runnerRef };
};

export default useCtaRoute;
