'use client';

import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_LABEL } from '@/data/site';
import useCtaVisibility from '../hooks/useCtaVisibility';
import styles from './MobileCtaBar.module.scss';

const MobileCtaBar = () => {
  const visible = useCtaVisibility();

  return (
    <div className={clsx(styles.bar, visible && styles['bar--visible'])} aria-hidden={!visible}>
      <BaseButton href="#contact" block tabIndex={visible ? 0 : -1}>
        {CTA_LABEL}
      </BaseButton>
    </div>
  );
};

export default MobileCtaBar;
