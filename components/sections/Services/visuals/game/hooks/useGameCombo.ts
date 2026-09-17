import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { GAME_COMBO as copy, GAME_PROMO } from '@/data/demosGame';
import {
  applyGravity,
  createBoard,
  findMatches,
  findMove,
  isAdjacent,
  swapCells,
} from '@/components/sections/Services/visuals/game/board';
import { makePromoCode } from '@/components/sections/Services/visuals/game/promo';

const SIZE = copy.size;
const KINDS = copy.kinds.length;

export interface IGameResult {
  label: string;
  prize: string;
  code: string;
}

interface IDrag {
  index: number;
  x: number;
  y: number;
}

/**
 * «Три в ряд» на 30 секунд: каскады умножают очки, в конце — промокод по результату.
 * Таймер стартует с первого хода и тикает только пока демо активно (на экране, не `inert`).
 * Хук монтируется только на клиенте (см. GameCombo), поэтому случайное поле не ломает гидрацию.
 */
const useGameCombo = (active: boolean, reduced: boolean) => {
  const [cells, setCells] = useState<number[]>(() => createBoard(SIZE, KINDS));
  // Сдвиг падения в клетках и счётчик перезапуска анимации для каждой клетки.
  const [fall, setFall] = useState<number[]>(() => cells.map((_, i) => SIZE - Math.floor(i / SIZE) + 2));
  const [fallTick, setFallTick] = useState<number[]>(() => cells.map(() => 0));
  const [popping, setPopping] = useState<number[]>([]);
  const [selected, setSelected] = useState(-1);
  const [hint, setHint] = useState<number[]>([]);
  const [shake, setShake] = useState({ cells: [] as number[], tick: 0 });
  const [combo, setCombo] = useState({ n: 0, tick: 0 });
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(copy.duration);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState(copy.idle);
  const [result, setResult] = useState<IGameResult | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const board = useRef(cells);
  const scoreRef = useRef(0);
  const leftRef = useRef(copy.duration);
  const busy = useRef(false);
  const over = useRef(false);
  const round = useRef(0);
  const timeouts = useRef(new Set<ReturnType<typeof setTimeout>>());
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<IDrag | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(
          () => {
            timeouts.current.delete(id);
            resolve();
          },
          reduced ? 40 : ms,
        );
        timeouts.current.add(id);
      }),
    [reduced],
  );

  const paint = (next: number[], offsets: number[]) => {
    board.current = next;
    setCells(next);
    setFall(offsets);
    setFallTick((ticks) => ticks.map((tick, i) => (offsets[i] > 0 ? tick + 1 : tick)));
    setPopping([]);
  };

  const finish = () => {
    over.current = true;
    const top = scoreRef.current >= copy.goal;
    const prize = top ? copy.prizeTop : copy.prizeBase;
    setResult({
      label: `${top ? copy.winTop : copy.winBase} · ${scoreRef.current} ${GAME_PROMO.points}`,
      prize: prize.label,
      code: makePromoCode(prize.prefix, 4),
    });
  };

  // Таймер: только после первого хода и только пока демо активно.
  useEffect(() => {
    if (!started || !active || result) return;
    const id = setInterval(() => {
      if (leftRef.current <= 0) return;
      leftRef.current -= 1;
      setLeft(leftRef.current);
      if (leftRef.current <= 0) {
        over.current = true;
        if (!busy.current) finish();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [started, active, result]);

  // Подсказка, если посетитель смотрит на поле, но не ходит.
  useEffect(() => {
    if (started || !active) return;
    const id = setTimeout(() => setHint(findMove(board.current, SIZE) ?? []), 2500);
    return () => clearTimeout(id);
  }, [started, active, cells]);

  const trySwap = async (a: number, b: number) => {
    if (busy.current || over.current) return;
    if (!isAdjacent(a, b, SIZE)) {
      setSelected(b);
      return;
    }
    const token = round.current;
    if (!started) {
      setStarted(true);
      setMessage(copy.go);
    }
    setSelected(-1);
    setHint([]);
    busy.current = true;
    const original = board.current;
    const swapped = swapCells(original, a, b);
    paint(
      swapped,
      swapped.map(() => 0),
    );
    let matches = findMatches(swapped, SIZE);

    if (!matches.size) {
      await wait(180);
      if (token !== round.current) return;
      paint(
        original,
        original.map(() => 0),
      );
      setShake((value) => ({ cells: [a, b], tick: value.tick + 1 }));
      setMessage(copy.invalid);
      busy.current = false;
      return;
    }

    let depth = 0;
    while (matches.size) {
      depth += 1;
      scoreRef.current += matches.size * 10 * depth;
      setScore(scoreRef.current);
      if (depth > 1) {
        setCombo((value) => ({ n: depth, tick: value.tick + 1 }));
        setMessage(`${copy.cascade}${depth}`);
      } else {
        setMessage(`+${matches.size * 10}`);
      }
      setPopping([...matches]);
      await wait(230);
      if (token !== round.current) return;
      const cleared = board.current.map((k, i) => (matches.has(i) ? -1 : k));
      const next = applyGravity(cleared, SIZE, KINDS);
      paint(next.board, next.fall);
      await wait(330);
      if (token !== round.current) return;
      matches = findMatches(board.current, SIZE);
    }

    if (!findMove(board.current, SIZE)) {
      setMessage(copy.shuffle);
      const fresh = createBoard(SIZE, KINDS);
      paint(
        fresh,
        fresh.map(() => SIZE),
      );
      await wait(330);
      if (token !== round.current) return;
    }
    busy.current = false;
    if (over.current) finish();
  };

  const reset = () => {
    round.current += 1;
    timeouts.current.forEach(clearTimeout);
    timeouts.current.clear();
    busy.current = false;
    over.current = false;
    scoreRef.current = 0;
    leftRef.current = copy.duration;
    const fresh = createBoard(SIZE, KINDS);
    paint(
      fresh,
      fresh.map((_, i) => SIZE - Math.floor(i / SIZE) + 2),
    );
    setSelected(-1);
    setHint([]);
    setScore(0);
    setLeft(copy.duration);
    setStarted(false);
    setResult(null);
    setMessage(copy.idle);
  };

  const onCellClick = (index: number) => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    if (busy.current || over.current) return;
    if (selected < 0) setSelected(index);
    else if (selected === index) setSelected(-1);
    else void trySwap(selected, index);
  };

  const onBoardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -SIZE,
      ArrowDown: SIZE,
    }[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const next = focusIndex + delta;
    if (next < 0 || next >= SIZE * SIZE) return;
    if (Math.abs(delta) === 1 && Math.floor(next / SIZE) !== Math.floor(focusIndex / SIZE)) return;
    setFocusIndex(next);
    cellRefs.current[next]?.focus();
  };

  const onCellPointerDown = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    drag.current = { index, x: event.clientX, y: event.clientY };
  };

  const onBoardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const threshold = (cellRefs.current[0]?.offsetWidth ?? 40) * 0.45;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;
    const i = start.index;
    let j = -1;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && i % SIZE < SIZE - 1) j = i + 1;
      else if (dx < 0 && i % SIZE > 0) j = i - 1;
    } else {
      j = dy > 0 ? i + SIZE : i - SIZE;
    }
    drag.current = null;
    dragged.current = true;
    if (j >= 0 && j < SIZE * SIZE) {
      setSelected(-1);
      void trySwap(i, j);
    }
  };

  const onPointerEnd = () => {
    drag.current = null;
    // click приходит после pointerup: сбрасываем флаг перетаскивания уже после него.
    setTimeout(() => {
      dragged.current = false;
    }, 0);
  };

  const again = () => {
    reset();
    setFocusIndex(0);
    cellRefs.current[0]?.focus();
  };

  return {
    size: SIZE,
    cells,
    fall,
    fallTick,
    popping,
    selected,
    hint,
    shake,
    combo,
    score,
    left,
    low: started && left <= 5,
    goal: Math.min(100, (score / copy.goal) * 100),
    message,
    result,
    focusIndex,
    cellRefs,
    setFocusIndex,
    onCellClick,
    onBoardKeyDown,
    onCellPointerDown,
    onBoardPointerMove,
    onPointerEnd,
    reset,
    again,
  };
};

export default useGameCombo;
