import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { AI_DOCUMENTS as copy } from '@/data/demosAi';
import useDemoActive from './useDemoActive';
import useReducedMotion from './useReducedMotion';
import useTimeline from './useTimeline';

/** Шаги разбора: тип документа, четыре поля, маршрут. */
const DELAYS = [1100, 200, 280, 280, 280, 380];
const DRAG_THRESHOLD = 6;

export interface IAiDrag {
  index: number;
  x: number;
  y: number;
  over: boolean;
}

interface IPress {
  index: number;
  startX: number;
  startY: number;
  moved: boolean;
}

const useAiDocuments = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();
  const timeline = useTimeline({ delays: DELAYS, active, reduced, autoStart: true });
  const zoneRef = useRef<HTMLElement>(null);
  const firstTileRef = useRef<HTMLButtonElement>(null);
  const press = useRef<IPress | null>(null);
  const suppressClick = useRef(false);
  const [current, setCurrent] = useState<number | null>(0);
  const [processed, setProcessed] = useState<number[]>([0]);
  const [drag, setDrag] = useState<IAiDrag | null>(null);

  const process = (index: number) => {
    setCurrent(index);
    setProcessed((list) => (list.includes(index) ? list : [...list, index]));
    timeline.start();
  };

  const isOverZone = (x: number, y: number) => {
    const rect = zoneRef.current?.getBoundingClientRect();
    return Boolean(rect && x > rect.left && x < rect.right && y > rect.top && y < rect.bottom);
  };

  const endPress = () => {
    press.current = null;
    setDrag(null);
  };

  const { step } = timeline;

  return {
    ref,
    zoneRef,
    firstTileRef,
    doc: current === null ? null : copy.docs[current],
    processed,
    drag,
    step,
    /** Скан-полоса бежит, пока определяется тип (и только в активной сцене). */
    scanning: active && !reduced && step === 0,
    typeShown: step >= 1,
    isFieldShown: (index: number) => step >= 2 + index,
    routeShown: step >= 6,
    process,
    reset: () => {
      setCurrent(null);
      setProcessed([]);
      timeline.reset();
      firstTileRef.current?.focus();
    },
    tileHandlers: (index: number) => ({
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0) return;
        suppressClick.current = false;
        press.current = { index, startX: event.clientX, startY: event.clientY, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
        const state = press.current;
        if (!state) return;
        if (!state.moved && Math.hypot(event.clientX - state.startX, event.clientY - state.startY) > DRAG_THRESHOLD) {
          state.moved = true;
        }
        if (state.moved) {
          setDrag({ index, x: event.clientX, y: event.clientY, over: isOverZone(event.clientX, event.clientY) });
        }
      },
      onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
        const state = press.current;
        if (state?.moved) {
          suppressClick.current = true;
          if (isOverZone(event.clientX, event.clientY)) process(index);
        }
        endPress();
      },
      onPointerCancel: endPress,
      onClick: () => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        process(index);
      },
    }),
  };
};

export default useAiDocuments;
