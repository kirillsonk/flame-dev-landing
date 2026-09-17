import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { TIBIA_CONVEYOR as copy } from '@/data/demosTibia';
import useDemoActive from './useDemoActive';

export interface IConveyorPipe {
  id: string;
  bad: boolean;
  seen: boolean;
  marked: boolean;
  dropping: boolean;
  /** Стартовая позиция, % ширины линии; дальше `left` пишет цикл напрямую в DOM. */
  start: number;
}

export type ConveyorTone = 'idle' | 'ok' | 'error';

export interface IConveyorSnapshot {
  pipes: IConveyorPipe[];
  score: [number, number, number];
  queue: number;
  message: string;
  tone: ConveyorTone;
  /** idle — заставка до первой смены, running — линия едет, over — итог смены. */
  phase: 'idle' | 'running' | 'over';
  accuracy: number;
}

export interface IUseTibiaConveyor {
  rootRef: RefObject<HTMLDivElement | null>;
  markRef: RefObject<HTMLButtonElement | null>;
  startRef: RefObject<HTMLButtonElement | null>;
  snapshot: IConveyorSnapshot;
  firing: boolean;
  bindPipe: (id: string) => (node: HTMLDivElement | null) => void;
  start: () => void;
  stop: () => void;
  mark: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

interface IGamePipe extends IConveyorPipe {
  x: number;
  checked: boolean;
  gone: number;
}

export const ZONES = { detector: 28, head: 60, reject: 84 };
const TOTAL = 20;
const WINDOW = 3.6;
const EXIT = 106;
const DROP_MS = 600;
const BAD_RATE = 0.28;

// Стартовый кадр: пара труб уже на линии, одна с меткой брака, одна промаркирована.
const INITIAL: IConveyorPipe[] = [
  { id: `${copy.serialPrefix}038`, bad: false, seen: false, marked: false, dropping: false, start: 14 },
  { id: `${copy.serialPrefix}039`, bad: true, seen: true, marked: false, dropping: false, start: 40 },
  { id: `${copy.serialPrefix}040`, bad: false, seen: true, marked: true, dropping: false, start: 66 },
];

const INITIAL_SNAPSHOT: IConveyorSnapshot = {
  pipes: INITIAL,
  score: [0, 0, 0],
  queue: TOTAL,
  message: copy.stopped,
  tone: 'idle',
  phase: 'idle',
  accuracy: 0,
};

// Сидированный ГПСЧ: смена воспроизводима и не зависит от Math.random.
const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
};

const useTibiaConveyor = (): IUseTibiaConveyor => {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const game = useRef({
    pipes: [] as IGamePipe[],
    spawned: 0,
    serial: 41,
    shift: 0,
    score: [0, 0, 0] as [number, number, number],
    speed: 11,
    nextAt: 0,
    last: 0,
    running: false,
    message: copy.stopped,
    tone: 'idle' as ConveyorTone,
    random: createRandom(1),
  });
  const [snapshot, setSnapshot] = useState<IConveyorSnapshot>(INITIAL_SNAPSHOT);
  const [firing, setFiring] = useState(false);
  const { active } = useDemoActive(rootRef);

  const publish = (phase: IConveyorSnapshot['phase']) => {
    const g = game.current;
    const [marked, rejected, errors] = g.score;
    setSnapshot({
      pipes: g.pipes.map(({ id, bad, seen, marked: isMarked, dropping, start }) => ({
        id,
        bad,
        seen,
        marked: isMarked,
        dropping,
        start,
      })),
      score: [...g.score],
      queue: TOTAL - g.spawned,
      message: g.message,
      tone: g.tone,
      phase,
      accuracy: Math.round(((marked + rejected) / Math.max(1, marked + rejected + errors)) * 100),
    });
  };

  const say = (message: string, tone: ConveyorTone) => {
    game.current.message = message;
    game.current.tone = tone;
  };

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    const g = game.current;
    g.running = false;
    g.pipes = [];
    say(copy.stopped, 'idle');
    publish('over');
    window.requestAnimationFrame(() => startRef.current?.focus());
  };

  // Цикл линии: едет только пока смена идёт и демо на экране; на паузе время не копится.
  useEffect(() => {
    if (snapshot.phase !== 'running' || !active) return;
    const g = game.current;
    let frame = 0;
    g.last = 0;
    const tick = (now: number) => {
      const dt = g.last ? Math.min(0.05, (now - g.last) / 1000) : 0;
      g.last = now;
      let changed = false;
      g.nextAt -= dt;
      if (g.spawned < TOTAL && g.nextAt <= 0) {
        const bad = g.spawned > 1 && g.random() < BAD_RATE;
        g.pipes.push({
          id: `${copy.serialPrefix}${String(g.serial).padStart(3, '0')}`,
          bad,
          seen: false,
          marked: false,
          dropping: false,
          start: -4,
          x: -4,
          checked: false,
          gone: 0,
        });
        g.serial += 1;
        g.spawned += 1;
        g.nextAt = (reduced() ? 2.6 : 1.7) - g.spawned * 0.03;
        changed = true;
      }
      g.pipes.forEach((pipe) => {
        if (pipe.dropping) return;
        pipe.x += g.speed * dt;
        const node = nodes.current.get(pipe.id);
        if (node) node.style.left = `${pipe.x}%`;
        if (!pipe.seen && pipe.x >= ZONES.detector) {
          pipe.seen = true;
          changed = true;
        }
        if (!pipe.checked && pipe.x > ZONES.reject) {
          pipe.checked = true;
          if (pipe.bad && !pipe.marked) {
            g.score[1] += 1;
            pipe.dropping = true;
            pipe.gone = now + DROP_MS;
            say(copy.dropped, 'ok');
            changed = true;
          } else if (!pipe.bad && !pipe.marked) {
            g.score[2] += 1;
            say(copy.missedGood, 'error');
            changed = true;
          }
        }
        if (pipe.x > EXIT) pipe.gone = now;
      });
      const before = g.pipes.length;
      g.pipes = g.pipes.filter((pipe) => !pipe.gone || pipe.gone > now);
      if (g.pipes.length !== before) changed = true;
      g.speed += dt * 0.12;
      if (g.spawned >= TOTAL && g.pipes.length === 0) {
        finish();
        return;
      }
      if (changed) publish('running');
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
    // publish/finish читают только game-ref, пересоздавать цикл из-за них не нужно.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.phase, active]);

  useEffect(() => {
    if (!firing) return;
    const id = window.setTimeout(() => setFiring(false), 160);
    return () => window.clearTimeout(id);
  }, [firing]);

  const start = () => {
    const g = game.current;
    g.shift += 1;
    g.random = createRandom(g.shift * 7919);
    g.pipes = [];
    g.spawned = 0;
    g.score = [0, 0, 0];
    g.speed = reduced() ? 7 : 11;
    g.nextAt = 0;
    g.running = true;
    say(copy.started, 'idle');
    publish('running');
    window.requestAnimationFrame(() => markRef.current?.focus());
  };

  const stop = () => {
    game.current.spawned = TOTAL;
    finish();
  };

  const mark = () => {
    const g = game.current;
    if (!g.running) return;
    setFiring(true);
    const target = g.pipes
      .filter((pipe) => !pipe.dropping && !pipe.marked)
      .sort((a, b) => Math.abs(a.x - ZONES.head) - Math.abs(b.x - ZONES.head))[0];
    if (!target || Math.abs(target.x - ZONES.head) > WINDOW) {
      g.score[2] += 1;
      say(copy.miss, 'error');
    } else {
      target.marked = true;
      if (target.bad) {
        g.score[2] += 1;
        say(copy.markedBad, 'error');
      } else {
        g.score[0] += 1;
        say(`${copy.markedOk} ${target.id}`, 'ok');
      }
    }
    publish('running');
  };

  // Пробел работает, только когда фокус внутри демо: страница не теряет прокрутку пробелом.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code !== 'Space' || !game.current.running) return;
    event.preventDefault();
    if (!event.repeat) mark();
  };

  const bindPipe = (id: string) => (node: HTMLDivElement | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  };

  return { rootRef, markRef, startRef, snapshot, firing, bindPipe, start, stop, mark, onKeyDown };
};

export default useTibiaConveyor;
