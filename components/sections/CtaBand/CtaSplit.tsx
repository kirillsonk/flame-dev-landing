'use client';

import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_LABEL } from '@/data/site';
import useCtaSplit from './hooks/useCtaSplit';
import styles from './CtaSplit.module.scss';

// Вариант «Разрез»: экран режется светящейся линией, половины разъезжаются и открывают ответ.
const CtaSplit = () => {
  const { sectionRef, seamRef, topRef, bottomRef, underRef } = useCtaSplit();

  return (
    <section ref={sectionRef} className={styles.split}>
      <div ref={underRef} className={styles.split__under}>
        <h2 className={styles.split__title}>
          {CTA_BAND.question} {CTA_BAND.answerLead}
          {CTA_BAND.answerAccent}
        </h2>
        <BaseButton href="#contact" variant="inverse" size="l" arrow>
          {CTA_LABEL}
        </BaseButton>
      </div>

      <div ref={topRef} className={clsx(styles.split__half, styles['split__half--top'])} aria-hidden="true">
        <div className={styles.split__face}>
          <span className={styles.split__word}>{CTA_BAND.question}</span>
        </div>
      </div>
      <div ref={bottomRef} className={clsx(styles.split__half, styles['split__half--bottom'])} aria-hidden="true">
        <div className={styles.split__face}>
          <span className={styles.split__word}>{CTA_BAND.question}</span>
        </div>
      </div>
      <div ref={seamRef} className={styles.split__seam} aria-hidden="true" />
    </section>
  );
};

export default CtaSplit;
