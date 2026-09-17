'use client';

import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CASES_ALL_LABEL, CASES_TITLE } from '@/data/site';
import { CASES_MARQUEE_ROWS } from '@/data/cases';
import CaseTile from './CaseTile';
import useCasesMarquee from './hooks/useCasesMarquee';
import styles from './Cases.module.scss';

// Две бегущие строки кейсов: верхняя едет справа налево, нижняя слева направо.
// Секция пинится, строки проезжают по скроллу, пока все карточки не побывали на экране.
// Полная сетка — на /cases.
const Cases = () => {
  const { sectionRef, rowRefs } = useCasesMarquee(CASES_MARQUEE_ROWS.length);

  return (
    <section ref={sectionRef} className={styles.cases} id="cases">
      <div className={styles.cases__head}>
        <h2 className={styles.cases__title}>{CASES_TITLE}</h2>
      </div>

      <div className={styles.cases__rows}>
        {CASES_MARQUEE_ROWS.map((row, index) => (
          <div key={index} className={styles.cases__viewport}>
            <div ref={rowRefs[index]} className={styles.cases__row}>
              {row.map((item) => (
                <CaseTile key={item.slug} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cases__foot}>
        <BaseButton href="/cases" arrow>
          {CASES_ALL_LABEL}
        </BaseButton>
      </div>
    </section>
  );
};

export default Cases;
