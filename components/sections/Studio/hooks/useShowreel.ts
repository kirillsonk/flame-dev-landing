import { useEffect, useState } from 'react';

// Длительность кадра и наплыва совпадают с анимациями в Showreel.module.scss
export const REEL_SLIDE = 6500;
export const REEL_TRANSITION = 1100;

export interface IUseShowreel {
  active: number;
  /** Кадр, который сейчас наплывает поверх активного */
  incoming: number | null;
  /** Номер смены: перезапускает световую полосу и заполнение деления */
  cycle: number;
  select: (index: number) => void;
}

interface IReelState { active: number; incoming: number | null; cycle: number }

const useShowreel = (length: number, running: boolean): IUseShowreel => {
  const [state, setState] = useState<IReelState>({ active: 0, incoming: null, cycle: 0 });

  useEffect(() => {
    if (!running || state.incoming !== null) return;
    const timer = window.setTimeout(() => setState(value => ({ active: value.active, incoming: (value.active + 1) % length, cycle: value.cycle + 1 })), REEL_SLIDE);
    return () => window.clearTimeout(timer);
  }, [running, length, state.active, state.incoming]);

  useEffect(() => {
    if (state.incoming === null) return;
    const timer = window.setTimeout(() => setState(value => ({ active: value.incoming ?? value.active, incoming: null, cycle: value.cycle })), REEL_TRANSITION);
    return () => window.clearTimeout(timer);
  }, [state.incoming]);

  const select = (index: number) => setState(value => (index === (value.incoming ?? value.active) ? value : { active: value.active, incoming: index, cycle: value.cycle + 1 }));

  return { active: state.active, incoming: state.incoming, cycle: state.cycle, select };
};

export default useShowreel;
