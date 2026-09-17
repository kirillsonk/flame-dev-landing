'use client';

import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_DAY, CTA_LABEL } from '@/data/site';
import useCtaDay from './hooks/useCtaDay';
import styles from './CtaDay.module.scss';

// Вариант «Один день»: вертикальная прокрутка ведёт ленту дня от заявки до ответа.
const CtaDay = () => {
  const { sectionRef, trackRef, itemsRef, fillRef, bindStep } = useCtaDay();

  return (
    <section ref={sectionRef} className={styles.day}>
      <div className={styles.day__inner}>
        <h2 className={styles.day__title}>
          {CTA_BAND.question} {CTA_BAND.answerLead}
          <span className={styles.day__accent}>{CTA_BAND.answerAccent}</span>
        </h2>

        <div ref={trackRef} className={styles.day__track}>
          <ol ref={itemsRef} className={styles.day__items}>
            <li className={styles.day__rail} aria-hidden="true">
              <span ref={fillRef} className={styles.day__fill} />
            </li>
            {CTA_DAY.steps.map((step, index) => (
              <li
                key={step.time}
                ref={bindStep(index)}
                className={styles.day__step}
              >
                <span className={styles.day__time}>{step.time}</span>
                <span>{step.text}</span>
              </li>
            ))}
            <li
              ref={bindStep(CTA_DAY.steps.length)}
              className={styles.day__final}
            >
              <span className={styles.day__time}>{CTA_DAY.final}</span>
              <BaseButton href="#contact" arrow>
                {CTA_LABEL}
              </BaseButton>
            </li>
          </ol>
        </div>

        <p className={styles.day__note}>{CTA_DAY.note}</p>
      </div>
    </section>
  );
};

export default CtaDay;
