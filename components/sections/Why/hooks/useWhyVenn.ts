import { gsap } from 'gsap';
import { SCRUB, part, parts } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

// Круги разъезжаются из центра и сходятся; подписи гаснут, ядро Flame Dev проявляется поверх.
const setup: WhyMotionSetup = (root, desktop) => {
  const circles = parts(root, 'circle');
  const labels = parts(root, 'label');
  const core = part(root, 'core');
  const cards = parts(root, 'card');

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: desktop
      ? { trigger: root, start: 'top top', end: '+=150%', scrub: SCRUB, pin: true }
      : { trigger: part(root, 'diagram'), start: 'top 85%', end: 'bottom 40%', scrub: SCRUB },
  });
  tl.fromTo(circles[0], { xPercent: -30, yPercent: -22 }, { xPercent: 0, yPercent: 0, duration: 1 }, 0)
    .fromTo(circles[1], { xPercent: 30, yPercent: -22 }, { xPercent: 0, yPercent: 0, duration: 1 }, 0)
    .fromTo(circles[2], { yPercent: 30 }, { yPercent: 0, duration: 1 }, 0)
    .fromTo(labels, { opacity: 1 }, { opacity: 0, duration: 0.35 }, 0.55)
    .fromTo(core, { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }, 0.8)
    .to(circles, { opacity: 0, duration: 0.2 }, 1);
  if (desktop) {
    tl.fromTo(cards, { opacity: 0.25 }, { opacity: 1, duration: 0.35, stagger: 0.35, ease: 'none' }, 0.2);
  }
};

const useWhyVenn = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhyVenn;
