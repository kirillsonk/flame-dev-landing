import { useEffect, useState } from 'react';

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

  return {
    scrolled,
    menuOpen,
    toggleMenu: () => setMenuOpen((v) => !v),
    closeMenu: () => setMenuOpen(false),
  };
};

export default useHeaderState;
