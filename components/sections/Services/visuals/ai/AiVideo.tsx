'use client';

import clsx from 'clsx';
import { AI_VIDEO as copy } from '@/data/demosAi';
import AiButton from './AiButton';
import AiCard from './AiCard';
import AiChips from './AiChips';
import AiProgress from './AiProgress';
import useAiVideo from './hooks/useAiVideo';
import styles from './AiVideo.module.scss';

const PICTURES = [
  <>
    <i className={styles.video__sky} />
    <i className={styles.video__sun} />
    <i className={styles.video__city} />
  </>,
  <>
    <i className={styles.video__sky} />
    <i className={styles.video__shoe} />
  </>,
  <>
    <i className={styles.video__sky} />
    <i className={styles.video__road} />
    <i className={styles.video__speed} />
    <i className={styles.video__runner} />
  </>,
];

// AI · генератор ролика: промпт (с готовыми примерами), формат и стиль → раскадровка из четырёх кадров.
const AiVideo = () => {
  const {
    brief,
    done,
    example,
    format,
    generate,
    isPending,
    meta,
    progress,
    prompt,
    ref,
    running,
    selectExample,
    setFormat,
    setPrompt,
    setStyle,
    stage,
    style,
  } = useAiVideo();

  return (
    <div ref={ref} className={styles.video}>
      <section className={styles.video__controls}>
        <div className={styles.video__brand}>
          <i className={styles.video__logo} aria-hidden="true" />
          {copy.brand}
          <span className={styles.video__mode}>{copy.mode}</span>
        </div>
        <label className={styles.video__field}>
          <span className={styles.video__label}>{copy.promptLabel}</span>
          <textarea
            className={styles.video__prompt}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>
        <AiChips
          label={copy.examplesLabel}
          items={copy.examples.map((item) => item.tab)}
          selected={example}
          disabled={running}
          onSelect={selectExample}
        />
        <span className={styles.video__label}>{copy.formatLabel}</span>
        <AiChips
          label={copy.formatLabel}
          variant="solid"
          items={copy.formats.map((item) => item.label)}
          selected={copy.formats.findIndex((item) => item.value === format)}
          disabled={running}
          onSelect={setFormat}
        />
        <span className={styles.video__label}>{copy.styleLabel}</span>
        <AiChips
          label={copy.styleLabel}
          variant="solid"
          items={copy.styles.map((item) => item.label)}
          selected={copy.styles.findIndex((item) => item.value === style)}
          disabled={running}
          onSelect={setStyle}
        />
        <AiButton variant="gradient" className={styles.video__go} busy={running} onClick={generate}>
          {running ? copy.busy : done ? copy.again : copy.go}
        </AiButton>
      </section>
      <AiCard ariaLabel={copy.result} ariaLive className={clsx(styles.video__out, styles[`video__out--${style}`])}>
        <AiProgress value={progress} stages={copy.stages} stage={stage} meta={meta} />
        <div className={clsx(styles.video__board, format === 'wide' && styles['video__board--wide'])}>
          {brief.captions.map((caption, index) => (
            <figure key={index} className={styles.video__shot}>
              <div
                className={clsx(
                  styles.video__picture,
                  format === 'wide' && styles['video__picture--wide'],
                  isPending(index) && styles['video__picture--pending'],
                )}
                role="img"
                aria-label={copy.shot(index + 1)}
              >
                {PICTURES[index] ?? (
                  <div className={styles.video__end}>
                    <b className={styles.video__endTitle}>{brief.title}</b>
                    <span className={styles.video__buy}>{copy.buy}</span>
                  </div>
                )}
              </div>
              <figcaption className={styles.video__caption}>
                <span className={styles.video__number}>0{index + 1} · </span>
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </AiCard>
    </div>
  );
};

export default AiVideo;
