import { useEffect, useRef } from 'react';
import type { MouseEvent, RefObject } from 'react';

export interface IUseHeaderBlob {
  linksRef: RefObject<HTMLDivElement | null>;
  blobRef: RefObject<HTMLSpanElement | null>;
  onLinkEnter: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLinksLeave: () => void;
}

/**
 * Шапка «Бегущая плашка»: подложка стоит под разделом, который сейчас на экране,
 * и переезжает под пункт под курсором. Секции главной пересоздаются меню вариантов,
 * поэтому раздел ищется по якорю на каждом кадре прокрутки, а не наблюдателем за узлами.
 */
const useHeaderBlob = (enabled: boolean, locale: string): IUseHeaderBlob => {
  const linksRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const hovered = useRef<HTMLAnchorElement | null>(null);
  const active = useRef<HTMLAnchorElement | null>(null);

  const moveTo = (link: HTMLAnchorElement | null) => {
    const blob = blobRef.current;
    if (!blob) return;
    blob.style.opacity = link ? '1' : '0';
    if (!link) return;
    blob.style.transform = `translateX(${link.offsetLeft}px)`;
    blob.style.width = `${link.offsetWidth}px`;
  };

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const links = Array.from(linksRef.current?.querySelectorAll<HTMLAnchorElement>('a[href*="#"]') ?? []);
      const middle = window.innerHeight / 2;
      active.current =
        links.find((link) => {
          const rect = document.querySelector(link.hash)?.getBoundingClientRect();
          return rect ? rect.top <= middle && rect.bottom > middle : false;
        }) ?? null;
      if (!hovered.current) moveTo(active.current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, locale]);

  const onLinkEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    hovered.current = event.currentTarget;
    moveTo(event.currentTarget);
  };

  const onLinksLeave = () => {
    hovered.current = null;
    moveTo(active.current);
  };

  return { linksRef, blobRef, onLinkEnter, onLinksLeave };
};

export default useHeaderBlob;
