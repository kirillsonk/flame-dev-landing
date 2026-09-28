'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import { APPEARANCE } from '@/data/appearance';
import { STUDIO } from '@/data/studio';
import styles from './Studio.module.scss';

interface FeaturedProjectProps { children: ReactNode }
const FeaturedProject = ({ children }: FeaturedProjectProps) => {
  const [paused, setPaused] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '0px' });
  return <div ref={ref} className={styles.hero__projectSlot}>
    <div className={clsx(styles.hero__project, (paused || !inView) && styles['hero__project--paused'])}>
      <div className={styles.hero__projectTop}>
        <span>{STUDIO.feature.label}</span>
        <button type="button" className={styles.hero__motion} onClick={() => setPaused(!paused)} aria-label={paused ? APPEARANCE.resume : APPEARANCE.pause} title={paused ? APPEARANCE.resume : APPEARANCE.pause} aria-pressed={paused}>
          <span>Flame Dev / 01</span><svg viewBox="0 0 16 16" aria-hidden="true">{paused ? <path d="m5 3 7 5-7 5Z" fill="currentColor" /> : <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />}</svg>
        </button>
      </div>
      {children}
    </div>
  </div>;
};
export default FeaturedProject;
