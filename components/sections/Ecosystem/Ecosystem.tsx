import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE } from '@/data/why';
import styles from './Ecosystem.module.scss';

const Ecosystem = () => {
  return (
    <section className={styles.ecosystem}>
      <h2 className={styles.ecosystem__title} data-reveal>{ECOSYSTEM_TITLE}</h2>
      <div className={styles.ecosystem__grid} role="list">
        {ECOSYSTEM_CARDS.map((card) => (
          <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={styles.ecosystem__card} data-reveal>
            <span className={styles.ecosystem__cardTitle}>{card.title}</span>
            <span className={styles.ecosystem__cardText}>{card.description}</span>
            <span className={styles.ecosystem__cardLink}>{card.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Ecosystem;
