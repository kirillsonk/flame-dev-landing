'use client';

import clsx from 'clsx';
import { WHY_BRAND, WHY_TITLE, WHY_VENN_LABELS } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyVenn from './hooks/useWhyVenn';
import styles from './WhyVenn.module.scss';

const LABEL_MODS = ['venn__label--1', 'venn__label--2', 'venn__label--3'];

// Вариант «Венн»: три круга подрядчиков съезжаются в один, пересечение наливается градиентом Flame.
const WhyVenn = () => {
  const { rootRef } = useWhyVenn();

  return (
    <section ref={rootRef} className={styles.venn}>
      <div>
        <h2 className={styles.venn__title}>{WHY_TITLE}</h2>
        <div className={styles.venn__diagram} data-part="diagram" aria-hidden="true">
          {WHY_VENN_LABELS.map((label, index) => (
            <div key={label} className={styles.venn__circle} data-part="circle">
              <span className={clsx(styles.venn__label, styles[LABEL_MODS[index]])} data-part="label">
                {label}
              </span>
            </div>
          ))}
          <div className={styles.venn__core} data-part="core">
            {WHY_BRAND}
          </div>
        </div>
      </div>
      <WhyCards
        image="start"
        classNames={{ card: styles.venn__card, featured: styles['venn__card--featured'], body: styles.venn__body }}
      />
    </section>
  );
};

export default WhyVenn;
