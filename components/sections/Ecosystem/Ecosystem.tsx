import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE } from '@/data/why';
import styles from './Ecosystem.module.scss';

const Ecosystem = () => {
  return (
    <section className={styles.ecosystem} id="ecosystem" aria-labelledby="ecosystem-title">
      <h2 className={styles.ecosystem__title} id="ecosystem-title" data-reveal>{ECOSYSTEM_TITLE}</h2>
      <div className={styles.ecosystem__links}>
        {ECOSYSTEM_CARDS.map((card) => (
          <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={styles.ecosystem__link} data-reveal>
            <span className={styles.ecosystem__linkTitle}>{card.title} <span aria-hidden="true">↗</span></span>
            <span className={styles.ecosystem__linkText}>{card.description}</span>
            <span className={styles.ecosystem__linkUrl}>{card.label.replace(/ →$/, '')}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Ecosystem;
