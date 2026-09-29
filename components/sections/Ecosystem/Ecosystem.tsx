import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE } from '@/data/why';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import EcosystemLogo from './EcosystemLogo';
import styles from './Ecosystem.module.scss';

// Синяя лента поперек экрана под формой: другие продукты Flame логотипами, не отнимает место у основного сайта
const Ecosystem = () => {
  return (
    <aside className={styles.ecosystem} id="ecosystem" aria-labelledby="ecosystem-title">
      <div className={styles.ecosystem__inner}>
        <p className={styles.ecosystem__title} id="ecosystem-title">{ECOSYSTEM_TITLE}</p>
        <div className={styles.ecosystem__links}>
          {ECOSYSTEM_CARDS.map((card) => (
            <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={styles.ecosystem__link}>
              {card.logo ? <EcosystemLogo name={card.logo} title={card.title} /> : <span className={styles.ecosystem__name}>{card.title}</span>}
              <span className={styles.ecosystem__text}>{card.description}</span>
              <BaseArrow className={styles.ecosystem__arrow} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Ecosystem;
