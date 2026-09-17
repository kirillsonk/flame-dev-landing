import { useState } from 'react';
import { AI_RAG as copy } from '@/data/demosAi';
import type { IAiKnowledge } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTimeline from './useTimeline';

/** Поиск 800 мс, сборка ответа 900 мс, затем слово каждые 18 мс и сноска за 60 мс. */
const SEARCH_DELAY = 800;
const ANSWER_DELAY = 900;
const WORD_DELAY = 18;
const FOOTNOTE_DELAY = 60;

export type AiRagToken = { kind: 'text'; value: string } | { kind: 'footnote'; index: number };

const toTokens = (answer: string): AiRagToken[] =>
  answer.split(/(\{\d\})/).flatMap((part): AiRagToken[] => {
    const footnote = part.match(/^\{(\d)\}$/);
    if (footnote) return [{ kind: 'footnote', index: Number(footnote[1]) }];
    return part
      .split(/(\s+)/)
      .filter(Boolean)
      .map((value) => ({ kind: 'text', value }));
  });

// Ищем тему по ключевым корням: какая тема набрала больше совпадений, та и отвечает.
const match = (text: string): IAiKnowledge | null => {
  const lower = text.toLowerCase();
  let best: IAiKnowledge | null = null;
  let bestScore = 0;
  for (const item of copy.base) {
    const score = item.keys.filter((key) => lower.includes(key)).length;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
};

const useAiRag = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const [query, setQuery] = useState(copy.base[0].question);
  const [asked, setAsked] = useState<{ text: string; found: IAiKnowledge | null }>({
    text: copy.base[0].question,
    found: copy.base[0],
  });
  const [hot, setHot] = useState<number | null>(null);
  const tokens = asked.found ? toTokens(asked.found.answer) : [];
  const delays = asked.found
    ? [SEARCH_DELAY, ANSWER_DELAY, ...tokens.map((token) => (token.kind === 'footnote' ? FOOTNOTE_DELAY : WORD_DELAY))]
    : [SEARCH_DELAY];
  const timeline = useTimeline({ delays, active, reduced, autoStart: true });
  const { step } = timeline;

  const ask = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setQuery(value);
    setAsked({ text: value, found: match(value) });
    setHot(null);
    timeline.start();
  };

  return {
    ref,
    query,
    setQuery,
    found: asked.found,
    question: asked.found ? asked.found.question : asked.text.replace(/\?*$/, '?'),
    searching: step < 1,
    answering: step >= 2,
    tokens: tokens.slice(0, Math.max(0, step - 2)),
    hot,
    setHot,
    ask,
  };
};

export default useAiRag;
