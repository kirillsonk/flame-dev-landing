'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useLocale } from '@/components/i18n/LocaleProvider';
import useInView from '@/hooks/useInView';
import { CLIENT_BRANDS, CLIENT_STRIP } from '@/data/clients';
import styles from './ClientStrip.module.scss';

const ClientStrip = () => {
  const { t } = useLocale();
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '0px', threshold: 0 });
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setHidden(document.hidden);
      setReducedMotion(motion.matches);
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  return (
    <section ref={ref} className={styles.clients} aria-label={t(CLIENT_STRIP.title)} data-running={inView && !hidden && !paused}>
      <div className={styles.clients__viewport} tabIndex={reducedMotion ? 0 : undefined} role={reducedMotion ? 'group' : undefined} aria-label={reducedMotion ? t(CLIENT_STRIP.title) : undefined}>
        <div className={styles.clients__track}>
          {[false, true].map(duplicate => (
            <ul key={String(duplicate)} className={styles.clients__group} aria-hidden={duplicate || undefined}>
              {CLIENT_BRANDS.map(brand => (
                <li key={brand.id} className={styles.clients__brand}>
                  <Image
                    className={clsx(brand.caption ? styles.clients__icon : styles.clients__logo, (brand.id === 'tbank' || brand.id === 'rostelecom') && styles['clients__logo--padded'])}
                    src={`/brands/${brand.id}.${brand.extension ?? 'svg'}`}
                    alt={brand.caption || duplicate ? '' : t(brand.name)}
                    width={brand.width}
                    height={brand.height}
                  />
                  {brand.caption && <span>{t(brand.caption)}</span>}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        className={styles.clients__pause}
        type="button"
        onClick={() => setPaused(value => !value)}
        aria-pressed={paused}
        aria-label={t(paused ? CLIENT_STRIP.resume : CLIENT_STRIP.pause)}
        title={t(paused ? CLIENT_STRIP.resume : CLIENT_STRIP.pause)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M4 2.5v11L13 8z" /> : <path d="M4 2.5h2.5v11H4zm5.5 0H12v11H9.5z" />}
        </svg>
      </button>
    </section>
  );
};

export default ClientStrip;
