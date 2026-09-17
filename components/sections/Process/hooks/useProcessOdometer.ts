import { gsap } from 'gsap';
import { PROCESS_ODOMETER } from '@/data/process';
import { part, pinTrigger } from '../helpers';
import useProcessScene from './useProcessScene';

const REEL_LENGTH = 11;
const { weeks } = PROCESS_ODOMETER;
const LAST = weeks.length - 1;

/** Сдвиг ленты барабана в процентах её высоты, чтобы в окне стояла цифра `value`. */
export const reelShift = (value: number) => (-value / REEL_LENGTH) * 100;

const useProcessOdometer = () =>
  useProcessScene(
    ({ root, desktop }) => {
      const step = part(root, 'step');
      const tens = part(root, 'tens');
      const units = part(root, 'units');
      const rows = part(root, 'rows');
      if (!step || !tens || !units || !rows) return;

      const state = { s: 0, w: 0 };
      const render = () => {
        gsap.set(step, { yPercent: reelShift(state.s + 1), y: 0 });
        const unit = state.w % 10;
        gsap.set(units, { yPercent: reelShift(unit), y: 0 });
        // Десятки докручиваются вместе с переходом единиц через 9.
        gsap.set(tens, { yPercent: reelShift(Math.floor(state.w / 10) + Math.max(0, unit - 9)), y: 0 });
        if (desktop) {
          const row = rows.firstElementChild as HTMLElement | null;
          gsap.set(rows, { y: -state.s * (row?.offsetHeight ?? 0) });
        }
      };
      render();

      if (!desktop) {
        gsap.to(state, {
          s: LAST,
          w: weeks[LAST],
          duration: 2.4,
          ease: 'power2.inOut',
          onUpdate: render,
          scrollTrigger: { trigger: part(root, 'meters') ?? root, start: 'top 80%' },
        });
      } else {
        const tl = gsap.timeline({ scrollTrigger: pinTrigger(root, 380) });
        tl.to({}, { duration: 0.3 });
        weeks.slice(1).forEach((week, index) => {
          tl.to(state, { s: index + 1, duration: 1, ease: 'back.inOut(1.3)', onUpdate: render })
            .to(state, { w: week, duration: 1.3, ease: 'power1.inOut', onUpdate: render }, '<')
            .to({}, { duration: 0.5 });
        });
      }

      return () => gsap.set([step, tens, units, rows], { clearProps: 'transform' });
    },
    { mobile: true },
  );

export default useProcessOdometer;
