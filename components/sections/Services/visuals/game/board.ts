// Чистая логика поля «Три в ряд» для квадратной доски size × size. -1 — пустая клетка.
// Текущий Match3 (hooks/useMatch3) использует своё поле 6 × 6 с анимацией обмена, поэтому логика отдельная.

export const randomKind = (kinds: number) => Math.floor(Math.random() * kinds);

export const findMatches = (board: number[], size: number): Set<number> => {
  const matched = new Set<number>();
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size - 2; c += 1) {
      const i = r * size + c;
      const k = board[i];
      if (k >= 0 && board[i + 1] === k && board[i + 2] === k)
        matched
          .add(i)
          .add(i + 1)
          .add(i + 2);
    }
  }
  for (let c = 0; c < size; c += 1) {
    for (let r = 0; r < size - 2; r += 1) {
      const i = r * size + c;
      const k = board[i];
      if (k >= 0 && board[i + size] === k && board[i + 2 * size] === k) {
        matched
          .add(i)
          .add(i + size)
          .add(i + 2 * size);
      }
    }
  }
  return matched;
};

export const isAdjacent = (a: number, b: number, size: number) =>
  (Math.abs(a - b) === 1 && Math.floor(a / size) === Math.floor(b / size)) || Math.abs(a - b) === size;

export const swapCells = (board: number[], a: number, b: number) => {
  const next = [...board];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
};

export const findMove = (board: number[], size: number): [number, number] | null => {
  for (let i = 0; i < board.length; i += 1) {
    for (const j of [i + 1, i + size]) {
      if (j >= board.length || (j === i + 1 && i % size === size - 1)) continue;
      if (findMatches(swapCells(board, i, j), size).size) return [i, j];
    }
  }
  return null;
};

// Поле без готовых троек и хотя бы с одним ходом.
export const createBoard = (size: number, kinds: number): number[] => {
  for (;;) {
    const board: number[] = [];
    for (let i = 0; i < size * size; i += 1) {
      let k = randomKind(kinds);
      while (
        (i % size >= 2 && board[i - 1] === k && board[i - 2] === k) ||
        (i >= 2 * size && board[i - size] === k && board[i - 2 * size] === k)
      ) {
        k = randomKind(kinds);
      }
      board.push(k);
    }
    if (findMove(board, size)) return board;
  }
};

// Фишки падают вниз, сверху досыпаются новые. fall — на сколько клеток сдвинулась каждая фишка.
export const applyGravity = (board: number[], size: number, kinds: number) => {
  const next = [...board];
  const fall = new Array<number>(board.length).fill(0);
  for (let c = 0; c < size; c += 1) {
    const column: { k: number; r: number }[] = [];
    for (let r = size - 1; r >= 0; r -= 1) {
      const i = r * size + c;
      if (board[i] >= 0) column.push({ k: board[i], r });
    }
    const fresh = size - column.length;
    for (let r = size - 1, j = 0; r >= 0; r -= 1, j += 1) {
      const i = r * size + c;
      if (j < column.length) {
        next[i] = column[j].k;
        fall[i] = r - column[j].r;
      } else {
        next[i] = randomKind(kinds);
        fall[i] = fresh;
      }
    }
  }
  return { board: next, fall };
};
