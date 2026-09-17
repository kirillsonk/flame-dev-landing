import { useEffect, useState } from 'react';

export interface IUseTimelineOptions {
  /** Пауза перед каждым шагом, мс. Шаг `i` наступает через `delays[i]` после шага `i - 1`. */
  delays: number[];
  /** Сцена на экране и не `inert`: только тогда таймер идёт, иначе сценарий стоит на месте. */
  active: boolean;
  /** prefers-reduced-motion: сценарий сразу приходит к результату. */
  reduced: boolean;
  /** Запустить сценарий при монтировании (стартует, когда демо станет активным). */
  autoStart?: boolean;
}

export interface IUseTimeline {
  /** -1 — не запускали, 0…total — пройдено шагов. */
  step: number;
  total: number;
  running: boolean;
  done: boolean;
  start: () => void;
  reset: () => void;
}

// Пошаговый сценарий демо: один setTimeout за раз, очищается при паузе, смене шага и размонтировании.
const useTimeline = ({ delays, active, reduced, autoStart = false }: IUseTimelineOptions): IUseTimeline => {
  const total = delays.length;
  const [state, setState] = useState({ step: autoStart ? 0 : -1, run: 0 });
  const { step, run } = state;
  const running = step >= 0 && step < total;
  const delay = running ? delays[step] : 0;

  useEffect(() => {
    if (!running || !active) return;
    const timer = window.setTimeout(
      () => setState((current) => (current.run === run ? { run, step: reduced ? total : current.step + 1 } : current)),
      reduced ? 0 : delay,
    );
    return () => window.clearTimeout(timer);
  }, [running, active, reduced, delay, step, run, total]);

  return {
    step,
    total,
    running,
    done: step >= total,
    start: () => setState((current) => ({ step: 0, run: current.run + 1 })),
    reset: () => setState((current) => ({ step: -1, run: current.run + 1 })),
  };
};

export default useTimeline;
