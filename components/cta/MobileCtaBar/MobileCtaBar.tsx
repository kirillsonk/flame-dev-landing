'use client';

import { useEffect } from 'react';
import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_LABEL } from '@/data/site';
import useCtaVisibility from '../hooks/useCtaVisibility';
import styles from './MobileCtaBar.module.scss';
import { useLocale } from '@/components/i18n/LocaleProvider';

const MobileCtaBar = () => {
  const { t } = useLocale();
  const visible = useCtaVisibility();

  // Плашка cookie встает над кнопкой, только пока кнопка на экране, иначе опускается к краю
  useEffect(() => {
    document.documentElement.toggleAttribute('data-cta-bar', visible);
    return () => document.documentElement.removeAttribute('data-cta-bar');
  }, [visible]);

  return (
    <div className={clsx(styles.bar, visible && styles['bar--visible'])} aria-hidden={!visible}>
      <BaseButton href="#contact" block tabIndex={visible ? 0 : -1}>
        {t(CTA_LABEL)}
      </BaseButton>
    </div>
  );
};

export default MobileCtaBar;
