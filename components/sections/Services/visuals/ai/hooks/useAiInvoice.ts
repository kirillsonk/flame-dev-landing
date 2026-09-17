import { useState } from 'react';
import { AI_INVOICE as copy } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTimeline from './useTimeline';

/** На строку: старт строки и четыре ячейки; в конце — пауза перед проверкой итога. */
const EVENTS_PER_ROW = 5;
const DELAYS = [...copy.rows.flatMap((_, row) => [row ? 260 : 0, 120, 90, 90, 90]), 780];
const NUMBER = new Intl.NumberFormat('ru-RU');

const toNumber = (value: string) => Number(value.replace(/\s/g, ''));

export type AiInvoiceCheck = 'waiting' | 'bad' | 'ok';

const useAiInvoice = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const timeline = useTimeline({ delays: DELAYS, active, reduced });
  const [quantity, setQuantity] = useState<string | null>(null);
  const { step, running, done } = timeline;
  const { doubt } = copy;

  const isDoubt = (row: number, col: number) => row === doubt.row && col === doubt.col;
  const isShown = (row: number, col: number) => step > row * EVENTS_PER_ROW + 1 + col;
  const sum = copy.rows.reduce(
    (total, cells, row) => total + toNumber(row === doubt.row ? (quantity ?? '0') : cells[1]) * toNumber(cells[2]),
    0,
  );
  const check: AiInvoiceCheck = !done ? 'waiting' : quantity === null || sum !== copy.total ? 'bad' : 'ok';

  return {
    ref,
    running,
    done,
    quantity,
    check,
    sumText: copy.sum(NUMBER.format(sum)),
    scanRow: running && step > 0 ? Math.min(copy.rows.length - 1, Math.floor((step - 1) / EVENTS_PER_ROW)) : -1,
    isShown,
    /** Ячейка распознана неуверенно и ещё не подтверждена человеком. */
    isDoubtful: (row: number, col: number) => isDoubt(row, col) && isShown(row, col) && quantity === null,
    cellText: (row: number, col: number) => {
      if (!isShown(row, col)) return copy.placeholder;
      if (isDoubt(row, col)) return quantity ?? doubt.read;
      return copy.rows[row][col];
    },
    recognize: () => {
      setQuantity(null);
      timeline.start();
    },
    choose: setQuantity,
  };
};

export default useAiInvoice;
