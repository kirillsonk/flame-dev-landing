export type HeaderVariant = 'current' | 'islands' | 'blob' | 'strip' | 'contacts';

export const HEADER_VARIANTS: HeaderVariant[] = ['current', 'islands', 'blob', 'strip', 'contacts'];

// «Контакты в шапке» основной. Выбрано основным 2026-09-17.
export const DEFAULT_HEADER: HeaderVariant = 'contacts';

export const parseHeader = (value: string | undefined): HeaderVariant =>
  HEADER_VARIANTS.includes(value as HeaderVariant) ? (value as HeaderVariant) : DEFAULT_HEADER;
