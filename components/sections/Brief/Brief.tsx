'use client';

import { useEffect, useId, useRef } from 'react';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { BRIEF } from '@/data/brief';
import { CONTACT } from '@/data/site';
import useBrief from './hooks/useBrief';
import { NO_RECORD } from '@/components/layout/Metrika/metrikaConfig';
import styles from './Brief.module.scss';

const Brief = () => {
  const b = useBrief();
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);
  useEffect(() => {
    if (previousStep.current !== b.step && heading.current) {
      heading.current.focus({ preventScroll: true });
      heading.current.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
    previousStep.current = b.step;
  }, [b.step]);
  if (b.status === 'success') return <div className={styles.brief} role="status"><h3 className={styles.brief__question}>{BRIEF.success}</h3><p>{BRIEF.successText}</p><BaseButton onClick={b.restart}>{BRIEF.another}</BaseButton></div>;
  const title = [BRIEF.typeQuestion, BRIEF.goalQuestion, BRIEF.detailTitle, BRIEF.timingQuestion, BRIEF.reviewTitle][b.step];
  return (
    <form className={styles.brief} onSubmit={(event) => { event.preventDefault(); if (b.step === 4) void b.submit(); else void b.next(); }}>
      <ol className={styles.brief__progress} aria-label={BRIEF.title}>{BRIEF.steps.map((label, index) => <li key={label} aria-current={index === b.step ? 'step' : undefined} className={index <= b.step ? styles['brief__progress--active'] : undefined}><span className={styles.brief__sr}>{label}</span></li>)}</ol>
      {b.step > 0 && b.step < 4 && <div className={styles.brief__history}><p className={styles.brief__answer}>{b.type}</p>{b.step > 1 && <p className={styles.brief__answer}>{b.goal}</p>}</div>}
      <div className={styles.brief__message}><span className={styles.brief__sender}>{BRIEF.assistant}</span><h3 className={styles.brief__question} ref={heading} tabIndex={-1}>{title}</h3></div>
      <div className={styles.brief__body}>
        {b.step === 0 && <fieldset className={styles.options}><legend className={styles.brief__sr}>{BRIEF.typeQuestion}</legend>{BRIEF.types.map((value) => <label className={styles.option} key={value}><input type="radio" name={`${id}-type`} value={value} checked={b.type === value} onChange={() => b.setType(value)} /><span>{value}</span></label>)}</fieldset>}
        {b.step === 1 && <label className={styles.field}><span className={styles.brief__sr}>{BRIEF.goalQuestion}</span><textarea className={NO_RECORD} value={b.goal} disabled={b.busy} onChange={(event) => b.setGoal(event.target.value)} maxLength={800} placeholder={BRIEF.goalPlaceholder} rows={6} required minLength={10} /></label>}
        {b.step === 2 && <><p className={styles.hint}>{b.ai ? BRIEF.aiLabel : BRIEF.basicLabel}</p>{b.questionsOutdated && <div className={styles.brief__refresh}><p className={styles.hint}>{BRIEF.refreshHint}</p><button type="button" className={styles.aiButton} onClick={b.refreshQuestions} disabled={b.busy}>{b.busy ? BRIEF.loading : BRIEF.refresh}</button></div>}{b.questions.map((question, index) => <label key={index} className={styles.field}><span>{question}</span><textarea className={NO_RECORD} value={b.answers[index]} disabled={b.busy} onChange={(event) => b.setAnswers(b.answers.map((answer, at) => at === index ? event.target.value : answer))} maxLength={400} rows={3} placeholder={BRIEF.optional} /></label>)}</>}
        {b.step === 3 && <><fieldset className={styles.options}><legend className={styles.brief__sr}>{BRIEF.timingQuestion}</legend>{BRIEF.timings.map((value) => <label className={styles.option} key={value}><input type="radio" name={`${id}-timing`} checked={b.timing === value} onChange={() => b.setTiming(value)} /><span>{value}</span></label>)}</fieldset>{b.timing === BRIEF.timings[0] && <label className={styles.field}><span>{BRIEF.dateLabel}</span><input className={NO_RECORD} value={b.date} onChange={(event) => b.setDate(event.target.value)} maxLength={120} placeholder={BRIEF.datePlaceholder} /></label>}</>}
        {b.step === 4 && <>{b.summaryOutdated && <div className={styles.brief__refresh}><p className={styles.hint}>{BRIEF.summaryChanged}</p><button type="button" className={styles.aiButton} onClick={b.refreshSummary} disabled={b.busy || b.status === 'sending'}>{BRIEF.summaryRefresh}</button></div>}<label className={styles.field}><span>{BRIEF.summaryLabel}</span><textarea className={NO_RECORD} value={b.summary} onChange={(event) => b.setSummary(event.target.value)} disabled={b.busy || b.status === 'sending'} maxLength={2800} rows={8} required /></label><div className={styles.brief__summaryTools}><p className={styles.hint}>{BRIEF.summaryHint}</p><button type="button" className={styles.aiButton} onClick={b.improve} disabled={b.busy || b.status === 'sending'}>{b.busy ? BRIEF.aiImproving : BRIEF.aiImprove}</button></div><div className={styles.brief__contacts}><label className={styles.field}><span>{CONTACT.form.name.label}</span><input className={NO_RECORD} value={b.name} disabled={b.status === 'sending'} onChange={(event) => b.setName(event.target.value)} autoComplete="name" maxLength={100} required minLength={2} placeholder={CONTACT.form.name.placeholder} /></label><label className={styles.field}><span>{CONTACT.form.contact.label}</span><input className={NO_RECORD} value={b.contact} disabled={b.status === 'sending'} onChange={(event) => b.setContact(event.target.value)} autoComplete="email" maxLength={200} required minLength={3} placeholder={CONTACT.form.contact.placeholder} /></label></div></>}
      </div>
      <div aria-live="polite">{b.notice && <p className={styles.hint}>{b.notice}</p>}{b.error && <p className={styles.error}>{b.error}</p>}{b.status === 'error' && <p className={styles.error}>{BRIEF.error} <a href={`mailto:${BRIEF.email}`}>{BRIEF.email}</a></p>}</div>
      <div className={styles.brief__actions}>{b.step > 0 && <BaseButton variant="ghost" onClick={() => b.setStep(b.step - 1)} disabled={b.busy || b.status === 'sending'}>{BRIEF.back}</BaseButton>}<BaseButton type="submit" disabled={b.busy || b.status === 'sending'}>{b.busy ? b.step === 4 ? BRIEF.aiImproving : BRIEF.loading : b.status === 'sending' ? BRIEF.sending : b.step === 4 ? BRIEF.send : BRIEF.next}</BaseButton></div>
    </form>
  );
};
export default Brief;
