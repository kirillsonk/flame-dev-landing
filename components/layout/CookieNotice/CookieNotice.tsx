'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { COOKIE_NOTICE } from '@/data/site';
import styles from './CookieNotice.module.scss';

const STORAGE_KEY = 'flame-cookie-ok';
// Плашка появляется не сразу: сначала посетитель видит первый экран
const SHOW_DELAY = 1200;

// Тонкое уведомление о cookie внизу экрана. Закрывается одной кнопкой, выбор запоминается
const CookieNotice = () => {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Хранилище недоступно: показываем, выбор живет до перезагрузки
    }
    // Сначала монтируем скрытой, следующим кадром проявляем: иначе переход не проиграется
    let frame = 0;
    const timer = window.setTimeout(() => {
      setMounted(true);
      frame = requestAnimationFrame(() => setVisible(true));
    }, SHOW_DELAY);
    return () => { window.clearTimeout(timer); cancelAnimationFrame(frame); };
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Без хранилища плашка просто закрывается
    }
    setVisible(false);
  };

  if (!mounted) return null;

  return (
    <aside
      className={clsx(styles.cookie, visible && styles['cookie--visible'])}
      role="region"
      aria-label={t(COOKIE_NOTICE.label)}
      inert={!visible}
      onTransitionEnd={() => { if (!visible) setMounted(false); }}
    >
      <p className={styles.cookie__text}>{t(COOKIE_NOTICE.text)}</p>
      <button type="button" className={styles.cookie__button} onClick={accept}>{t(COOKIE_NOTICE.accept)}</button>
    </aside>
  );
};

export default CookieNotice;
