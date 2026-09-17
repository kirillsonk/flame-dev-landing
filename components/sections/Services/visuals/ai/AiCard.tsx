import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './AiCard.module.scss';

export interface AiCardProps {
  children: ReactNode;
  /** Подпись в шапке карточки слева. */
  label?: ReactNode;
  /** Подпись в шапке справа (счётчик, время). */
  aside?: ReactNode;
  tone?: 'plain' | 'result';
  ariaLabel?: string;
  ariaLive?: boolean;
  className?: string;
}

// Карточка входа или результата AI-демо: подпись-шапка и содержимое, заполняет доступную высоту.
const AiCard = ({ children, label, aside, tone = 'plain', ariaLabel, ariaLive, className }: AiCardProps) => (
  <section
    className={clsx(styles.aiCard, styles[`aiCard--${tone}`], className)}
    aria-label={ariaLabel}
    aria-live={ariaLive ? 'polite' : undefined}
  >
    {(label || aside) && (
      <div className={styles.aiCard__head}>
        <span>{label}</span>
        {aside && <span>{aside}</span>}
      </div>
    )}
    {children}
  </section>
);

export default AiCard;
