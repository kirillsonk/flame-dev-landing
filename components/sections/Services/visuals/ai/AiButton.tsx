import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './AiButton.module.scss';

export interface AiButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'gradient' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
  busy?: boolean;
  pressed?: boolean;
  className?: string;
  onClick?: () => void;
}

// Кнопка действия AI-демо: «Запустить», «Распознать», «Спросить».
const AiButton = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  busy,
  pressed,
  className,
  onClick,
}: AiButtonProps) => (
  <button
    type={type}
    className={clsx(styles.aiButton, styles[`aiButton--${variant}`], busy && styles['aiButton--busy'], className)}
    disabled={disabled || busy}
    aria-busy={busy || undefined}
    aria-pressed={pressed}
    onClick={onClick}
  >
    {children}
  </button>
);

export default AiButton;
