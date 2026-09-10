import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './BaseTag.module.scss';

export interface BaseTagProps {
  variant?: 'outline' | 'accent';
  className?: string;
  children: ReactNode;
}

const BaseTag = ({ variant = 'outline', className, children }: BaseTagProps) => {
  return <span className={clsx(styles.tag, styles[`tag--${variant}`], className)}>{children}</span>;
};

export default BaseTag;
