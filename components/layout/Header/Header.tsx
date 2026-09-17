'use client';

import Link from 'next/link';
import clsx from 'clsx';
import Logo from '@/components/ui/Logo/Logo';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import BaseLangSwitch from '@/components/ui/BaseLangSwitch/BaseLangSwitch';
import CtaButton from '@/components/cta/CtaButton/CtaButton';
import useStoredVariant from '@/components/layout/VariantPanel/hooks/useStoredVariant';
import { CONTACT, NAV } from '@/data/site';
import HeaderStrip from './HeaderStrip';
import useHeaderState from './hooks/useHeaderState';
import useHeaderBlob from './hooks/useHeaderBlob';
import { parseHeader } from './variants';
import styles from './Header.module.scss';

// Шапке «Контакты» нужны только мессенджер и почта, презентация остаётся в контактах.
const HEADER_CONTACTS = CONTACT.links.filter((link) => link.icon !== 'deck');

const Header = () => {
  const { value } = useStoredVariant('header');
  const variant = parseHeader(value);
  const { menuOpen, compact, progressRef, toggleMenu, closeMenu } = useHeaderState();
  const { linksRef, blobRef, onLinkEnter, onLinksLeave } = useHeaderBlob(variant === 'blob');
  const blob = variant === 'blob';

  return (
    <>
      {variant === 'strip' && <HeaderStrip />}
      <header className={clsx(styles.header, styles[`header--${variant}`], menuOpen && styles['header--open'], compact && styles['header--compact'])}>
        <div className={styles.header__inner}>
          <Link href="/" className={styles.header__logo} onClick={closeMenu} aria-label="Flame Dev">
            <Logo />
          </Link>

          <nav id="header-nav" className={styles.header__nav} aria-label="Разделы">
            <div ref={linksRef} className={styles.header__links} onMouseLeave={blob ? onLinksLeave : undefined}>
              {blob && <span ref={blobRef} className={styles.header__blob} aria-hidden="true" />}
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className={styles.header__link} onClick={closeMenu} onMouseEnter={blob ? onLinkEnter : undefined}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className={styles.header__actions}>
              <BaseLangSwitch className={styles.header__lang} />
              {variant === 'contacts' && (
                <div className={styles.header__contacts}>
                  {HEADER_CONTACTS.map((link) => {
                    const external = link.href.startsWith('http');
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={styles.header__contact}
                        aria-label={link.label}
                        title={link.label}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                      >
                        <BaseIcon name={link.icon} className={styles.header__contactIcon} />
                      </a>
                    );
                  })}
                </div>
              )}
              <CtaButton className={styles.header__cta} onClick={closeMenu} />
            </div>
          </nav>

          <div className={styles.header__mobile}>
            <BaseLangSwitch />
            <button
              type="button"
              className={styles.header__burger}
              aria-expanded={menuOpen}
              aria-controls="header-nav"
              aria-label="Меню"
              onClick={toggleMenu}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={styles.header__progress} aria-hidden="true">
          <span ref={progressRef} className={styles.header__read} />
        </div>
      </header>
    </>
  );
};

export default Header;
