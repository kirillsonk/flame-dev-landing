export type CtaVariant = 'band' | 'chat' | 'day' | 'inflate' | 'reel' | 'split' | 'curve' | 'route';

export const CTA_VARIANTS: CtaVariant[] = ['band', 'chat', 'day', 'inflate', 'reel', 'split', 'curve', 'route'];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_CTA: CtaVariant = 'chat';

export const parseCta = (value: string | undefined): CtaVariant =>
  CTA_VARIANTS.includes(value as CtaVariant) ? (value as CtaVariant) : DEFAULT_CTA;
