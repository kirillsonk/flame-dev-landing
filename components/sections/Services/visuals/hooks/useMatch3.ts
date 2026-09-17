import { useEffect, useRef, useState } from 'react';
import { GAME_DEMO } from '@/data/demos';

export const GRID = 6;
export const KINDS = 5;

const randomKind = () => Math.floor(Math.random() * KINDS);

const findMatches = (cells: number[]): Set<number> => {
  const matched = new Set<number>();
  for (let r = 0; r < GRID; r += 1) {
    for (let c = 0; c < GRID; c += 1) {
      const i = r * GRID + c;
      if (c <= GRID - 3 && cells[i] === cells[i + 1] && cells[i] === cells[i + 2]) {
        matched
          .add(i)
          .add(i + 1)
          .add(i + 2);
      }
      if (r <= GRID - 3 && cells[i] === cells[i + GRID] && cells[i] === cells[i + 2 * GRID]) {
        matched
          .add(i)
          .add(i + GRID)
          .add(i + 2 * GRID);
      }
    }
  }
  return matched;
};

const collapse = (cells: number[], matched: Set<number>): number[] => {
  const next = [...cells];
  for (let c = 0; c < GRID; c += 1) {
    const column: number[] = [];
    for (let r = GRID - 1; r >= 0; r -= 1) {
      const i = r * GRID + c;
      if (!matched.has(i)) column.push(next[i]);
    }
    while (column.length < GRID) column.push(randomKind());
    for (let r = GRID - 1, k = 0; r >= 0; r -= 1, k += 1) {
      next[r * GRID + c] = column[k];
    }
  }
  return next;
};

const makeBoard = (): number[] => {
  let cells = Array.from({ length: GRID * GRID }, randomKind);
  let matched = findMatches(cells);
  while (matched.size > 0) {
    cells = collapse(cells, matched);
    matched = findMatches(cells);
  }
  return findMove(cells) ? cells : makeBoard();
};

const isAdjacent = (a: number, b: number) => {
  const ra = Math.floor(a / GRID);
  const rb = Math.floor(b / GRID);
  return (ra === rb && Math.abs(a - b) === 1) || Math.abs(a - b) === GRID;
};

const findMove = (cells: number[]): number[] | null => {
  for (let a = 0; a < cells.length; a += 1) {
    for (const b of [a + 1, a + GRID]) {
      if (b >= cells.length || !isAdjacent(a, b)) continue;
      const next = [...cells];
      [next[a], next[b]] = [next[b], next[a]];
      if (findMatches(next).size) return [a, b];
    }
  }
  return null;
};

interface ISwap {
  from: number;
  to: number;
  returning: boolean;
}

const useMatch3 = () => {
  const [cells, setCells] = useState<number[]>(makeBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState<number[]>([]);
  const [hint, setHint] = useState<number[]>([]);
  const [message, setMessage] = useState(GAME_DEMO.instruction);
  const [swap, setSwap] = useState<ISwap | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const finish = (board: number[]) => {
    const move = findMove(board);
    setCells(move ? board : makeBoard());
    if (!move) setMessage(GAME_DEMO.shuffled);
    setMatched([]);
    setBusy(false);
    locked.current = false;
  };
  const resolve = (board: number[], depth = 1) => {
    const matches = findMatches(board);
    if (!matches.size || depth > 20) {
      finish(depth > 20 ? makeBoard() : board);
      return;
    }
    setCells(board);
    setMatched([...matches]);
    setMessage(depth > 1 ? GAME_DEMO.cascade : GAME_DEMO.success);
    setScore((value) => value + matches.size * 10 * depth);
    timer.current = setTimeout(() => {
      const next = collapse(board, matches);
      setCells(next);
      setMatched([]);
      timer.current = setTimeout(() => resolve(next, depth + 1), 220);
    }, 360);
  };
  const onCellClick = (index: number) => {
    if (locked.current) return;
    setHint([]);
    if (selected === index) {
      setSelected(null);
      return;
    }
    if (selected === null || !isAdjacent(selected, index)) {
      setSelected(index);
      return;
    }
    setSwap({ from: selected, to: index, returning: false });
    setSelected(null);
    locked.current = true;
    setBusy(true);
  };
  // Commit the board only after the visual exchange reaches its destination.
  // Invalid moves keep the original board and play the same path in reverse.
  const completeSwap = () => {
    if (!swap) return;
    if (swap.returning) {
      setSwap(null);
      setBusy(false);
      locked.current = false;
      return;
    }
    const swapped = [...cells];
    [swapped[swap.from], swapped[swap.to]] = [swapped[swap.to], swapped[swap.from]];
    if (!findMatches(swapped).size) {
      setMessage(GAME_DEMO.invalid);
      setSwap({ ...swap, returning: true });
      return;
    }
    setSwap(null);
    resolve(swapped);
  };
  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setSwap(null);
    setCells(makeBoard());
    setSelected(null);
    setScore(0);
    setMatched([]);
    setHint([]);
    setBusy(false);
    locked.current = false;
    setMessage(GAME_DEMO.instruction);
  };
  return {
    cells,
    swap,
    completeSwap,
    selected,
    score,
    onCellClick,
    matched,
    hint,
    busy,
    message,
    reset,
    showHint: () => {
      setHint(findMove(cells) ?? []);
      setSelected(null);
    },
  };
};
export default useMatch3;
