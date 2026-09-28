import type { CSSProperties } from 'react';
import { FLAME_PROCESS } from '@/data/appearance';
import { FLAME_BASE } from '@/components/sections/Services/flame';
import styles from './FlameProcess.module.scss';

const icons = [
  <g key="discover"><circle cx="24" cy="24" r="15" /><path d="m30 18-4 10-8 2 4-10 8-2ZM24 5v4m0 30v4M5 24h4m30 0h4" /></g>,
  <g key="structure"><rect x="17" y="7" width="14" height="10" rx="2" /><rect x="5" y="31" width="14" height="10" rx="2" /><rect x="29" y="31" width="14" height="10" rx="2" /><path d="M24 17v7H12v7m12-7h12v7" /></g>,
  <g key="design"><path d="m12 35 4-13L32 6l10 10-16 16-14 3Zm4-13 10 10M28 10l10 10M7 42h34" /><circle cx="22" cy="24" r="2" /></g>,
  <g key="code"><path d="m15 10-10 10 10 10m18-20 10 10-10 10M27 7l-6 26m5 5 5 5 12-12" /></g>,
  <g key="launch"><path d="M19 29c-1-9 7-20 22-22 0 15-10 24-21 23Zm0 0-8 8m10-23-10 1-5 10 12-1m16 2-1 11-10 5 1-12M10 33c-4 1-5 5-5 10 5 0 9-1 10-5" /><circle cx="31" cy="17" r="4" /></g>,
];
const FlameProcess = () => <ol className={styles.process}>
  {FLAME_PROCESS.map((step, index) => <li className={styles.process__step} key={step.title} data-reveal style={{ '--step': index } as CSSProperties}>
    <div className={styles.process__visual} aria-hidden="true">
      <svg className={styles.process__flame} viewBox="-.06 .1 1.12 .98" fill="none">
        <defs><linearGradient id={`process-flame-${index}`} x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse"><stop stopColor="var(--color-action-accent)" /><stop offset=".6" stopColor="var(--color-action-primary)" /><stop offset="1" stopColor="var(--color-action-accent)" /></linearGradient></defs>
        <path className={styles.process__fill} d={FLAME_BASE} fill={`url(#process-flame-${index})`} />
        <path className={styles.process__outline} d={FLAME_BASE} stroke={`url(#process-flame-${index})`} strokeWidth=".008" pathLength="1" />
      </svg>
      <svg className={styles.process__icon} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[index]}</svg>
      <span className={styles.process__number}>0{index + 1}</span>
    </div>
    <h3>{step.title}</h3><p>{step.description}</p>
  </li>)}
</ol>;
export default FlameProcess;
