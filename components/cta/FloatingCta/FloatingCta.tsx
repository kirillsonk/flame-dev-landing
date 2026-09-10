'use client';

import { useState } from 'react';
import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import LeadForm from '@/components/sections/Contact/LeadForm';
import { CTA_LABEL } from '@/data/site';
import useCtaVisibility from '../hooks/useCtaVisibility';
import styles from './FloatingCta.module.scss';

const FloatingCta = () => {
  const visible = useCtaVisibility();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={clsx(styles.cta, visible && styles['cta--visible'])} aria-hidden={!visible}>
      {expanded ? (
        <div className={styles.cta__panel} role="dialog" aria-label="Расскажите о задаче">
          <div className={styles.cta__head}>
            <span className={styles.cta__title}>Расскажите о задаче</span>
            <button type="button" className={styles.cta__close} aria-label="Закрыть" onClick={() => setExpanded(false)}>
              ×
            </button>
          </div>
          <LeadForm source="floating" compact />
        </div>
      ) : (
        <BaseButton onClick={() => setExpanded(true)} tabIndex={visible ? 0 : -1}>
          {CTA_LABEL}
        </BaseButton>
      )}
    </div>
  );
};

export default FloatingCta;
