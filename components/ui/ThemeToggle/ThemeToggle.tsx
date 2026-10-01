'use client';

import { useSyncExternalStore } from 'react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { APPEARANCE } from '@/data/appearance';
import { THEME_EVENT, THEME_KEY, autoTheme } from '@/lib/theme';
import styles from './ThemeToggle.module.scss';

const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_KEY && event.key !== null) return;
    // Выбор в другой вкладке. Если его сбросили, возвращаемся к теме по времени суток
    document.documentElement.dataset.theme = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : autoTheme(new Date());
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
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
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* Theme still works without storage */ }
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  const label = t(light ? APPEARANCE.dark : APPEARANCE.light);
  return <button type="button" className={styles.toggle} aria-label={label} title={label} onClick={toggle}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {light ? <path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6 8.6 8.6 0 1 0 20.4 14.2Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
    </svg>
  </button>;
};
export default ThemeToggle;
