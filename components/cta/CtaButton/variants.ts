export type CtaButtonVariant = 'current' | 'border' | 'spot' | 'beam' | 'reveal' | 'wave';

export const CTA_BUTTON_VARIANTS: CtaButtonVariant[] = ['current', 'border', 'spot', 'beam', 'reveal', 'wave'];

// «Бегущий луч» основной. Выбрано основным 2026-09-17.
export const DEFAULT_CTA_BUTTON: CtaButtonVariant = 'beam';

export const parseCtaButton = (value: string | undefined): CtaButtonVariant =>
  CTA_BUTTON_VARIANTS.includes(value as CtaButtonVariant) ? (value as CtaButtonVariant) : DEFAULT_CTA_BUTTON;
