export type ServicesVariant = 'player' | 'current';

export const SERVICES_VARIANTS: ServicesVariant[] = ['player', 'current'];

// «Сцена-плеер» выбран основным; огонёк-стопка остаётся для сравнения.
export const DEFAULT_SERVICES: ServicesVariant = 'player';

export const parseServices = (value: string | undefined): ServicesVariant =>
  SERVICES_VARIANTS.includes(value as ServicesVariant) ? (value as ServicesVariant) : DEFAULT_SERVICES;
