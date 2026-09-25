export type ProcessVariant =
  | 'route'
  | 'odometer'
  | 'bezel'
  | 'gantt'
  | 'conveyor'
  | 'terminal'
  | 'stopwatch'
  | 'timeline'
  | 'current';

export const PROCESS_VARIANTS: ProcessVariant[] = [
  'route',
  'odometer',
  'bezel',
  'gantt',
  'conveyor',
  'terminal',
  'stopwatch',
  'timeline',
  'current',
];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_PROCESS: ProcessVariant = 'terminal';

export const parseProcess = (value: string | undefined): ProcessVariant =>
  PROCESS_VARIANTS.includes(value as ProcessVariant) ? (value as ProcessVariant) : DEFAULT_PROCESS;
