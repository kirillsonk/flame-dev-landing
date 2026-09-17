'use client';

import clsx from 'clsx';
import { WHY_BRAND, WHY_PARTS, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyChord from './hooks/useWhyChord';
import styles from './WhyChord.module.scss';

const KEY_MODS = ['chord__key--1', 'chord__key--2', 'chord__key--3'];

// Вариант «Аккорд»: три волны разной частоты по скроллу совпадают в одну волну Flame.
const WhyChord = () => {
  const { rootRef, canvasRef } = useWhyChord();

  return (
    <section ref={rootRef} className={styles.chord}>
      <div className={styles.chord__head}>
        <h2 className={styles.chord__title}>{WHY_TITLE}</h2>
        <div className={styles.chord__legend} aria-hidden="true">
          <div className={clsx(styles.chord__keys, styles['chord__keys--many'])} data-part="many">
            {WHY_PARTS.map((label, index) => (
              <span key={label} className={clsx(styles.chord__key, styles[KEY_MODS[index]])}>
                <i className={styles.chord__line} />
                {label}
              </span>
            ))}
          </div>
          <div className={clsx(styles.chord__keys, styles['chord__keys--one'])} data-part="one">
            <span className={clsx(styles.chord__key, styles['chord__key--brand'])}>
              <i className={clsx(styles.chord__line, styles['chord__line--brand'])} />
              {WHY_BRAND}
            </span>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className={styles.chord__canvas} aria-hidden="true" />
      <WhyCards
        image="start"
        classNames={{
          list: styles.chord__cards,
          card: styles.chord__card,
          featured: styles['chord__card--featured'],
          image: styles.chord__image,
        }}
      />
    </section>
  );
};

export default WhyChord;
