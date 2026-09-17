import type { ReactNode, Ref } from 'react';
import styles from './GameFrame.module.scss';

export interface GameFrameProps {
  tag: string;
  title: string;
  hint: string;
  // Дополнительный блок под подсказкой (легенда), скрыт на мобильном.
  extra?: ReactNode;
  foot: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

// Общая раскладка промо-механик: слева задание и счётчики, справа игровое поле.
const GameFrame = ({ tag, title, hint, extra, foot, children, ref }: GameFrameProps) => (
  <div ref={ref} className={styles.gameFrame}>
    <aside className={styles.gameFrame__side}>
      <span className={styles.gameFrame__tag}>{tag}</span>
      <h4 className={styles.gameFrame__title}>{title}</h4>
      <p className={styles.gameFrame__hint}>{hint}</p>
      {extra && <div className={styles.gameFrame__extra}>{extra}</div>}
      <div className={styles.gameFrame__foot}>{foot}</div>
    </aside>
    <div className={styles.gameFrame__play}>{children}</div>
  </div>
);

export default GameFrame;
