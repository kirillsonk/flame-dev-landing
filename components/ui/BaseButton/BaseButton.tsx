import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BaseButton.module.scss';

type ButtonVariant = 'primary' | 'inverse' | 'chrome' | 'ghost';
type ButtonSize = 'm' | 'l';

interface BaseButtonCommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseButtonCommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseButtonCommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type BaseButtonProps = ButtonAsButton | ButtonAsLink;

const BaseButton = ({ variant = 'primary', size = 'm', block = false, className, children, ...rest }: BaseButtonProps) => {
  const classes = clsx(styles.button, styles[`button--${variant}`], styles[`button--${size}`], block && styles['button--block'], className);

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
};

export default BaseButton;
