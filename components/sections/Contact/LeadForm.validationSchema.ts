import * as yup from 'yup';

export type LeadSource = 'form' | 'floating' | 'mobile-bar' | 'brief';

export interface ILeadValues {
  name: string;
  contact: string;
  message: string;
  source: LeadSource;
  /** Согласие на обработку персональных данных: без него заявка не принимается */
  consent: boolean;
}

export const LEAD_MESSAGE_MAX = 2800;

export const LEAD_INITIAL_VALUES: ILeadValues = { name: '', contact: '', message: '', source: 'form', consent: false };

export const leadValidationSchema = yup.object({
  name: yup.string().trim().min(2, 'Минимум 2 символа').max(100).required('Как к вам обращаться?'),
  contact: yup.string().trim().min(3, 'Минимум 3 символа').max(200).required('Укажите Telegram или почту для связи'),
  message: yup.string().trim().max(LEAD_MESSAGE_MAX, `Слишком длинно, до ${LEAD_MESSAGE_MAX} символов`),
  source: yup.mixed<LeadSource>().oneOf(['form', 'floating', 'mobile-bar', 'brief']).required(),
  consent: yup.boolean().oneOf([true], 'Отметьте согласие, без него мы не можем принять заявку').required('Отметьте согласие, без него мы не можем принять заявку'),
});
