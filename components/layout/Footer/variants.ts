export type FooterVariant = 'current' | 'columns' | 'chips' | 'curtain' | 'card';

export const FOOTER_VARIANTS: FooterVariant[] = ['current', 'columns', 'chips', 'curtain', 'card'];

// «Контакты-плашки» основной. Выбрано основным 2026-09-17.
export const DEFAULT_FOOTER: FooterVariant = 'chips';

export const parseFooter = (value: string | undefined): FooterVariant =>
  FOOTER_VARIANTS.includes(value as FooterVariant) ? (value as FooterVariant) : DEFAULT_FOOTER;
