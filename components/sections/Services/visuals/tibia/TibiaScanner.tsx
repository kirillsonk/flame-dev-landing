'use client';

import clsx from 'clsx';
import { TIBIA_SCANNER as copy } from '@/data/demosTibia';
import useFinePointer from './hooks/useFinePointer';
import useTibiaScanner from './hooks/useTibiaScanner';
import styles from './TibiaScanner.module.scss';

const PIPES = Array.from({ length: 8 }, (_, index) => index);

// Сканер-пистолет: курсор — лазер ТСД, бирка под ним считывается со вспышкой и писком.
// На таче курсора нет: бирка считывается тапом, клавиатура — Tab и Enter.
const TibiaScanner = () => {
  const { fine } = useFinePointer();
  const { rootRef, laserRef, done, hot, fresh, last, reading, bindTag, scan, aim, move, leave, reset } =
    useTibiaScanner();
  const complete = done.length === copy.tags.length;
  const pieces = done.reduce((sum, index) => sum + copy.tags[index].count, 0);
  const status = complete
    ? `${copy.accepted} ${pieces} ${copy.pipes}`
    : last !== null
      ? `${copy.read} ${copy.tags[last].id}`
      : copy.ready;

  return (
    <div ref={rootRef} className={styles.scanner} onPointerMove={move} onPointerLeave={leave}>
      <div className={styles.scanner__bar}>
        <span className={styles.scanner__brand}>
          <i className={styles.scanner__led} />
          {copy.brand}
        </span>
        <span className={styles.scanner__hint}>{fine ? copy.hintPointer : copy.hintTouch}</span>
      </div>
      <div className={styles.scanner__body}>
        <div className={styles.scanner__yard}>
          {copy.tags.map((tag, index) => (
            <div key={tag.id} className={styles.scanner__bundle}>
              <div className={styles.scanner__pipes} aria-hidden="true">
                {PIPES.map((pipe) => (
                  <span key={pipe} className={styles.scanner__pipe} />
                ))}
              </div>
              <button
                ref={bindTag(index)}
                type="button"
                className={clsx(
                  styles.scanner__tag,
                  hot === index && styles['scanner__tag--hot'],
                  done.includes(index) && styles['scanner__tag--done'],
                )}
                aria-label={`${copy.tagLabel} ${tag.id}`}
                aria-pressed={done.includes(index)}
                onClick={() => scan(index)}
                onPointerEnter={(event) => aim(index, event)}
                onPointerLeave={(event) => aim(null, event)}
              >
                <span className={styles.scanner__code} />
                <span className={styles.scanner__tagId}>
                  <span>{tag.id}</span>
                  <span className={styles.scanner__tagCount}>
                    {tag.count} {copy.pieces}
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className={styles.scanner__log}>
          <div className={styles.scanner__head}>
            <span>{copy.journal}</span>
            <strong className={styles.scanner__count}>
              {done.length} / {copy.tags.length}
            </strong>
          </div>
          <div className={styles.scanner__track}>
            <i className={styles.scanner__fill} style={{ transform: `scaleX(${done.length / copy.tags.length})` }} />
          </div>
          <div className={styles.scanner__scroll}>
            <table className={styles.scanner__table}>
              <thead>
                <tr>
                  {copy.headers.map((header) => (
                    <th key={header} className={styles.scanner__th}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.tags.map((tag, index) =>
                  done.includes(index) ? (
                    <tr key={tag.id} className={clsx(fresh === index && styles['scanner__row--new'])}>
                      <td className={styles.scanner__td}>{tag.id}</td>
                      <td className={styles.scanner__td}>{tag.size}</td>
                      <td className={clsx(styles.scanner__td, styles['scanner__td--ok'])}>
                        ✓ {tag.count} {copy.pieces}
                      </td>
                    </tr>
                  ) : (
                    <tr key={tag.id}>
                      <td className={clsx(styles.scanner__td, styles['scanner__td--empty'])}>{copy.empty}</td>
                      <td className={clsx(styles.scanner__td, styles['scanner__td--empty'])}>{copy.emptyShort}</td>
                      <td className={clsx(styles.scanner__td, styles['scanner__td--empty'])}>{copy.pending}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.scanner__foot}>
            <span className={styles.scanner__status} role="status">
              {status}
            </span>
            <button type="button" className={styles.scanner__reset} onClick={reset}>
              {copy.reset}
            </button>
          </div>
        </div>
      </div>
      <div ref={laserRef} className={clsx(styles.scanner__laser, reading && styles['scanner__laser--reading'])} aria-hidden="true">
        <b className={styles.scanner__beam} />
        <em className={styles.scanner__read} />
        <i className={styles.scanner__spot} />
      </div>
    </div>
  );
};

export default TibiaScanner;
