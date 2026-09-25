export type AiDemoVariant =
  'current' | 'fields' | 'themes' | 'video' | 'documents' | 'content' | 'rag' | 'moderation' | 'invoice';

export const AI_DEMO_VARIANTS: AiDemoVariant[] = [
  'current',
  'fields',
  'themes',
  'video',
  'documents',
  'content',
  'rag',
  'moderation',
  'invoice',
];

// Выбран основным 2026-09-24; на главной подключён напрямую (Home.tsx).
export const DEFAULT_AI_DEMO: AiDemoVariant = 'invoice';

export const parseAiDemo = (value?: string): AiDemoVariant =>
  AI_DEMO_VARIANTS.includes(value as AiDemoVariant) ? (value as AiDemoVariant) : DEFAULT_AI_DEMO;
