'use client';

import type { PointerEvent } from 'react';
import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import useStoredVariant from '@/components/layout/VariantPanel/hooks/useStoredVariant';
import { CTA_LABEL } from '@/data/site';
import { parseCtaButton } from './variants';
import styles from './CtaButton.module.scss';

export interface CtaButtonProps {
  href?: string;
  block?: boolean;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
}

// Шаг задержки между буквами в «Волне», мс.
const WAVE_STEP = 18;

// Точка входа курсора: из неё растекается заливка варианта «Заливка от курсора».
const setSpot = (event: PointerEvent<HTMLAnchorElement>) => {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
  target.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
};

// Кнопка «Обсудить проект»; вид выбирается меню вариантов (группа ctaButton).
const CtaButton = ({ href = '#contact', block = false, className, onClick, tabIndex }: CtaButtonProps) => {
  const { value } = useStoredVariant('ctaButton');
  const variant = parseCtaButton(value);

  if (variant === 'current' || variant === 'beam') {
    return (
      <BaseButton href={href} block={block} className={className} onClick={onClick} tabIndex={tabIndex}>
        {CTA_LABEL}
      </BaseButton>
    );
  }

  const spot = variant === 'spot';
  const wave = variant === 'wave';

  return (
    <a
      href={href}
      className={clsx(styles.cta, styles[`cta--${variant}`], block && styles['cta--block'], className)}
      aria-label={wave ? CTA_LABEL : undefined}
      tabIndex={tabIndex}
      onClick={onClick}
      onPointerEnter={spot ? setSpot : undefined}
      onPointerLeave={spot ? setSpot : undefined}
    >
      {wave ? (
        Array.from(CTA_LABEL).map((char, index) => (
          <span key={index} className={styles.cta__char} style={{ transitionDelay: `${index * WAVE_STEP}ms` }} aria-hidden="true">
            {char}
          </span>
        ))
      ) : (
        <span className={styles.cta__label}>{CTA_LABEL}</span>
      )}
      {variant === 'reveal' && (
        <span className={styles.cta__slot} aria-hidden="true">
          <BaseIcon name="arrow" className={styles.cta__icon} />
        </span>
      )}
    </a>
  );
};

export default CtaButton;
