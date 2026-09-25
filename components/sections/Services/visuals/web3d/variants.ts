export type Web3dDemoVariant = 'flight' | 'reactor' | 'material' | 'plant' | 'scale' | 'current';

export const WEB3D_DEMO_VARIANTS: Web3dDemoVariant[] = ['flight', 'reactor', 'material', 'plant', 'scale', 'current'];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_WEB3D_DEMO: Web3dDemoVariant = 'flight';

export const parseWeb3dDemo = (value?: string): Web3dDemoVariant =>
  WEB3D_DEMO_VARIANTS.includes(value as Web3dDemoVariant) ? (value as Web3dDemoVariant) : DEFAULT_WEB3D_DEMO;
