'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from './TibiaTable.module.scss';

const ROWS = [
  ['НКТ', '4X8', '73×5.5', 'Р', 'НК'],
  ['НКТ', '4X9', '73×5.5', 'Р', 'НК'],
  ['НКТ', '5A1', '89×6.5', 'Р', 'НК'],
  ['НКТ', '5A2', '89×6.5', 'Р', 'НК'],
];

const INITIAL_VISIBLE = 2;

const TibiaTable = () => {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const showAll = () => setVisible(ROWS.length);
  const collapse = () => {
    if (window.matchMedia('(hover: hover)').matches) setVisible(INITIAL_VISIBLE);
  };

  return (
    <div className={styles.table} onMouseEnter={showAll} onMouseLeave={collapse} onTouchStart={showAll} aria-hidden="true">
      <div className={styles.table__head}>
        <span>Тип</span><span>Код</span><span>Размер</span><span>Кл.</span><span>Пакет</span>
      </div>
      {ROWS.map((row, index) => (
        <div key={row[1]} className={clsx(styles.table__row, index < visible && styles['table__row--visible'])} style={{ transitionDelay: `${index * 80}ms` }}>
          {row.map((cell, i) => (
            <span key={`${row[1]}-${i}`}>{cell}</span>
          ))}
        </div>
      ))}
      <span className={styles.table__badge}>сканер подключён</span>
    </div>
  );
};

export default TibiaTable;
