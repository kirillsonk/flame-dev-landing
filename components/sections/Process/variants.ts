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

// «Гант» основной. Выбрано основным 2026-09-17.
export const DEFAULT_PROCESS: ProcessVariant = 'gantt';

export const parseProcess = (value: string | undefined): ProcessVariant =>
  PROCESS_VARIANTS.includes(value as ProcessVariant) ? (value as ProcessVariant) : DEFAULT_PROCESS;
