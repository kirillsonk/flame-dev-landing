'use client';

import type { ReactNode } from 'react';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { STUDIO } from '@/data/studio';
import Brief from './Brief';
import styles from './Brief.module.scss';

export interface BriefContactProps { children?: ReactNode }

const BriefContact = ({ children }: BriefContactProps) => {
  const { t } = useLocale();
  return (
    <div className={styles.contactGroup}>
      <section className={styles.contact} id="contact" aria-labelledby="contact-title">
        <div className={styles.contact__inner}>
          <div className={styles.contact__intro}>
            <h2 id="contact-title">{t(STUDIO.contact.title)}</h2>
          </div>
          <div className={styles.contact__form}><Brief /></div>
        </div>
      </section>
      {children}
    </div>
  );
};
export default BriefContact;
