import * as yup from 'yup';

export type LeadSource = 'form' | 'floating' | 'mobile-bar';

export interface ILeadValues {
  name: string;
  contact: string;
  message: string;
  source: LeadSource;
}

export const LEAD_INITIAL_VALUES: ILeadValues = { name: '', contact: '', message: '', source: 'form' };

export const leadValidationSchema = yup.object({
  name: yup.string().trim().min(2, 'Минимум 2 символа').required('Как к вам обращаться?'),
  contact: yup.string().trim().min(3, 'Минимум 3 символа').required('Telegram или почта, чтобы ответить'),
  message: yup.string().trim().max(2000, 'Слишком длинно, до 2000 символов'),
  source: yup.mixed<LeadSource>().oneOf(['form', 'floating', 'mobile-bar']).required(),
});
