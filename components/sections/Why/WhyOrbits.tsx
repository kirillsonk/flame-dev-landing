'use client';

import clsx from 'clsx';
import { WHY_BRAND, WHY_ORBITS, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyOrbits from './hooks/useWhyOrbits';
import styles from './WhyOrbits.module.scss';

const RING_MODS = ['orbits__ring--1', 'orbits__ring--2', 'orbits__ring--3'];
const SATELLITE_MODS = ['orbits__satellite--1', 'orbits__satellite--2', 'orbits__satellite--3'];

// Вариант «Орбиты»: три подрядчика кружат по своим орбитам, орбиты стягиваются в ядро Flame dev.
const WhyOrbits = () => {
  const { rootRef } = useWhyOrbits();

  return (
    <section ref={rootRef} className={styles.orbits}>
      <h2 className={styles.orbits__title}>{WHY_TITLE}</h2>
      <div className={styles.orbits__scene} data-part="scene" aria-hidden="true">
        {WHY_ORBITS.map((label, index) => (
          <div key={label} className={clsx(styles.orbits__ring, styles[RING_MODS[index]])} data-part="ring">
            <div className={clsx(styles.orbits__satellite, styles[SATELLITE_MODS[index]])} data-part="satellite">
              <i className={styles.orbits__dot} />
              <span className={styles.orbits__label}>{label}</span>
            </div>
          </div>
        ))}
        <div className={styles.orbits__core} data-part="core">
          {WHY_BRAND}
        </div>
      </div>
      <WhyCards
        image="start"
        classNames={{
          list: styles.orbits__cards,
          card: styles.orbits__card,
          featured: styles['orbits__card--featured'],
          image: styles.orbits__image,
        }}
      />
    </section>
  );
};

export default WhyOrbits;
