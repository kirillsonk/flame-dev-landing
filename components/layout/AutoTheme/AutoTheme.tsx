'use client';

import { useEffect } from 'react';
import { DARK_QUERY, THEME_EVENT, THEME_KEY, autoTheme } from '@/lib/theme';

// Пока посетитель не выбрал тему сам, сверяет ее с темой устройства и солнцем: раз в минуту,
// при возврате на вкладку и сразу, когда устройство переключает тему. Ничего не рисует
const AutoTheme = () => {
  useEffect(() => {
    const sync = () => {
      try {
        if (window.localStorage.getItem(THEME_KEY)) return;
      } catch {
        // Без хранилища ручного выбора нет, работаем автоматически
      }
      const theme = autoTheme(new Date());
      if (document.documentElement.dataset.theme === theme) return;
      document.documentElement.dataset.theme = theme;
      window.dispatchEvent(new Event(THEME_EVENT));
    };
    const device = window.matchMedia(DARK_QUERY);
    const timer = window.setInterval(sync, 60_000);
    const visibility = () => { if (!document.hidden) sync(); };
    device.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.clearInterval(timer);
      device.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return null;
};

export default AutoTheme;
