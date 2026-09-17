export type ContactVariant = 'marker' | 'guides' | 'chat' | 'current';

export const CONTACT_VARIANTS: ContactVariant[] = ['marker', 'guides', 'chat', 'current'];

// «Маркер» — основной, пока не выбран финальный вариант.
export const DEFAULT_CONTACT: ContactVariant = 'marker';

export const parseContact = (value: string | undefined): ContactVariant =>
  CONTACT_VARIANTS.includes(value as ContactVariant) ? (value as ContactVariant) : DEFAULT_CONTACT;
