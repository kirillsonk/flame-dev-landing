export type HeaderVariant = 'current' | 'islands' | 'blob' | 'strip' | 'contacts';

export const HEADER_VARIANTS: HeaderVariant[] = ['current', 'islands', 'blob', 'strip', 'contacts'];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_HEADER: HeaderVariant = 'blob';

export const parseHeader = (value: string | undefined): HeaderVariant =>
  HEADER_VARIANTS.includes(value as HeaderVariant) ? (value as HeaderVariant) : DEFAULT_HEADER;
