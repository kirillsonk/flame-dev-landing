'use client';

import clsx from 'clsx';
import { TIBIA_CONVEYOR as copy } from '@/data/demosTibia';
import useTibiaConveyor, { ZONES } from './hooks/useTibiaConveyor';
import styles from './TibiaConveyor.module.scss';

// Конвейер маркировки: трубы едут по линии, годные маркируются под головкой, брак уходит в отбраковку.
const TibiaConveyor = () => {
  const { rootRef, markRef, startRef, snapshot, firing, bindPipe, start, stop, mark, onKeyDown } =
    useTibiaConveyor();
  const { pipes, score, queue, message, tone, phase, accuracy } = snapshot;
  const running = phase === 'running';

  return (
    <div ref={rootRef} className={styles.conveyor} onKeyDown={onKeyDown}>
      <div className={styles.conveyor__head}>
        <span>
          {copy.line} · <span className={styles.conveyor__dim}>{queue} {copy.queue}</span>
        </span>
        <div className={styles.conveyor__score} aria-live="polite">
          <span className={styles.conveyor__dim}>
            {copy.marked} <b className={styles['conveyor__value--ok']}>{score[0]}</b>
          </span>
          <span className={styles.conveyor__dim}>
            {copy.rejected} <b className={styles['conveyor__value--gold']}>{score[1]}</b>
          </span>
          <span className={styles.conveyor__dim}>
            {copy.errors} <b className={styles['conveyor__value--error']}>{score[2]}</b>
          </span>
        </div>
      </div>
      <div className={styles.conveyor__line}>
        <div className={styles.conveyor__rollers} />
        <div
          className={clsx(styles.conveyor__zone, styles['conveyor__zone--detector'])}
          style={{ left: `${ZONES.detector}%` }}
        >
          <span className={styles.conveyor__zoneLabel}>{copy.detector}</span>
        </div>
        <div
          className={clsx(styles.conveyor__zone, styles['conveyor__zone--head'], firing && styles['conveyor__zone--fire'])}
          style={{ left: `${ZONES.head}%` }}
        >
          <span className={styles.conveyor__zoneLabel}>{copy.marker}</span>
        </div>
        <div
          className={clsx(styles.conveyor__zone, styles['conveyor__zone--reject'])}
          style={{ left: `${ZONES.reject}%` }}
        >
          <span className={styles.conveyor__zoneLabel}>{copy.reject}</span>
        </div>
        {pipes.map((pipe) => (
          <div
            key={pipe.id}
            ref={bindPipe(pipe.id)}
            className={clsx(
              styles.conveyor__pipe,
              pipe.bad && pipe.seen && styles['conveyor__pipe--bad'],
              pipe.marked && styles['conveyor__pipe--marked'],
              pipe.dropping && styles['conveyor__pipe--drop'],
            )}
            style={{ left: `${pipe.start}%` }}
          >
            <span className={styles.conveyor__stamp}>{pipe.id}</span>
          </div>
        ))}
        {!running && (
          <div className={styles.conveyor__overlay}>
            <div className={styles.conveyor__intro}>
              <b className={styles.conveyor__title}>
                {phase === 'over' ? `${copy.endTitle} ${accuracy}%` : copy.introTitle}
              </b>
              <p className={styles.conveyor__dim}>
                {phase === 'over' ? copy.endText(score[0], score[1], score[2]) : copy.introText}
              </p>
              <button
                ref={startRef}
                type="button"
                className={clsx(styles.conveyor__button, styles['conveyor__button--primary'])}
                onClick={start}
              >
                {phase === 'over' ? copy.again : copy.start}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.conveyor__foot}>
        <span
          className={clsx(
            styles.conveyor__message,
            tone === 'ok' && styles['conveyor__message--ok'],
            tone === 'error' && styles['conveyor__message--error'],
          )}
          role="status"
        >
          {message}
        </span>
        <div className={styles.conveyor__buttons}>
          <button
            ref={markRef}
            type="button"
            className={clsx(styles.conveyor__button, styles['conveyor__button--primary'])}
            disabled={!running}
            onClick={mark}
          >
            {copy.mark}
          </button>
          <button type="button" className={styles.conveyor__button} disabled={!running} onClick={stop}>
            {copy.stop}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TibiaConveyor;
