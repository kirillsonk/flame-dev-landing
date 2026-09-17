'use client';

import { PROCESS_BEZEL, PROCESS_NOTE, PROCESS_STEPS, PROCESS_TITLE } from '@/data/process';
import ProcessGradient from './ProcessGradient';
import { round, stepNumber, stepText } from './helpers';
import useProcessBezel, { BEZEL_LAST, bezelRotation } from './hooks/useProcessBezel';
import styles from './ProcessBezel.module.scss';

// Тот же id подставлен в стилях активного сектора.
const GRADIENT_ID = 'process-bezel-gradient';
const TICKS = Array.from({ length: 60 }, (_, index) => index);
const SECTOR = 360 / PROCESS_STEPS.length;

/** Точка на окружности радиуса `r` под углом `deg` от 12 часов по часовой. */
const point = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [round(r * Math.sin(a)), round(-r * Math.cos(a))];
};

const arc = (r: number, from: number, to: number) => {
  const [ax, ay] = point(r, from);
  const [bx, by] = point(r, to);
  return `M${ax} ${ay} A${r} ${r} 0 0 1 ${bx} ${by}`;
};

// Вариант «Безель»: безель циферблата щёлкает под неподвижным индексом, в центре — текущий шаг.
const ProcessBezel = () => {
  const { sectionRef } = useProcessBezel();

  return (
    <section ref={sectionRef} className={styles.bezel} id="process">
      <div className={styles.bezel__inner}>
        <div className={styles.bezel__dial} aria-hidden="true" data-part="dial">
          <svg className={styles.bezel__svg} viewBox="-280 -280 560 560">
            <defs>
              <ProcessGradient id={GRADIENT_ID} from={0.3} />
            </defs>
            <g transform={bezelRotation(BEZEL_LAST)} data-part="ring">
              <circle className={styles.bezel__case} r="270" />
              {TICKS.map((tick) => {
                const major = tick % 12 === 6;
                const [x1, y1] = point(major ? 236 : 250, tick * 6);
                const [x2, y2] = point(262, tick * 6);
                return (
                  <line
                    key={tick}
                    className={major ? styles['bezel__tick--major'] : styles.bezel__tick}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                  />
                );
              })}
              {PROCESS_BEZEL.sectors.map((sector, index) => {
                const center = index * SECTOR;
                const on = index === BEZEL_LAST || undefined;
                return (
                  <g key={sector}>
                    <path
                      className={styles.bezel__arc}
                      d={arc(224, center - 32, center + 32)}
                      data-part="arc"
                      data-on={on}
                    />
                    <path id={`process-bezel-label-${index}`} d={arc(196, center - 34, center + 34)} fill="none" />
                    <text className={styles.bezel__label} textAnchor="middle" dy="5" fontSize="16" data-part="label" data-on={on}>
                      <textPath href={`#process-bezel-label-${index}`} startOffset="50%">
                        {stepNumber(index)} {sector}
                      </textPath>
                    </text>
                  </g>
                );
              })}
            </g>
            <circle className={styles.bezel__face} r="168" />
            <path className={styles.bezel__index} d="M-11 -279 L11 -279 L0 -258 Z" />
          </svg>
          <div className={styles.bezel__center}>
            {PROCESS_BEZEL.captions.map((caption, index) => (
              <div key={caption} className={styles.bezel__now} data-part="now" data-on={index === BEZEL_LAST || undefined}>
                <div className={styles.bezel__number}>{stepNumber(index)}</div>
                <div className={styles.bezel__caption}>{caption}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bezel__side}>
          <h2 className={styles.bezel__title}>{PROCESS_TITLE}</h2>
          <ol className={styles.bezel__list}>
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className={styles.bezel__item} data-part="item" data-on={index === BEZEL_LAST || undefined}>
                <span className={styles.bezel__num}>{stepNumber(index)}</span>
                <h3 className={styles.bezel__name}>{step.title}</h3>
                <p className={styles.bezel__text}>{stepText(step)}</p>
              </li>
            ))}
          </ol>
          <p className={styles.bezel__note}>{PROCESS_NOTE}</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessBezel;
