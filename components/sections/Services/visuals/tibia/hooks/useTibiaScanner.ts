import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';

export interface IUseTibiaScanner {
  rootRef: RefObject<HTMLDivElement | null>;
  laserRef: RefObject<HTMLDivElement | null>;
  done: number[];
  hot: number | null;
  fresh: number | null;
  last: number | null;
  reading: boolean;
  bindTag: (index: number) => (node: HTMLButtonElement | null) => void;
  scan: (index: number) => void;
  aim: (index: number | null, event: PointerEvent) => void;
  move: (event: PointerEvent<HTMLDivElement>) => void;
  leave: () => void;
  reset: () => void;
}

/** Сколько лазер держит бирку, пока не считает штрихкод. */
const READ_MS = 450;
const FRESH_MS = 900;

const useTibiaScanner = (): IUseTibiaScanner => {
  const rootRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const [done, setDone] = useState<number[]>([0]);
  const [hot, setHot] = useState<number | null>(null);
  const [fresh, setFresh] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);

  useEffect(() => {
    if (fresh === null) return;
    const id = window.setTimeout(() => setFresh(null), FRESH_MS);
    return () => window.clearTimeout(id);
  }, [fresh]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const beep = () => {
    try {
      audio.current ??= new AudioContext();
      const ctx = audio.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = 2700;
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.13);
    } catch {
      // Звук — украшение: без Web Audio демо работает молча.
    }
  };

  const scan = (index: number) => {
    window.clearTimeout(timer.current);
    setHot(null);
    if (done.includes(index)) return;
    beep();
    const tag = tagRefs.current[index];
    if (tag && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tag.animate(
        [
          { boxShadow: '0 0 0 0 var(--color-text), 0 0 4rem 1rem var(--color-action-accent)' },
          { boxShadow: '0 0 0 0 transparent' },
        ],
        { duration: 500 },
      );
    }
    setDone((current) => (current.includes(index) ? current : [...current, index]));
    setFresh(index);
    setLast(index);
  };

  const aim = (index: number | null, event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    window.clearTimeout(timer.current);
    if (index === null || done.includes(index)) {
      setHot(null);
      return;
    }
    setHot(index);
    timer.current = window.setTimeout(() => scan(index), READ_MS);
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    const laser = laserRef.current;
    if (!root || !laser || event.pointerType === 'touch') return;
    const rect = root.getBoundingClientRect();
    laser.style.transform = `translate(${event.clientX - rect.left}px, ${event.clientY - rect.top}px)`;
    laser.dataset.on = '';
  };

  const leave = () => {
    delete laserRef.current?.dataset.on;
    window.clearTimeout(timer.current);
    setHot(null);
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setDone([0]);
    setHot(null);
    setFresh(null);
    setLast(null);
  };

  const bindTag = (index: number) => (node: HTMLButtonElement | null) => {
    tagRefs.current[index] = node;
  };

  return {
    rootRef,
    laserRef,
    done,
    hot,
    fresh,
    last,
    reading: hot !== null,
    bindTag,
    scan,
    aim,
    move,
    leave,
    reset,
  };
};

export default useTibiaScanner;
