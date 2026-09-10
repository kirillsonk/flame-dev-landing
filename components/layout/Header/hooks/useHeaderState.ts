import { useEffect, useState } from 'react';

// Must match the `mobile` mixin in styles/_mixins.scss.
const MOBILE_QUERY = '(max-width: 768px) and (orientation: portrait)';

export interface IUseHeaderState {
  scrolled: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const useHeaderState = (): IUseHeaderState => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
    scrolled,
    menuOpen,
    toggleMenu: () => setMenuOpen((v) => !v),
    closeMenu: () => setMenuOpen(false),
  };
};

export default useHeaderState;
