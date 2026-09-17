'use client';

import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { AI_DOCUMENTS as copy, AI_TONE_ORDER } from '@/data/demosAi';
import type { IAiDocument } from '@/data/demosAi';
import AiButton from './AiButton';
import AiField from './AiField';
import useAiDocuments from './hooks/useAiDocuments';
import tones from './AiTones.module.scss';
import styles from './AiDocuments.module.scss';

const LINES = Array.from({ length: 14 }, (_, index) => (index ? 40 + ((index * 37) % 55) : 60));

const FileTile = ({ doc }: { doc: IAiDocument }) => (
  <>
    <span className={clsx(styles.documents__icon, tones[`tone--${doc.tone}`])} aria-hidden="true">
      <span className={styles.documents__ext}>{doc.ext}</span>
    </span>
    <span className={styles.documents__file}>
      <span className={styles.documents__name}>{doc.name}</span>
      <span className={styles.documents__meta}>{doc.meta}</span>
    </span>
  </>
);

// AI · классификатор документов: файл перетаскивают (или нажимают) в зону — тип, реквизиты и маршрут.
const AiDocuments = () => {
  const {
    doc,
    drag,
    firstTileRef,
    isFieldShown,
    processed,
    ref,
    reset,
    routeShown,
    scanning,
    tileHandlers,
    typeShown,
    zoneRef,
  } = useAiDocuments();

  return (
    <div ref={ref} className={styles.documents}>
      <section className={styles.documents__files} aria-label={copy.filesLabel}>
        <span className={styles.documents__hint}>{copy.filesHint}</span>
        {copy.docs.map((item, index) => (
          <button
            key={item.name}
            ref={index === 0 ? firstTileRef : undefined}
            type="button"
            className={clsx(
              styles.documents__tile,
              processed.includes(index) && styles['documents__tile--done'],
              drag?.index === index && styles['documents__tile--dragging'],
            )}
            {...tileHandlers(index)}
          >
            <FileTile doc={item} />
          </button>
        ))}
      </section>
      <section
        ref={zoneRef}
        className={clsx(
          styles.documents__zone,
          drag?.over && styles['documents__zone--over'],
          doc && styles['documents__zone--full'],
        )}
        aria-label={copy.zoneLabel}
        aria-live="polite"
      >
        {doc ? (
          <>
            <div className={styles.documents__paper} aria-hidden="true">
              {LINES.map((width, index) => (
                <i
                  key={index}
                  className={clsx(styles.documents__line, !index && styles['documents__line--head'])}
                  style={{ width: `${width}%` }}
                />
              ))}
              {doc.fields.map((field, index) => (
                <i
                  key={field.label}
                  className={clsx(
                    styles.documents__box,
                    tones[`tone--${AI_TONE_ORDER[index]}`],
                    isFieldShown(index) && styles['documents__box--on'],
                  )}
                  style={{
                    left: `${field.box[0]}%`,
                    top: `${field.box[1]}%`,
                    width: `${field.box[2]}%`,
                    height: `${field.box[3]}%`,
                  }}
                />
              ))}
              {scanning && <i className={styles.documents__scan} />}
            </div>
            <div className={styles.documents__result}>
              <span className={styles.documents__hint}>{doc.name}</span>
              <div className={styles.documents__type}>
                {typeShown ? (
                  <>
                    <b className={styles.documents__typeName}>{doc.type}</b>
                    <span className={styles.documents__confidence}>{copy.confidence(doc.confidence)}</span>
                  </>
                ) : (
                  <b className={styles.documents__typeName}>{copy.detecting}</b>
                )}
              </div>
              {doc.fields.map((field, index) => (
                <AiField
                  key={field.label}
                  name={field.label}
                  value={field.value}
                  tone={AI_TONE_ORDER[index]}
                  hidden={!isFieldShown(index)}
                />
              ))}
              <span className={styles.documents__route}>{routeShown ? doc.route : ''}</span>
              <AiButton variant="ghost" className={styles.documents__reset} onClick={reset}>
                {copy.reset}
              </AiButton>
            </div>
          </>
        ) : (
          <div className={styles.documents__idle}>
            <b className={styles.documents__typeName}>{copy.idleTitle}</b>
            <span>{copy.idleText}</span>
          </div>
        )}
      </section>
      {drag &&
        createPortal(
          <div className={styles.documents__ghost} style={{ left: drag.x - 40, top: drag.y - 24 }} aria-hidden="true">
            <FileTile doc={copy.docs[drag.index]} />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AiDocuments;
