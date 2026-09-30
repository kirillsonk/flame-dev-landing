import Link from 'next/link';
import Logo from '@/components/ui/Logo/Logo';
import { FOOTER_ABOUT, FOOTER_COLUMNS, FOOTER_COPYRIGHT } from '@/data/site';
import FooterLink from './FooterLink';
import styles from './FooterColumns.module.scss';

// Вариант «Колонки»: кто мы, разделы и контакты, снизу копирайт.
const FooterColumns = () => {
  return (
    <footer className={styles.columns}>
      <div className={styles.columns__inner}>
        <div className={styles.columns__grid}>
          <div className={styles.columns__brand}>
            <Link href="/" className={styles.columns__logo} aria-label="Flame dev">
              <Logo variant="footer" />
            </Link>
            <p className={styles.columns__about}>{FOOTER_ABOUT}</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} className={styles.columns__column} aria-label={column.title}>
              <p className={styles.columns__title}>{column.title}</p>
              <ul className={styles.columns__list}>
                {column.links.map((item) => (
                  <li key={item.href}>
                    <FooterLink item={item} className={styles.columns__link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.columns__bottom}>
          <span>{FOOTER_COPYRIGHT}</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterColumns;
