'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { SYSTEM_DEMO as copy } from '@/data/demos';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import styles from './TibiaTable.module.scss';

const TibiaTable = () => {
  const [verified, setVerified] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setVerified((value) => value + 1);
      if (verified === copy.rows.length - 1) setRunning(false);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [running, verified]);
  const complete = verified === copy.rows.length;
  return (
    <div className={ui.panel}>
      <div className={ui.header}>
        <span className={ui.wordmark}>{copy.name}</span>
        <span className={ui.badge}>{copy.badge}</span>
      </div>
      <div className={styles.table__overview}>
        <div>
          <h4 className={ui.title}>{copy.title}</h4>
          <p className={ui.muted}>{copy.subtitle}</p>
        </div>
        <div className={styles.table__counter}>
          <strong>{verified.toString().padStart(2, '0')}</strong>
          <span className={ui.muted}>/ {copy.rows.length.toString().padStart(2, '0')}</span>
        </div>
      </div>
      <div className={styles.table__track}>
        <div
          className={styles.table__progress}
          style={{ transform: `scaleX(${verified / copy.rows.length})` }}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            {copy.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {copy.rows.map((row, index) => (
            <tr
              key={row.id}
              className={clsx(
                index < verified && styles['table__row--done'],
                running && index === verified && styles['table__row--scanning'],
              )}
            >
              <td>{row.id}</td>
              <td>{row.size}</td>
              <td>
                <span className={styles.table__state}>
                  {index < verified ? '✓ ' : '· '}
                  {index < verified ? copy.done : copy.pending}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.table__footer}>
        <span className={ui.status} role="status">
          <span className={ui.dot} />
          {running ? copy.scanning : complete ? copy.complete : copy.ready}
        </span>
        <button
          className={clsx(ui.button, ui['button--primary'])}
          disabled={running}
          onClick={() => {
            setVerified(0);
            setRunning(true);
          }}
        >
          {complete ? copy.reset : copy.scan}
        </button>
      </div>
    </div>
  );
};
export default TibiaTable;
