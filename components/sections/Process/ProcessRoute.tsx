'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { PROCESS_STEPS } from '@/data/process';
import ProcessGradient from './ProcessGradient';
import ProcessHead from './ProcessHead';
import { stepNumber } from './helpers';
import useProcessRoute, { ROUTE_PATH, ROUTE_STOPS } from './hooks/useProcessRoute';
import styles from './ProcessRoute.module.scss';

const GRADIENT_ID = 'process-route-gradient';
const [LAST_X, LAST_Y] = ROUTE_STOPS[ROUTE_STOPS.length - 1];

// Вариант «Маршрут»: по скроллу рисуется волнистая кривая, маркер едет по ней и зажигает шаги.
const ProcessRoute = () => {
  const { sectionRef } = useProcessRoute();

  return (
    <section ref={sectionRef} className={styles.route} id="process">
      <div className={styles.route__inner}>
        <ProcessHead />
        <div className={styles.route__stage}>
          <svg className={styles.route__svg} viewBox="0 0 1320 560" aria-hidden="true">
            <defs>
              <ProcessGradient id={GRADIENT_ID} />
            </defs>
            <path className={styles.route__base} d={ROUTE_PATH} />
            <path className={styles.route__trail} d={ROUTE_PATH} stroke={`url(#${GRADIENT_ID})`} data-part="trail" />
            {ROUTE_STOPS.map(([x, y]) => (
              <circle key={x} className={styles.route__dot} cx={x} cy={y} r="8" data-part="dot" />
            ))}
            <g className={styles.route__marker} transform={`translate(${LAST_X} ${LAST_Y})`} data-part="marker">
              <circle className={styles.route__halo} r="24" />
              <circle className={styles.route__core} r="9" />
            </g>
          </svg>
          {PROCESS_STEPS.map((step, index) => {
            const [x, y] = ROUTE_STOPS[index];
            return (
              <article
                key={step.title}
                className={clsx(
                  styles.route__stop,
                  y < 300 ? styles['route__stop--up'] : styles['route__stop--down'],
                  index === 0 && styles['route__stop--first'],
                  index === PROCESS_STEPS.length - 1 && styles['route__stop--last'],
                )}
                style={{ '--x': `${x / 10}rem` } as CSSProperties}
                data-part="stop"
              >
                <p className={styles.route__meta}>
                  <span className={styles.route__num}>{stepNumber(index)}</span>
                  {step.duration && <span>{step.duration}</span>}
                </p>
                <h3 className={styles.route__title}>{step.title}</h3>
                <p className={styles.route__text}>{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessRoute;
