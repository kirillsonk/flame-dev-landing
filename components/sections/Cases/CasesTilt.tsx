'use client';

import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CASES_ALL_LABEL, CASES_TITLE } from '@/data/site';
import { CASES_TILT_ROWS } from '@/data/cases';
import CaseTile from './CaseTile';
import useCasesMarquee from './hooks/useCasesMarquee';
import styles from './CasesTilt.module.scss';

// Скорости рядов: нижний идёт навстречу и медленнее.
const SPEEDS = [1, 0.75];

export interface CasesTiltProps {
  /** Секция встаёт под пин на высоту окна раньше, чем поедут ряды: окно для перехода от hero. */
  leadIn?: boolean;
}

const leadViewport = () => window.innerHeight;

// Основной блок кейсов: два ряда под наклоном −4° с разной скоростью, поток кейсов.
// Прямые строки (Cases) остаются для сравнения в меню вариантов (см. Home.tsx).
const CasesTilt = ({ leadIn = false }: CasesTiltProps) => {
  const { sectionRef, rowRefs } = useCasesMarquee(CASES_TILT_ROWS.length, {
    speeds: SPEEDS,
    lead: leadIn ? leadViewport : undefined,
  });

  return (
    <section ref={sectionRef} className={styles.tilt} id="cases">
      <div className={styles.tilt__head}>
        <h2 className={styles.tilt__title} data-transition="cases-title">{CASES_TITLE}</h2>
      </div>

      <div className={styles.tilt__stage} data-transition="cases-stage">
        <div className={styles.tilt__rows}>
          {CASES_TILT_ROWS.map((row, index) => (
            <div key={index} className={styles.tilt__viewport}>
              <div ref={rowRefs[index]} className={styles.tilt__row} data-transition="cases-row">
                {row.map((item, position) => (
                  <CaseTile key={`${item.slug}-${position}`} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tilt__foot}>
        <BaseButton href="/cases" arrow>
          {CASES_ALL_LABEL}
        </BaseButton>
      </div>
    </section>
  );
};

export default CasesTilt;
