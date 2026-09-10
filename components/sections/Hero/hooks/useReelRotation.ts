import { useCallback, useEffect, useRef, useState } from 'react';

export interface IUseReelRotation {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

const useReelRotation = (count: number, intervalMs = 4500): IUseReelRotation => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const id = window.setInterval(() => {
      if (hoveredRef.current) return;
      setActiveIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  const onHoverStart = useCallback((index: number) => {
    hoveredRef.current = true;
    setActiveIndex(index);
  }, []);

  const onHoverEnd = useCallback(() => {
    hoveredRef.current = false;
  }, []);

  return { activeIndex, setActiveIndex, onHoverStart, onHoverEnd };
};

export default useReelRotation;
