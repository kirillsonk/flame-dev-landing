'use client';

import { useSyncExternalStore } from 'react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { APPEARANCE } from '@/data/appearance';
import styles from './ThemeToggle.module.scss';

const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== 'flame-theme' && event.key !== null) return;
    document.documentElement.dataset.theme = event.newValue === 'light' ? 'light' : 'dark';
    window.dispatchEvent(new Event('flame-theme-change'));
  };
  window.addEventListener('flame-theme-change', callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener('flame-theme-change', callback);
    window.removeEventListener('storage', onStorage);
  };
};
const getSnapshot = () => document.documentElement.dataset.theme === 'light';
const getServerSnapshot = () => false;

const ThemeToggle = () => {
  const { t } = useLocale();
  const light = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = () => {
    const theme = light ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('flame-theme', theme); } catch { /* Theme still works without storage */ }
    window.dispatchEvent(new Event('flame-theme-change'));
  };
  const label = t(light ? APPEARANCE.dark : APPEARANCE.light);
  return <button type="button" className={styles.toggle} aria-label={label} title={label} onClick={toggle}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {light ? <path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6 8.6 8.6 0 1 0 20.4 14.2Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
    </svg>
  </button>;
};
export default ThemeToggle;
