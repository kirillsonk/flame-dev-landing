import clsx from 'clsx';
import { WHY_CARDS, WHY_TITLE } from '@/data/why';
import styles from './Why.module.scss';

const Why = () => {
  return (
    <section className={styles.why}>
      <h2 className={styles.why__title} data-reveal>{WHY_TITLE}</h2>
      <div className={styles.why__grid} role="list">
        {WHY_CARDS.map((card) => (
          <article key={card.title} className={clsx(styles.why__card, card.featured && styles['why__card--featured'])} data-reveal>
            <h3 className={styles.why__cardTitle}>{card.title}</h3>
            <p className={styles.why__cardText}>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Why;
