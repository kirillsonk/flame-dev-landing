import type { IEcosystemCard, IEcosystemCredit, IWhyCard } from './types';

export const WHY_TITLE = 'Один подрядчик вместо трех';

export const WHY_CARDS: IWhyCard[] = [
  {
    title: 'Разработка, дизайн и видео вместе',
    description: 'Обычно сайт делает студия, ролик — продакшн, а склеивать это приходится вам. Здесь все в одном месте, и результат выглядит цельно.',
  },
  {
    title: 'Опыт с брендами и корпорациями',
    description: 'Coca-Cola, Росатом, AliExpress, Purina, VK. Знаем, как работать с брендбуками, юристами и согласованиями, и не срываем даты запуска.',
  },
  {
    title: 'Flame AI — продукт, который мы построили сами',
    description: 'AI-платформа генерации рекламных видео: собственный фронтенд, пайплайн генерации и биллинг.',
    featured: true,
  },
];

// Постер Flame AI для карточки-продукта в вариантах блока.
export const WHY_POSTER = { src: '/videos/flame-ai-wide.jpg', alt: 'Flame AI', width: 1280, height: 720 };

export const WHY_BRAND = 'Flame Dev';

// Подписи вариантов «Почему мы»: три подрядчика, которых заменяет одна команда.
export const WHY_VENN_LABELS = ['Студия · сайт', 'Продакшн · ролик', 'Дизайн'];

export const WHY_EQUATION = {
  terms: ['Студия', 'Продакшн', 'Дизайн-бюро'],
  before: '3 договора',
  after: '1 договор',
  label: 'Студия плюс продакшн плюс дизайн-бюро — это Flame Dev и один договор',
};

export const WHY_PUZZLE = {
  lead: 'Сайт, ролик и дизайн делаются одной командой — детали подходят друг к другу без переделок.',
  tags: ['Сайт · ролик · дизайн', 'Бренды'],
};

export const WHY_SPOTLIGHTS = ['Студия', 'Продакшн', 'Дизайн'];

export const WHY_PARTS = ['Сайт', 'Ролик', 'Дизайн'];

export const WHY_ORBITS = ['Студия', 'Продакшн', 'Бюро'];

export const WHY_LAYERS = {
  tags: ['Дизайн', 'Видео', 'Разработка'],
  brand: 'Flame AI',
  heading: 'Рекламное видео за минуты',
  button: 'Попробовать',
};

export const ECOSYSTEM_TITLE = 'Flame — это еще и';

export const ECOSYSTEM_CARDS: IEcosystemCard[] = [
  { title: 'Flame CGI', description: 'Видеопродакшн и CGI для брендов', href: 'https://flamecgi.com', label: 'flamecgi.com →', logo: 'cgi' },
  { title: 'Flame AI', description: 'AI-платформа для генерации видео', href: 'https://app.flameai.studio', label: 'app.flameai.studio →', logo: 'ai' },
];

// Вариант «Бегущие строки» (marquee): верхняя строка — заголовок, нижняя — продукты контуром.
export const ECOSYSTEM_MARQUEE = {
  repeat: 5,
  separator: '✦',
};

// Вариант «Титры» (credits): финальные титры ролика, продукты — строки-карточки.
export const ECOSYSTEM_CREDITS: IEcosystemCredit[] = [
  { role: 'Разработка', name: 'Flame Dev' },
  { role: 'Дизайн', name: 'Flame Dev' },
  { role: 'Спецпроекты и мини-аппы', name: 'Flame Dev' },
  { role: 'Видеопродакшн и CGI', card: 0 },
  { role: 'Генерация видео', card: 1 },
  { role: 'Бренды', name: 'Coca-Cola · Росатом · AliExpress · Purina · VK' },
  { role: 'Следующий проект', name: 'Ваш ↓' },
];

// Вариант «Токены» (tokens): заголовок выдаётся токенами, продукты печатаются как продолжения.
export const ECOSYSTEM_TOKENS = {
  heading: ['Flame', '—', 'это', 'еще', 'и'],
  counter: 'tokens',
  meta: ['temperature 0.7', 'stream: on'],
};
