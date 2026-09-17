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

// Заявка с подсветкой полей — основной вариант: связь «фраза ↔ поле CRM» понятна с первого взгляда.
export const DEFAULT_AI_DEMO: AiDemoVariant = 'fields';

export const parseAiDemo = (value?: string): AiDemoVariant =>
  AI_DEMO_VARIANTS.includes(value as AiDemoVariant) ? (value as AiDemoVariant) : DEFAULT_AI_DEMO;
