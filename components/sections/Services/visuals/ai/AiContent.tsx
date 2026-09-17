'use client';

import { useId } from 'react';
import clsx from 'clsx';
import { AI_CONTENT as copy } from '@/data/demosAi';
import AiButton from './AiButton';
import AiChips from './AiChips';
import useAiContent from './hooks/useAiContent';
import styles from './AiContent.module.scss';

const STATUS_CLASSES = {
  idle: '',
  busy: 'content__led--busy',
  done: 'content__led--done',
};

// AI · контент-фабрика: одна идея превращается в тексты для Telegram, VK, рассылки и баннера.
const AiContent = () => {
  const id = useId();
  const {
    pack,
    current,
    count,
    done,
    example,
    feats,
    generate,
    idea,
    onTabKey,
    ref,
    running,
    select,
    selectExample,
    setIdea,
    statusOf,
    text,
    typing,
  } = useAiContent();
  const channel = copy.channels[current];
  const typed = <span className={clsx(typing && styles.content__caret)}>{text}</span>;

  return (
    <div ref={ref} className={styles.content}>
      <section className={styles.content__input}>
        <label className={styles.content__field}>
          <span className={styles.content__label}>{copy.ideaLabel}</span>
          <textarea className={styles.content__idea} value={idea} onChange={(event) => setIdea(event.target.value)} />
        </label>
        <AiChips
          label={copy.examplesLabel}
          items={copy.examples.map((item) => item.tab)}
          selected={example}
          disabled={running}
          onSelect={selectExample}
        />
        <span className={styles.content__label}>{copy.featsLabel}</span>
        <ul className={styles.content__feats}>
          {feats.map((feat) => (
            <li key={feat} className={styles.content__feat}>
              {feat}
            </li>
          ))}
        </ul>
        <AiButton variant="gradient" busy={running} onClick={generate}>
          {running ? copy.busy : done ? copy.again : copy.go}
        </AiButton>
      </section>
      <section className={styles.content__output}>
        <div className={styles.content__tabs} role="tablist" aria-label={copy.channelsLabel}>
          {copy.channels.map((item, index) => {
            const status = statusOf(index);
            return (
              <button
                key={item.key}
                id={`${id}-${item.key}`}
                type="button"
                role="tab"
                className={styles.content__tab}
                aria-selected={index === current}
                tabIndex={index === current ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onTabKey}
              >
                <i
                  className={clsx(styles.content__led, STATUS_CLASSES[status] && styles[STATUS_CLASSES[status]])}
                  aria-hidden="true"
                />
                {item.name}
              </button>
            );
          })}
        </div>
        <div
          className={styles.content__panel}
          role="tabpanel"
          aria-labelledby={`${id}-${channel.key}`}
          aria-busy={running}
        >
          {channel.key === 'tg' && (
            <div className={styles.content__telegram}>
              {typed}
              <small className={styles.content__time}>{copy.tgTime}</small>
            </div>
          )}
          {channel.key === 'vk' && (
            <div className={styles.content__vk}>
              <div className={styles.content__vkHead}>
                <i className={styles.content__avatar} aria-hidden="true" />
                <span>
                  {copy.vkAuthor}
                  <br />
                  <span className={styles.content__dim}>{copy.vkTime}</span>
                </span>
              </div>
              <p className={styles.content__vkText}>{typed}</p>
              <div className={styles.content__cover} aria-hidden="true" />
            </div>
          )}
          {channel.key === 'mail' && (
            <div className={styles.content__mail}>
              <div className={styles.content__mailHead}>
                <span className={styles.content__mailLabel}>{copy.mailSubject}</span>
                <b className={styles.content__mailSubject}>{pack.mailSubject}</b>
              </div>
              <p className={styles.content__mailText}>{typed}</p>
              <span className={styles.content__mailCta}>{pack.cta}</span>
            </div>
          )}
          {channel.key === 'ban' && (
            <div className={styles.content__banner}>
              <b className={styles.content__bannerTitle}>{typed}</b>
              <span className={styles.content__bannerCta}>{pack.cta}</span>
            </div>
          )}
          <div className={styles.content__meta}>
            <span>{channel.meta}</span>
            <span>{copy.chars(count)}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiContent;
