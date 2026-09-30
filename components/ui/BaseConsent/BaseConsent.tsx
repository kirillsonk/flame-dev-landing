'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { CONSENT_CHECKBOX, LEGAL_LINKS } from '@/data/legal';
import styles from './BaseConsent.module.scss';

export interface BaseConsentProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
}

// Согласие на обработку персональных данных перед отправкой заявки: по умолчанию не отмечено,
// ссылки открывают документы в новой вкладке, чтобы не потерять заполненную форму
const BaseConsent = ({ id, checked, onChange, error, disabled }: BaseConsentProps) => {
  const { t } = useLocale();
  return (
    <div className={styles.consent}>
      <label className={clsx(styles.consent__label, error && styles['consent__label--error'])} htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className={styles.consent__input}
          checked={checked}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={event => onChange(event.target.checked)}
        />
        <span className={styles.consent__box} aria-hidden="true" />
        <span className={styles.consent__text}>
          {t(CONSENT_CHECKBOX.before)}{' '}
          <Link href={LEGAL_LINKS.consent.href} target="_blank">{t(CONSENT_CHECKBOX.consent)}</Link>{' '}
          {t(CONSENT_CHECKBOX.middle)}{' '}
          <Link href={LEGAL_LINKS.privacy.href} target="_blank">{t(CONSENT_CHECKBOX.policy)}</Link>
        </span>
      </label>
      {error && <p id={`${id}-error`} className={styles.consent__error} role="alert">{error}</p>}
    </div>
  );
};

export default BaseConsent;
