import { useCallback, useEffect, useRef, useState } from 'react';

export interface IUseReelRotation {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

const MOBILE_QUERY = '(max-width: 768px) and (orientation: portrait)'; // must match the `mobile` mixin

const useReelRotation = (count: number, intervalMs = 4500): IUseReelRotation => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mobile = window.matchMedia(MOBILE_QUERY);
    let id = 0;
    const start = () => {
      window.clearInterval(id);
      if (mobile.matches || document.hidden) return;
      id = window.setInterval(() => {
        if (hoveredRef.current) return;
        setActiveIndex((i) => (i + 1) % count);
      }, intervalMs);
    };
    start();
    mobile.addEventListener('change', start);
    document.addEventListener('visibilitychange', start);
    return () => {
      window.clearInterval(id);
      mobile.removeEventListener('change', start);
      document.removeEventListener('visibilitychange', start);
    };
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
