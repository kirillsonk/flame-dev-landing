'use client';

import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { WHY_LAYERS, WHY_POSTER, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyLayers from './hooks/useWhyLayers';
import styles from './WhyLayers.module.scss';

const POSTER_STYLE = { '--poster': `url(${WHY_POSTER.src})` } as CSSProperties;
const TAG_MODS = ['layers__tag--1', 'layers__tag--2', 'layers__tag--3'];
const NAV_ITEMS = 3;

// Вариант «Слои»: экран разобран в изометрии на дизайн, видео и интерфейс и собирается анфас.
const WhyLayers = () => {
  const { rootRef } = useWhyLayers();

  return (
    <section ref={rootRef} className={styles.layers} style={POSTER_STYLE}>
      <div className={styles.layers__scene} aria-hidden="true">
        <div className={styles.layers__stack} data-part="stack">
          <div className={styles.layers__layer} data-part="layer">
            <div className={clsx(styles.layers__face, styles['layers__face--design'])} />
            <span className={clsx(styles.layers__tag, styles[TAG_MODS[0]])} data-part="tag">
              {WHY_LAYERS.tags[0]}
            </span>
          </div>
          <div className={styles.layers__layer} data-part="layer">
            <div className={clsx(styles.layers__face, styles['layers__face--video'])} />
            <span className={clsx(styles.layers__tag, styles[TAG_MODS[1]])} data-part="tag">
              {WHY_LAYERS.tags[1]}
            </span>
          </div>
          <div className={styles.layers__layer} data-part="layer">
            <div className={clsx(styles.layers__face, styles['layers__face--ui'])}>
              <div className={styles.layers__nav}>
                <b className={styles.layers__brand}>{WHY_LAYERS.brand}</b>
                <span className={styles.layers__menu}>
                  {Array.from({ length: NAV_ITEMS }, (_, i) => (
                    <i key={i} className={styles.layers__bar} />
                  ))}
                </span>
              </div>
              <div className={styles.layers__heading}>{WHY_LAYERS.heading}</div>
              <div className={styles.layers__line} />
              <span className={styles.layers__button}>{WHY_LAYERS.button}</span>
            </div>
            <span className={clsx(styles.layers__tag, styles[TAG_MODS[2]])} data-part="tag">
              {WHY_LAYERS.tags[2]}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles.layers__title}>{WHY_TITLE}</h2>
        <WhyCards
          classNames={{
            list: styles.layers__list,
            card: styles.layers__item,
            featured: styles['layers__item--featured'],
          }}
        />
      </div>
    </section>
  );
};

export default WhyLayers;
