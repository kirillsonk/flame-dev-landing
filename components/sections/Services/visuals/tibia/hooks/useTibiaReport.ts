import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface IReportData {
  incoming: number[];
  outgoing: number[];
  max: number;
  received: number;
  shipped: number;
  tons: number;
  errors: number;
  /** Доли размеров труб, в сумме 1. */
  shares: number[];
}

export interface IUseTibiaReport {
  closeRef: RefObject<HTMLButtonElement | null>;
  pdfRef: RefObject<HTMLButtonElement | null>;
  days: number;
  warehouse: string;
  shift: string;
  data: IReportData;
  sheet: boolean;
  built: boolean;
  setDays: (value: number) => void;
  setWarehouse: (value: string) => void;
  setShift: (value: string) => void;
  openSheet: () => void;
  closeSheet: () => void;
}

export const DAYS_MIN = 3;
export const DAYS_MAX = 30;
const BUILD_MS = 1100;
const TON_PER_PIPE = 11.8 / 1000;
const ERROR_RATE = 0.0042;
const BASE_SHARES = [0.46, 0.34, 0.12, 0.08];

// Значения — гладкая функция дня, склада и смены: без случайности, поэтому одинаковы на сервере и клиенте.
const dayValue = (day: number, kind: number, warehouse: string, shift: string) => {
  const warehouses = warehouse === 'all' ? [1, 2, 3] : [Number(warehouse)];
  const shifts = shift === 'all' ? [0, 1] : [shift === 'day' ? 0 : 1];
  const weekend = day % 7 === 5 || day % 7 === 6 ? 0.45 : 1;
  let total = 0;
  warehouses.forEach((w) =>
    shifts.forEach((s) => {
      const wave = Math.sin(day * 1.7 + w * 3.1 + s * 2.3 + kind * 5.9) * 0.5 + 0.5;
      total += Math.round((kind ? 70 : 90) * (s ? 0.6 : 1) * (w === 2 ? 1.3 : 1) * weekend * (0.55 + wave * 0.6));
    }),
  );
  return total;
};

const buildReport = (days: number, warehouse: string, shift: string): IReportData => {
  const incoming = Array.from({ length: days }, (_, day) => dayValue(day, 0, warehouse, shift));
  const outgoing = Array.from({ length: days }, (_, day) => dayValue(day, 1, warehouse, shift));
  const received = incoming.reduce((a, b) => a + b, 0);
  const shipped = outgoing.reduce((a, b) => a + b, 0);
  const offset = warehouse === 'all' ? 0 : Number(warehouse);
  const weights = BASE_SHARES.map((share, i) => share + Math.sin(days * 0.3 + i + offset * 1.3) * 0.05);
  const sum = weights.reduce((a, b) => a + b, 0);
  return {
    incoming,
    outgoing,
    max: Math.max(...incoming, ...outgoing) * 1.1,
    received,
    shipped,
    tons: shipped * TON_PER_PIPE,
    errors: Math.round(received * ERROR_RATE),
    shares: weights.map((weight) => weight / sum),
  };
};

const useTibiaReport = (): IUseTibiaReport => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const pdfRef = useRef<HTMLButtonElement>(null);
  const [days, setDays] = useState(14);
  const [warehouse, setWarehouse] = useState('all');
  const [shift, setShift] = useState('all');
  const [sheet, setSheet] = useState(false);
  const [built, setBuilt] = useState(false);
  const data = useMemo(() => buildReport(days, warehouse, shift), [days, warehouse, shift]);

  useEffect(() => {
    if (!sheet) return;
    const focus = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 50);
    const build = window.setTimeout(() => setBuilt(true), BUILD_MS);
    return () => {
      window.clearTimeout(focus);
      window.clearTimeout(build);
    };
  }, [sheet]);

  const openSheet = () => {
    setBuilt(false);
    setSheet(true);
  };

  const closeSheet = () => {
    setSheet(false);
    pdfRef.current?.focus({ preventScroll: true });
  };

  return {
    closeRef,
    pdfRef,
    days,
    warehouse,
    shift,
    data,
    sheet,
    built,
    setDays,
    setWarehouse,
    setShift,
    openSheet,
    closeSheet,
  };
};

export default useTibiaReport;
