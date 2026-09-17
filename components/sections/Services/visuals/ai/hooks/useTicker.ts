import { useEffect, useEffectEvent, useState } from 'react';

export interface IUseTickerOptions {
  /** Паузы по кругу: после `delays[i]` вызывается `onTick(i)`, затем ждём `delays[i + 1]`. */
  delays: number[];
  enabled: boolean;
  onTick: (phase: number) => void;
}

// Бесконечный цикл демо (поток комментариев): тикает только пока `enabled`, фаза сохраняется на паузе.
const useTicker = ({ delays, enabled, onTick }: IUseTickerOptions) => {
  const [phase, setPhase] = useState(0);
  const tick = useEffectEvent(onTick);
  const delay = delays[phase % delays.length];

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      tick(phase);
      setPhase((phase + 1) % delays.length);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [enabled, delay, phase, delays.length]);

  return { phase, resetPhase: () => setPhase(0) };
};

export default useTicker;
