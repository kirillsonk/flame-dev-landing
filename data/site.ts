import type { INavItem } from './types';

export const NAV: INavItem[] = [
  { label: 'Кейсы', href: '#cases' },
  { label: 'Услуги', href: '#services' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакт', href: '#contact' },
];

export const CTA_LABEL = 'Обсудить проект';

export const HERO = {
  title: 'Сложные системы и спецпроекты для брендов',
  stats: ['[N] лет', '[N] проектов', 'Полный цикл: дизайн · разработка · видео'],
};

export const CTA_BAND = {
  text: 'Есть задача? Расскажите, ответим в течение дня.',
};

export const CONTACT = {
  title: 'Расскажите о задаче',
  text: 'Ответим в течение дня. Оценку сроков и бюджета дадим за 2–3 дня.',
  links: [
    { label: 'Написать в Telegram →', href: 'https://t.me/flamedev' },
    { label: 'hello@flame.dev →', href: 'mailto:hello@flame.dev' },
    { label: 'Скачать презентацию (PDF) →', href: '/flame-dev.pdf' },
  ],
};

export const FOOTER_LINKS: INavItem[] = [
  ...NAV,
  { label: 'Flame CGI', href: 'https://flamecgi.com' },
  { label: 'Flame AI', href: 'https://app.flame.ai' },
];
