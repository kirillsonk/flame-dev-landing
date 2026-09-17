import { gsap } from 'gsap';
import { PROCESS_STEPS } from '@/data/process';
import { part, parts, pinTrigger, PROCESS_SCRUB, toggleOn } from '../helpers';
import useProcessScene from './useProcessScene';

export const BEZEL_LAST = PROCESS_STEPS.length - 1;
const SECTOR = 360 / PROCESS_STEPS.length;

/** Поворот безеля, при котором под индексом стоит сектор шага `index` (может быть дробным). */
export const bezelRotation = (index: number) => `rotate(${-SECTOR * index})`;

const useProcessBezel = () =>
  useProcessScene(
    ({ root, desktop }) => {
      const ring = part<SVGGElement>(root, 'ring');
      if (!ring) return;
      const groups = ['arc', 'label', 'now', 'item'].map((name) => parts<Element>(root, name));

      let current = -1;
      const setActive = (index: number) => {
        if (index === current) return;
        current = index;
        groups.forEach((list) => toggleOn(list, (k) => k === index));
      };

      const state = { step: 0 };
      const render = () => {
        ring.setAttribute('transform', bezelRotation(state.step));
        setActive(Math.round(state.step));
      };
      render();

      const tl = gsap.timeline({
        scrollTrigger: desktop
          ? pinTrigger(root, 360)
          : { trigger: part(root, 'dial') ?? root, start: 'top 75%', end: 'bottom 25%', scrub: PROCESS_SCRUB },
      });
      tl.to({}, { duration: 0.3 });
      // Щелчки по 6°: сектор в 72° проходит за 12 шагов.
      for (let i = 1; i <= BEZEL_LAST; i++) {
        tl.to(state, { step: i, duration: 1, ease: 'steps(12)', onUpdate: render }).to({}, { duration: 0.5 });
      }

      return () => {
        ring.setAttribute('transform', bezelRotation(BEZEL_LAST));
        groups.forEach((list) => toggleOn(list, (k) => k === BEZEL_LAST));
      };
    },
    { mobile: true },
  );

export default useProcessBezel;
