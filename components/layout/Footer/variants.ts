export type FooterVariant = 'current' | 'columns' | 'chips' | 'curtain' | 'card';

export const FOOTER_VARIANTS: FooterVariant[] = ['current', 'columns', 'chips', 'curtain', 'card'];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_FOOTER: FooterVariant = 'curtain';

export const parseFooter = (value: string | undefined): FooterVariant =>
  FOOTER_VARIANTS.includes(value as FooterVariant) ? (value as FooterVariant) : DEFAULT_FOOTER;
