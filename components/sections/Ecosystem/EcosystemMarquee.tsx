'use client';

import clsx from 'clsx';
import { ECOSYSTEM_CARDS, ECOSYSTEM_MARQUEE, ECOSYSTEM_TITLE } from '@/data/why';
import EcosystemLink from './EcosystemLink';
import useEcosystemMarquee from './hooks/useEcosystemMarquee';
import styles from './EcosystemMarquee.module.scss';

const REPEATS = Array.from({ length: ECOSYSTEM_MARQUEE.repeat }, (_, index) => index);

// Вариант «Бегущие строки»: как в кейсах, две display-строки едут навстречу по скроллу —
// заголовок и названия продуктов контуром. На последней трети карточки со ссылками
// поднимаются снизу, строки уходят в фон. На мобильном строки стоят, карточки столбиком.
const EcosystemMarquee = () => {
  const { sectionRef } = useEcosystemMarquee();

  return (
    <section ref={sectionRef} className={styles.marquee}>
      <h2 className={styles.marquee__title}>{ECOSYSTEM_TITLE}</h2>
      <div className={styles.marquee__rows} aria-hidden="true">
        <div className={styles.marquee__row} data-part="row">
          {REPEATS.map((index) => (
            <span key={index} className={styles.marquee__item}>
              {ECOSYSTEM_TITLE}
              <i className={styles.marquee__sep}>{ECOSYSTEM_MARQUEE.separator}</i>
            </span>
          ))}
        </div>
        <div className={clsx(styles.marquee__row, styles['marquee__row--outline'])} data-part="row">
          {REPEATS.map((index) =>
            ECOSYSTEM_CARDS.map((card) => (
              <span key={`${index}-${card.href}`} className={styles.marquee__item}>
                {card.title}
                <i className={styles.marquee__sep}>{ECOSYSTEM_MARQUEE.separator}</i>
              </span>
            )),
          )}
        </div>
      </div>
      <div className={styles.marquee__cards} data-part="cards">
        {ECOSYSTEM_CARDS.map((card) => (
          <EcosystemLink key={card.href} card={card} className={styles.marquee__card} />
        ))}
      </div>
    </section>
  );
};

export default EcosystemMarquee;
