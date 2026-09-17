'use client';

import { Fragment, useId } from 'react';
import clsx from 'clsx';
import { AI_RAG as copy } from '@/data/demosAi';
import AiButton from './AiButton';
import AiCard from './AiCard';
import AiChips from './AiChips';
import useAiRag from './hooks/useAiRag';
import styles from './AiRag.module.scss';

const SKELETON = [90, 70, 80];

// Совпадения во фрагменте размечены [квадратными скобками].
const Fragments = ({ text }: { text: string }) =>
  text.split(/\[(.+?)\]/).map((part, index) =>
    index % 2 ? (
      <mark key={index} className={styles.rag__match}>
        {part}
      </mark>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );

// AI · поиск по базе знаний: фрагменты из документов с подсветкой и ответ со сносками на источники.
const AiRag = () => {
  const inputId = useId();
  const { found, answering, ask, hot, query, question, ref, searching, setHot, setQuery, tokens } = useAiRag();

  return (
    <div ref={ref} className={styles.rag}>
      <form
        className={styles.rag__form}
        onSubmit={(event) => {
          event.preventDefault();
          ask(query);
        }}
      >
        <label htmlFor={inputId} className={styles.rag__srOnly}>
          {copy.inputLabel}
        </label>
        <input
          id={inputId}
          className={styles.rag__input}
          value={query}
          autoComplete="off"
          placeholder={copy.placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
        <AiButton type="submit">{copy.ask}</AiButton>
      </form>
      <AiChips
        label={copy.examplesLabel}
        prefix={copy.examplesLabel}
        items={copy.base.map((item) => item.question)}
        onSelect={(index) => ask(copy.base[index].question)}
      />
      <div className={styles.rag__body}>
        <section className={styles.rag__sources} aria-label={copy.sourcesLabel}>
          <div className={styles.rag__label}>
            <span>{copy.foundLabel}</span>
            <span>{!searching && found ? copy.time : ''}</span>
          </div>
          {searching &&
            SKELETON.map((width) => <i key={width} className={styles.rag__skeleton} style={{ width: `${width}%` }} />)}
          {!searching && !found && (
            <div className={styles.rag__source}>
              <span className={styles.rag__fragment}>{copy.noSources}</span>
            </div>
          )}
          {!searching &&
            found?.sources.map((source, index) => (
              <article
                key={`${source.doc}${source.section}`}
                className={clsx(
                  styles.rag__source,
                  hot === index + 1 && styles['rag__source--hot'],
                  hot !== null && hot !== index + 1 && styles['rag__source--dim'],
                )}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className={styles.rag__sourceHead}>
                  <span className={styles.rag__number}>{index + 1}</span>
                  <span className={styles.rag__doc}>
                    {source.doc} · {source.section}
                  </span>
                  <span className={styles.rag__score}>{String(source.score).replace('.', ',')}</span>
                </div>
                <p className={styles.rag__fragment}>
                  <Fragments text={source.fragment} />
                </p>
              </article>
            ))}
        </section>
        <AiCard tone="result" ariaLive className={styles.rag__answer}>
          <h4 className={styles.rag__question}>{question}</h4>
          {searching && (
            <>
              {SKELETON.map((width) => (
                <i key={width} className={styles.rag__skeleton} style={{ width: `${width}%` }} />
              ))}
              <span className={styles.rag__state}>{copy.searching}</span>
            </>
          )}
          {!searching && !found && (
            <>
              <p className={styles.rag__text}>{copy.noAnswer}</p>
              <span className={styles.rag__state}>{copy.noteLimited}</span>
            </>
          )}
          {answering && found && (
            <>
              <p className={styles.rag__text}>
                {tokens.map((token, index) =>
                  token.kind === 'text' ? (
                    <Fragment key={index}>{token.value}</Fragment>
                  ) : (
                    <button
                      key={index}
                      type="button"
                      className={styles.rag__footnote}
                      aria-label={copy.footnote(token.index, found.sources[token.index - 1].doc)}
                      onMouseEnter={() => setHot(token.index)}
                      onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(token.index)}
                      onBlur={() => setHot(null)}
                      onClick={() => setHot(token.index)}
                    >
                      {token.index}
                    </button>
                  ),
                )}
              </p>
              <span className={styles.rag__state}>{copy.hover}</span>
            </>
          )}
        </AiCard>
      </div>
    </div>
  );
};

export default AiRag;
