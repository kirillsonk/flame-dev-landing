'use client';

import type { UIEvent } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Poster from '@/components/ui/Poster/Poster';
import type { ICase } from '@/data/types';
import { HERO_REEL_LABELS, HERO_REEL_CTA } from '@/data/cases';
import useReelRotation from '@/components/sections/Hero/hooks/useReelRotation';
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
          // Полоса ведёт на страницу кейса, как и вкладки в полноэкранном варианте.
          <Link
            key={item.slug}
            href={`/cases/${item.slug}`}
            className={clsx(styles.reel__strip, index === activeIndex && styles['reel__strip--active'])}
            onMouseEnter={() => onHoverStart(index)}
            onFocus={() => onHoverStart(index)}
            aria-label={item.title}
          >
            <div className={styles.reel__media}>
              <Poster item={item} playing={index === activeIndex} showTitle={false} />
            </div>
            <span className={styles.reel__shade} aria-hidden="true" />
            <span className={styles.reel__spine} aria-hidden="true">{HERO_REEL_LABELS[item.slug] ?? item.title}</span>
            <span className={styles.reel__caption} aria-hidden="true">
              <span className={styles.reel__category}>{item.tags[0]}</span>
              <span className={styles.reel__title}>{item.title}</span>
              <span className={styles.reel__cta}>{HERO_REEL_CTA}<span>↗</span></span>
            </span>
          </Link>
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
