import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE } from '@/data/why';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import styles from './Ecosystem.module.scss';

// Тонкая строка о других продуктах Flame под формой: не отнимает место у основного сайта
const Ecosystem = () => {
  return (
    <aside className={styles.ecosystem} id="ecosystem" aria-labelledby="ecosystem-title">
      <p className={styles.ecosystem__title} id="ecosystem-title">{ECOSYSTEM_TITLE}</p>
      <div className={styles.ecosystem__links}>
        {ECOSYSTEM_CARDS.map((card) => (
          <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={styles.ecosystem__link}>
            <span className={styles.ecosystem__name}>{card.title}</span>
            <span className={styles.ecosystem__text}>{card.description}</span>
            <BaseArrow className={styles.ecosystem__arrow} />
          </a>
        ))}
      </div>
    </aside>
  );
};

export default Ecosystem;
