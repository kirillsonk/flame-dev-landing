import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AI_CONTENT as copy } from '@/data/demosAi';
import type { IAiContentPack } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTimeline from './useTimeline';

/** Печать: по 3 символа каждые 16 мс, после формата — пауза 450 мс. */
const CHARS_PER_STEP = 3;
const TYPE_DELAY = 16;
const TAB_PAUSE = 450;

export type AiContentStatus = 'idle' | 'busy' | 'done';

// Одна идея → название продукта и фичи → тексты под четыре канала.
const toPack = (idea: string): IAiContentPack => {
  const value = idea.trim() || copy.fallbackIdea;
  const colon = value.indexOf(':');
  const head = colon >= 0 ? value.slice(0, colon) : value;
  const rest = colon >= 0 ? value.slice(colon + 1) : '';
  const feats = rest
    .split(/,| и /)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
  const subject = copy.lemmas.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    head.replace(copy.lead, '').trim(),
  );
  return copy.pack(subject || copy.fallbackIdea, feats.length ? feats : copy.fallbackFeats, copy.running.test(value));
};

const textOf = (pack: IAiContentPack, index: number) => pack[copy.channels[index].key];

const useAiContent = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const [idea, setIdeaState] = useState(copy.examples[0].idea);
  const [generated, setGenerated] = useState<IAiContentPack | null>(null);
  const [selected, setSelected] = useState(0);
  const pack = generated ?? toPack(idea);

  const lengths = copy.channels.map((_, index) => Math.ceil(textOf(pack, index).length / CHARS_PER_STEP));
  const offsets = lengths.map((_, index) => lengths.slice(0, index).reduce((sum, count) => sum + count + 1, 0));
  const delays = lengths.flatMap((count) => [...Array.from({ length: count }, () => TYPE_DELAY), TAB_PAUSE]);
  const timeline = useTimeline({ delays, active, reduced });
  const { step, running } = timeline;

  const statusOf = (index: number): AiContentStatus => {
    if (!running) return 'done';
    if (step < offsets[index]) return 'idle';
    return step <= offsets[index] + lengths[index] ? 'busy' : 'done';
  };
  const typingTab = running ? copy.channels.findIndex((_, index) => statusOf(index) === 'busy') : -1;
  const current = typingTab >= 0 ? typingTab : selected;
  const fullText = textOf(pack, current);
  const shown =
    typingTab >= 0 ? Math.min(fullText.length, (step - offsets[current]) * CHARS_PER_STEP) : fullText.length;

  const select = (index: number) => {
    if (!running) setSelected(index);
  };

  return {
    ref,
    idea,
    example: copy.examples.findIndex((item) => item.idea === idea),
    feats: toPack(idea).feats,
    pack,
    running,
    done: timeline.done,
    current,
    text: fullText.slice(0, shown),
    count: shown,
    typing: typingTab >= 0 && shown < fullText.length,
    statusOf,
    select,
    onTabKey: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (running || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
      const total = copy.channels.length;
      const next = (current + (event.key === 'ArrowRight' ? 1 : total - 1)) % total;
      select(next);
      const tabs = event.currentTarget.parentElement?.children;
      (tabs?.[next] as HTMLElement | undefined)?.focus();
    },
    setIdea: (value: string) => {
      setIdeaState(value);
      if (!running) setGenerated(null);
    },
    selectExample: (index: number) => {
      setIdeaState(copy.examples[index].idea);
      setGenerated(null);
      timeline.reset();
    },
    generate: () => {
      setGenerated(toPack(idea));
      setSelected(copy.channels.length - 1);
      timeline.start();
    },
  };
};

export default useAiContent;
