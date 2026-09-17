'use client';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { GAME_DEMO as copy } from '@/data/demos';
import useMatch3, { GRID } from '@/components/sections/Services/visuals/hooks/useMatch3';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import styles from './Match3Board.module.scss';
const Match3Board = () => {
  const game = useMatch3();
  return (
    <>
      <div className={ui.header}>
        <span className={ui.wordmark}>{copy.name}</span>
        <span className={ui.badge}>{copy.badge}</span>
      </div>
      <div className={styles.game__layout}>
        <div className={styles.game__board} role="group" aria-label={copy.title} aria-busy={game.busy}>
          {game.cells.map((kind, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${copy.cell} ${index + 1}: ${copy.kinds[kind]}`}
              aria-pressed={game.selected === index}
              disabled={game.busy}
              className={clsx(
                styles.game__cell,
                styles[`game__cell--${kind}`],
                game.selected === index && styles['game__cell--selected'],
                game.matched.includes(index) && styles['game__cell--matched'],
                game.hint.includes(index) && styles['game__cell--hint'],
              )}
              style={
                game.swap && (index === game.swap.from || index === game.swap.to)
                  ? ({
                      '--swap-column':
                        ((index === game.swap.from ? game.swap.to : game.swap.from) % GRID) - (index % GRID),
                      '--swap-row':
                        Math.floor((index === game.swap.from ? game.swap.to : game.swap.from) / GRID) -
                        Math.floor(index / GRID),
                    } as CSSProperties)
                  : undefined
              }
              data-swap={
                game.swap && (index === game.swap.from || index === game.swap.to)
                  ? game.swap.returning
                    ? 'return'
                    : 'forward'
                  : undefined
              }
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget && index === game.swap?.from) game.completeSwap();
              }}
              onClick={() => game.onCellClick(index)}
            >
              <span aria-hidden="true">{copy.symbols[kind]}</span>
            </button>
          ))}
        </div>
        <div className={styles.game__side}>
          <h4 className={ui.title}>{copy.title}</h4>
          <div className={styles.game__score}>
            <span className={ui.muted}>{copy.score}</span>
            <strong>{game.score.toString().padStart(3, '0')}</strong>
          </div>
          <div className={ui.toolbar}>
            <button className={ui.button} disabled={game.busy} onClick={game.showHint}>
              {copy.hint}
            </button>
            <button className={ui.button} onClick={game.reset}>
              {copy.reset}
            </button>
          </div>
        </div>
      </div>
      <p className={styles.game__message} role="status">
        {game.message}
      </p>
    </>
  );
};
export default Match3Board;
