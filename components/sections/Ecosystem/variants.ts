export type EcosystemVariant = 'marquee' | 'credits' | 'tokens' | 'current';

export const ECOSYSTEM_VARIANTS: EcosystemVariant[] = ['marquee', 'credits', 'tokens', 'current'];

// «Бегущие строки» — основной, пока не выбран финальный вариант.
export const DEFAULT_ECOSYSTEM: EcosystemVariant = 'marquee';

export const parseEcosystem = (value: string | undefined): EcosystemVariant =>
  ECOSYSTEM_VARIANTS.includes(value as EcosystemVariant) ? (value as EcosystemVariant) : DEFAULT_ECOSYSTEM;
