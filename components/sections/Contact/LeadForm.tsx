'use client';

import { Formik, Form } from 'formik';
import clsx from 'clsx';
import BaseInput from '@/components/ui/BaseInput/BaseInput';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CONTACT } from '@/data/site';
import useLeadSubmit from './hooks/useLeadSubmit';
import { LEAD_INITIAL_VALUES, leadValidationSchema, type LeadSource } from './LeadForm.validationSchema';
import styles from './LeadForm.module.scss';

export interface LeadFormProps {
  source?: LeadSource;
  compact?: boolean;
  className?: string;
}

const LeadForm = ({ source = 'form', compact = false, className }: LeadFormProps) => {
  const { status, submit } = useLeadSubmit();
  const idPrefix = `lead-${source}`;

  if (status === 'success') {
    return (
      <div className={clsx(styles.form, styles['form--done'], className)} role="status">
        <p className={styles.form__success}>Спасибо, ответим в течение дня.</p>
      </div>
    );
  }

  return (
    <Formik initialValues={{ ...LEAD_INITIAL_VALUES, source }} validationSchema={leadValidationSchema} onSubmit={submit}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className={clsx(styles.form, compact && styles['form--compact'], className)} noValidate>
          <BaseInput
            id={`${idPrefix}-name`}
            name="name"
            label="Имя"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
          />
          <BaseInput
            id={`${idPrefix}-contact`}
            name="contact"
            label="Telegram или почта"
            autoComplete="email"
            value={values.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contact ? errors.contact : undefined}
          />
          {!compact && (
            <BaseInput
              id={`${idPrefix}-message`}
              name="message"
              label="Коротко о задаче"
              multiline
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.message ? errors.message : undefined}
            />
          )}
          <BaseButton type="submit" disabled={status === 'sending'} block={compact}>
            {status === 'sending' ? 'Отправляем…' : 'Отправить'}
          </BaseButton>
          {status === 'error' && (
            <p className={styles.form__error} role="alert">
              Не отправилось. Напишите нам напрямую:{' '}
              <a href={CONTACT.telegram.href} target="_blank" rel="noreferrer">
                Telegram
              </a>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LeadForm;
