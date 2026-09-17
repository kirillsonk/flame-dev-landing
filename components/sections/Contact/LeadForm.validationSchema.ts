import * as yup from 'yup';

export type LeadSource = 'form' | 'floating' | 'mobile-bar';

export interface ILeadValues {
  name: string;
  contact: string;
  message: string;
  source: LeadSource;
}

export const LEAD_MESSAGE_MAX = 2000;

export const LEAD_INITIAL_VALUES: ILeadValues = { name: '', contact: '', message: '', source: 'form' };

export const leadValidationSchema = yup.object({
  name: yup.string().trim().min(2, 'Минимум 2 символа').required('Как к вам обращаться?'),
  contact: yup.string().trim().min(3, 'Минимум 3 символа').required('Telegram или почта, чтобы ответить'),
  message: yup.string().trim().max(LEAD_MESSAGE_MAX, `Слишком длинно, до ${LEAD_MESSAGE_MAX} символов`),
  source: yup.mixed<LeadSource>().oneOf(['form', 'floating', 'mobile-bar']).required(),
});
