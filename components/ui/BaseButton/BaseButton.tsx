import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import styles from './BaseButton.module.scss';

type ButtonVariant = 'primary' | 'inverse' | 'chrome' | 'ghost';
type ButtonSize = 'm' | 'l';

interface BaseButtonCommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Круглый слот со стрелкой у правого края — для главных CTA. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseButtonCommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseButtonCommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type BaseButtonProps = ButtonAsButton | ButtonAsLink;

const BaseButton = ({ variant = 'primary', size = 'm', block = false, arrow = false, className, children, ...rest }: BaseButtonProps) => {
  const classes = clsx(styles.button, styles[`button--${variant}`], styles[`button--${size}`], block && styles['button--block'], className);
  const content = (
    <>
      {children}
      {arrow && (
        <span className={styles.button__slot} aria-hidden="true">
          <BaseIcon name="arrow" className={styles.button__icon} />
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
};

export default BaseButton;
