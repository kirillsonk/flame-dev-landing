export type GameDemoVariant = 'current' | 'combo' | 'scratch' | 'catch';

export const GAME_DEMO_VARIANTS: GameDemoVariant[] = ['current', 'combo', 'scratch', 'catch'];

// «Лови заказ» основной. Выбрано основным 2026-09-17.
export const DEFAULT_GAME_DEMO: GameDemoVariant = 'catch';

export const parseGameDemo = (value?: string): GameDemoVariant =>
  GAME_DEMO_VARIANTS.includes(value as GameDemoVariant) ? (value as GameDemoVariant) : DEFAULT_GAME_DEMO;
