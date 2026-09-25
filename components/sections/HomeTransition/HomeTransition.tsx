'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import useHomeTransition from './hooks/useHomeTransition';
import { DEFAULT_TRANSITION } from './variants';
import type { HomeTransitionVariant } from './variants';
import styles from './HomeTransition.module.scss';

export interface HomeTransitionProps {
  variant?: HomeTransitionVariant;
  children: ReactNode;
}

// Обёртка первого экрана и кейсов: по скроллу ведёт переход между ними (см. хук).
// На главной — вариант 4 «зум и размытие»; остальные 1…10 остаются в хуке.
const HomeTransition = ({ variant = DEFAULT_TRANSITION, children }: HomeTransitionProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useHomeTransition(rootRef, variant);

  return (
    <div ref={rootRef} className={styles.transition}>
      {children}
    </div>
  );
};

export default HomeTransition;
