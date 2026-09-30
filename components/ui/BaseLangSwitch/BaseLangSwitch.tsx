'use client';

import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { LANGS } from '@/data/site';
import styles from './BaseLangSwitch.module.scss';

export interface BaseLangSwitchProps {
  className?: string;
}

const BaseLangSwitch = ({ className }: BaseLangSwitchProps) => {
  const { locale, setLocale, t } = useLocale();
  const index = LANGS.findIndex((lang) => lang.code === locale);

  return (
    <div className={clsx(styles.langSwitch, className)} role="group" aria-label={t('Язык сайта')}>
      <span className={styles.langSwitch__pill} style={{ '--index': index } as CSSProperties} aria-hidden="true" />
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={clsx(styles.langSwitch__option, locale === lang.code && styles['langSwitch__option--active'])}
          aria-pressed={locale === lang.code}
          aria-label={t(lang.code === 'en' ? 'Английский язык' : 'Русский язык')}
          lang={lang.code}
          onClick={() => setLocale(lang.code === 'en' ? 'en' : 'ru')}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default BaseLangSwitch;
