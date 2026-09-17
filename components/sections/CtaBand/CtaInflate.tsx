'use client';

import BaseButton from '@/components/ui/BaseButton/BaseButton';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import { CTA_BAND, CTA_LABEL } from '@/data/site';
import useCtaInflate from './hooks/useCtaInflate';
import styles from './CtaInflate.module.scss';

// Вариант «Кнопка-блок»: кнопка «Обсудить проект» раздувается в целый блок на градиенте.
const CtaInflate = () => {
  const { sectionRef, areaRef, blobRef, gradientRef, labelRef, contentRef } = useCtaInflate();

  return (
    <section ref={sectionRef} className={styles.inflate}>
      <div ref={areaRef} className={styles.inflate__area}>
        <div ref={blobRef} className={styles.inflate__blob}>
          <div ref={gradientRef} className={styles.inflate__gradient} />
          <span ref={labelRef} className={styles.inflate__label} aria-hidden="true">
            {CTA_LABEL}
            <span className={styles.inflate__slot}>
              <BaseIcon name="arrow" className={styles.inflate__icon} />
            </span>
          </span>
          <div ref={contentRef} className={styles.inflate__content}>
            <h2 className={styles.inflate__title}>
              {CTA_BAND.question} {CTA_BAND.answerLead}
              {CTA_BAND.answerAccent}
            </h2>
            <BaseButton href="#contact" variant="inverse" size="l" arrow>
              {CTA_LABEL}
            </BaseButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaInflate;
