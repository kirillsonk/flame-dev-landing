import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import { NO_RECORD } from '@/components/layout/Metrika/metrikaConfig';
import styles from './BaseInput.module.scss';

interface BaseInputCommonProps {
  label: string;
  error?: string;
  /** Пометка справа от подписи, например «по желанию». */
  note?: string;
  className?: string;
}

type InputProps = BaseInputCommonProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaProps = BaseInputCommonProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export type BaseInputProps = InputProps | TextareaProps;

// Строка под полем есть всегда: ошибка и счётчик появляются в зарезервированной высоте,
// поэтому валидация не сдвигает форму.
const BaseInput = ({ label, error, note, className, multiline, id, name, ...rest }: BaseInputProps) => {
  const fieldId = id ?? name;
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  const length = String(rest.value ?? '').length;
  const a11y = { 'aria-invalid': error ? true : undefined, 'aria-describedby': errorId };

  return (
    <div className={clsx(styles.field, error && styles['field--error'], className)}>
      <div className={styles.field__head}>
        <label htmlFor={fieldId} className={styles.field__label}>
          {label}
        </label>
        {note && <span className={styles.field__note}>{note}</span>}
      </div>
      <div className={styles.field__box}>
        {multiline ? (
          <textarea id={fieldId} name={name} className={clsx(styles.field__control, styles['field__control--multiline'], NO_RECORD)} {...a11y} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input id={fieldId} name={name} className={clsx(styles.field__control, NO_RECORD)} {...a11y} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
        )}
        <span className={styles.field__line} aria-hidden="true" />
      </div>
      <div className={styles.field__meta}>
        <span id={errorId} className={styles.field__error} aria-live="polite">
          {error && (
            <span key={error} className={styles.field__message}>
              {error}
            </span>
          )}
        </span>
        {multiline && rest.maxLength !== undefined && (
          <span className={styles.field__counter} aria-hidden="true">
            {length} / {rest.maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default BaseInput;
