import { useState } from 'react';
import type { ILeadValues } from '../LeadForm.validationSchema';

export type LeadStatus = 'idle' | 'sending' | 'success' | 'error';

export interface IUseLeadSubmit {
  status: LeadStatus;
  submit: (values: ILeadValues) => Promise<void>;
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
    } catch {
      setStatus('error');
    }
  };

  return { status, submit };
};

export default useLeadSubmit;
