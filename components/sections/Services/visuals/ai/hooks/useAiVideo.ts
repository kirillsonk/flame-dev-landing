import { useState } from 'react';
import { AI_VIDEO as copy } from '@/data/demosAi';
import type { AiVideoFormat, AiVideoStyle } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTimeline from './useTimeline';

/** Генерация длится 40 тиков по 105 мс (≈4,2 с), как в прототипе. */
const TICKS = 40;
const DELAYS = Array.from({ length: TICKS }, () => 105);

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

// Раскадровка из промпта: заголовок — первые слова до двоеточия, настроение — по ключевым словам.
const toBrief = (prompt: string) => {
  const text = prompt.trim() || copy.fallback;
  const head = text.split(/[:,.—–-]/)[0].trim();
  const title = capitalize(head.split(/\s+/).slice(0, 3).join(' '));
  const tail = (text.split(/[:,]/)[1] || '').trim();
  const mood = copy.moods.find((item) => item.test.test(text))?.label ?? copy.defaultMood;
  return {
    title,
    captions: [
      copy.captions.mood(mood),
      copy.captions.closeUp(title.toLowerCase()),
      copy.captions.tail(tail ? capitalize(tail) : copy.motion),
      copy.captions.ending,
    ],
  };
};

const useAiVideo = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const timeline = useTimeline({ delays: DELAYS, active, reduced });
  const [prompt, setPromptState] = useState(copy.examples[0].prompt);
  const [briefPrompt, setBriefPrompt] = useState(prompt);
  const [changed, setChanged] = useState(false);
  const [format, setFormatState] = useState<AiVideoFormat>('tall');
  const [style, setStyle] = useState<AiVideoStyle>('cine');

  const { step, running, done } = timeline;
  const progress = step < 0 ? 0 : step / TICKS;
  const ratio = copy.formats.find((item) => item.value === format)?.ratio ?? '';
  const meta = running
    ? `${Math.round(progress * 100)}%`
    : done
      ? copy.ready(ratio)
      : changed
        ? copy.changed
        : copy.duration;

  return {
    ref,
    prompt,
    example: copy.examples.findIndex((item) => item.prompt === prompt),
    format,
    style,
    running,
    done,
    progress,
    stage: done
      ? copy.stages.length
      : step < 0
        ? -1
        : Math.min(copy.stages.length - 1, Math.floor(progress * copy.stages.length)),
    meta,
    brief: toBrief(briefPrompt),
    /** Кадр ещё рендерится: проявляется по мере прогресса. */
    isPending: (index: number) => running && progress <= 0.3 + index * 0.17,
    setPrompt: (value: string) => {
      setPromptState(value);
      if (running) return;
      timeline.reset();
      setChanged(true);
    },
    selectExample: (index: number) => {
      const next = copy.examples[index].prompt;
      setPromptState(next);
      setBriefPrompt(next);
      setChanged(false);
      timeline.reset();
    },
    setFormat: (index: number) => {
      setFormatState(copy.formats[index].value);
      setBriefPrompt(prompt);
    },
    setStyle: (index: number) => setStyle(copy.styles[index].value),
    generate: () => {
      setBriefPrompt(prompt);
      setChanged(false);
      timeline.start();
    },
  };
};

export default useAiVideo;
