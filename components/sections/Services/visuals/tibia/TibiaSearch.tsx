'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';
import { TIBIA_SEARCH as copy } from '@/data/demosTibia';
import useTibiaSearch, { ROW_REM } from './hooks/useTibiaSearch';
import type { StockFilter } from './hooks/useTibiaSearch';
import styles from './TibiaSearch.module.scss';

const FILTERS: StockFilter[] = ['all', 0, 1, 2];
const STATUS_CLASSES = ['search__led--stock', 'search__led--shipping', 'search__led--marking', 'search__led--shipped'];
const NUMBER = new Intl.NumberFormat('ru-RU');

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlight = (text: string, terms: string[]): ReactNode => {
  if (!terms.length) return text;
  const parts = text.split(new RegExp(`(${terms.map(escape).join('|')})`, 'gi'));
  return parts.map((part, index) =>
    index % 2 ? (
      <mark key={index} className={styles.search__mark}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

// Поиск по складу: 12 000 позиций фильтруются на лету, виртуальный список рисует только видимые строки.
const TibiaSearch = () => {
  const { scrollRef, query, filter, terms, results, ms, from, to, total, setQuery, setFilter, onScroll } =
    useTibiaSearch();
  const rows = results.slice(from, to);

  return (
    <div className={styles.search}>
      <label className={styles.search__field}>
        <svg className={styles.search__icon} viewBox="0 0 20 20" fill="none" strokeWidth="2" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6" />
          <path d="M13 13l5 5" />
        </svg>
        <input
          className={styles.search__input}
          value={query}
          placeholder={copy.placeholder}
          aria-label={copy.label}
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className={styles.search__ms}>
          {ms === null ? '' : ms < 1 ? copy.fast : `${ms.toFixed(1)} ${copy.ms}`}
        </span>
      </label>
      <div className={styles.search__chips}>
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={styles.search__chip}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
          >
            {item === 'all' ? copy.all : copy.statuses[item]}
          </button>
        ))}
        <span className={styles.search__suggest}>
          <span className={styles.search__dim}>{copy.try}</span>
          {copy.suggestions.map((suggestion) => (
            <button key={suggestion} type="button" className={styles.search__link} onClick={() => setQuery(suggestion)}>
              {suggestion}
            </button>
          ))}
        </span>
      </div>
      <div className={styles.search__table}>
        <div className={clsx(styles.search__row, styles.search__thead)}>
          {copy.headers.map((header) => (
            <span key={header} className={styles.search__cell}>
              {header}
            </span>
          ))}
        </div>
        <div ref={scrollRef} className={styles.search__scroll} tabIndex={0} aria-label={copy.results} onScroll={onScroll}>
          <div className={styles.search__body} style={{ height: `${results.length * ROW_REM}rem` }}>
            {rows.map((item, offset) => (
              <div
                key={`${item.id}-${from + offset}`}
                className={clsx(styles.search__row, styles['search__row--item'])}
                style={{ top: `${(from + offset) * ROW_REM}rem` }}
              >
                <span className={styles.search__cell}>{highlight(item.id, terms)}</span>
                <span className={styles.search__cell}>{highlight(item.size, terms)}</span>
                <span className={styles.search__cell}>{highlight(item.cell, terms)}</span>
                <span className={clsx(styles.search__cell, styles.search__status)}>
                  <i className={clsx(styles.search__led, styles[STATUS_CLASSES[item.status]])} />
                  {highlight(copy.statuses[item.status], terms)}
                </span>
                <span className={styles.search__cell}>{highlight(item.lot, terms)}</span>
              </div>
            ))}
          </div>
          {results.length === 0 && <div className={styles.search__empty}>{copy.empty}</div>}
        </div>
      </div>
      <div className={styles.search__foot}>
        <span aria-live="polite">
          {copy.found} {NUMBER.format(results.length)} {copy.of} {NUMBER.format(total)}
        </span>
        <span>
          {copy.inDom} <b>{rows.length}</b>
        </span>
      </div>
    </div>
  );
};

export default TibiaSearch;
