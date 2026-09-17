'use client';
import clsx from 'clsx';
import { GAME_CATCH as copy } from '@/data/demosGame';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import GameFrame from './GameFrame';
import GameIcon from './GameIcon';
import GamePromo from './GamePromo';
import GameStat from './GameStat';
import useDemoActive from './hooks/useDemoActive';
import useGameCatch from './hooks/useGameCatch';
import styles from './GameCatch.module.scss';

const GameCatch = () => {
  const { ref, active } = useDemoActive<HTMLDivElement>();
  const { canvasRef, ...game } = useGameCatch(active);

  return (
    <GameFrame
      ref={ref}
      tag={copy.tag}
      title={copy.title}
      hint={copy.hint}
      extra={
        <ul className={styles.gameCatch__legend}>
          {copy.legend.map((item) => (
            <li key={item.kind} className={styles.gameCatch__legendItem}>
              <GameIcon
                kind={item.kind}
                className={clsx(styles.gameCatch__legendIcon, styles[`gameCatch__legendIcon--${item.kind}`])}
              />
              {item.label}
              <b className={styles.gameCatch__legendPoints}>
                {item.points > 0 ? `+${item.points}` : `−${Math.abs(item.points)}`}
              </b>
            </li>
          ))}
        </ul>
      }
      foot={
        <div className={styles.gameCatch__stats}>
          <GameStat
            label={copy.time}
            value={`0:${String(game.left).padStart(2, '0')}`}
            low={game.phase === 'playing' && game.left <= 5}
          />
          <GameStat label={copy.score} value={game.score} />
        </div>
      }
    >
      <div className={styles.gameCatch__play}>
        <canvas
          ref={canvasRef}
          className={styles.gameCatch__canvas}
          tabIndex={0}
          aria-label={copy.canvas}
          onPointerMove={game.onPointerMove}
          onPointerDown={game.onPointerDown}
          onKeyDown={game.onKeyDown}
          onKeyUp={game.onKeyUp}
          onBlur={game.onBlur}
        />
        {game.phase === 'idle' && (
          <div className={styles.gameCatch__start}>
            <p className={styles.gameCatch__intro}>{copy.intro}</p>
            <button
              type="button"
              className={clsx(ui.button, ui['button--primary'], styles.gameCatch__go)}
              onClick={game.start}
            >
              {copy.start}
            </button>
          </div>
        )}
        {game.result && (
          <GamePromo
            label={game.result.label}
            prize={game.result.prize}
            code={game.result.code}
            note={copy.note}
            again={copy.again}
            onAgain={game.start}
          />
        )}
      </div>
    </GameFrame>
  );
};

export default GameCatch;
