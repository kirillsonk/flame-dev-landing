import { useRef, useState } from 'react';
import { BRIEF } from '@/data/brief';
import useLeadSubmit from '@/components/sections/Contact/hooks/useLeadSubmit';

const useBrief = () => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState(BRIEF.types[0]);
  const [goal, setGoal] = useState('');
  const [questions, setQuestions] = useState<string[]>(BRIEF.standardQuestions);
  const [answers, setAnswers] = useState(['', '']);
  const [timing, setTiming] = useState(BRIEF.timings[2]);
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [summaryOutdated, setSummaryOutdated] = useState(false);
  const summaryInput = useRef('');
  const lead = useLeadSubmit();
  const details = questions.map((question, index) => `${question}\n${answers[index].trim() || BRIEF.unknown}`).join('\n\n');
  const makeSummary = () => `${BRIEF.labels.type} · ${type}\n\n${BRIEF.labels.goal}\n${goal.trim()}\n\n${details}\n\n${BRIEF.labels.timing}\n${timing}${timing === BRIEF.timings[0] && date.trim() ? ` · ${date.trim()}` : ''}`;

  const context = `${type}|${goal.trim()}`;
  const requestQuestions = async (clearAnswers = false) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'questions', type, goal }), signal: AbortSignal.timeout(25_000) });
      const data = await res.json();
      if (res.ok && Array.isArray(data.questions) && data.questions.length === 2 && data.questions.every((value: unknown) => typeof value === 'string')) {
        setQuestions(data.questions); setAi(data.mode === 'ai');
      } else { setQuestions(BRIEF.standardQuestions); setAi(false); }
    } catch { setQuestions(BRIEF.standardQuestions); setAi(false); }
    if (clearAnswers) setAnswers(['', '']);
    setQuestionInput(context);
    setBusy(false);
  };
  const refreshSummary = () => {
    const draft = makeSummary();
    setSummary(draft); summaryInput.current = draft; setSummaryOutdated(false);
  };
  const next = async () => {
    if (busy) return;
    setError(''); setNotice('');
    if (step === 1 && goal.trim().length < 10) { setError(BRIEF.required); return; }
    if (step === 1 && answers.every((answer) => !answer.trim()) && questionInput !== context) await requestQuestions();
    if (step === 2) setQuestionInput(context);
    if (step === 3) {
      const draft = makeSummary();
      if (summaryInput.current !== draft) {
        if (!summary || summary === summaryInput.current) refreshSummary();
        else setSummaryOutdated(true);
      }
    }
    setStep((value) => Math.min(value + 1, 4));
  };
  const improve = async () => {
    if (busy || lead.status === 'sending') return;
    setBusy(true); setNotice('');
    try {
      const res = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'summary', type, goal, details: summary }), signal: AbortSignal.timeout(25_000) });
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
    lead.reset(); setStep(0); setType(BRIEF.types[0]); setGoal(''); setAnswers(['', '']); setQuestions(BRIEF.standardQuestions); setTiming(BRIEF.timings[2]); setDate(''); setSummary(''); setName(''); setContact(''); setAi(false); setError(''); setNotice(''); setQuestionInput(''); summaryInput.current = ''; setSummaryOutdated(false);
  };
  return { step, setStep, type, setType, goal, setGoal, questions, answers, setAnswers, timing, setTiming, date, setDate, summary, setSummary, name, setName, contact, setContact, busy, ai, notice, error, questionsOutdated: questionInput !== context, refreshQuestions: () => requestQuestions(true), summaryOutdated, refreshSummary, next, improve, submit, restart, status: lead.status };
};
export default useBrief;
