import { gsap } from 'gsap';
import { PROCESS_GANTT } from '@/data/process';
import { part, parts, pinTrigger, PROCESS_SCRUB, toggleOn } from '../helpers';
import useProcessScene from './useProcessScene';

const { weeks: WEEKS, bars: BARS } = PROCESS_GANTT;
const LAST = BARS.length - 1;

const useProcessGantt = () =>
  useProcessScene(
    ({ root, desktop }) => {
      const cursor = part(root, 'cursor');
      const cursorLabel = part(root, 'cursor-label');
      if (!cursor || !cursorLabel) return;
      const labels = parts(root, 'label');
      const notes = parts(root, 'note');
      const weeks = parts(root, 'week');
      const facts = parts(root, 'fact');
      const demos = BARS.map((_, index) => parts(root, `demo-${index}`));
      const initialLabel = cursorLabel.textContent;

      const state = { w: 0 };
      let currentNote = -1;
      const render = () => {
        const w = state.w;
        cursor.style.left = `${(w / WEEKS) * 100}%`;
        cursorLabel.textContent =
          w < 0.05
            ? PROCESS_GANTT.start
            : w >= WEEKS - 0.05
              ? PROCESS_GANTT.finish
              : `${PROCESS_GANTT.today} ${Math.min(WEEKS, Math.floor(w) + 1)}`;
        toggleOn(weeks, (index) => index < Math.ceil(w));

        let active = 0;
        BARS.forEach((bar, index) => {
          const done = gsap.utils.clamp(0, 1, (w - bar.start) / (bar.end - bar.start));
          facts[index]?.style.setProperty('clip-path', `inset(0 ${(1 - done) * 100}% 0 0)`);
          labels[index]?.toggleAttribute('data-on', w >= bar.start && (w <= bar.end || index === LAST));
          if (w >= bar.start) active = index;
          (bar.demos ?? []).forEach((demo, k) => demos[index][k]?.toggleAttribute('data-on', w >= demo));
        });
        if (active !== currentNote) {
          currentNote = active;
          toggleOn(notes, (index) => index === active);
        }
      };
      render();

      gsap.to(state, {
        w: WEEKS,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: desktop
          ? pinTrigger(root, 320)
          : { trigger: part(root, 'chart') ?? root, start: 'top 70%', end: 'bottom 35%', scrub: PROCESS_SCRUB },
      });

      return () => {
        cursor.style.removeProperty('left');
        cursorLabel.textContent = initialLabel;
        facts.forEach((fact) => fact.style.removeProperty('clip-path'));
        toggleOn([...weeks, ...demos.flat()], () => true);
        toggleOn([...labels, ...notes], () => false);
      };
    },
    { mobile: true },
  );

export default useProcessGantt;
