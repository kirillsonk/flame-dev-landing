import { siteEn } from '@/data/i18n/site';
import { shellEn } from '@/data/i18n/shell';
import { demosEn } from '@/data/i18n/demos';
import { casesEn } from '@/data/i18n/cases';
import { briefEn } from '@/data/i18n/brief';

const en = { ...siteEn, ...shellEn, ...demosEn, ...casesEn, ...briefEn };

export type Locale = 'ru' | 'en';
export type TranslationParams = Record<string, string | number>;

export const translateText = (locale: Locale, source: string, params?: TranslationParams): string => {
  const translated = locale === 'en' ? en[source] ?? source : source;
  return params ? translated.replace(/\{(\w+)\}/g, (match, key: string) => String(params[key] ?? match)) : translated;
};
