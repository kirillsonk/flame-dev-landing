import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import styles from './BaseButton.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'inverse' | 'chrome' | 'ghost';
type ButtonSize = 'm' | 'l';

interface BaseButtonCommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Необязательная стрелка без отдельной круглой подложки */
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
          <BaseArrow direction="right" className={styles.button__icon} />
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    if (href.startsWith('/')) {
      return <Link href={href} className={classes} {...anchorProps}>{content}</Link>;
    }
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
