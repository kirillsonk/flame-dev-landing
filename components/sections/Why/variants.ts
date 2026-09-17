export type WhyVariant = 'venn' | 'equation' | 'puzzle' | 'spotlights' | 'drops' | 'chord' | 'orbits' | 'layers' | 'current';

export const WHY_VARIANTS: WhyVariant[] = ['venn', 'equation', 'puzzle', 'spotlights', 'drops', 'chord', 'orbits', 'layers', 'current'];

export const DEFAULT_WHY: WhyVariant = 'venn';

export const parseWhy = (value: string | undefined): WhyVariant =>
  WHY_VARIANTS.includes(value as WhyVariant) ? (value as WhyVariant) : DEFAULT_WHY;
