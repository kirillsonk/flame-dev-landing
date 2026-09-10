import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './BaseInput.module.scss';

interface BaseInputCommonProps {
  label: string;
  error?: string;
  className?: string;
}

type InputProps = BaseInputCommonProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaProps = BaseInputCommonProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export type BaseInputProps = InputProps | TextareaProps;

const BaseInput = ({ label, error, className, multiline, id, name, ...rest }: BaseInputProps) => {
  const fieldId = id ?? name;
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  const a11y = { 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId : undefined };

  return (
    <div className={clsx(styles.field, error && styles['field--error'], className)}>
      <label htmlFor={fieldId} className={styles.field__label}>
        {label}
      </label>
      {multiline ? (
        <textarea id={fieldId} name={name} className={clsx(styles.field__control, styles['field__control--multiline'])} {...a11y} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={fieldId} name={name} className={styles.field__control} {...a11y} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && (
        <span id={errorId} className={styles.field__error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default BaseInput;
