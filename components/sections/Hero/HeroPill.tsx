'use client';

import { useRef } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import type { IHeroPill } from '@/data/types';
import { SERVICES } from '@/data/services';
import { SERVICES_GOTO_EVENT } from '@/components/sections/Services/hooks/useServicesPlayer';
import useChipMagnet from './hooks/useChipMagnet';
import useChipSize from './hooks/useChipSize';
import styles from './HeroOverlay.module.scss';

export interface HeroPillProps {
  pill: IHeroPill;
}

// Пилюля надзаголовка, как чипы прежнего заголовка: белая, тянется за курсором, у каждой свой ховер
// (стили в HeroOverlay.module.scss). Клик открывает сцену услуги в «Что разработаем для вас».
const HeroPill = ({ pill }: HeroPillProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  useChipMagnet(ref);
  const { size } = useChipSize(ref, pill.effect === 'frame');
  const index = SERVICES.findIndex((item) => item.slug === pill.service);
  const stack = pill.effect === 'roll' ? pill.stack ?? [] : [];

  return (
    <a
      ref={ref}
      href="#services"
      className={clsx(styles.heroOverlay__pill, styles[`heroOverlay__pill--${pill.effect}`])}
      data-meta={size}
      onClick={() => window.dispatchEvent(new CustomEvent(SERVICES_GOTO_EVENT, { detail: index }))}
    >
      {stack.length > 0 ? (
        // Слово в потоке задает ширину, стек лежит ниже и уезжает вверх до копии слова.
        <span className={styles.heroOverlay__slot}>
          <span className={styles.heroOverlay__roll} style={{ '--slot-shift': `-${(stack.length + 1) * 100}%` } as CSSProperties}>
            {pill.label}
            {[...stack, pill.label].map((item, position, all) => (
              <span
                key={item}
                className={clsx(styles.heroOverlay__rollItem, position === all.length - 1 && styles['heroOverlay__rollItem--last'])}
                style={{ top: `${(position + 1) * 100}%` }}
                aria-hidden="true"
              >
                {item}
              </span>
            ))}
          </span>
        </span>
      ) : (
        pill.label
      )}
      {pill.effect === 'game' && (
        <span className={styles.heroOverlay__stars} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </a>
  );
};

export default HeroPill;
