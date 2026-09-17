'use client';

import clsx from 'clsx';
import { AI_MODERATION as copy } from '@/data/demosAi';
import type { AiModerationLabel } from '@/data/demosAi';
import AiButton from './AiButton';
import AiCard from './AiCard';
import useAiModeration from './hooks/useAiModeration';
import tones from './AiTones.module.scss';
import styles from './AiModeration.module.scss';

const LABELS: AiModerationLabel[] = ['ok', 'spam', 'tox'];
/** Ниже этой уверенности AI просит человека перепроверить. */
const REVIEW_THRESHOLD = 0.8;

// AI · модерация комментариев: поток с метками спама и токсичности, ручные правки идут в дообучение.
const AiModeration = () => {
  const { counts, ended, fixes, items, lastFix, override, playing, ref, running, toggle } = useAiModeration();
  const status = ended ? copy.ended : playing ? copy.live : copy.paused;

  return (
    <div ref={ref} className={styles.moderation}>
      <section className={styles.moderation__feed}>
        <div className={styles.moderation__head}>
          <h4 className={styles.moderation__title}>{copy.title}</h4>
          <span className={styles.moderation__live}>
            <i className={clsx(styles.moderation__dot, running && styles['moderation__dot--on'])} aria-hidden="true" />
            {status}
          </span>
          <AiButton variant="ghost" className={styles.moderation__toggle} onClick={toggle}>
            {ended ? copy.replay : playing ? copy.pause : copy.resume}
          </AiButton>
        </div>
        <div className={styles.moderation__list} aria-label={copy.listLabel} aria-live="polite">
          {items.map(({ index, label, manual }) => {
            const comment = copy.stream[index];
            return (
              <article
                key={index}
                className={clsx(styles.moderation__comment, label && tones[`tone--${copy.labels[label].tone}`])}
              >
                <span className={styles.moderation__avatar} aria-hidden="true">
                  {comment.who[0].toUpperCase()}
                </span>
                <span className={styles.moderation__who}>{comment.who}</span>
                <span
                  className={clsx(
                    styles.moderation__text,
                    label && label !== 'ok' && styles['moderation__text--hidden'],
                  )}
                >
                  {comment.text}
                </span>
                <div className={styles.moderation__side}>
                  {label ? (
                    <>
                      <span className={styles.moderation__label}>
                        {copy.labels[label].name} · {manual ? copy.manual : `${Math.round(comment.confidence * 100)}%`}
                        {!manual && comment.confidence < REVIEW_THRESHOLD && ` · ${copy.review}`}
                      </span>
                      <button type="button" className={styles.moderation__override} onClick={() => override(index)}>
                        {label === 'ok' ? copy.hide : copy.restore}
                      </button>
                    </>
                  ) : (
                    <span className={clsx(styles.moderation__label, styles['moderation__label--wait'])}>
                      {copy.checking}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <aside className={styles.moderation__stats} aria-label={copy.statsLabel}>
        {LABELS.map((label) => (
          <div key={label} className={clsx(styles.moderation__stat, tones[`tone--${copy.labels[label].tone}`])}>
            <i className={styles.moderation__statDot} aria-hidden="true" />
            <span className={styles.moderation__statName}>{copy.labels[label].stat}</span>
            <b className={styles.moderation__statValue}>{counts[label]}</b>
          </div>
        ))}
        <AiCard tone="result" className={styles.moderation__learn} ariaLive>
          <b>{copy.fixes(fixes)}</b>
          <span className={styles.moderation__learnHint}>{lastFix ?? copy.fixesHint}</span>
        </AiCard>
      </aside>
    </div>
  );
};

export default AiModeration;
