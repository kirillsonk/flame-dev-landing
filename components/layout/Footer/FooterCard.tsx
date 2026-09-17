import Link from 'next/link';
import Logo from '@/components/ui/Logo/Logo';
import BaseLangSwitch from '@/components/ui/BaseLangSwitch/BaseLangSwitch';
import CtaButton from '@/components/cta/CtaButton/CtaButton';
import { FOOTER_COPYRIGHT, FOOTER_EMAIL, FOOTER_LINKS } from '@/data/site';
import FooterLink from './FooterLink';
import styles from './FooterCard.module.scss';

// Вариант «Карточка»: подвал — отдельная панель с отступом от краёв, как карточки на сайте.
const FooterCard = () => {
  return (
    <footer className={styles.card}>
      <div className={styles.card__inner}>
        <div className={styles.card__box}>
          <div className={styles.card__brand}>
            <Link href="/" className={styles.card__logo} aria-label="Flame Dev">
              <Logo variant="footer" />
            </Link>
            <a href={`mailto:${FOOTER_EMAIL}`} className={styles.card__email}>
              {FOOTER_EMAIL}
            </a>
          </div>
          <ul className={styles.card__links}>
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <FooterLink item={item} className={styles.card__link} />
              </li>
            ))}
          </ul>
          <div className={styles.card__action}>
            <CtaButton />
          </div>
          <div className={styles.card__bottom}>
            <span>{FOOTER_COPYRIGHT}</span>
            <BaseLangSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCard;
