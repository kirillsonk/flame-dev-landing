import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './GameStat.module.scss';

export interface GameStatProps {
  label: string;
  value: string | number;
  low?: boolean;
  children?: ReactNode;
}

const GameStat = ({ label, value, low = false, children }: GameStatProps) => (
  <div className={clsx(styles.gameStat, low && styles['gameStat--low'])}>
    <span className={styles.gameStat__label}>{label}</span>
    <b className={styles.gameStat__value}>{value}</b>
    {children}
  </div>
);

export default GameStat;
