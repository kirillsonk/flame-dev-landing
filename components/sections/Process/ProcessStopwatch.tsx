'use client';

import { PROCESS_NOTE, PROCESS_STEPS, PROCESS_STOPWATCH, PROCESS_TITLE } from '@/data/process';
import { round, stepNumber } from './helpers';
import useProcessStopwatch, { handRotation, readout, subhandRotation } from './hooks/useProcessStopwatch';
import styles from './ProcessStopwatch.module.scss';

const { days, totalDays, head, laps } = PROCESS_STOPWATCH;
const TICKS = Array.from({ length: 70 }, (_, index) => index);
const WEEK_TICKS = Array.from({ length: 14 }, (_, index) => index);
const FINAL = readout(totalDays);

// Вариант «Секундомер»: стрелка обходит неделю за оборот, на границе шага нажимается кнопка и пишется отсечка.
const ProcessStopwatch = () => {
  const { sectionRef } = useProcessStopwatch();

  return (
    <section ref={sectionRef} className={styles.stopwatch} id="process">
      <div className={styles.stopwatch__inner}>
        <div className={styles.stopwatch__watch} aria-hidden="true">
          <svg className={styles.stopwatch__svg} viewBox="-240 -290 480 530">
            <g data-part="crown">
              <rect className={styles.stopwatch__crown} x="-26" y="-286" width="52" height="30" rx="6" />
              <rect className={styles.stopwatch__crown} x="-12" y="-258" width="24" height="24" />
            </g>
            <circle className={styles.stopwatch__case} r="236" />
            <circle className={styles.stopwatch__face} r="216" />
            {TICKS.map((tick) => {
              const a = (tick / TICKS.length) * Math.PI * 2;
              const day = tick % 10 === 0;
              const r = day ? 186 : 200;
              return (
                <g key={tick}>
                  <line
                    className={day ? styles['stopwatch__tick--day'] : styles.stopwatch__tick}
                    x1={round(r * Math.sin(a))}
                    y1={round(-r * Math.cos(a))}
                    x2={round(212 * Math.sin(a))}
                    y2={round(-212 * Math.cos(a))}
                  />
                  {day && (
                    <text
                      className={styles.stopwatch__day}
                      x={round(160 * Math.sin(a + 0.45))}
                      y={round(-160 * Math.cos(a + 0.45))}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="16"
                    >
                      {days[tick / 10]}
                    </text>
                  )}
                </g>
              );
            })}
            <circle className={styles.stopwatch__sub} cy="78" r="52" />
            {WEEK_TICKS.map((week) => {
              const a = (week / WEEK_TICKS.length) * Math.PI * 2;
              return (
                <line
                  key={week}
                  className={styles.stopwatch__subtick}
                  x1={round(44 * Math.sin(a))}
                  y1={round(78 - 44 * Math.cos(a))}
                  x2={round(52 * Math.sin(a))}
                  y2={round(78 - 52 * Math.cos(a))}
                />
              );
            })}
            <line
              className={styles.stopwatch__subhand}
              x1="0"
              y1="78"
              x2="0"
              y2="38"
              transform={subhandRotation(totalDays)}
              data-part="subhand"
            />
            <line
              className={styles.stopwatch__hand}
              x1="0"
              y1="34"
              x2="0"
              y2="-196"
              transform={handRotation(totalDays)}
              data-part="hand"
            />
            <circle className={styles.stopwatch__pivot} r="8" />
          </svg>
          <p className={styles.stopwatch__read}>
            {PROCESS_STOPWATCH.week} <b data-part="week">{FINAL.week}</b> · {PROCESS_STOPWATCH.day}{' '}
            <b data-part="day">{FINAL.day}</b>
          </p>
        </div>
        <div className={styles.stopwatch__side}>
          <h2 className={styles.stopwatch__title}>{PROCESS_TITLE}</h2>
          <div className={styles.stopwatch__table}>
            <div className={styles['stopwatch__row--head']}>
              <span>{head[0]}</span>
              <span>{head[1]}</span>
              <span className={styles.stopwatch__split}>{head[2]}</span>
            </div>
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className={styles.stopwatch__row} data-part="row">
                <span className={styles.stopwatch__lap}>{stepNumber(index)}</span>
                <div>
                  <h3 className={styles.stopwatch__name}>{step.title}</h3>
                  <p className={styles.stopwatch__text}>{step.description}</p>
                </div>
                <span className={styles.stopwatch__split} data-part="split" data-split={laps[index].split}>
                  {laps[index].split}
                </span>
              </div>
            ))}
          </div>
          <p className={styles.stopwatch__note}>
            {PROCESS_NOTE} {PROCESS_STOPWATCH.note}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessStopwatch;
