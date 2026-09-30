'use client';

import { useLocale } from '@/components/i18n/LocaleProvider';
import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE } from '@/data/why';
import EcosystemLogo from './EcosystemLogo';
import styles from './Ecosystem.module.scss';

// Заголовок над компактной синей лентой: другие продукты Flame не отнимают место у основного сайта
const Ecosystem = () => {
  const { t } = useLocale();
  return (
    <aside className={styles.ecosystem} id="ecosystem" aria-labelledby="ecosystem-title">
      <div className={styles.ecosystem__heading}>
        <p className={styles.ecosystem__title} id="ecosystem-title">{t(ECOSYSTEM_TITLE)}</p>
      </div>
      <div className={styles.ecosystem__band}>
        <div className={styles.ecosystem__inner}>
          <div className={styles.ecosystem__links}>
            {ECOSYSTEM_CARDS.map((card) => (
              <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={styles.ecosystem__link} aria-label={card.title}>
                {card.logo ? <EcosystemLogo name={card.logo} title={card.title} /> : <span className={styles.ecosystem__name}>{card.title}</span>}
                <span className={styles.ecosystem__text}>{t(card.description)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Ecosystem;
