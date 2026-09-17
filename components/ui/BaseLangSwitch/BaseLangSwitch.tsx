'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { LANGS } from '@/data/site';
import styles from './BaseLangSwitch.module.scss';

export interface BaseLangSwitchProps {
  className?: string;
}

// Переключатель пока только визуальный: английской версии нет, язык страницы не меняется.
const BaseLangSwitch = ({ className }: BaseLangSwitchProps) => {
  const [active, setActive] = useState(LANGS[0].code);
  const index = LANGS.findIndex((lang) => lang.code === active);

  return (
    <div className={clsx(styles.langSwitch, className)} role="group" aria-label="Язык сайта">
      <span className={styles.langSwitch__pill} style={{ '--index': index } as CSSProperties} aria-hidden="true" />
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={clsx(styles.langSwitch__option, active === lang.code && styles['langSwitch__option--active'])}
          aria-pressed={active === lang.code}
          title={lang.hint}
          onClick={() => setActive(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default BaseLangSwitch;
