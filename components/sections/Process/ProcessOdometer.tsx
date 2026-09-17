'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { PROCESS_ODOMETER, PROCESS_STEPS } from '@/data/process';
import ProcessHead from './ProcessHead';
import { stepNumber } from './helpers';
import useProcessOdometer, { reelShift } from './hooks/useProcessOdometer';
import styles from './ProcessOdometer.module.scss';

// Лента цифр барабана: последний ноль нужен для переноса разряда 9 → 10.
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const FINAL_WEEK = PROCESS_ODOMETER.weeks[PROCESS_ODOMETER.weeks.length - 1];

interface IReelProps {
  name?: string;
  value: number;
  accent?: boolean;
}

const Reel = ({ name, value, accent }: IReelProps) => (
  <div className={clsx(styles.odometer__window, accent && styles['odometer__window--accent'])}>
    <div className={styles.odometer__reel} style={{ '--shift': `${reelShift(value)}%` } as CSSProperties} data-part={name}>
      {DIGITS.map((digit, index) => (
        <span key={index} className={styles.odometer__digit}>
          {digit}
        </span>
      ))}
    </div>
  </div>
);

// Вариант «Одометр»: барабаны номера шага и недели проекта крутятся по скроллу с переносом разряда.
const ProcessOdometer = () => {
  const { sectionRef } = useProcessOdometer();

  return (
    <section ref={sectionRef} className={styles.odometer} id="process">
      <div className={styles.odometer__inner}>
        <div className={styles.odometer__head}>
          <ProcessHead />
        </div>
        <div className={styles.odometer__meters} aria-hidden="true" data-part="meters">
          <div>
            <p className={styles.odometer__label}>{PROCESS_ODOMETER.stepLabel}</p>
            <div className={styles.odometer__body}>
              <Reel value={0} />
              <Reel name="step" value={PROCESS_STEPS.length} accent />
            </div>
          </div>
          <div>
            <p className={styles.odometer__label}>{PROCESS_ODOMETER.weekLabel}</p>
            <div className={styles.odometer__body}>
              <Reel name="tens" value={Math.floor(FINAL_WEEK / 10)} />
              <Reel name="units" value={FINAL_WEEK % 10} />
            </div>
          </div>
        </div>
        <div className={styles.odometer__side}>
          <div className={styles.odometer__drum}>
            <div className={styles.odometer__rows} data-part="rows">
              {PROCESS_STEPS.map((step, index) => (
                <article key={step.title} className={styles.odometer__row}>
                  <p className={styles.odometer__meta}>{[stepNumber(index), step.duration].filter(Boolean).join(' · ')}</p>
                  <h3 className={styles.odometer__title}>{step.title}</h3>
                  <p className={styles.odometer__text}>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessOdometer;
