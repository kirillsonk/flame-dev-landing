import { useState } from 'react';
import { BRIEF } from '@/data/brief';
import { useLocale } from '@/components/i18n/LocaleProvider';
import useLeadSubmit from '@/components/sections/Contact/hooks/useLeadSubmit';
import type { Locale } from '@/lib/i18n';

type QuestionTranslations = Record<Locale, string[]>;
interface ISummaryEdit { text: string; input: string }
const isQuestionPair = (value: unknown): value is string[] => Array.isArray(value) && value.length === 2 && value.every((question: unknown) => typeof question === 'string' && question.trim().length > 0 && question.length <= 400);

const useBrief = () => {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(0);
  const [type, setType] = useState(BRIEF.types[0]);
  const [goal, setGoal] = useState('');
  // Both versions describe the same questions in the same order, so changing
  // the interface language never changes what an existing answer refers to.
  const [questionTranslations, setQuestionTranslations] = useState<QuestionTranslations | null>(null);
  const [answers, setAnswers] = useState(['', '']);
  const [timing, setTiming] = useState(BRIEF.timings[2]);
  const [date, setDate] = useState('');
  const [summaryEdit, setSummaryEdit] = useState<ISummaryEdit | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const lead = useLeadSubmit();
  const questions = questionTranslations?.[locale] ?? BRIEF.standardQuestions.map(question => t(question));
  const details = questions.map((question, index) => `${question}\n${answers[index].trim() || t(BRIEF.unknown)}`).join('\n\n');
  const draft = `${t(BRIEF.labels.type)} · ${t(type)}\n\n${t(BRIEF.labels.goal)}\n${goal.trim()}\n\n${details}\n\n${t(BRIEF.labels.timing)}\n${t(timing)}${timing === BRIEF.timings[0] && date.trim() ? ` · ${date.trim()}` : ''}`;
  const summary = summaryEdit?.text ?? draft;
  // Compare content rather than translated labels. A language switch updates
  // an untouched draft but never overwrites text edited by the visitor or AI.
  const summaryInput = JSON.stringify([type, goal.trim(), questionTranslations, answers.map(answer => answer.trim()), timing, timing === BRIEF.timings[0] ? date.trim() : '']);
  const summaryOutdated = summaryEdit !== null && summaryEdit.input !== summaryInput;
  const setSummary = (text: string) => setSummaryEdit({ text, input: summaryEdit?.input ?? summaryInput });

  const context = `${type}|${goal.trim()}`;
  const requestQuestions = async (clearAnswers = false) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'questions', type, goal, locale }), signal: AbortSignal.timeout(25_000) });
      const data = await res.json();
      if (res.ok && isQuestionPair(data.questions) && isQuestionPair(data.translatedQuestions)) {
        setQuestionTranslations(locale === 'en' ? { en: data.questions, ru: data.translatedQuestions } : { ru: data.questions, en: data.translatedQuestions });
        setAi(data.mode === 'ai');
      } else { setQuestionTranslations(null); setAi(false); }
    } catch { setQuestionTranslations(null); setAi(false); }
    if (clearAnswers) setAnswers(['', '']);
    setQuestionInput(context);
    setBusy(false);
  };
  const refreshSummary = () => setSummaryEdit(null);
  const next = async () => {
    if (busy) return;
    setError(''); setNotice('');
    if (step === 1 && goal.trim().length < 10) { setError(BRIEF.required); return; }
    if (step === 1 && answers.every((answer) => !answer.trim()) && questionInput !== context) await requestQuestions();
    if (step === 2) setQuestionInput(context);
    setStep((value) => Math.min(value + 1, 4));
  };
  const improve = async () => {
    if (busy || lead.status === 'sending') return;
    setBusy(true); setNotice('');
    try {
      const res = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'summary', type, goal, details: summary, locale }), signal: AbortSignal.timeout(25_000) });
      const data = await res.json();
      if (!res.ok || data.mode !== 'ai' || typeof data.summary !== 'string' || !data.summary.trim()) throw new Error('unavailable');
      setSummary(data.summary);
    } catch { setNotice(BRIEF.aiUnavailable); }
    finally { setBusy(false); }
  };
  const submit = async () => {
    if (busy || lead.status === 'sending') return;
    setError('');
    if (name.trim().length < 2 || contact.trim().length < 3 || !summary.trim()) { setError(BRIEF.invalidContact); return; }
    await lead.submit({ name: name.trim(), contact: contact.trim(), message: summary, source: 'brief' });
  };
  const restart = () => {
    lead.reset(); setStep(0); setType(BRIEF.types[0]); setGoal(''); setAnswers(['', '']); setQuestionTranslations(null); setTiming(BRIEF.timings[2]); setDate(''); setSummaryEdit(null); setName(''); setContact(''); setAi(false); setError(''); setNotice(''); setQuestionInput('');
  };
  return { step, setStep, type, setType, goal, setGoal, questions, answers, setAnswers, timing, setTiming, date, setDate, summary, setSummary, name, setName, contact, setContact, busy, ai, notice, error, questionsOutdated: questionInput !== context, refreshQuestions: () => requestQuestions(true), summaryOutdated, refreshSummary, next, improve, submit, restart, status: lead.status };
};
export default useBrief;
