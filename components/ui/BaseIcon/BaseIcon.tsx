import clsx from 'clsx';
import type { IconName } from '@/data/types';
import styles from './BaseIcon.module.scss';

export interface BaseIconProps {
  name: IconName;
  className?: string;
}

// Одна сетка 24, одна толщина линии: иконок несколько, библиотека не нужна.
const PATHS: Record<IconName, string[]> = {
  telegram: ['M21.2 4.6 2.9 11.3c-.9.3-.9 1.6 0 1.9l4.6 1.5 1.7 4.9c.3.8 1.3 1 1.9.3l2.4-2.8 4.4 3.2c.6.5 1.5.1 1.7-.6l3-13.8c.2-.8-.6-1.5-1.4-1.3Z', 'm7.5 14.7 10.2-7.9-6.6 9'],
  mail: ['M3 6.5h18v11H3z', 'm3.4 7 8.6 6 8.6-6'],
  deck: ['M12 3v11', 'm7.5 10 4.5 4.5 4.5-4.5', 'M4.5 19.5h15'],
  arrow: ['M4.5 12h15', 'm13 5.5 6.5 6.5-6.5 6.5'],
  arrowUp: ['M12 19.5v-15', 'm5.5 11 6.5-6.5 6.5 6.5'],
  sliders: ['M4 7h9', 'M17 7h3', 'M4 17h3', 'M11 17h9', 'M15 4.5v5', 'M9 14.5v5'],
  check: ['m5 12.5 4.5 4.5L19 7.5'],
};

const BaseIcon = ({ name, className }: BaseIconProps) => {
  return (
    <svg
      className={clsx(styles.icon, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
};

export default BaseIcon;
