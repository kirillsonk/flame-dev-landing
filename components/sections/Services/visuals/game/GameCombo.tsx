'use client';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { GAME_COMBO as copy } from '@/data/demosGame';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import GameFrame from './GameFrame';
import GameIcon from './GameIcon';
import GamePromo from './GamePromo';
import GameStat from './GameStat';
import { COMBO_KINDS } from './icons';
import useDemoActive from './hooks/useDemoActive';
import useGameCombo from './hooks/useGameCombo';
import useMounted from './hooks/useMounted';
import useReducedMotion from './hooks/useReducedMotion';
import styles from './GameCombo.module.scss';

interface IGameComboBoardProps {
  active: boolean;
  reduced: boolean;
}

const formatTime = (seconds: number) => `0:${String(seconds).padStart(2, '0')}`;

// Поле монтируется только на клиенте: раскладка случайная.
const GameComboBoard = ({ active, reduced }: IGameComboBoardProps) => {
  const game = useGameCombo(active, reduced);

  return (
    <GameFrame
      tag={copy.tag}
      title={copy.title}
      hint={copy.hint}
      foot={
        <>
          <div className={styles.gameCombo__stats}>
            <GameStat label={copy.time} value={formatTime(game.left)} low={game.low} />
            <GameStat label={copy.score} value={game.score} />
          </div>
          <div className={styles.gameCombo__goal} aria-hidden="true">
            <i className={styles.gameCombo__goalFill} style={{ width: `${game.goal}%` }} />
          </div>
          <button type="button" className={clsx(ui.button, styles.gameCombo__reset)} onClick={game.reset}>
            {copy.reset}
          </button>
        </>
      }
    >
      <div className={styles.gameCombo__stage}>
        <div
          className={styles.gameCombo__board}
          role="group"
          aria-label={copy.board}
          onKeyDown={game.onBoardKeyDown}
          onPointerMove={game.onBoardPointerMove}
          onPointerUp={game.onPointerEnd}
          onPointerCancel={game.onPointerEnd}
          onPointerLeave={game.onPointerEnd}
        >
          {game.cells.map((kind, index) => {
            const falling = !reduced && game.fall[index] > 0;
            const shaking = game.shake.cells.includes(index);
            return (
              <button
                key={index}
                ref={(node) => {
                  game.cellRefs.current[index] = node;
                }}
                type="button"
                tabIndex={index === game.focusIndex ? 0 : -1}
                aria-pressed={game.selected === index}
                aria-label={`${copy.kinds[kind] ?? ''}, ${copy.row} ${Math.floor(index / game.size) + 1}, ${copy.column} ${(index % game.size) + 1}`}
                className={clsx(
                  styles.gameCombo__cell,
                  styles[`gameCombo__cell--${kind}`],
                  game.selected === index && styles['gameCombo__cell--selected'],
                  game.hint.includes(index) && styles['gameCombo__cell--hint'],
                  game.popping.includes(index) && styles['gameCombo__cell--pop'],
                  falling && styles[game.fallTick[index] % 2 ? 'gameCombo__cell--fallA' : 'gameCombo__cell--fallB'],
                  shaking && styles[game.shake.tick % 2 ? 'gameCombo__cell--shakeA' : 'gameCombo__cell--shakeB'],
                )}
                style={falling ? ({ '--fall': game.fall[index] } as CSSProperties) : undefined}
                onFocus={() => game.setFocusIndex(index)}
                onPointerDown={(event) => game.onCellPointerDown(index, event)}
                onClick={() => game.onCellClick(index)}
              >
                {kind >= 0 && <GameIcon kind={COMBO_KINDS[kind]} className={styles.gameCombo__icon} />}
              </button>
            );
          })}
        </div>
      </div>
      {game.combo.n > 1 && (
        <div
          className={clsx(
            styles.gameCombo__combo,
            styles[game.combo.tick % 2 ? 'gameCombo__combo--a' : 'gameCombo__combo--b'],
          )}
          aria-hidden="true"
        >
          {copy.combo}
          {game.combo.n}
        </div>
      )}
      <p className={styles.gameCombo__message} aria-live="polite">
        {game.message}
      </p>
      {game.result && (
        <GamePromo
          label={game.result.label}
          prize={game.result.prize}
          code={game.result.code}
          note={copy.note}
          again={copy.again}
          onAgain={game.again}
        />
      )}
    </GameFrame>
  );
};

const GameCombo = () => {
  const { mounted } = useMounted();
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { reduced } = useReducedMotion();

  return (
    <div ref={ref} className={styles.gameCombo}>
      {mounted && <GameComboBoard active={active} reduced={reduced} />}
    </div>
  );
};

export default GameCombo;
