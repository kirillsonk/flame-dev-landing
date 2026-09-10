import { useCallback, useState } from 'react';

export const GRID = 6;
export const KINDS = 5;

export interface IUseMatch3 {
  cells: number[];
  selected: number | null;
  score: number;
  onCellClick: (index: number) => void;
}

const randomKind = () => Math.floor(Math.random() * KINDS);

const findMatches = (cells: number[]): Set<number> => {
  const matched = new Set<number>();
  for (let r = 0; r < GRID; r += 1) {
    for (let c = 0; c < GRID; c += 1) {
      const i = r * GRID + c;
      if (c <= GRID - 3 && cells[i] === cells[i + 1] && cells[i] === cells[i + 2]) {
        matched.add(i).add(i + 1).add(i + 2);
      }
      if (r <= GRID - 3 && cells[i] === cells[i + GRID] && cells[i] === cells[i + 2 * GRID]) {
        matched.add(i).add(i + GRID).add(i + 2 * GRID);
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
  return cells;
};

const isAdjacent = (a: number, b: number) => {
  const ra = Math.floor(a / GRID);
  const rb = Math.floor(b / GRID);
  return (ra === rb && Math.abs(a - b) === 1) || Math.abs(a - b) === GRID;
};

const useMatch3 = (): IUseMatch3 => {
  const [cells, setCells] = useState<number[]>(makeBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const onCellClick = useCallback(
    (index: number) => {
      if (selected === null) {
        setSelected(index);
        return;
      }
      if (selected === index || !isAdjacent(selected, index)) {
        setSelected(index);
        return;
      }
      const swapped = [...cells];
      [swapped[selected], swapped[index]] = [swapped[index], swapped[selected]];
      let matched = findMatches(swapped);
      setSelected(null);
      if (matched.size === 0) return;
      let board = swapped;
      let gained = 0;
      while (matched.size > 0) {
        gained += matched.size;
        board = collapse(board, matched);
        matched = findMatches(board);
      }
      setCells(board);
      setScore((s) => s + gained * 10);
    },
    [cells, selected],
  );

  return { cells, selected, score, onCellClick };
};

export default useMatch3;
