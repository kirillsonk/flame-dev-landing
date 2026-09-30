'use client';

import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';
import Logo from '@/components/ui/Logo/Logo';
import { FOOTER_EMAIL, FOOTER_LINKS } from '@/data/site';
import { LEGAL_LINKS } from '@/data/legal';
import styles from './Footer.module.scss';

const Footer = () => {
  const { t } = useLocale();
  return (
    <footer className={styles.footer} data-site-footer>
      <div className={styles.footer__inner}>
        <div className={styles.footer__brand}>
          <Link href="/" className={styles.footer__logo} aria-label="Flame dev">
            <Logo variant="footer" />
          </Link>
          <a href={`mailto:${FOOTER_EMAIL}`} className={styles.footer__email}>{FOOTER_EMAIL}</a>
        </div>
        <div className={styles.footer__side}>
          <nav className={styles.footer__links} aria-label={t('Подвал')}>
            {FOOTER_LINKS.map((item) => {
              const external = item.href.startsWith('http');
              return (
                <a key={item.href} href={item.href} className={styles.footer__link} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                  {t(item.label)}
                </a>
              );
            })}
          </nav>
          <div className={styles.footer__legal}>
            {Object.values(LEGAL_LINKS).map(link => <Link key={link.href} href={link.href} className={styles.footer__legalLink}>{t(link.label)}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
