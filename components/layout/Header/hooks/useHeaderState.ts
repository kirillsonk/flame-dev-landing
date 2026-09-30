import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';

// Must match the `mobile` mixin in styles/_mixins.scss.
const MOBILE_QUERY = '(max-width: 900px)';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const subscribeMobile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const getMobileSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const getServerMobileSnapshot = () => false;

export interface IUseHeaderState {
  menuOpen: boolean;
  mobile: boolean;
  compact: boolean;
  /** Страница ушла от самого верха: под шапкой проявляется стекло */
  scrolled: boolean;
  headerRef: RefObject<HTMLElement | null>;
  navRef: RefObject<HTMLElement | null>;
  burgerRef: RefObject<HTMLButtonElement | null>;
  /** Линия прочитанного: долю пишем прямо в стиль, чтобы не перерисовывать шапку на каждый кадр. */
  progressRef: RefObject<HTMLSpanElement | null>;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const useHeaderState = (): IUseHeaderState => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerMobileSnapshot);
  const [compact, setCompact] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Тонкое состояние включается, когда страница ушла вниз на высоту полной шапки.
  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      // Гистерезис: включаем позже, выключаем раньше. У одного порога состояние дребезжит.
      setCompact((on) => (on ? window.scrollY > rem * 4 : window.scrollY > rem * 10));
      setScrolled(window.scrollY > 8);
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
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      if (!mq.matches) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        burgerRef.current?.focus({ preventScroll: true });
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
        .filter((item) => item.tabIndex >= 0 && item.getClientRects().length > 0 && getComputedStyle(item).visibility !== 'hidden' && !item.closest('[inert]'));
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !headerRef.current?.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !headerRef.current?.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };
    navRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    mq.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Пункт, сфокусированный на десктопе, не остается внутри закрытого меню после сужения окна.
  useEffect(() => {
    if (mobile && !menuOpen && navRef.current?.contains(document.activeElement)) {
      burgerRef.current?.focus({ preventScroll: true });
    }
  }, [mobile, menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    if (mobile && menuOpen) burgerRef.current?.focus({ preventScroll: true });
  };

  return {
    menuOpen,
    mobile,
    compact,
    scrolled,
    headerRef,
    navRef,
    burgerRef,
    progressRef,
    toggleMenu: () => setMenuOpen((v) => !v),
    closeMenu,
  };
};

export default useHeaderState;
