'use client';

import { PROCESS_NOTE, PROCESS_STEPS, PROCESS_TITLE } from '@/data/process';
import ProcessStep from './ProcessStep';
import useProcessScroll from './hooks/useProcessScroll';
import styles from './Process.module.scss';

const MIN_FILL = 0.08;

const Process = () => {
  const { sectionRef, trackRef, progress, onMobileScroll } = useProcessScroll();
  const activeIndex = Math.min(PROCESS_STEPS.length - 1, Math.floor(progress * PROCESS_STEPS.length + 0.0001));

  return (
    <section ref={sectionRef} className={styles.process} id="process">
      <div className={styles.process__inner}>
        <h2 className={styles.process__title}>{PROCESS_TITLE}</h2>
        <div className={styles.process__timeline} aria-hidden="true">
          <span className={styles.process__timelineFill} style={{ transform: `scaleX(${Math.max(progress, MIN_FILL)})` }} />
        </div>
        <div ref={trackRef} className={styles.process__track} onScroll={onMobileScroll}>
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStep key={step.title} step={step} active={index <= activeIndex} />
          ))}
        </div>
        <p className={styles.process__note}>{PROCESS_NOTE}</p>
      </div>
    </section>
  );
};

export default Process;
