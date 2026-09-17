import { useState } from 'react';
import { AI_MODERATION as copy } from '@/data/demosAi';
import type { AiModerationLabel } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTicker from './useTicker';

/** Фазы потока: через 650 мс AI ставит метку новому комментарию, ещё через 1050 мс приходит следующий. */
const PHASES = [650, 1050];
/** Сколько комментариев видно в ленте. */
const VISIBLE = 8;
/** Столько комментариев уже проверено к первому показу. */
const INITIAL = 3;

export interface IAiComment {
  index: number;
  label: AiModerationLabel | null;
  manual: boolean;
}

const initialItems = (): IAiComment[] =>
  Array.from({ length: INITIAL }, (_, index) => ({ index, label: copy.stream[index].label, manual: false }));

const useAiModeration = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const [items, setItems] = useState<IAiComment[]>(initialItems);
  /** null — пользователь не трогал паузу: поток идёт, если нет reduced motion. */
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [fixes, setFixes] = useState(0);
  const [lastFix, setLastFix] = useState<string | null>(null);

  const ended = items.length >= copy.stream.length && items.every((item) => item.label);
  const playing = (userPlaying ?? !reduced) && !ended;
  const running = playing && active;

  const { resetPhase } = useTicker({
    delays: PHASES,
    enabled: running,
    onTick: (phase) => {
      if (phase === 0) {
        setItems((list) => list.map((item) => (item.label ? item : { ...item, label: copy.stream[item.index].label })));
        return;
      }
      setItems((list) =>
        list.length >= copy.stream.length ? list : [...list, { index: list.length, label: null, manual: false }],
      );
    },
  });

  const counts = { ok: 0, spam: 0, tox: 0 } as Record<AiModerationLabel, number>;
  items.forEach((item) => {
    if (item.label) counts[item.label] += 1;
  });

  return {
    ref,
    items: items.slice(-VISIBLE).reverse(),
    counts,
    fixes,
    lastFix,
    playing,
    running,
    ended,
    toggle: () => {
      if (ended) {
        setItems([]);
        resetPhase();
        setUserPlaying(true);
        return;
      }
      setUserPlaying(!playing);
    },
    override: (index: number) => {
      const target = items.find((item) => item.index === index);
      if (!target?.label) return;
      const source = copy.stream[index];
      const next: AiModerationLabel = target.label !== 'ok' ? 'ok' : copy.spamHint.test(source.text) ? 'spam' : 'tox';
      const short = source.text.length > 40 ? `${source.text.slice(0, 40)}…` : source.text;
      setItems((list) => list.map((item) => (item.index === index ? { ...item, label: next, manual: true } : item)));
      setFixes((value) => value + 1);
      setLastFix(copy.fixed(short, copy.labels[next].name.toLowerCase()));
    },
  };
};

export default useAiModeration;
