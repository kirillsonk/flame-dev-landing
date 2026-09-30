'use client';

import { useEffect } from 'react';
import { THEME_EVENT, THEME_KEY, themeByTime } from '@/lib/theme';

// Раз в минуту сверяет тему со временем суток, пока посетитель не выбрал ее сам.
// Сайт, открытый днем, к вечеру сам станет темным. Ничего не рисует
const AutoTheme = () => {
  useEffect(() => {
    const sync = () => {
      try {
        if (window.localStorage.getItem(THEME_KEY)) return;
      } catch {
        // Без хранилища ручного выбора нет, работаем по времени
      }
      const theme = themeByTime();
      if (document.documentElement.dataset.theme === theme) return;
      document.documentElement.dataset.theme = theme;
      window.dispatchEvent(new Event(THEME_EVENT));
    };
    const timer = window.setInterval(sync, 60_000);
    const visibility = () => { if (!document.hidden) sync(); };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return null;
};

export default AutoTheme;
