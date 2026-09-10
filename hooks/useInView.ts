import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface IUseInViewOptions {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export interface IUseInView<T extends HTMLElement> {
  ref: RefObject<T | null>;
  inView: boolean;
}

const useInView = <T extends HTMLElement>({ rootMargin = '200px 0px', threshold = 0.01, once = false }: IUseInViewOptions = {}): IUseInView<T> => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
};

export default useInView;
