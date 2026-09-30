'use client';

import { Fragment } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { WHY_BRAND, WHY_EQUATION, WHY_POSTER, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyEquation from './hooks/useWhyEquation';
import styles from './WhyEquation.module.scss';

const POSTER_STYLE = { '--poster': `url(${WHY_POSTER.src})` } as CSSProperties;

// Вариант «Уравнение»: «Студия + Продакшн + Дизайн-бюро = 3 договора» решается в «Flame dev = 1 договор».
const WhyEquation = () => {
  const { rootRef } = useWhyEquation();

  return (
    <section ref={rootRef} className={styles.equation} style={POSTER_STYLE}>
      <h2 className={styles.equation__title}>{WHY_TITLE}</h2>
      <div className={styles.equation__row} data-part="row" role="img" aria-label={WHY_EQUATION.label}>
        {WHY_EQUATION.terms.map((term, index) => (
          <Fragment key={term}>
            {index > 0 && (
              <span className={styles.equation__op} data-part="plus">
                +
              </span>
            )}
            <span className={styles.equation__term} data-part="term">
              {term}
            </span>
          </Fragment>
        ))}
        <span className={styles.equation__op} data-part="equal">
          =
        </span>
        <span className={styles.equation__result} data-part="result">
          <span className={clsx(styles.equation__value, styles['equation__value--before'])} data-part="before">
            {WHY_EQUATION.before}
          </span>
          <span className={clsx(styles.equation__value, styles['equation__value--after'])} data-part="after">
            {WHY_EQUATION.after}
          </span>
        </span>
        <span className={styles.equation__one} data-part="one">
          {WHY_BRAND}
        </span>
      </div>
      <WhyCards
        classNames={{
          list: styles.equation__cards,
          card: styles.equation__card,
          featured: styles['equation__card--featured'],
        }}
      />
    </section>
  );
};

export default WhyEquation;
