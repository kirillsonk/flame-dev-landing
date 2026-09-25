export type TibiaDemoVariant = 'scanner' | 'passport' | 'conveyor' | 'search' | 'report' | 'current';

export const TIBIA_DEMO_VARIANTS: TibiaDemoVariant[] = ['scanner', 'passport', 'conveyor', 'search', 'report', 'current'];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_TIBIA_DEMO: TibiaDemoVariant = 'report';

export const parseTibiaDemo = (value?: string): TibiaDemoVariant =>
  TIBIA_DEMO_VARIANTS.includes(value as TibiaDemoVariant) ? (value as TibiaDemoVariant) : DEFAULT_TIBIA_DEMO;
