import Link from 'next/link';
import Logo from '@/components/ui/Logo/Logo';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import BaseLangSwitch from '@/components/ui/BaseLangSwitch/BaseLangSwitch';
import { FOOTER_CHIPS, FOOTER_COPYRIGHT, FOOTER_LINKS } from '@/data/site';
import FooterLink from './FooterLink';
import styles from './FooterChips.module.scss';

// Вариант «Контакты-плашки»: Telegram, почта и презентация крупными плашками с подписями.
const FooterChips = () => {
  return (
    <footer className={styles.chips}>
      <div className={styles.chips__inner}>
        <div className={styles.chips__top}>
          <Link href="/" className={styles.chips__logo} aria-label="Flame Dev">
            <Logo variant="footer" />
          </Link>
          <ul className={styles.chips__list}>
            {FOOTER_CHIPS.map((chip) => (
              <li key={chip.href} className={styles.chips__item}>
                <FooterLink item={chip} className={styles.chips__chip}>
                  <BaseIcon name={chip.icon} className={styles.chips__icon} />
                  {chip.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.chips__bottom}>
          <span className={styles.chips__copy}>{FOOTER_COPYRIGHT}</span>
          <nav className={styles.chips__links} aria-label="Подвал">
            {FOOTER_LINKS.map((item) => (
              <FooterLink key={item.href} item={item} className={styles.chips__link} />
            ))}
            <BaseLangSwitch />
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterChips;
