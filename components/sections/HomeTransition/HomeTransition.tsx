'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import useHomeTransition from './hooks/useHomeTransition';
import type { HomeTransitionVariant } from './variants';
import styles from './HomeTransition.module.scss';

export interface HomeTransitionProps {
  variant: HomeTransitionVariant;
  children: ReactNode;
}

// Обёртка первого экрана и кейсов: по скроллу ведёт переход между ними (см. хук).
// Вариант 1…10 выбирается меню вариантов в углу экрана (см. components/sections/Home/Home.tsx).
const HomeTransition = ({ variant, children }: HomeTransitionProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useHomeTransition(rootRef, variant);

  return (
    <div ref={rootRef} className={styles.transition}>
      {children}
    </div>
  );
};

export default HomeTransition;
