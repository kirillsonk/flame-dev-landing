'use client';

import type { UIEvent } from 'react';
import clsx from 'clsx';
import Poster from '@/components/ui/Poster/Poster';
import type { ICase } from '@/data/types';
import useReelRotation from './hooks/useReelRotation';
import styles from './HeroReel.module.scss';

export interface HeroReelProps {
  items: ICase[];
}

const HeroReel = ({ items }: HeroReelProps) => {
  const { activeIndex, setActiveIndex, onHoverStart, onHoverEnd } = useReelRotation(items.length);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
    setActiveIndex(Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
  };

  return (
    <div className={styles.reel}>
      <div className={styles.reel__track} onScroll={onScroll} onMouseLeave={onHoverEnd} onBlur={onHoverEnd}>
        {items.map((item, index) => (
          <a
            key={item.slug}
            href="#cases"
            className={clsx(styles.reel__strip, index === activeIndex && styles['reel__strip--active'])}
            onMouseEnter={() => onHoverStart(index)}
            onFocus={() => onHoverStart(index)}
            aria-label={item.title}
          >
            <Poster item={item} playing={index === activeIndex} showTitle={false} />
            <span className={styles.reel__label} aria-hidden="true">{item.title}</span>
            <span className={styles.reel__caption} aria-hidden="true">{item.title}</span>
          </a>
        ))}
      </div>
      <div className={styles.reel__dots} aria-hidden="true">
        {items.map((item, index) => (
          <span key={item.slug} className={clsx(styles.reel__dot, index === activeIndex && styles['reel__dot--active'])} />
        ))}
      </div>
    </div>
  );
};

export default HeroReel;
