import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

// Must match the `mobile` mixin in styles/_mixins.scss.
const MOBILE_QUERY = '(max-width: 768px) and (orientation: portrait)';

export interface IUseHeaderState {
  menuOpen: boolean;
  compact: boolean;
  /** Линия прочитанного: долю пишем прямо в стиль, чтобы не перерисовывать шапку на каждый кадр. */
  progressRef: RefObject<HTMLSpanElement | null>;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const useHeaderState = (): IUseHeaderState => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Тонкое состояние включается, когда страница ушла вниз на высоту полной шапки.
  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      // Гистерезис: включаем позже, выключаем раньше. У одного порога состояние дребезжит.
      setCompact((on) => (on ? window.scrollY > rem * 4 : window.scrollY > rem * 10));
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const read = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressRef.current?.style.setProperty('--read', read.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      if (!mq.matches) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return {
    menuOpen,
    compact,
    progressRef,
    toggleMenu: () => setMenuOpen((v) => !v),
    closeMenu: () => setMenuOpen(false),
  };
};

export default useHeaderState;
