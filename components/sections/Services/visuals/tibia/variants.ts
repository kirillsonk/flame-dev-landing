export type TibiaDemoVariant = 'scanner' | 'passport' | 'conveyor' | 'search' | 'report' | 'current';

export const TIBIA_DEMO_VARIANTS: TibiaDemoVariant[] = ['scanner', 'passport', 'conveyor', 'search', 'report', 'current'];

// Сканер-пистолет показывает приёмку сразу руками посетителя, поэтому он основной.
export const DEFAULT_TIBIA_DEMO: TibiaDemoVariant = 'scanner';

export const parseTibiaDemo = (value?: string): TibiaDemoVariant =>
  TIBIA_DEMO_VARIANTS.includes(value as TibiaDemoVariant) ? (value as TibiaDemoVariant) : DEFAULT_TIBIA_DEMO;
