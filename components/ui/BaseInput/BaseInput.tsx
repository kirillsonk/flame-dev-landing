import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './BaseInput.module.scss';

interface BaseInputCommonProps {
  label: string;
  error?: string;
  multiline?: boolean;
  className?: string;
}

type InputProps = BaseInputCommonProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false };
type TextareaProps = BaseInputCommonProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export type BaseInputProps = InputProps | TextareaProps;

const BaseInput = (props: BaseInputProps) => {
  const { label, error, className, id } = props;
  const fieldId = id ?? props.name;
  const wrapperClass = clsx(styles.field, error && styles['field--error'], className);

  if (props.multiline) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _l, error: _e, multiline: _m, className: _c, ...textareaProps } = props;
    return (
      <label className={wrapperClass} htmlFor={fieldId}>
        <span className={styles.field__label}>{label}</span>
        <textarea id={fieldId} className={clsx(styles.field__control, styles['field__control--multiline'])} {...textareaProps} />
        {error && <span className={styles.field__error}>{error}</span>}
      </label>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { label: _l, error: _e, multiline: _m, className: _c, ...inputProps } = props;
  return (
    <label className={wrapperClass} htmlFor={fieldId}>
      <span className={styles.field__label}>{label}</span>
      <input id={fieldId} className={styles.field__control} {...inputProps} />
      {error && <span className={styles.field__error}>{error}</span>}
    </label>
  );
};

export default BaseInput;
