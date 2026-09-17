'use client';

import { Formik, Form } from 'formik';
import clsx from 'clsx';
import BaseInput from '@/components/ui/BaseInput/BaseInput';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import { CONTACT } from '@/data/site';
import useLeadSubmit from './hooks/useLeadSubmit';
import { LEAD_INITIAL_VALUES, LEAD_MESSAGE_MAX, leadValidationSchema, type LeadSource } from './LeadForm.validationSchema';
import styles from './LeadForm.module.scss';

export interface LeadFormProps {
  source?: LeadSource;
  compact?: boolean;
  className?: string;
}

const COPY = CONTACT.form;

// Форма и экран «спасибо» лежат в одной ячейке грида: после отправки высота блока не меняется.
const LeadForm = ({ source = 'form', compact = false, className }: LeadFormProps) => {
  const { status, submit, reset } = useLeadSubmit();
  const idPrefix = `lead-${source}`;
  const done = status === 'success';

  return (
    <div className={clsx(styles.lead, done && styles['lead--done'], compact && styles['lead--compact'], className)}>
      <Formik
        initialValues={{ ...LEAD_INITIAL_VALUES, source }}
        validationSchema={leadValidationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (await submit(values)) resetForm();
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className={styles.form} noValidate inert={done}>
            <BaseInput
              id={`${idPrefix}-name`}
              name="name"
              label={COPY.name.label}
              placeholder={COPY.name.placeholder}
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name ? errors.name : undefined}
            />
            <BaseInput
              id={`${idPrefix}-contact`}
              name="contact"
              label={COPY.contact.label}
              placeholder={COPY.contact.placeholder}
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
                note={COPY.optional}
                label={COPY.message.label}
                placeholder={COPY.message.placeholder}
                multiline
                maxLength={LEAD_MESSAGE_MAX}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message ? errors.message : undefined}
              />
            )}
            <div className={styles.form__footer}>
              <BaseButton type="submit" className={styles.form__submit} disabled={status === 'sending'} block={compact}>
                {status === 'sending' ? COPY.sending : COPY.submit}
              </BaseButton>
              <div className={styles.form__status} aria-live="polite">
                <p className={clsx(styles.form__hint, status === 'error' && styles['form__hint--hidden'])}>{COPY.hint}</p>
                <p className={clsx(styles.form__error, status !== 'error' && styles['form__error--hidden'])}>
                  {COPY.error}{' '}
                  <a href={CONTACT.telegram.href} target="_blank" rel="noreferrer" tabIndex={status === 'error' ? undefined : -1}>
                    {COPY.errorLink}
                  </a>
                </p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div className={styles.lead__done} role="status" inert={!done}>
        {done && (
          <>
            <span className={styles.lead__check} aria-hidden="true">
              <BaseIcon name="check" className={styles.lead__icon} />
            </span>
            <p className={styles.lead__title}>{COPY.successTitle}</p>
            <p className={styles.lead__text}>{COPY.successText}</p>
            {!compact && (
              <BaseButton variant="ghost" className={styles.lead__again} onClick={reset}>
                {COPY.again}
              </BaseButton>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeadForm;
