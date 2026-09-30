'use client';

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CASES } from '@/data/cases';
import { translateText } from '@/lib/i18n';
import type { Locale, TranslationParams } from '@/lib/i18n';

const STORAGE_KEY = 'flame-locale';
const CHANGE_EVENT = 'flame:locale-change';
let memoryLocale: Locale = 'ru';

const getSnapshot = (): Locale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'ru' ? saved : memoryLocale;
  } catch { return memoryLocale; }
};
const getServerSnapshot = (): Locale => 'ru';
const subscribe = (notify: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    memoryLocale = event.newValue === 'en' ? 'en' : 'ru';
    notify();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
};
const setLocale = (locale: Locale) => {
  memoryLocale = locale;
  try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* Keep the choice for this tab when storage is unavailable. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

interface ILocaleContext {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (source: string, params?: TranslationParams) => string;
}
const LocaleContext = createContext<ILocaleContext>({ locale: 'ru', setLocale, t: source => source });

const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();
  const value = useMemo(() => ({ locale, setLocale, t: (source: string, params?: TranslationParams) => translateText(locale, source, params) }), [locale]);
  const item = pathname.startsWith('/cases/') ? CASES.find(entry => entry.slug === pathname.split('/')[2]) : undefined;
  const publicPage = pathname === '/' || pathname === '/cases' || Boolean(item);
  const title = item ? `${value.t(item.title)} | Flame dev` : pathname === '/cases' ? `${value.t('Кейсы')} | Flame dev` : value.t('Flame dev | Разработка сайтов, сервисов и AI-решений');
  const description = value.t(item?.description ?? (pathname === '/cases' ? 'Все проекты Flame dev: спецпроекты для брендов, платформы, сайты и AI-продукты' : 'Разрабатываем сайты, цифровые сервисы, спецпроекты и AI-решения для бизнеса. Берем на себя проектирование, дизайн и запуск'));
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return <LocaleContext.Provider value={value}>{publicPage && <><title>{title}</title><meta name="description" content={description} /></>}{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);
export default LocaleProvider;
