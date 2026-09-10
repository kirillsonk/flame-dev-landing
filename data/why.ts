import type { IEcosystemCard, IWhyCard } from './types';

export const WHY_TITLE = 'Один подрядчик вместо трёх';

export const WHY_CARDS: IWhyCard[] = [
  {
    title: 'Разработка, дизайн и видео вместе',
    description: 'Обычно сайт делает студия, ролик — продакшн, а склеивать это приходится вам. Здесь всё в одном месте, и результат выглядит цельно.',
  },
  {
    title: 'Опыт с брендами и корпорациями',
    description: 'Coca-Cola, Росатом, AliExpress, Purina, VK. Знаем, как работать с брендбуками, юристами и согласованиями, и не срываем даты запуска.',
  },
  {
    title: 'Flame AI — продукт, который мы построили сами',
    description: 'AI-платформа генерации рекламных видео: собственный фронтенд, пайплайн генерации и биллинг. Текст-питч финализируется отдельно.',
    featured: true,
  },
];

export const ECOSYSTEM_TITLE = 'Flame — это ещё и';

export const ECOSYSTEM_CARDS: IEcosystemCard[] = [
  { title: 'Flame CGI', description: 'Видеопродакшн и CGI для брендов', href: 'https://flamecgi.com', label: 'flamecgi.com →' },
  { title: 'Flame AI', description: 'AI-платформа для генерации видео', href: 'https://app.flameai.studio', label: 'app.flameai.studio →' },
];
