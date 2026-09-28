import clsx from 'clsx';
import styles from './BaseArrow.module.scss';

export interface BaseArrowProps {
  /** Ссылка наружу или на страницу, листание галереи назад и вперед */
  direction?: 'out' | 'left' | 'right';
  size?: 'm' | 'l';
  className?: string;
}

// Плотная залитая стрелка с рублеными концами, как срезы в логотипе. Заменяет тонкие символы ↗ ← →
const SHAPES = {
  out: '6.6 4.2 19.8 4.2 19.8 17.4 16.2 17.4 16.2 10.4 6.8 19.8 4.2 17.2 13.6 7.8 6.6 7.8',
  right: '2.8 10.2 14.2 10.2 9.6 5.6 12.2 3 21.2 12 12.2 21 9.6 18.4 14.2 13.8 2.8 13.8',
  left: '21.2 10.2 9.8 10.2 14.4 5.6 11.8 3 2.8 12 11.8 21 14.4 18.4 9.8 13.8 21.2 13.8',
};

const BaseArrow = ({ direction = 'out', size = 'm', className }: BaseArrowProps) => (
  <svg className={clsx(styles.arrow, styles[`arrow--${size}`], className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <polygon points={SHAPES[direction]} />
  </svg>
);

export default BaseArrow;
