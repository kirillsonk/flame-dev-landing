import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import usePanelDrag from './usePanelDrag';

export interface IUseVariantPanel {
  open: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  toggle: () => void;
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void;
}

// Открытие и перетаскивание меню; сам выбор вариантов — в useVariants.
const useVariantPanel = (): IUseVariantPanel => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { onDragStart, consumeDrag } = usePanelDrag(rootRef);

  // Закрывается по Escape и по клику мимо панели.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // Отпускание после перетаскивания тоже даёт click: его пропускаем, меню не мигает.
  const toggle = () => {
    if (consumeDrag()) return;
    setOpen((value) => !value);
  };

  return { open, rootRef, toggle, onDragStart };
};

export default useVariantPanel;
