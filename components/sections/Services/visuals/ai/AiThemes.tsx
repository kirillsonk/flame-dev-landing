'use client';

import clsx from 'clsx';
import { AI_THEMES as copy } from '@/data/demosAi';
import AiButton from './AiButton';
import useAiThemes from './hooks/useAiThemes';
import tones from './AiTones.module.scss';
import styles from './AiThemes.module.scss';

// AI · отзывы → темы: 12 разрозненных отзывов сжимаются до ключевых фраз и собираются в группы.
const AiThemes = () => {
  const { boardRef, tipRef, measured, clustered, groups, positions, hot, setHot, toggle } = useAiThemes();

  return (
    <div className={styles.themes}>
      <div className={styles.themes__bar}>
        <h4 className={styles.themes__title}>{copy.title}</h4>
        <span className={styles.themes__sub} aria-live="polite">
          {clustered ? copy.subDone : copy.subIdle}
        </span>
        <AiButton pressed={clustered} onClick={toggle}>
          {clustered ? copy.back : copy.find}
        </AiButton>
      </div>
      <div
        ref={boardRef}
        className={clsx(
          styles.themes__board,
          clustered && styles['themes__board--clustered'],
          measured && styles['themes__board--ready'],
        )}
      >
        <div className={styles.themes__spacer} style={{ height: positions.content }} aria-hidden="true" />
        {copy.reviews.map((review, index) => {
          const tone = groups.find((group) => group.key === review.group)?.tone;
          return (
            <div
              key={review.text}
              className={clsx(
                styles.themes__card,
                tone && tones[`tone--${tone}`],
                clustered && styles['themes__card--clustered'],
                hot === review.group && styles['themes__card--hot'],
              )}
              style={positions.cards[index]}
              tabIndex={0}
              title={review.text}
              onMouseEnter={() => setHot(review.group)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(review.group)}
              onBlur={() => setHot(null)}
            >
              <span
                className={clsx(styles.themes__full, clustered && styles['themes__full--off'])}
                aria-hidden={clustered}
              >
                «{review.text}»
              </span>
              <span
                className={clsx(styles.themes__key, clustered && styles['themes__key--on'])}
                aria-hidden={!clustered}
              >
                {review.key}
              </span>
            </div>
          );
        })}
        {groups.map((group, index) => (
          <div
            key={group.key}
            className={clsx(styles.themes__group, clustered && styles['themes__group--on'])}
            style={positions.groups[index]}
            aria-hidden={!clustered}
          >
            <b className={styles.themes__groupName}>
              {group.name} · {group.count}
            </b>
            <div className={styles.themes__meter} aria-hidden="true">
              <i className={styles.themes__positive} style={{ width: `${group.percent}%` }} />
              <i className={styles.themes__negative} />
            </div>
            <span className={styles.themes__mood}>
              {group.mood} · {copy.satisfied(group.percent)}
            </span>
          </div>
        ))}
        <div
          ref={tipRef}
          className={clsx(styles.themes__tip, clustered && styles['themes__tip--on'])}
          style={{ top: positions.tipTop }}
          aria-hidden={!clustered}
        >
          <b>{copy.tipLead}</b> {copy.tip}
        </div>
      </div>
    </div>
  );
};

export default AiThemes;
