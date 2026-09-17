'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { PROCESS_GANTT, PROCESS_STEPS } from '@/data/process';
import ProcessHead from './ProcessHead';
import { stepNumber } from './helpers';
import useProcessGantt from './hooks/useProcessGantt';
import styles from './ProcessGantt.module.scss';

const { weeks, bars } = PROCESS_GANTT;
const WEEKS = Array.from({ length: weeks }, (_, index) => index + 1);
const share = (week: number) => `${(week / weeks) * 100}%`;

// Вариант «Гант»: линия «Сегодня» едет по неделям, план за ней заливается фактом, на разработке вспыхивают демо.
const ProcessGantt = () => {
  const { sectionRef } = useProcessGantt();

  return (
    <section ref={sectionRef} className={styles.gantt} id="process">
      <div className={styles.gantt__inner}>
        <ProcessHead />
        <div className={styles.gantt__chart} data-part="chart">
          <div className={styles.gantt__corner}>{PROCESS_GANTT.corner}</div>
          <div className={styles.gantt__weeks} aria-hidden="true">
            {WEEKS.map((week) => (
              <span key={week} className={styles.gantt__week} data-part="week" data-on>
                {week}
              </span>
            ))}
          </div>
          {PROCESS_STEPS.map((step, index) => {
            const bar = bars[index];
            return (
              <div key={step.title} className={styles.gantt__row}>
                <div className={styles.gantt__label} data-part="label">
                  <b className={styles.gantt__num}>{stepNumber(index)}</b>
                  <span className={styles.gantt__name}>{step.title}</span>
                </div>
                <div className={styles.gantt__lane}>
                  <div
                    className={clsx(styles.gantt__bar, bar.open && styles['gantt__bar--open'])}
                    style={{ '--left': share(bar.start), '--width': share(bar.end - bar.start) } as CSSProperties}
                  >
                    <div className={styles.gantt__plan} />
                    <div className={styles.gantt__fact} data-part="fact" />
                  </div>
                  {bar.demos?.map((demo) => (
                    <i
                      key={demo}
                      className={styles.gantt__demo}
                      style={{ '--left': share(demo) } as CSSProperties}
                      data-part={`demo-${index}`}
                      data-on
                    />
                  ))}
                </div>
              </div>
            );
          })}
          <div className={styles.gantt__cursorArea} aria-hidden="true">
            <div className={styles.gantt__cursor} data-part="cursor">
              <span className={styles.gantt__cursorLabel} data-part="cursor-label">
                {PROCESS_GANTT.finish}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.gantt__notes}>
          {PROCESS_STEPS.map((step, index) => (
            <p key={step.title} className={styles.gantt__note} data-part="note">
              <span className={styles.gantt__noteMeta}>
                {stepNumber(index)} · {step.duration ?? step.title}
              </span>
              <span className={styles.gantt__noteText}>{step.description}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessGantt;
