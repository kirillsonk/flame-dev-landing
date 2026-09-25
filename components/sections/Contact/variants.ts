export type ContactVariant = 'marker' | 'guides' | 'chat' | 'current';

export const CONTACT_VARIANTS: ContactVariant[] = ['marker', 'guides', 'chat', 'current'];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_CONTACT: ContactVariant = 'chat';

export const parseContact = (value: string | undefined): ContactVariant =>
  CONTACT_VARIANTS.includes(value as ContactVariant) ? (value as ContactVariant) : DEFAULT_CONTACT;
