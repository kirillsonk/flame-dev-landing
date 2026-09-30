import { useEffect, useRef, useState } from 'react';
import { BRIEF } from '@/data/brief';
import { useLocale } from '@/components/i18n/LocaleProvider';
import useLeadSubmit from '@/components/sections/Contact/hooks/useLeadSubmit';
import { reachGoal } from '@/components/layout/Metrika/metrikaConfig';
import type { Locale } from '@/lib/i18n';

type QuestionTranslations = Record<Locale, string[]>;
interface ISummaryEdit { text: string; input: string }
interface IQuestionResult { translations: QuestionTranslations | null; ai: boolean }
/** Резюме от AI для конкретного набора ответов: пока `done` ложно, запрос в пути */
interface ISummaryJob { key: string; text?: string; done: boolean }
const isQuestionPair = (value: unknown): value is string[] => Array.isArray(value) && value.length === 2 && value.every((question: unknown) => typeof question === 'string' && question.trim().length > 0 && question.length <= 400);
// Сервер делает одну повторную попытку, клиент ждет чуть дольше нее
const AI_TIMEOUT = 22_000;
// Уточнения запрашиваются заранее, когда посетитель перестал печатать задачу
const PREFETCH_DELAY = 1200;
const postBrief = (body: object) => fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(AI_TIMEOUT) });

interface IQuestionRequest { type: string; goal: string; locale: Locale }
// Один запрос на формулировку задачи: нажатие «Продолжить» и предзагрузка берут уже идущий ответ.
// Неудачный ответ не кешируется, следующая попытка спросит заново
const loadQuestions = (jobs: Map<string, Promise<IQuestionResult>>, key: string, request: IQuestionRequest) => {
  const known = jobs.get(key);
  if (known) return known;
  const job = postBrief({ action: 'questions', ...request })
    .then(async (res): Promise<IQuestionResult> => {
      const data = await res.json();
      if (!res.ok || !isQuestionPair(data.questions) || !isQuestionPair(data.translatedQuestions)) throw new Error('questions');
      const [own, other] = [data.questions, data.translatedQuestions];
      return { translations: request.locale === 'en' ? { en: own, ru: other } : { ru: own, en: other }, ai: data.mode === 'ai' };
    })
    .catch((): IQuestionResult => { jobs.delete(key); return { translations: null, ai: false }; });
  if (jobs.size > 12) jobs.clear();
  jobs.set(key, job);
  return job;
};

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
  const [summaryJob, setSummaryJob] = useState<ISummaryJob | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState(false);
  const [error, setError] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const questionJobs = useRef(new Map<string, Promise<IQuestionResult>>());
  const lead = useLeadSubmit();
  const questions = questionTranslations?.[locale] ?? BRIEF.standardQuestions.map(question => t(question));
  const details = questions.map((question, index) => `${question}\n${answers[index].trim() || t(BRIEF.unknown)}`).join('\n\n');
  // Ответы без сроков: из них AI собирает связный текст, сроки дописываются как есть
  const content = `${t(BRIEF.labels.type)} · ${t(type)}\n\n${t(BRIEF.labels.goal)}\n${goal.trim()}\n\n${details}`;
  const timingBlock = `${t(BRIEF.labels.timing)}\n${t(timing)}${timing === BRIEF.timings[0] && date.trim() ? ` · ${date.trim()}` : ''}`;
  const summaryKey = JSON.stringify([locale, content]);
  const aiSummary = summaryJob?.key === summaryKey ? summaryJob.text : undefined;
  const summaryPending = summaryJob?.key === summaryKey && !summaryJob.done;
  const summary = summaryEdit?.text ?? `${aiSummary ?? content}\n\n${timingBlock}`;
  // Compare content rather than translated labels. A language switch updates
  // an untouched draft but never overwrites text edited by the visitor.
  const summaryInput = JSON.stringify([type, goal.trim(), questionTranslations, answers.map(answer => answer.trim()), timing, timing === BRIEF.timings[0] ? date.trim() : '']);
  const summaryOutdated = summaryEdit !== null && summaryEdit.input !== summaryInput;
  const setSummary = (text: string) => setSummaryEdit({ text, input: summaryEdit?.input ?? summaryInput });

  const context = `${type}|${goal.trim()}`;
  useEffect(() => {
    if (step !== 1 || goal.trim().length < 10) return;
    const jobs = questionJobs.current;
    const timer = window.setTimeout(() => { void loadQuestions(jobs, `${type}|${goal.trim()}`, { type, goal, locale }); }, PREFETCH_DELAY);
    return () => window.clearTimeout(timer);
  }, [step, type, goal, locale]);

  const requestQuestions = async (clearAnswers = false) => {
    if (busy) return;
    setBusy(true);
    const result = await loadQuestions(questionJobs.current, context, { type, goal, locale });
    setQuestionTranslations(result.translations);
    setAi(result.ai && result.translations !== null);
    if (clearAnswers) setAnswers(['', '']);
    setQuestionInput(context);
    setBusy(false);
  };
  // Резюме собирается в фоне, пока посетитель выбирает сроки. Если AI не ответил, остается черновик из ответов
  const requestSummary = async () => {
    const key = summaryKey;
    if (summaryJob?.key === key && (!summaryJob.done || summaryJob.text)) return;
    setSummaryJob({ key, done: false });
    let text: string | undefined;
    try {
      const res = await postBrief({ action: 'summary', type, goal, details: content, locale });
      const data = await res.json();
      if (res.ok && data.mode === 'ai' && typeof data.summary === 'string' && data.summary.trim()) text = data.summary.trim();
    } catch { /* черновик из ответов остается */ }
    setSummaryJob(job => (job?.key === key ? { key, text, done: true } : job));
  };
  const refreshSummary = () => { setSummaryEdit(null); void requestSummary(); };
  // Посетитель начал работать с текстом, пока AI еще собирает бриф: фиксируем то, что он видит,
  // иначе пришедший ответ заменит текст под курсором
  const holdSummary = () => { if (summaryPending && !summaryEdit) setSummary(summary); };
  const next = async () => {
    if (busy) return;
    setError('');
    if (step === 1 && goal.trim().length < 10) { setError(BRIEF.required); return; }
    if (step === 1 && answers.every((answer) => !answer.trim()) && questionInput !== context) await requestQuestions();
    if (step === 2) setQuestionInput(context);
    if (step >= 2) void requestSummary();
    // Воронка брифа: начал отвечать и дошел до контактов
    if (step === 0) reachGoal('brief_start', { type });
    if (step === 3) reachGoal('brief_contact');
    setStep((value) => Math.min(value + 1, 4));
  };
  const submit = async () => {
    if (busy || lead.status === 'sending') return;
    setError('');
    if (name.trim().length < 2 || contact.trim().length < 3 || !summary.trim()) { setError(BRIEF.invalidContact); return; }
    if (!consent) { setConsentError(true); return; }
    await lead.submit({ name: name.trim(), contact: contact.trim(), message: summary, source: 'brief', consent });
  };
  const restart = () => {
    lead.reset(); setStep(0); setType(BRIEF.types[0]); setGoal(''); setAnswers(['', '']); setQuestionTranslations(null); setTiming(BRIEF.timings[2]); setDate(''); setSummaryEdit(null); setSummaryJob(null); setName(''); setContact(''); setConsent(false); setConsentError(false); setAi(false); setError(''); setQuestionInput('');
  };
  return {
    step, setStep, type, setType, goal, setGoal, questions, answers, setAnswers, timing, setTiming, date, setDate,
    summary, setSummary, summaryPending: summaryPending && !summaryEdit, summaryByAi: Boolean(aiSummary) && !summaryEdit,
    name, setName, contact, setContact, consent, setConsent: (value: boolean) => { setConsent(value); if (value) setConsentError(false); }, consentError,
    busy, ai, error, questionsOutdated: questionInput !== context, refreshQuestions: () => requestQuestions(true), summaryOutdated, refreshSummary, holdSummary,
    next, submit, restart, status: lead.status,
  };
};
export default useBrief;
