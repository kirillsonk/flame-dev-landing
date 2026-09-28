'use client';

import clsx from 'clsx';
import { HERO_STAGE, HERO_VARIANTS } from '@/data/studio';
import type { HeroVariant } from './hooks/useHeroVariant';
import styles from './HeroSwitch.module.scss';

export interface HeroSwitchProps {
  variant: HeroVariant;
  onSelect: (value: HeroVariant) => void;
}

// Переключатель вариантов первого экрана для ревью, в продакшен-сборку не попадает
const HeroSwitch = ({ variant, onSelect }: HeroSwitchProps) => (
  <div className={styles.switch} role="group" aria-label={HERO_STAGE.switchLabel}>
    <span className={styles.switch__label}>{HERO_STAGE.switchLabel}</span>
    {HERO_VARIANTS.map(item => (
      <button
        key={item.value}
        type="button"
        className={clsx(styles.switch__option, item.value === variant && styles['switch__option--active'])}
        aria-pressed={item.value === variant}
        onClick={() => onSelect(item.value)}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export default HeroSwitch;
