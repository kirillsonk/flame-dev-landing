import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

/** Четыре вертикали по краям колонок, две горизонтали сверху и снизу, одна мерная линия зазора. */
export const GUIDE_LINES = 7;

export interface IUseContactGuides {
  sectionRef: RefObject<HTMLElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  infoRef: RefObject<HTMLDivElement | null>;
  formRef: RefObject<HTMLDivElement | null>;
  linesRef: RefObject<SVGSVGElement | null>;
  selRef: RefObject<HTMLSpanElement | null>;
  gapTagRef: RefObject<HTMLSpanElement | null>;
  sizeTagRef: RefObject<HTMLSpanElement | null>;
}

interface IBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Координаты без учёта transform: элементы едут твинами, а разметка считается по их месту в сетке.
const boxIn = (el: HTMLElement, root: HTMLElement): IBox => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

const put = (line: SVGLineElement, x1: number, y1: number, x2: number, y2: number) => {
  line.setAttribute('x1', x1.toFixed(1));
  line.setAttribute('y1', y1.toFixed(1));
  line.setAttribute('x2', x2.toFixed(1));
  line.setAttribute('y2', y2.toFixed(1));
};

/**
 * Секция пинится на 170% экрана: направляющие прочерчиваются, колонка текста и форма
 * с рамкой выделения защёлкиваются на них с упругой отдачей (back.out), появляются
 * размеры, затем вся разметка гаснет. На мобильном без пина, при reduced motion — статично.
 */
const useContactGuides = (): IUseContactGuides => {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const selRef = useRef<HTMLSpanElement>(null);
  const gapTagRef = useRef<HTMLSpanElement>(null);
  const sizeTagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const info = infoRef.current;
    const form = formRef.current;
    const svg = linesRef.current;
    const sel = selRef.current;
    const gapTag = gapTagRef.current;
    const sizeTag = sizeTagRef.current;
    if (!section || !inner || !info || !form || !svg || !sel || !gapTag || !sizeTag) return;

    const lines = Array.from(svg.querySelectorAll('line'));
    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;

      const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
      const A = () => boxIn(info, inner);
      const F = () => boxIn(form, inner);

      const layout = () => {
        const a = A();
        const f = F();
        const r = rem();
        const e = r * 4;
        const top = Math.min(a.y, f.y);
        const bottom = Math.max(a.y + a.h, f.y + f.h);
        [a.x, a.x + a.w, f.x, f.x + f.w].forEach((x, i) => put(lines[i], x, top - e * 2, x, bottom + e * 2));
        [top, bottom].forEach((y, i) =>
          put(lines[4 + i], Math.min(a.x, f.x) - e, y, Math.max(a.x + a.w, f.x + f.w) + e, y),
        );

        let gap: number;
        let gx: number;
        let gy: number;
        if (desktop) {
          const my = f.y + f.h / 2;
          put(lines[6], a.x + a.w, my, f.x, my);
          gap = f.x - a.x - a.w;
          gx = (a.x + a.w + f.x) / 2;
          gy = my - r * 3.2;
        } else {
          const mx = f.x + f.w * 0.75;
          put(lines[6], mx, a.y + a.h, mx, f.y);
          gap = f.y - a.y - a.h;
          gx = mx + r;
          gy = (a.y + a.h + f.y) / 2 - r * 1.2;
        }
        gapTag.textContent = String(Math.round(gap));
        sizeTag.textContent = `${Math.round(f.w)} × ${Math.round(f.h)}`;
        gsap.set(gapTag, { x: desktop ? gx - gapTag.offsetWidth / 2 : gx, y: gy });
        gsap.set(sizeTag, { x: f.x + f.w / 2 - sizeTag.offsetWidth / 2, y: f.y + f.h + r * 1.2 });
      };
      layout();

      const r = rem();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: desktop ? 'top top' : 'top 80%',
          end: desktop ? '+=170%' : 'bottom 75%',
          pin: desktop,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: layout,
        },
      });

      lines.forEach((line, index) =>
        tl.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, index * 0.03),
      );
      tl.fromTo(info, { x: -r * 4, y: r * 2.4, autoAlpha: 0.35 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.22, ease: 'back.out(2.2)' }, 0.3)
        .fromTo(sel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, 0.28)
        .fromTo(
          sel,
          { x: () => A().x - r * 4, y: () => A().y + r * 2.4, width: () => A().w, height: () => A().h },
          { x: () => A().x, y: () => A().y, duration: 0.22, ease: 'back.out(2.2)' },
          0.3,
        )
        .to(sel, { x: () => F().x + r * 5, y: () => F().y - r * 3.2, width: () => F().w, height: () => F().h, duration: 0.05, ease: 'power2.inOut' }, 0.53)
        .fromTo(form, { x: r * 5, y: -r * 3.2, autoAlpha: 0.35 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.22, ease: 'back.out(2.2)' }, 0.56)
        .to(sel, { x: () => F().x, y: () => F().y, duration: 0.22, ease: 'back.out(2.2)' }, 0.56)
        .fromTo([gapTag, sizeTag], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.8)
        .to([...lines, gapTag, sizeTag, sel], { autoAlpha: 0, duration: 0.08 }, 0.94);
    });

    return () => mm.revert();
  }, []);

  return { sectionRef, innerRef, infoRef, formRef, linesRef, selRef, gapTagRef, sizeTagRef };
};

export default useContactGuides;
