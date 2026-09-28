'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import { CASE_TYPES, HERO_STAGE, STUDIO } from '@/data/studio';
import styles from './Showreel.module.scss';

export interface ReelCaptionProps {
  items: ICase[];
  current: number;
  cycle: number;
  running: boolean;
  onSelect: (index: number) => void;
  className?: string;
}

// Подпись текущего проекта и деления шоурила: активное деление заполняется за время кадра
const ReelCaption = ({ items, current, cycle, running, onSelect, className }: ReelCaptionProps) => {
  const item = items[current];
  return (
    <div className={clsx(styles.caption, className)} data-morph-fade>
      <Link key={item.slug} href={`/cases/${item.slug}`} className={styles.caption__link} aria-label={`${HERO_STAGE.open} · ${item.title}`}>
        <span className={styles.caption__title}>{item.title}</span>
        <span className={styles.caption__type}>{CASE_TYPES[item.slug]}</span>
        <span className={styles.caption__arrow} aria-hidden="true">↗</span>
      </Link>
      <div className={styles.caption__ticks} role="group" aria-label={HERO_STAGE.reelLabel}>
        {items.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            className={clsx(styles.caption__tick, index === current && styles['caption__tick--active'], index === current && running && styles['caption__tick--running'])}
            aria-label={`${STUDIO.feature.select} ${project.title}`}
            aria-pressed={index === current}
            onClick={() => onSelect(index)}
          >
            <span key={index === current ? cycle : undefined} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReelCaption;
