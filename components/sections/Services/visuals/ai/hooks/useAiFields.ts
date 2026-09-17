import { useState } from 'react';
import { AI_FIELDS as copy } from '@/data/demosAi';
import type { AiTone, IAiLeadMark } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTimeline from './useTimeline';

/** Печать: по 2 символа каждые 28 мс. Затем по одной подсветке и по одному полю CRM. */
const CHARS_PER_STEP = 2;
const TYPE_PAUSE = 500;
const TYPE_DELAY = 28;
const MARK_PAUSE = 450;
const MARK_DELAY = 380;
const FIELD_PAUSE = 550;
const FIELD_DELAY = 240;

export type AiFieldsPhase = 'typing' | 'marking' | 'filling' | 'done';

export interface IAiLeadSegment {
  text: string;
  mark?: IAiLeadMark;
  tone?: AiTone;
  /** Порядковый номер подсветки — очередь её появления. */
  order: number;
  /** Позиция куска в тексте заявки. */
  start: number;
}

export interface IAiLeadField {
  key: string;
  name: string;
  tone: AiTone;
  value: string | null;
  /** Поле ещё не перенесено в карточку. */
  hidden: boolean;
}

// Режем текст заявки на куски: обычный текст и фразы, связанные с полями CRM.
const toSegments = (index: number): IAiLeadSegment[] => {
  const { text, marks } = copy.samples[index];
  const lower = text.toLowerCase();
  const hits = marks
    .map((mark) => ({ mark, start: lower.indexOf(mark.phrase.toLowerCase()) }))
    .filter((hit) => hit.start >= 0)
    .sort((a, b) => a.start - b.start);
  const segments: IAiLeadSegment[] = [];
  let position = 0;
  hits.forEach(({ mark, start }, order) => {
    if (start < position) return;
    if (start > position) segments.push({ text: text.slice(position, start), order, start: position });
    const end = start + mark.phrase.length;
    const tone = copy.fields.find((field) => field.key === mark.key)?.tone;
    segments.push({ text: text.slice(start, end), mark, tone, order, start });
    position = end;
  });
  if (position < text.length) segments.push({ text: text.slice(position), order: hits.length, start: position });
  return segments;
};

const queue = (count: number, pause: number, delay: number) =>
  Array.from({ length: count }, (_, index) => (index ? delay : pause));

// Сценарий: заявка печатается, фразы подсвечиваются по очереди, затем справа заполняется карточка CRM.
const useAiFields = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [hot, setHot] = useState<string | null>(null);
  const sample = copy.samples[selected];
  const segments = toSegments(selected);
  const markCount = segments.filter((segment) => segment.mark).length;
  const typeSteps = Math.ceil(sample.text.length / CHARS_PER_STEP);
  const timeline = useTimeline({
    delays: [
      ...queue(typeSteps, TYPE_PAUSE, TYPE_DELAY),
      ...queue(markCount, MARK_PAUSE, MARK_DELAY),
      ...queue(copy.fields.length, FIELD_PAUSE, FIELD_DELAY),
    ],
    active,
    reduced,
    autoStart: true,
  });
  const step = Math.max(0, timeline.step);
  const typed = Math.min(sample.text.length, step * CHARS_PER_STEP);
  const marksShown = Math.max(0, Math.min(markCount, step - typeSteps));
  const fieldsShown = Math.max(0, Math.min(copy.fields.length, step - typeSteps - markCount));
  const phase: AiFieldsPhase = timeline.done
    ? 'done'
    : step < typeSteps
      ? 'typing'
      : step < typeSteps + markCount
        ? 'marking'
        : 'filling';

  // Сегменты обрезаны по напечатанному; фраза становится подсветкой, когда до неё дошла очередь.
  const visible = segments
    .map((segment) => ({
      ...segment,
      text: segment.text.slice(0, Math.max(0, typed - segment.start)),
      mark: segment.order < marksShown ? segment.mark : undefined,
    }))
    .filter((segment) => segment.text);

  const fields: IAiLeadField[] = copy.fields.map((field, index) => ({
    ...field,
    value: sample.marks.find((mark) => mark.key === field.key)?.value ?? null,
    hidden: index >= fieldsShown,
  }));
  const found = fields.filter((field) => field.value && !field.hidden).length;
  const type = fields.find((field) => field.key === 'type' && !field.hidden)?.value;

  return {
    ref,
    selected,
    segments: visible,
    fields,
    found,
    phase,
    percent: Math.round((found / fields.length) * 100),
    title: fieldsShown ? (type ? copy.deal(type) : copy.noType) : phase === 'typing' ? copy.waiting : copy.parsing,
    hot,
    select: (index: number) => {
      setSelected(index);
      setHot(null);
      timeline.start();
    },
    hover: (key: string, on: boolean) => setHot((current) => (on ? key : current === key ? null : current)),
  };
};

export default useAiFields;
