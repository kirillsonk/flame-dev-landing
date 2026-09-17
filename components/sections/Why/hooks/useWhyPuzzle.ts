import { gsap } from 'gsap';
import { SCRUB, cssVar, part, parts } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

/** Смесь двух hex-цветов: доля `t` первого. */
const mix = (a: string, b: string, t: number) => {
  const from = rgb(a);
  const to = rgb(b);
  return `rgb(${from.map((x, i) => Math.round(x * t + to[i] * (1 - t))).join(',')})`;
};

// Детали разного оттенка разбросаны с поворотом, по скроллу встают на место, «щёлкают»,
// цвета выравниваются и загорается общий контур. Только десктоп с пином.
const setup: WhyMotionSetup = (root, desktop) => {
  if (!desktop) return;

  const row = part(root, 'row');
  const pieces = parts(root, 'card');
  const surface = mix(cssVar('--color-surface'), cssVar('--color-surface'), 1);
  const tints = [
    mix(cssVar('--color-fire'), cssVar('--color-surface'), 0.1),
    mix(cssVar('--color-elevated'), cssVar('--color-surface'), 1),
    mix(cssVar('--color-action-primary'), cssVar('--color-surface'), 0.16),
  ];

  gsap.set(row, { '--glow': 0 });
  pieces.forEach((piece, i) => {
    piece.style.backgroundColor = tints[i];
  });

  const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top top', end: '+=160%', scrub: SCRUB, pin: true } });
  tl.fromTo(
    pieces,
    {
      xPercent: (i: number) => [-14, 0, 14][i],
      yPercent: (i: number) => [14, -12, 22][i],
      rotation: (i: number) => [-9, 5, 11][i],
      scale: 0.92,
    },
    { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: 1, ease: 'power3.inOut', stagger: { each: 0.12, from: 'center' } },
    0,
  )
    .to(row, { scaleX: 0.985, duration: 0.08, ease: 'power2.in' }, 1.22)
    .to(row, { scaleX: 1, duration: 0.25, ease: 'elastic.out(1,.5)' }, 1.3)
    .to(pieces, { backgroundColor: surface, duration: 0.4, ease: 'none' }, 1.3)
    .to(row, { '--glow': 1, duration: 0.4 }, 1.4)
    .to({}, { duration: 0.3 });

  return () => {
    pieces.forEach((piece) => {
      piece.style.backgroundColor = '';
    });
  };
};

const useWhyPuzzle = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhyPuzzle;
