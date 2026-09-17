export type CtaVariant = 'band' | 'chat' | 'day' | 'inflate' | 'reel' | 'split' | 'curve' | 'route';

export const CTA_VARIANTS: CtaVariant[] = ['band', 'chat', 'day', 'inflate', 'reel', 'split', 'curve', 'route'];

// «Барабан» основной. Выбрано основным 2026-09-17.
export const DEFAULT_CTA: CtaVariant = 'reel';

export const parseCta = (value: string | undefined): CtaVariant =>
  CTA_VARIANTS.includes(value as CtaVariant) ? (value as CtaVariant) : DEFAULT_CTA;
