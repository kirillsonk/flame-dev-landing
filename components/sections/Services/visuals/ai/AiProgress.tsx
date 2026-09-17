import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './AiProgress.module.scss';

export interface AiProgressProps {
  /** Доля готовности 0…1. */
  value: number;
  label?: ReactNode;
  meta?: ReactNode;
  /** Этапы обработки; текущий — `stage`, все до него — пройдены. С этапами полоса уходит под строку. */
  stages?: string[];
  stage?: number;
  className?: string;
}

// Прогресс AI-демо: подпись или этапы, полоса и значение.
const AiProgress = ({ value, label, meta, stages, stage = -1, className }: AiProgressProps) => {
  const track = (
    <div className={clsx(styles.aiProgress__track, !stages && styles['aiProgress__track--grow'])} aria-hidden="true">
      <i className={styles.aiProgress__bar} style={{ transform: `scaleX(${Math.min(1, Math.max(0, value))})` }} />
    </div>
  );

  if (!stages) {
    return (
      <div className={clsx(styles.aiProgress, styles['aiProgress--inline'], className)}>
        <span className={styles.aiProgress__label}>{label}</span>
        {track}
        <span className={styles.aiProgress__meta}>{meta}</span>
      </div>
    );
  }

  return (
    <div className={clsx(styles.aiProgress, className)}>
      <div className={styles.aiProgress__row}>
        <ol className={styles.aiProgress__stages}>
          {stages.map((item, index) => (
            <li
              key={item}
              className={clsx(
                styles.aiProgress__stage,
                index < stage && styles['aiProgress__stage--done'],
                index === stage && styles['aiProgress__stage--current'],
              )}
            >
              {item}
            </li>
          ))}
        </ol>
        <span className={styles.aiProgress__meta}>{meta}</span>
      </div>
      {track}
    </div>
  );
};

export default AiProgress;
