'use client';

import { useId } from 'react';
import clsx from 'clsx';
import { TIBIA_PASSPORT as copy } from '@/data/demosTibia';
import useTibiaPassport from './hooks/useTibiaPassport';
import styles from './TibiaPassport.module.scss';

const QR_SIZE = 21;
const FINDERS = [
  [0, 0],
  [14, 0],
  [0, 14],
];
const STEP_DELAY_MS = 120;

const highlight = (id: string, needle: string) => {
  const at = needle ? id.indexOf(needle) : -1;
  if (at < 0) return id;
  return (
    <>
      {id.slice(0, at)}
      <mark className={styles.passport__mark}>{needle}</mark>
      {id.slice(at + needle.length)}
    </>
  );
};

// Паспорт трубы: поиск по маркировке открывает цепочку событий от проката до скважины.
const TibiaPassport = () => {
  const inputId = useId();
  const { query, needle, matches, pipe, active, generation, qr, setQuery, select, setActive, onKeyDown } =
    useTibiaPassport();
  const events = copy.history(pipe);
  const [time, source, data] = events[active];
  const last = copy.steps.length - 1;

  return (
    <div className={styles.passport}>
      <div className={styles.passport__side}>
        <label className={styles.passport__dim} htmlFor={inputId}>
          {copy.label}
        </label>
        <div className={styles.passport__search}>
          <svg className={styles.passport__icon} viewBox="0 0 20 20" fill="none" strokeWidth="2" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6" />
            <path d="M13 13l5 5" />
          </svg>
          <input
            id={inputId}
            className={styles.passport__input}
            value={query}
            placeholder={copy.placeholder}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <ul className={styles.passport__options} aria-label={copy.matches}>
          {matches.length ? (
            matches.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={clsx(styles.passport__option, item === pipe && styles['passport__option--selected'])}
                  aria-pressed={item === pipe}
                  onClick={() => select(item)}
                >
                  <span>{highlight(item.id, needle)}</span>
                  <span className={styles.passport__optionStage}>{copy.steps[item.done]}</span>
                </button>
              </li>
            ))
          ) : (
            <li className={styles.passport__empty}>{copy.notFound}</li>
          )}
        </ul>
        <div className={styles.passport__qr}>
          <svg className={styles.passport__code} viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} aria-hidden="true">
            {qr.map((on, index) =>
              on ? (
                <rect key={index} x={index % QR_SIZE} y={Math.floor(index / QR_SIZE)} width="1" height="1" />
              ) : null,
            )}
            {FINDERS.map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <rect x={x} y={y} width="7" height="7" />
                <rect x={x + 1} y={y + 1} width="5" height="5" className={styles.passport__paper} />
                <rect x={x + 2} y={y + 2} width="3" height="3" />
              </g>
            ))}
          </svg>
          <span className={styles.passport__dim}>{copy.qr}</span>
        </div>
      </div>
      <div className={styles.passport__main} aria-live="polite">
        <div className={styles.passport__head}>
          <div>
            <span className={styles.passport__dim}>{copy.passport}</span>
            <div className={styles.passport__id}>{pipe.id}</div>
          </div>
          <div className={styles.passport__specs}>
            <span className={styles.passport__spec}>
              {copy.diameter} {pipe.size} {copy.mm}
            </span>
            <span className={styles.passport__spec}>
              {copy.grade} {pipe.grade}
            </span>
            <span className={styles.passport__spec}>
              {pipe.length} {copy.meters}
            </span>
          </div>
        </div>
        <div className={styles.passport__chain}>
          <div className={styles.passport__rail} aria-hidden="true">
            <i className={styles.passport__line} style={{ transform: `scaleX(${pipe.done / last})` }} />
          </div>
          <ol className={styles.passport__steps}>
            {copy.steps.map((step, index) => (
              <li key={step} className={styles.passport__cell}>
                <button
                  type="button"
                  className={clsx(
                    styles.passport__step,
                    index <= pipe.done && styles['passport__step--on'],
                    index > pipe.done && styles['passport__step--future'],
                  )}
                  style={generation ? { transitionDelay: `${index * STEP_DELAY_MS}ms` } : undefined}
                  aria-pressed={index === active}
                  disabled={index > pipe.done}
                  onClick={() => setActive(index)}
                >
                  <span className={styles.passport__dot} />
                  <span className={styles.passport__label}>{step}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.passport__detail}>
          <div key={`${pipe.id}-${active}`} className={styles.passport__card}>
            <span className={styles.passport__dim}>
              {copy.event} {active + 1} {copy.of} {copy.steps.length}
            </span>
            <b className={styles.passport__cardTitle}>{copy.steps[active]}</b>
            <dl className={styles.passport__kv}>
              <dt className={styles.passport__key}>{copy.time}</dt>
              <dd className={styles.passport__value}>{time}</dd>
              <dt className={styles.passport__key}>{copy.source}</dt>
              <dd className={styles.passport__value}>{source}</dd>
              <dt className={styles.passport__key}>{copy.data}</dt>
              <dd className={styles.passport__value}>{data}</dd>
            </dl>
          </div>
          <div className={styles.passport__card}>
            <span className={styles.passport__dim}>{copy.now}</span>
            <b className={styles.passport__cardTitle}>{pipe.where}</b>
            <dl className={styles.passport__kv}>
              <dt className={styles.passport__key}>{copy.stage}</dt>
              <dd className={styles.passport__value}>{copy.steps[pipe.done]}</dd>
              <dt className={styles.passport__key}>{copy.events}</dt>
              <dd className={styles.passport__value}>{pipe.done + 1}</dd>
              <dt className={styles.passport__key}>{copy.signature}</dt>
              <dd className={clsx(styles.passport__value, styles.passport__ok)}>{copy.intact}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TibiaPassport;
