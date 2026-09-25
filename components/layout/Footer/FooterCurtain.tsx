'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo/Logo';
import BaseLangSwitch from '@/components/ui/BaseLangSwitch/BaseLangSwitch';
import { FOOTER_COPYRIGHT, FOOTER_EMAIL, FOOTER_LINKS, FOOTER_TAGLINE } from '@/data/site';
import FooterLink from './FooterLink';
import styles from './FooterCurtain.module.scss';

// Подвал-шторка: лежит под страницей, контент уезжает вверх и открывает его.
// Страница должна перекрывать подвал: атрибут на <html> поднимает <main> над ним (стили в модуле).
const FooterCurtain = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.footer = 'curtain';
    return () => {
      delete root.dataset.footer;
    };
  }, []);

  return (
    <footer className={styles.curtain}>
      <div className={styles.curtain__inner}>
        <div className={styles.curtain__brand}>
          <Link href="/" className={styles.curtain__logo} aria-label="Flame Dev">
            <Logo variant="footer" />
          </Link>
          <p className={styles.curtain__tagline}>{FOOTER_TAGLINE}</p>
          <a href={`mailto:${FOOTER_EMAIL}`} className={styles.curtain__email}>
            {FOOTER_EMAIL}
          </a>
        </div>
        <div className={styles.curtain__side}>
          <nav className={styles.curtain__links} aria-label="Подвал">
            {FOOTER_LINKS.map((item) => (
              <FooterLink key={item.href} item={item} className={styles.curtain__link} />
            ))}
          </nav>
          <div className={styles.curtain__meta}>
            <BaseLangSwitch />
            <span>{FOOTER_COPYRIGHT}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCurtain;
