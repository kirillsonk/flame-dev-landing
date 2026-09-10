'use client';

import { useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import useMatch3, { GRID } from './hooks/useMatch3';
import styles from './Match3.module.scss';

const subscribe = () => () => undefined;
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

const boardStyle = { '--grid': GRID } as CSSProperties;

const Board = () => {
  const { cells, selected, score, onCellClick } = useMatch3();
  return (
    <>
      <div className={styles.game__board} style={boardStyle} role="grid" aria-label="Три в ряд">
        {cells.map((kind, index) => (
          <button
            key={index}
            type="button"
            className={clsx(styles.game__cell, styles[`game__cell--${kind}`], selected === index && styles['game__cell--selected'])}
            onClick={() => onCellClick(index)}
            aria-label={`Ячейка ${index + 1}`}
            aria-pressed={selected === index}
          />
        ))}
      </div>
      <div className={styles.game__side}>
        <span className={styles.game__label}>очки</span>
        <span className={styles.game__score}>{score}</span>
        <span className={styles.game__hint}>меняйте соседние фишки местами</span>
      </div>
    </>
  );
};

const Match3 = () => {
  const mounted = useMounted();
  return <div className={styles.game}>{mounted ? <Board /> : <div className={styles.game__board} style={boardStyle} aria-hidden="true" />}</div>;
};

export default Match3;
