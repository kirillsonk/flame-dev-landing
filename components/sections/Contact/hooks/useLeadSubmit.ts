import { useState } from 'react';
import { reachGoal } from '@/components/layout/Metrika/metrikaConfig';
import type { ILeadValues } from '../LeadForm.validationSchema';

export type LeadStatus = 'idle' | 'sending' | 'success' | 'error';

export interface IUseLeadSubmit {
  status: LeadStatus;
  /** Возвращает `true`, если заявка ушла: форма по этому сигналу очищает поля. */
  submit: (values: ILeadValues) => Promise<boolean>;
  reset: () => void;
}

const useLeadSubmit = (): IUseLeadSubmit => {
  const [status, setStatus] = useState<LeadStatus>('idle');

  const submit = async (values: ILeadValues) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? 'success' : 'error');
      // Главная конверсия сайта: заявка дошла до сервера и ушла в Telegram
      reachGoal(res.ok ? 'lead_sent' : 'lead_error', { source: values.source });
      return res.ok;
    } catch {
      setStatus('error');
      reachGoal('lead_error', { source: values.source });
      return false;
    }
  };

  const reset = () => setStatus('idle');

  return { status, submit, reset };
};

export default useLeadSubmit;
