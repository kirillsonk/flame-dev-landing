import Logo from '@/components/ui/Logo/Logo';
import { FOOTER_LINKS } from '@/data/site';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <a href="#top" className={styles.footer__logo}>
          <Logo variant="footer" />
        </a>
        <nav className={styles.footer__links} aria-label="Ссылки">
          {FOOTER_LINKS.map((item) => {
            const external = item.href.startsWith('http');
            return (
              <a key={item.href} href={item.href} className={styles.footer__link} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {item.label}
              </a>
            );
          })}
          <span className={styles.footer__link}>RU / EN</span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
