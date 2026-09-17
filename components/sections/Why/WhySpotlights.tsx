'use client';

import clsx from 'clsx';
import { WHY_SPOTLIGHTS, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhySpotlights from './hooks/useWhySpotlights';
import styles from './WhySpotlights.module.scss';

const BEAM_MODS = ['spotlights__beam--1', 'spotlights__beam--2', 'spotlights__beam--3'];
const SOURCE_MODS = ['spotlights__source--1', 'spotlights__source--2', 'spotlights__source--3'];

// Вариант «Прожекторы»: три луча из углов сцены сводятся в одну точку на заголовке.
const WhySpotlights = () => {
  const { rootRef } = useWhySpotlights();

  return (
    <section ref={rootRef} className={styles.spotlights}>
      <div className={styles.spotlights__beams} aria-hidden="true">
        {BEAM_MODS.map((mod) => (
          <div key={mod} className={clsx(styles.spotlights__beam, styles[mod])} data-part="beam" />
        ))}
        {WHY_SPOTLIGHTS.map((label, index) => (
          <span key={label} className={clsx(styles.spotlights__source, styles[SOURCE_MODS[index]])} data-part="source">
            {label}
          </span>
        ))}
      </div>
      <h2 className={styles.spotlights__title} data-part="title">
        {WHY_TITLE}
      </h2>
      <WhyCards
        image="end"
        classNames={{
          list: styles.spotlights__cards,
          card: styles.spotlights__card,
          featured: styles['spotlights__card--featured'],
          image: styles.spotlights__image,
        }}
      />
    </section>
  );
};

export default WhySpotlights;
