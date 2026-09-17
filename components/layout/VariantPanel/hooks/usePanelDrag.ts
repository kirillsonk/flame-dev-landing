import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export interface IUsePanelDrag {
  /** Начало перетаскивания: вешается на кнопку и на заголовок панели. */
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void;
  /** Было ли последнее нажатие перетаскиванием: тогда клик по кнопке не открывает меню. */
  consumeDrag: () => boolean;
}

interface IPanelPosition {
  x: number;
  y: number;
}

const STORAGE_KEY = 'flame-dev:variant-panel';
// Сдвиг в пикселях, после которого нажатие считается перетаскиванием, а не кликом.
const DRAG_THRESHOLD = 4;
// Отступ от краёв окна в пикселях: кнопку нельзя увезти за экран.
const EDGE = 8;

const readPosition = (): IPanelPosition | null => {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');
    return typeof value?.x === 'number' && typeof value?.y === 'number' ? value : null;
  } catch {
    return null;
  }
};

const savePosition = (position: IPanelPosition) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  } catch {
    // Хранилище недоступно (приватный режим): позиция просто не запомнится.
  }
};

/**
 * Перетаскивание меню вариантов. Позиция живёт в инлайн-стилях корня, а не в состоянии React:
 * перерисовки на каждый pointermove не нужны. Корень — точка размером с кнопку, панель
 * раскрывается от неё в сторону, где больше места (data-vertical / data-horizontal).
 */
const usePanelDrag = (rootRef: RefObject<HTMLDivElement | null>): IUsePanelDrag => {
  const position = useRef<IPanelPosition | null>(null);
  const dragged = useRef(false);

  const place = (x: number, y: number) => {
    const root = rootRef.current;
    if (!root) return;
    const { width, height } = root.getBoundingClientRect();
    const left = Math.min(Math.max(EDGE, x), window.innerWidth - width - EDGE);
    const top = Math.min(Math.max(EDGE, y), window.innerHeight - height - EDGE);
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.dataset.vertical = top + height / 2 < window.innerHeight / 2 ? 'top' : 'bottom';
    root.dataset.horizontal = left + width / 2 < window.innerWidth / 2 ? 'left' : 'right';
    position.current = { x: left, y: top };
  };

  // Сохранённая позиция ставится после монтирования; на ресайзе кнопка возвращается в окно.
  useEffect(() => {
    const saved = readPosition();
    if (saved) place(saved.x, saved.y);
    const onResize = () => {
      if (position.current) place(position.current.x, position.current.y);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // place читает только ref и окно.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    const root = rootRef.current;
    // Кнопки внутри заголовка («Сбросить») остаются кнопками; сама кнопка-кружок — ручка.
    const button = (event.target as HTMLElement).closest('button');
    if (!root || event.button !== 0 || (button && button !== event.currentTarget)) return;

    const handle = event.currentTarget;
    const box = root.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    dragged.current = false;
    handle.setPointerCapture(event.pointerId);

    const onMove = (move: PointerEvent) => {
      const dx = move.clientX - startX;
      const dy = move.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      moved = true;
      root.dataset.dragging = '';
      place(box.left + dx, box.top + dy);
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      delete root.dataset.dragging;
      if (moved && position.current) {
        dragged.current = true;
        savePosition(position.current);
      }
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  const consumeDrag = () => {
    const value = dragged.current;
    dragged.current = false;
    return value;
  };

  return { onDragStart, consumeDrag };
};

export default usePanelDrag;
