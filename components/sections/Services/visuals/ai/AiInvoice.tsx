'use client';

import clsx from 'clsx';
import { AI_INVOICE as copy } from '@/data/demosAi';
import { useLocale } from '@/components/i18n/LocaleProvider';
import AiButton from './AiButton';
import AiChips from './AiChips';
import useAiInvoice from './hooks/useAiInvoice';
import styles from './AiInvoice.module.scss';

/** Колонка цены прячется на телефоне. */
const OPTIONAL_COL = 2;

// AI · накладная из скана: рамки бегут по строкам мятого скана, таблица заполняется, спорная ячейка — на проверку.
const AiInvoice = () => {
  const { locale, t } = useLocale();
  const number = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU');
  const { cellText, check, choose, done, isDoubtful, isShown, quantity, recognize, ref, running, scanRow, sumText } =
    useAiInvoice();
  const { doubt } = copy;

  return (
    <div ref={ref} className={styles.invoice}>
      <div className={styles.invoice__scan}>
        <div className={styles.invoice__paper} role="img" aria-label={t(copy.paperLabel)}>
          <div className={styles.invoice__paperHead}>
            <span>{t(copy.paperTitle)}</span>
            <span>{t(copy.paperDate)}</span>
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
                    {t(header)}
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
                      {col === 0 ? t(cell) : number.format(Number(cell.replace(/\s/g, '')))}
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
            <span>{t(copy.totalLabel)}</span>
            <span>{number.format(copy.total)}</span>
          </div>
          <i className={styles.invoice__stamp} aria-hidden="true" />
        </div>
      </div>
      <section className={styles.invoice__result} aria-live="polite">
        <div className={styles.invoice__head}>
          <h4 className={styles.invoice__title}>{t(copy.title)}</h4>
          <AiButton busy={running} onClick={recognize}>
            {t(running ? copy.busy : done ? copy.again : copy.go)}
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
                  {t(header)}
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
        {done && check !== 'ok' ? (
          <div className={styles.invoice__fix}>
            <span>{t(copy.fixPrompt)}</span>
            <AiChips label={t(copy.fixPrompt)} items={doubt.options} selected={quantity === null ? undefined : doubt.options.indexOf(quantity)} onSelect={(index) => choose(doubt.options[index])} />
            {quantity !== null && <b className={styles.invoice__verdict}>{t(copy.bad)}</b>}
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
                <span>{t(copy.checkLabel)}</span>
                <b className={styles.invoice__verdict}>{t(copy.waiting)}</b>
              </>
            )}
            {check !== 'waiting' && quantity !== null && (
              <>
                <span>{sumText}</span>
                <b className={styles.invoice__verdict}>{t(check === 'ok' ? copy.ok : copy.bad)}</b>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AiInvoice;
