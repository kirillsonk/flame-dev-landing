'use client';

import { useId } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { TIBIA_REPORT as copy } from '@/data/demosTibia';
import useTibiaReport, { DAYS_MAX, DAYS_MIN } from './hooks/useTibiaReport';
import styles from './TibiaReport.module.scss';

const NUMBER = new Intl.NumberFormat('ru-RU');
const SIZE_CLASSES = ['report__swatch--a', 'report__swatch--b', 'report__swatch--c', 'report__swatch--d'];
const RADIUS = 15.9;
const CIRCLE = 2 * Math.PI * RADIUS;
const GAP = 0.6;

const plural = (value: number, [one, few, many]: [string, string, string]) => {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

// Отчёт за смену: период, склад и смена перестраивают графики и KPI, «PDF» собирает страницу отчёта.
const TibiaReport = () => {
  const rangeId = useId();
  const {
    closeRef,
    pdfRef,
    days,
    warehouse,
    shift,
    data,
    sheet,
    built,
    setDays,
    setWarehouse,
    setShift,
    openSheet,
    closeSheet,
  } = useTibiaReport();
  const kpis = [
    `${NUMBER.format(data.received)} ${copy.pieces}`,
    `${NUMBER.format(data.shipped)} ${copy.pieces}`,
    `${data.tons.toFixed(1)} ${copy.tons}`,
    `${((data.errors / Math.max(1, data.received)) * 100).toFixed(2)}%`,
  ];
  const warehouseLabel = copy.warehouses.find(([key]) => key === warehouse)?.[1] ?? '';
  const shiftLabel = copy.shifts.find(([key]) => key === shift)?.[1] ?? '';
  const starts = data.shares.map((_, index) => data.shares.slice(0, index).reduce((a, b) => a + b, 0) * CIRCLE);

  return (
    <div className={styles.report} onKeyDown={(event) => event.key === 'Escape' && sheet && closeSheet()}>
      <div className={styles.report__controls} inert={sheet}>
        <div className={styles.report__group}>
          <div className={styles.report__rangeHead}>
            <label htmlFor={rangeId}>{copy.period}</label>
            <span>
              {days} {plural(days, copy.days)}
            </span>
          </div>
          <input
            id={rangeId}
            className={styles.report__range}
            type="range"
            min={DAYS_MIN}
            max={DAYS_MAX}
            value={days}
            style={{ '--progress': `${((days - DAYS_MIN) / (DAYS_MAX - DAYS_MIN)) * 100}%` } as CSSProperties}
            onChange={(event) => setDays(Number(event.target.value))}
          />
        </div>
        <div className={styles.report__group}>
          <span className={styles.report__dim}>{copy.warehouse}</span>
          <div className={styles.report__segment}>
            {copy.warehouses.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={styles.report__option}
                aria-pressed={warehouse === key}
                onClick={() => setWarehouse(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.report__group}>
          <span className={styles.report__dim}>{copy.shift}</span>
          <div className={clsx(styles.report__segment, styles['report__segment--three'])}>
            {copy.shifts.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={styles.report__option}
                aria-pressed={shift === key}
                onClick={() => setShift(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <span className={clsx(styles.report__dim, styles.report__note)}>{copy.note}</span>
        <button ref={pdfRef} type="button" className={styles.report__pdf} onClick={openSheet}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M9 2v10M5 8l4 4 4-4M3 15h12" />
          </svg>
          {copy.pdf}
        </button>
      </div>
      <div className={clsx(styles.report__main, sheet && styles['report__main--sheet'])}>
        <div className={styles.report__kpis} inert={sheet}>
          {copy.kpis.map((label, index) => (
            <div key={label} className={styles.report__kpi}>
              <span className={styles.report__dim}>{label}</span>
              <strong className={styles.report__kpiValue}>{kpis[index]}</strong>
            </div>
          ))}
        </div>
        <div className={styles.report__charts} inert={sheet}>
          <div className={clsx(styles.report__card, styles['report__card--bars'])}>
            <div className={styles.report__legend}>
              <span>
                <i className={clsx(styles.report__swatch, styles['report__swatch--in'])} />
                {copy.legendIn}
              </span>
              <span>
                <i className={clsx(styles.report__swatch, styles['report__swatch--out'])} />
                {copy.legendOut}
              </span>
            </div>
            <div className={styles.report__bars} role="img" aria-label={copy.chart}>
              {data.incoming.map((value, day) => (
                <div key={day} className={styles.report__day}>
                  <i
                    className={clsx(styles.report__bar, styles['report__bar--in'])}
                    style={{ height: `${(value / data.max) * 100}%` }}
                  />
                  <i
                    className={clsx(styles.report__bar, styles['report__bar--out'])}
                    style={{ height: `${(data.outgoing[day] / data.max) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={clsx(styles.report__card, styles['report__card--sizes'])}>
            <div className={styles.report__donut}>
              <svg className={styles.report__ring} viewBox="0 0 42 42" aria-hidden="true">
                {data.shares.map((share, index) => {
                  const length = share * CIRCLE;
                  const dash = `${Math.max(0, length - GAP)} ${CIRCLE - length + GAP}`;
                  return (
                    <circle
                      key={copy.sizes[index]}
                      className={clsx(styles.report__arc, styles[SIZE_CLASSES[index]])}
                      cx="21"
                      cy="21"
                      r={RADIUS}
                      strokeDasharray={dash}
                      strokeDashoffset={-starts[index]}
                    />
                  );
                })}
              </svg>
              <b className={styles.report__total}>{Math.round(data.received / 100) / 10}k</b>
            </div>
            <div className={styles.report__sizes}>
              {copy.sizes.map((size, index) => (
                <div key={size} className={styles.report__size}>
                  <span>
                    <i className={clsx(styles.report__swatch, styles[SIZE_CLASSES[index]])} />
                    {size}
                  </span>
                  <b className={styles.report__share}>{Math.round(data.shares[index] * 100)}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={clsx(styles.report__sheet, sheet && styles['report__sheet--open'])} aria-hidden={!sheet} inert={!sheet}>
          <span className={styles.report__meta}>{copy.sheetMeta}</span>
          <h4 className={styles.report__sheetTitle}>
            {copy.sheetTitle} {days} {copy.sheetDays} · {warehouse === 'all' ? copy.allWarehouses : `${copy.warehouseName} ${warehouseLabel}`}
          </h4>
          <div className={styles.report__progress}>
            <i className={styles.report__progressFill} />
          </div>
          <table className={styles.report__table}>
            <tbody>
              {[
                shift === 'all' ? copy.bothShifts : shiftLabel.toLowerCase(),
                `${NUMBER.format(data.received)} ${copy.pieces}`,
                `${NUMBER.format(data.shipped)} ${copy.pieces} · ${data.tons.toFixed(1)} ${copy.tons}`,
                String(data.errors),
                copy.signature,
              ].map((value, index) => (
                <tr key={copy.rows[index]}>
                  <td className={styles.report__td}>{copy.rows[index]}</td>
                  <td className={clsx(styles.report__td, styles['report__td--value'])}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.report__sheetFoot}>
            <span className={styles.report__meta} role="status">
              {sheet && built ? copy.file(warehouse, days) : copy.building}
            </span>
            <button ref={closeRef} type="button" className={styles.report__close} onClick={closeSheet}>
              {copy.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TibiaReport;
