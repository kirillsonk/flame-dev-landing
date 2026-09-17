import { gsap } from 'gsap';
import { SCRUB, cssVar, part, parts } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

// Точка крепления луча в долях сцены и стартовое отклонение угла, в градусах.
const ANCHORS: [number, number, number][] = [
  [0, 0, 38],
  [1, 0, -34],
  [0.5, 1, 26],
];

const rgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${alpha})`;
};

// Лучи светят вразнобой и по скроллу сводятся на заголовок; заголовок и карточки освещаются.
// Только десктоп: на мобильном лучи скрыты вёрсткой.
const setup: WhyMotionSetup = (root, desktop) => {
  if (!desktop) return;

  const title = part(root, 'title');
  const beams = parts(root, 'beam');
  const sources = parts(root, 'source');
  const cards = parts(root, 'card');
  const accent = cssVar('--color-action-accent');

  const target = () => ({ x: title.offsetLeft + title.offsetWidth / 2, y: title.offsetTop + title.offsetHeight / 2 });
  const delta = (i: number) => {
    const { x, y } = target();
    return { dx: x - ANCHORS[i][0] * root.clientWidth, dy: y - ANCHORS[i][1] * root.clientHeight };
  };
  const aim = (i: number) => {
    const { dx, dy } = delta(i);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const length = (i: number) => {
    const { dx, dy } = delta(i);
    return Math.hypot(dx, dy) * 1.35;
  };

  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: 'top top', end: '+=160%', scrub: SCRUB, pin: true, invalidateOnRefresh: true },
  });
  tl.fromTo(
    beams,
    { width: (i: number) => length(i), rotation: (i: number) => aim(i) + ANCHORS[i][2], opacity: 0.35 },
    { width: (i: number) => length(i), rotation: (i: number) => aim(i), opacity: 0.75, duration: 1, ease: 'power2.inOut', stagger: 0.1 },
    0,
  )
    .fromTo(
      title,
      { color: cssVar('--color-text-dim'), textShadow: `0 0 0px ${rgba(accent, 0)}` },
      { color: cssVar('--color-text'), textShadow: `0 0 40px ${rgba(accent, 0.35)}`, duration: 0.5 },
      0.8,
    )
    .fromTo(cards, { opacity: 0.35 }, { opacity: 1, duration: 0.5, stagger: 0.1 }, 0.9)
    .to(sources, { opacity: 0.35, duration: 0.4 }, 1)
    .to(beams, { opacity: 0.45, duration: 0.4 }, 1.3);
};

const useWhySpotlights = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhySpotlights;
