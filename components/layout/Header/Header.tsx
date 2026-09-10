'use client';

import clsx from 'clsx';
import Logo from '@/components/ui/Logo/Logo';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_LABEL, NAV } from '@/data/site';
import useHeaderState from './hooks/useHeaderState';
import styles from './Header.module.scss';

const Header = () => {
  const { scrolled, menuOpen, toggleMenu, closeMenu } = useHeaderState();

  return (
    <header className={clsx(styles.header, scrolled && styles['header--scrolled'], menuOpen && styles['header--open'])}>
      <div className={styles.header__inner}>
        <a href="#top" className={styles.header__logo} onClick={closeMenu}>
          <Logo />
        </a>

        <nav className={styles.header__nav} aria-label="Разделы">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.header__link} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <span className={styles.header__lang} aria-label="Язык">RU / EN</span>
          <BaseButton href="#contact" className={styles.header__cta} onClick={closeMenu}>
            {CTA_LABEL}
          </BaseButton>
        </nav>

        <div className={styles.header__mobile}>
          <span className={styles.header__lang}>RU</span>
          <button type="button" className={styles.header__burger} aria-expanded={menuOpen} aria-label="Меню" onClick={toggleMenu}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
