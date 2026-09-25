'use client';

import clsx from 'clsx';
import { AI_INVOICE as copy } from '@/data/demosAi';
import AiButton from './AiButton';
import AiChips from './AiChips';
import useAiInvoice from './hooks/useAiInvoice';
import styles from './AiInvoice.module.scss';

/** Колонка цены прячется на телефоне. */
const OPTIONAL_COL = 2;
const NUMBER = new Intl.NumberFormat('ru-RU');

// AI · накладная из скана: рамки бегут по строкам мятого скана, таблица заполняется, спорная ячейка — на проверку.
const AiInvoice = () => {
  const { cellText, check, choose, done, isDoubtful, isShown, quantity, recognize, ref, running, scanRow, sumText } =
    useAiInvoice();
  const { doubt } = copy;

  return (
    <div ref={ref} className={styles.invoice}>
      <div className={styles.invoice__scan}>
        <div className={styles.invoice__paper} role="img" aria-label={copy.paperLabel}>
          <div className={styles.invoice__paperHead}>
            <span>{copy.paperTitle}</span>
            <span>{copy.paperDate}</span>
          </div>
          <table className={styles.invoice__paperTable}>
            <thead>
              <tr>
                {copy.paperHeaders.map((header, col) => (
                  <th
                    key={header}
                    className={clsx(
                      styles.invoice__paperCell,
                      col === OPTIONAL_COL && styles['invoice__cell--optional'],
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((cells, row) => (
                <tr key={cells[0]}>
                  {cells.map((cell, col) => (
                    <td
                      key={col}
                      className={clsx(
                        styles.invoice__paperCell,
                        row === doubt.row && col === doubt.col && styles['invoice__paperCell--smudge'],
                        scanRow === row && styles['invoice__paperCell--scan'],
                        col === OPTIONAL_COL && styles['invoice__cell--optional'],
                      )}
                    >
                      {cell}
                      <i
                        className={clsx(
                          styles.invoice__box,
                          isShown(row, col) && styles['invoice__box--on'],
                          row === doubt.row && col === doubt.col && styles['invoice__box--doubt'],
                        )}
                        aria-hidden="true"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.invoice__paperFoot}>
            <span>{copy.totalLabel}</span>
            <span>{NUMBER.format(copy.total)}</span>
          </div>
          <i className={styles.invoice__stamp} aria-hidden="true" />
        </div>
      </div>
      <section className={styles.invoice__result} aria-live="polite">
        <div className={styles.invoice__head}>
          <h4 className={styles.invoice__title}>{copy.title}</h4>
          <AiButton busy={running} onClick={recognize}>
            {running ? copy.busy : done ? copy.again : copy.go}
          </AiButton>
        </div>
        <table className={styles.invoice__table}>
          <thead>
            <tr>
              {copy.headers.map((header, col) => (
                <th
                  key={header}
                  className={clsx(styles.invoice__th, col === OPTIONAL_COL && styles['invoice__cell--optional'])}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((cells, row) => (
              <tr key={cells[0]}>
                {cells.map((_, col) => (
                  <td
                    key={`${col}-${isShown(row, col)}-${row === doubt.row && col === doubt.col ? quantity : ''}`}
                    className={clsx(
                      styles.invoice__td,
                      !isShown(row, col) && styles['invoice__td--empty'],
                      isShown(row, col) && styles['invoice__td--new'],
                      isDoubtful(row, col) && styles['invoice__td--doubt'],
                      col === OPTIONAL_COL && styles['invoice__cell--optional'],
                    )}
                  >
                    {cellText(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Спорная ячейка и сверка итога делят одно место: пока количество не выбрано, итог не сверить,
            а вдвоём они не помещаются в рамку сцены. */}
        {done && quantity === null ? (
          <div className={styles.invoice__fix}>
            <span>{copy.fixPrompt}</span>
            <AiChips label={copy.fixPrompt} items={doubt.options} onSelect={(index) => choose(doubt.options[index])} />
          </div>
        ) : (
          <div
            className={clsx(
              styles.invoice__check,
              check === 'ok' && styles['invoice__check--ok'],
              check === 'bad' && styles['invoice__check--bad'],
            )}
          >
            {check === 'waiting' && (
              <>
                <span>{copy.checkLabel}</span>
                <b className={styles.invoice__verdict}>{copy.waiting}</b>
              </>
            )}
            {check !== 'waiting' && quantity !== null && (
              <>
                <span>{sumText}</span>
                <b className={styles.invoice__verdict}>{check === 'ok' ? copy.ok : copy.bad}</b>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AiInvoice;
