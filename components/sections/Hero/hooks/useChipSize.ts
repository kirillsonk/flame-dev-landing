import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export interface IUseChipSize {
  /** «320 × 96» — ширина × высота бокса в CSS-пикселях. */
  size: string | undefined;
}

// Реальные размеры пилюли для бейджа «как в Figma». ResizeObserver отдаёт
// нетрансформированный бокс, поэтому поворот на ховере на цифры не влияет.
const useChipSize = (ref: RefObject<HTMLElement | null>, enabled: boolean): IUseChipSize => {
  const [size, setSize] = useState<string>();

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const box = entry.borderBoxSize?.[0];
      const w = box ? box.inlineSize : width;
      const h = box ? box.blockSize : height;
      setSize(`${Math.round(w)} × ${Math.round(h)}`);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return { size };
};

export default useChipSize;
