import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { TIBIA_SEARCH as copy } from '@/data/demosTibia';

export interface IStockItem {
  id: string;
  size: string;
  cell: string;
  status: number;
  lot: string;
  hay: string;
}

export type StockFilter = 'all' | number;

export interface IUseTibiaSearch {
  scrollRef: RefObject<HTMLDivElement | null>;
  query: string;
  filter: StockFilter;
  terms: string[];
  results: IStockItem[];
  ms: number | null;
  from: number;
  to: number;
  total: number;
  setQuery: (value: string) => void;
  setFilter: (value: StockFilter) => void;
  onScroll: () => void;
}

export const STOCK_SIZE = 12000;
/** Высота строки в rem — та же, что в стилях. */
export const ROW_REM = 4;
const OVERSCAN = 4;
/** Сколько строк рисуем до первого замера окна (сервер и гидрация). */
const INITIAL_ROWS = 12;

// Склад генерируется сидированным ГПСЧ: одинаковые 12 000 позиций на сервере и клиенте.
let stock: IStockItem[] | null = null;
const getStock = (): IStockItem[] => {
  if (stock) return stock;
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const pick = (count: number) => Math.floor(random() * count);
  stock = Array.from({ length: STOCK_SIZE }, (_, index) => {
    const id = `${copy.prefix}${3 + pick(4)}${copy.series[pick(copy.series.length)]}${pick(10)}-${String(index % 1000).padStart(3, '0')}`;
    const status = pick(copy.statuses.length);
    const size = copy.sizes[pick(copy.sizes.length)];
    const cell = `${copy.zones[pick(copy.zones.length)]}-${1 + pick(12)}`;
    const lot = status === 1 || status === 3 ? `${copy.trip} ${2400 + pick(60)}` : `${copy.lot}${100 + pick(40)}`;
    return { id, size, cell, status, lot, hay: `${id} ${size} ${cell} ${copy.statuses[status]} ${lot}`.toUpperCase() };
  });
  return stock;
};

// Кириллические двойники латиницы после цифры: «5А» → «5A», «4Х8» → «4X8».
const normalize = (value: string) =>
  value
    .toUpperCase()
    .replace(/Х/g, 'X')
    .replace(/(\d)А/g, '$1A')
    .replace(/(\d)В/g, '$1B')
    .replace(/(\d)У/g, '$1Y')
    .replace(/(\d)К/g, '$1K')
    .replace(/(\d)М/g, '$1M');

const toTerms = (value: string) => normalize(value).trim().split(/\s+/).filter(Boolean);

const search = (terms: string[], filter: StockFilter) =>
  getStock().filter((item) => (filter === 'all' || item.status === filter) && terms.every((term) => item.hay.includes(term)));

const useTibiaSearch = (): IUseTibiaSearch => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [query, setQueryState] = useState(copy.initialQuery);
  const [filter, setFilterState] = useState<StockFilter>('all');
  const [results, setResults] = useState(() => search(toTerms(copy.initialQuery), 'all'));
  const [ms, setMs] = useState<number | null>(null);
  const [range, setRange] = useState({ from: 0, to: INITIAL_ROWS });

  const measure = (count: number) => {
    const node = scrollRef.current;
    if (!node) return;
    const rowPx = parseFloat(getComputedStyle(document.documentElement).fontSize) * ROW_REM;
    const from = Math.max(0, Math.floor(node.scrollTop / rowPx) - OVERSCAN);
    const to = Math.min(count, Math.ceil((node.scrollTop + node.clientHeight) / rowPx) + OVERSCAN);
    setRange((current) => (current.from === from && current.to === to ? current : { from, to }));
  };

  const run = (nextQuery: string, nextFilter: StockFilter) => {
    const started = performance.now();
    const next = search(toTerms(nextQuery), nextFilter);
    setMs(performance.now() - started);
    setResults(next);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    measure(next.length);
  };

  const count = results.length;
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => measure(count));
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame.current);
    };
  }, [count]);

  const onScroll = () => {
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => measure(count));
  };

  const setQuery = (value: string) => {
    setQueryState(value);
    run(value, filter);
  };

  const setFilter = (value: StockFilter) => {
    setFilterState(value);
    run(query, value);
  };

  return {
    scrollRef,
    query,
    filter,
    terms: toTerms(query),
    results,
    ms,
    from: Math.min(range.from, count),
    to: Math.min(range.to, count),
    total: STOCK_SIZE,
    setQuery,
    setFilter,
    onScroll,
  };
};

export default useTibiaSearch;
