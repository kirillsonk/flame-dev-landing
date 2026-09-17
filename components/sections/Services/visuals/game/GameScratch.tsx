'use client';
import clsx from 'clsx';
import { GAME_PROMO, GAME_SCRATCH as copy } from '@/data/demosGame';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import GameFrame from './GameFrame';
import GameStat from './GameStat';
import { copyText } from './promo';
import useGameScratch from './hooks/useGameScratch';
import useMounted from './hooks/useMounted';
import useReducedMotion from './hooks/useReducedMotion';
import styles from './GameScratch.module.scss';

interface IGameScratchTicketProps {
  reduced: boolean;
}

// Билет монтируется только на клиенте: приз и промокод случайные.
const GameScratchTicket = ({ reduced }: IGameScratchTicketProps) => {
  const { canvasRef, copyRef, autoRef, ...game } = useGameScratch(reduced);

  return (
    <GameFrame
      tag={copy.tag}
      title={copy.title}
      hint={copy.hint}
      foot={
        <>
          <GameStat label={copy.erased} value={`${game.percent}%`}>
            <span className={styles.gameScratch__bar} aria-hidden="true">
              <i className={styles.gameScratch__barFill} style={{ width: `${game.progress}%` }} />
            </span>
          </GameStat>
          {game.revealed ? (
            <button type="button" className={clsx(ui.button, styles.gameScratch__action)} onClick={game.next}>
              {copy.next}
            </button>
          ) : (
            <button
              ref={autoRef}
              type="button"
              className={clsx(ui.button, ui['button--primary'], styles.gameScratch__action)}
              onClick={game.autoErase}
            >
              {copy.auto}
            </button>
          )}
        </>
      }
    >
      <div className={styles.gameScratch__stage}>
        <div className={styles.gameScratch__ticket}>
          <div className={styles.gameScratch__prize} aria-hidden={!game.revealed}>
            <p className={styles.gameScratch__dim}>{game.revealed ? copy.kickerWin : copy.kicker}</p>
            <p className={styles.gameScratch__big}>{game.prize.big}</p>
            <p className={styles.gameScratch__sub}>{game.prize.sub}</p>
            <div className={styles.gameScratch__code}>
              <span>{game.code}</span>
              <button
                ref={copyRef}
                type="button"
                tabIndex={game.revealed ? 0 : -1}
                className={styles.gameScratch__copy}
                onClick={() => {
                  copyText(game.code);
                  game.setCopied(true);
                }}
              >
                {game.copied ? GAME_PROMO.copied : GAME_PROMO.copy}
              </button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className={clsx(styles.gameScratch__canvas, game.revealed && styles['gameScratch__canvas--gone'])}
            role="img"
            aria-label={copy.canvas}
            onPointerDown={game.onPointerDown}
            onPointerMove={game.onPointerMove}
            onPointerUp={game.onPointerUp}
            onPointerCancel={game.onPointerUp}
          />
        </div>
      </div>
      <p className={styles.gameScratch__message} aria-live="polite">
        {game.message}
      </p>
    </GameFrame>
  );
};

const GameScratch = () => {
  const { mounted } = useMounted();
  const { reduced } = useReducedMotion();

  return <div className={styles.gameScratch}>{mounted && <GameScratchTicket reduced={reduced} />}</div>;
};

export default GameScratch;
