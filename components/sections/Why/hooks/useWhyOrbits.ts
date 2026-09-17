import { gsap } from 'gsap';
import { SCRUB, part, parts } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

// Сколько градусов проходит каждая орбита за скролл и с какого угла стартует.
const TURNS = [300, -420, 540];
const START_ANGLES = [-30, 140, 250];

// Орбиты крутятся и сжимаются к центру, спутники падают в ядро, ядро разгорается.
const setup: WhyMotionSetup = (root, desktop) => {
  const rings = parts(root, 'ring');
  const satellites = parts(root, 'satellite');
  const core = part(root, 'core');

  const tl = gsap.timeline({
    scrollTrigger: desktop
      ? { trigger: root, start: 'top top', end: '+=160%', scrub: SCRUB, pin: true }
      : { trigger: part(root, 'scene'), start: 'top 80%', end: 'bottom 30%', scrub: SCRUB },
  });
  rings.forEach((ring, i) => {
    tl.fromTo(ring, { rotation: START_ANGLES[i], scale: 1 }, { rotation: START_ANGLES[i] + TURNS[i], scale: 0, duration: 1, ease: 'power2.in' }, 0);
    // Подпись крутится навстречу орбите и остаётся читаемой.
    tl.fromTo(
      satellites[i],
      { rotation: -START_ANGLES[i], scale: 1 },
      { rotation: -(START_ANGLES[i] + TURNS[i]), scale: 3, duration: 1, ease: 'power2.in' },
      0,
    );
  });
  tl.fromTo(core, { scale: 0.35, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.8)' }, 0.8).to({}, { duration: 0.2 });
};

const useWhyOrbits = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhyOrbits;
