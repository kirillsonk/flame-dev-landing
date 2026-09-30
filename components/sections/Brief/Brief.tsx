'use client';

import { useEffect, useId, useRef } from 'react';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import BaseSpinner from '@/components/ui/BaseSpinner/BaseSpinner';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { BRIEF } from '@/data/brief';
import { CONTACT } from '@/data/site';
import useBrief from '@/components/sections/Brief/hooks/useBrief';
import useSmoothHeight from '@/components/sections/Brief/hooks/useSmoothHeight';
import { NO_RECORD } from '@/components/layout/Metrika/metrikaConfig';
import BaseConsent from '@/components/ui/BaseConsent/BaseConsent';
import { CONSENT_CHECKBOX } from '@/data/legal';
import styles from './Brief.module.scss';

const Brief = () => {
  const b = useBrief();
  const { t } = useLocale();
  const id = useId();
  const frame = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const done = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);
  const success = b.status === 'success';
  useSmoothHeight(frame, success ? 'success' : b.step);
  useEffect(() => {
    if (previousStep.current !== b.step && heading.current) {
      heading.current.focus({ preventScroll: true });
      heading.current.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
    previousStep.current = b.step;
  }, [b.step]);
  // После отправки блок сжимается к сообщению об успехе. Если его верх ушел за экран, страница плавно
  // поднимается к нему, вместо того чтобы оставить посетителя у следующей секции
  useEffect(() => {
    const node = frame.current;
    if (!success || !node) return;
    done.current?.focus({ preventScroll: true });
    const margin = parseFloat(getComputedStyle(node).scrollMarginTop) || 0;
    if (node.getBoundingClientRect().top < margin) node.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [success]);
  const title = [BRIEF.typeQuestion, BRIEF.goalQuestion, BRIEF.detailTitle, BRIEF.timingQuestion, BRIEF.reviewTitle][b.step];
  const sending = b.status === 'sending';
  return (
    <div className={styles.brief} ref={frame}>
      {success ? (
        <div className={styles.brief__done} role="status">
          <span className={styles.brief__doneIcon}><BaseIcon name="check" /></span>
          <h3 className={styles.brief__question} ref={done} tabIndex={-1}>{t(BRIEF.success)}</h3>
          <p className={styles.hint}>{t(BRIEF.successText)}</p>
          <BaseButton variant="secondary" onClick={b.restart}>{t(BRIEF.another)}</BaseButton>
        </div>
      ) : (
        <form className={styles.brief__flow} onSubmit={(event) => { event.preventDefault(); if (b.step === 4) void b.submit(); else void b.next(); }}>
          <ol className={styles.brief__progress} aria-label={t(BRIEF.title)}>{BRIEF.steps.map((label, index) => <li key={label} aria-current={index === b.step ? 'step' : undefined} className={index <= b.step ? styles['brief__progress--active'] : undefined}><span className={styles.brief__sr}>{t(label)}</span></li>)}</ol>
          {b.step > 0 && b.step < 4 && <div className={styles.brief__history}><p className={styles.brief__answer}>{t(b.type)}</p>{b.step > 1 && <p className={styles.brief__answer}>{b.goal}</p>}</div>}
          <div className={styles.brief__message}><span className={styles.brief__sender}>{BRIEF.assistant}</span><h3 className={styles.brief__question} ref={heading} tabIndex={-1}>{t(title)}</h3></div>
          <div className={styles.brief__body} key={b.step}>
            {b.step === 0 && <fieldset className={styles.options}><legend className={styles.brief__sr}>{t(BRIEF.typeQuestion)}</legend>{BRIEF.types.map((value) => <label className={styles.option} key={value}><input type="radio" name={`${id}-type`} value={value} checked={b.type === value} onChange={() => b.setType(value)} /><span>{t(value)}</span></label>)}</fieldset>}
            {b.step === 1 && <label className={styles.field}><span className={styles.brief__sr}>{t(BRIEF.goalQuestion)}</span><textarea className={NO_RECORD} value={b.goal} disabled={b.busy} onChange={(event) => b.setGoal(event.target.value)} maxLength={800} placeholder={t(BRIEF.goalPlaceholder)} rows={6} required minLength={10} /></label>}
            {b.step === 2 && <><p className={styles.hint}>{t(b.ai ? BRIEF.aiLabel : BRIEF.basicLabel)}</p>{b.questionsOutdated && <div className={styles.brief__refresh}><p className={styles.hint}>{t(BRIEF.refreshHint)}</p><button type="button" className={styles.aiButton} onClick={b.refreshQuestions} disabled={b.busy}>{b.busy && <BaseSpinner />}{t(b.busy ? BRIEF.loading : BRIEF.refresh)}</button></div>}{b.questions.map((question, index) => <label key={index} className={styles.field}><span>{question}</span><textarea className={NO_RECORD} value={b.answers[index]} disabled={b.busy} onChange={(event) => b.setAnswers(b.answers.map((answer, at) => at === index ? event.target.value : answer))} maxLength={400} rows={3} placeholder={t(BRIEF.optional)} /></label>)}</>}
            {b.step === 3 && <><fieldset className={styles.options}><legend className={styles.brief__sr}>{t(BRIEF.timingQuestion)}</legend>{BRIEF.timings.map((value) => <label className={styles.option} key={value}><input type="radio" name={`${id}-timing`} checked={b.timing === value} onChange={() => b.setTiming(value)} /><span>{t(value)}</span></label>)}</fieldset>{b.timing === BRIEF.timings[0] && <label className={styles.field}><span>{t(BRIEF.dateLabel)}</span><input className={NO_RECORD} value={b.date} onChange={(event) => b.setDate(event.target.value)} maxLength={120} placeholder={t(BRIEF.datePlaceholder)} /></label>}</>}
            {b.step === 4 && <>
              {b.summaryOutdated && <div className={styles.brief__refresh}><p className={styles.hint}>{t(BRIEF.summaryChanged)}</p><button type="button" className={styles.aiButton} onClick={b.refreshSummary} disabled={sending}>{t(BRIEF.summaryRefresh)}</button></div>}
              <label className={styles.field}><span>{t(BRIEF.summaryLabel)}</span><textarea className={NO_RECORD} value={b.summary} onFocus={b.holdSummary} onChange={(event) => b.setSummary(event.target.value)} disabled={sending} maxLength={2800} rows={8} required /></label>
              <p className={styles.hint} aria-live="polite">{b.summaryPending && <BaseSpinner />}{t(b.summaryPending ? BRIEF.summaryPending : b.summaryByAi ? BRIEF.summaryByAi : BRIEF.summaryHint)}</p>
              <div className={styles.brief__contacts}><label className={styles.field}><span>{t(CONTACT.form.name.label)}</span><input className={NO_RECORD} value={b.name} disabled={sending} onChange={(event) => b.setName(event.target.value)} autoComplete="name" maxLength={100} required minLength={2} placeholder={t(CONTACT.form.name.placeholder)} /></label><label className={styles.field}><span>{t(CONTACT.form.contact.label)}</span><input className={NO_RECORD} value={b.contact} disabled={sending} onChange={(event) => b.setContact(event.target.value)} autoComplete="email" maxLength={200} required minLength={3} placeholder={t(CONTACT.form.contact.placeholder)} /></label></div>
              <BaseConsent id={`${id}-consent`} checked={b.consent} onChange={b.setConsent} disabled={sending} error={b.consentError ? t(CONSENT_CHECKBOX.error) : undefined} />
            </>}
          </div>
          <div aria-live="polite">{b.error && <p className={styles.error}>{t(b.error)}</p>}{b.status === 'error' && <p className={styles.error}>{t(BRIEF.error)} <a href={`mailto:${BRIEF.email}`}>{BRIEF.email}</a></p>}</div>
          <div className={styles.brief__actions}>{b.step > 0 && <BaseButton variant="ghost" onClick={() => b.setStep(b.step - 1)} disabled={b.busy || sending}>{t(BRIEF.back)}</BaseButton>}<BaseButton type="submit" loading={b.busy || sending}>{t(b.busy ? BRIEF.loading : sending ? BRIEF.sending : b.step === 4 ? BRIEF.send : BRIEF.next)}</BaseButton></div>
        </form>
      )}
    </div>
  );
};
export default Brief;
