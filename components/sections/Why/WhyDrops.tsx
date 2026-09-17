'use client';

import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { WHY_PARTS, WHY_POSTER, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyDrops from './hooks/useWhyDrops';
import styles from './WhyDrops.module.scss';

// На странице один экземпляр блока, поэтому id фильтра статичный.
const GOO_ID = 'why-drops-goo';
const BLOB_MODS = ['drops__blob--1', 'drops__blob--2', 'drops__blob--3'];
const SECTION_STYLE = { '--poster': `url(${WHY_POSTER.src})`, '--goo': `url(#${GOO_ID})` } as CSSProperties;

// Вариант «Капли»: три капли стягиваются к центру и сливаются в одну (SVG goo-фильтр).
const WhyDrops = () => {
  const { rootRef } = useWhyDrops();

  return (
    <section ref={rootRef} className={styles.drops} style={SECTION_STYLE}>
      <svg className={styles.drops__defs} width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={GOO_ID}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
          </filter>
        </defs>
      </svg>
      <div className={styles.drops__scene} data-part="scene">
        <div className={styles.drops__goo} aria-hidden="true">
          <div className={clsx(styles.drops__blob, styles['drops__blob--core'])} data-part="core" />
          {BLOB_MODS.map((mod) => (
            <div key={mod} className={clsx(styles.drops__blob, styles[mod])} data-part="blob" />
          ))}
        </div>
        <div className={styles.drops__labels} aria-hidden="true">
          {WHY_PARTS.map((label) => (
            <span key={label} className={styles.drops__label} data-part="label">
              {label}
            </span>
          ))}
        </div>
        <h2 className={styles.drops__title}>{WHY_TITLE}</h2>
      </div>
      <WhyCards
        classNames={{ list: styles.drops__cards, card: styles.drops__card, featured: styles['drops__card--featured'] }}
      />
    </section>
  );
};

export default WhyDrops;
