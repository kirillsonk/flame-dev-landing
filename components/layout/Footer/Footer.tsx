import Link from 'next/link';
import Logo from '@/components/ui/Logo/Logo';
import BaseLangSwitch from '@/components/ui/BaseLangSwitch/BaseLangSwitch';
import { FOOTER_EMAIL, FOOTER_LINKS } from '@/data/site';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__brand}>
          <Link href="/" className={styles.footer__logo} aria-label="Flame Dev">
            <Logo variant="footer" />
          </Link>
          <a href={`mailto:${FOOTER_EMAIL}`} className={styles.footer__email}>{FOOTER_EMAIL}</a>
        </div>
        <nav className={styles.footer__links} aria-label="Подвал">
          {FOOTER_LINKS.map((item) => {
            const external = item.href.startsWith('http');
            return (
              <a key={item.href} href={item.href} className={styles.footer__link} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {item.label}
              </a>
            );
          })}
          <BaseLangSwitch />
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
