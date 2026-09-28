import type { CSSProperties } from 'react';
import { FLAME_PROCESS } from '@/data/appearance';
import styles from './FlameProcess.module.scss';

const icons = [
  <g key="discover"><rect x="7" y="8" width="27" height="23" rx="11.5" /><path d="M19 34a11 11 0 0 0 22-2c0-4-2-7-5-9" /><circle cx="15" cy="19.5" r="1" /><circle cx="21" cy="19.5" r="1" /><circle cx="27" cy="19.5" r="1" /></g>,
  <g key="structure"><rect x="16" y="6" width="16" height="12" rx="6" /><rect x="4" y="31" width="16" height="12" rx="6" /><rect x="28" y="31" width="16" height="12" rx="6" /><path d="M24 18v4c0 3-2 4-5 4h-3c-3 0-4 2-4 5m12-9c0 3 2 4 5 4h3c3 0 4 2 4 5" /></g>,
  <g key="design"><path d="M24 6C14 6 6 14 6 24s8 18 18 18h2c4 0 6-4 4-7-2-4 0-7 4-7h2c4 0 6-3 6-6C42 13 34 6 24 6Z" /><circle cx="16" cy="16" r="2" /><circle cx="26" cy="13" r="2" /><circle cx="35" cy="18" r="2" /><circle cx="13" cy="27" r="2" /></g>,
  <g key="code"><rect x="5" y="7" width="38" height="34" rx="10" /><path d="M6 17h36m-23 7-3 2c-2 1-2 3 0 4l3 2m10-8 3 2c2 1 2 3 0 4l-3 2" /><circle cx="13" cy="12" r=".8" /><circle cx="18" cy="12" r=".8" /></g>,
  <g key="launch"><circle cx="24" cy="24" r="17" /><path d="m16 24 5 5c1 1 2 1 3 0l9-10" /></g>,
];
const FlameProcess = () => <ol className={styles.process}>
  {FLAME_PROCESS.map((step, index) => <li className={styles.process__step} key={step.title} data-reveal style={{ '--step': index } as CSSProperties}>
    <div className={styles.process__visual} aria-hidden="true">
      <span className={styles.process__orbit} />
      <span className={styles.process__disc}>
        <svg className={styles.process__icon} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[index]}</svg>
      </span>
    </div>
    <h3>{step.title}</h3><p>{step.description}</p>
  </li>)}
</ol>;
export default FlameProcess;
