'use client';

import { PROCESS_NOTE, PROCESS_STEPS, PROCESS_TIMELINE, PROCESS_TITLE } from '@/data/process';
import ProcessGradient from './ProcessGradient';
import { stepNumber } from './helpers';
import useProcessTimeline from './hooks/useProcessTimeline';
import styles from './ProcessTimeline.module.scss';

const RULER = Array.from({ length: PROCESS_TIMELINE.rulerCells }, (_, index) => index + 1);

// Вариант «Лента времени»: шаги едут горизонтальной лентой, номера и линейка недель — с другой скоростью.
const ProcessTimeline = () => {
  const { sectionRef } = useProcessTimeline();

  return (
    <section ref={sectionRef} className={styles.timeline} id="process">
      <svg className={styles.timeline__defs} aria-hidden="true">
        <defs>
          {/* Тот же id подставлен в стилях нечётных номеров. */}
          <ProcessGradient id="process-timeline-gradient" from={0.3} />
        </defs>
      </svg>
      <div className={styles.timeline__pin}>
        <div className={styles.timeline__track} data-part="track">
          <div className={styles.timeline__intro}>
            <h2 className={styles.timeline__title}>{PROCESS_TITLE}</h2>
            <p className={styles.timeline__note}>{PROCESS_NOTE}</p>
          </div>
          {PROCESS_STEPS.map((step, index) => (
            <article key={step.title} className={styles.timeline__card}>
              <svg className={styles.timeline__num} viewBox="0 0 440 320" aria-hidden="true" data-part="num">
                <text x="440" y="270" textAnchor="end" fontSize="330">
                  {stepNumber(index)}
                </text>
              </svg>
              <p className={styles.timeline__meta}>
                {step.duration ?? `${PROCESS_TIMELINE.stepLabel} ${stepNumber(index)}`}
              </p>
              <h3 className={styles.timeline__name}>{step.title}</h3>
              <p className={styles.timeline__text}>{step.description}</p>
            </article>
          ))}
          <div className={styles.timeline__end}>{PROCESS_TIMELINE.end}</div>
        </div>
        <div className={styles.timeline__ruler} aria-hidden="true" data-part="ruler">
          {RULER.map((week) => (
            <span key={week} className={styles.timeline__week}>
              {week <= PROCESS_TIMELINE.weeks && `${PROCESS_TIMELINE.weekLabel} ${week}`}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
