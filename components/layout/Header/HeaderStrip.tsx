import Link from 'next/link';
import { HEADER_STRIP } from '@/data/site';
import styles from './HeaderStrip.module.scss';

// Шапка «Строка-обещание»: полоса над шапкой в потоке страницы, уезжает при прокрутке.
const HeaderStrip = () => {
  return (
    <div className={styles.strip}>
      <span className={styles.strip__dot} aria-hidden="true" />
      <span className={styles.strip__text}>{HEADER_STRIP.text}</span>
      <Link href="/#contact" className={styles.strip__link}>
        {HEADER_STRIP.link}
      </Link>
    </div>
  );
};

export default HeaderStrip;
