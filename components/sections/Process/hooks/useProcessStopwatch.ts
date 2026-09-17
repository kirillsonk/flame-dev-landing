import { gsap } from 'gsap';
import { PROCESS_STOPWATCH } from '@/data/process';
import { part, parts, pinTrigger, toggleOn } from '../helpers';
import useProcessScene from './useProcessScene';

const { totalDays: TOTAL, laps: LAPS, empty: EMPTY } = PROCESS_STOPWATCH;
const LAST = LAPS.length - 1;
// Сколько держится подсветка строки после отсечки.
const FLASH_MS = 450;

/** Секундная стрелка: оборот — неделя. */
export const handRotation = (day: number) => `rotate(${(day / 7) * 360})`;

/** Малая стрелка: оборот — весь проект. */
export const subhandRotation = (day: number) => `rotate(${(day / TOTAL) * 360} 0 78)`;

/** Неделя и день проекта для подписи под центром. */
export const readout = (day: number) => {
  const whole = Math.min(TOTAL - 1, Math.floor(day));
  return { week: Math.floor(whole / 7) + 1, day: (whole % 7) + 1 };
};

const useProcessStopwatch = () =>
  useProcessScene(({ root }) => {
    const hand = part<SVGLineElement>(root, 'hand');
    const subhand = part<SVGLineElement>(root, 'subhand');
    const crown = part<SVGGElement>(root, 'crown');
    const weekEl = part(root, 'week');
    const dayEl = part(root, 'day');
    if (!hand || !subhand || !crown || !weekEl || !dayEl) return;
    const rows = parts(root, 'row');
    const splits = parts(root, 'split');
    const timers: number[] = [];

    const state = { d: 0 };
    let laps = -1;
    const render = (animate: boolean) => {
      const d = state.d;
      hand.setAttribute('transform', handRotation(d));
      subhand.setAttribute('transform', subhandRotation(d));
      const now = readout(d);
      weekEl.textContent = String(now.week);
      dayEl.textContent = String(now.day);

      const done = LAPS.filter((lap) => d >= lap.day - 0.001).length;
      if (done === laps) return;
      if (animate && done > laps && laps >= 0) {
        // Нажатие кнопки секундомера и вспышка строки с новой отсечкой.
        gsap.fromTo(crown, { y: 0 }, { y: 10, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        const row = rows[done - 1];
        row.setAttribute('data-flash', '');
        timers.push(window.setTimeout(() => row.removeAttribute('data-flash'), FLASH_MS));
      }
      laps = done;
      rows.forEach((row, index) => {
        row.toggleAttribute('data-done', index < done);
        row.toggleAttribute('data-on', index === Math.min(done, LAST));
      });
      splits.forEach((split, index) => {
        split.textContent = index < done ? (split.dataset.split ?? '') : EMPTY;
      });
    };
    render(false);

    gsap.to(state, { d: TOTAL, ease: 'none', onUpdate: () => render(true), scrollTrigger: pinTrigger(root, 400) });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      state.d = TOTAL;
      laps = -1;
      render(false);
      toggleOn(rows, () => false);
      rows.forEach((row) => {
        row.removeAttribute('data-done');
        row.removeAttribute('data-flash');
      });
    };
  });

export default useProcessStopwatch;
