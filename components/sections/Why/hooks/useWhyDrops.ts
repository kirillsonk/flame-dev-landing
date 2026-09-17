import { gsap } from 'gsap';
import { SCRUB, part, parts } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

// Капли стартуют разнесёнными по сцене (в долях её ширины и высоты) и стягиваются в центр,
// где вырастает общая капля. На десктопе — с пином, на мобильном — по проходу сцены.
const setup: WhyMotionSetup = (root, desktop) => {
  const scene = part(root, 'scene');
  const blobs = parts(root, 'blob');
  const labels = parts(root, 'label');
  const core = part(root, 'core');
  const spread = desktop ? 0.36 : 0.3;
  const positions = [
    [-spread, 0.12],
    [0, -0.28],
    [spread, 0.1],
  ];

  const tl = gsap.timeline({
    scrollTrigger: desktop
      ? { trigger: root, start: 'top top', end: '+=150%', scrub: SCRUB, pin: true, invalidateOnRefresh: true }
      : { trigger: scene, start: 'top 80%', end: 'bottom 35%', scrub: SCRUB, invalidateOnRefresh: true },
  });
  blobs.forEach((blob, i) => {
    const from = { x: () => positions[i][0] * scene.clientWidth, y: () => positions[i][1] * scene.clientHeight };
    tl.fromTo(blob, { ...from, scale: 1 }, { x: 0, y: 0, scale: 0.9, duration: 1, ease: 'power2.inOut' }, 0);
    tl.fromTo(labels[i], { ...from, opacity: 1 }, { x: 0, y: 0, opacity: 0, duration: 0.8, ease: 'power2.in' }, 0);
  });
  tl.fromTo(core, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0.75)
    .to(blobs, { scale: 0.5, duration: 0.4 }, 1)
    .to({}, { duration: 0.2 });
};

const useWhyDrops = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhyDrops;
