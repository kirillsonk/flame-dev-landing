import { gsap } from 'gsap';
import { SCRUB, part, parts, remPx } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

// Расстояние между слоями стопки по оси z, в rem.
const DEPTH_DESKTOP = 11;
const DEPTH_MOBILE = 5;

// Слои опускаются в одну плоскость, стопка разворачивается из изометрии анфас.
const setup: WhyMotionSetup = (root, desktop) => {
  const stack = part(root, 'stack');
  const layers = parts(root, 'layer');
  const tags = parts(root, 'tag');
  const depth = desktop ? DEPTH_DESKTOP : DEPTH_MOBILE;

  const tl = gsap.timeline({
    scrollTrigger: desktop
      ? { trigger: root, start: 'top top', end: '+=150%', scrub: SCRUB, pin: true, invalidateOnRefresh: true }
      : { trigger: stack, start: 'top 85%', end: 'bottom 45%', scrub: SCRUB, invalidateOnRefresh: true },
  });
  tl.fromTo(stack, { rotationX: 52, rotationZ: -30, scale: 0.74 }, { rotationX: 0, rotationZ: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0.25)
    .fromTo(layers, { z: (i: number) => i * depth * remPx() }, { z: 0, duration: 0.9, ease: 'power3.inOut' }, 0)
    .fromTo(tags, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.3)
    .to({}, { duration: 0.2 });
};

const useWhyLayers = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhyLayers;
