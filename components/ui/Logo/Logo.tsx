import clsx from 'clsx';
import styles from './Logo.module.scss';

export interface LogoProps {
  variant?: 'header' | 'footer';
  className?: string;
}

const H = 17.91;
const S = 4.2;

const D_PATH = `M0 0 H9 L13 4 V${H - 4} L9 ${H} H0 Z M${S} ${S} V${H - S} H${9 - S * 0.4} L${13 - S} ${H - 4 - S * 0.4} V${4 + S * 0.4} L${9 - S * 0.4} ${S} Z`;
const E_PATH = `M0 0 H11 V${S} H${S} V${H / 2 - S / 2} H9.5 V${H / 2 + S / 2} H${S} V${H - S} H11 V${H} H0 Z`;
const V_PATH = `M0 0 H4.6 L7 ${H - 6} L9.4 0 H14 L9 ${H} H5 Z`;

const Logo = ({ variant = 'header', className }: LogoProps) => {
  return (
    <svg
      className={clsx(styles.logo, styles[`logo--${variant}`], className)}
      viewBox="0 0 376 72"
      fill="currentColor"
      role="img"
      aria-label="FLAME DEV"
    >
      <polygon points="253.83 72 310.98 72 314.74 54.03 280.75 54.03 282.66 45.01 307.82 45.01 311.55 27.04 286.47 27.04 288.39 18.02 322.37 18.02 326.13 0 269.1 0 253.83 72" />
      <path d="M240.75,0l-22.96,26.99L202.26,0h-19.53l-13.31,62.81L156.1,0h-22.68l-31.11,54.02h-20.81L92.98,0H15.26L0,72h22.86l5.72-26.99h26.74l3.82-17.96h-26.76l1.91-9.03h31.9l-11.44,53.98h60.76l5.16-8.96h26.78l1.9,8.96h41.08c.63-4.8,3.37-9.8,6.91-12.75.16-.21,1.63-1.82,1.8-2.04,2.74-3.59,3.78-6.94,4.26-10.39.32-2.63,0-5.16,0-5.16,11.13,10.91,10.55,23.69,10.55,23.69,0,0,5.06-3.66,7.02-10.23,3.28,4.6,5.69,11.01,6.2,16.88h21.52L263.92,0h-23.17ZM131.07,45.01l9.19-15.95,3.38,15.95h-12.57Z" />
      <g transform="translate(331.25 0) skewX(-12.22)">
        <path d={D_PATH} fillRule="evenodd" />
        <path d={E_PATH} transform="translate(16 0)" />
        <path d={V_PATH} transform="translate(30 0)" />
      </g>
    </svg>
  );
};

export default Logo;
