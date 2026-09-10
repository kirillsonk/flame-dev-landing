import type { ICase } from './types';

// Сетка 12 колонок: L и M — 4 колонки × 2 ряда, S — 2 колонки × 1 ряд; порядок l,l,m,m,m,s,s,s,s
// раскладывается как [L L M] + [M M | S S / S S]. Первый тег — основная категория, он подсвечивается акцентом.
// Тестовые видео 9:16 из landingv2, заменить на реальные баннеры кейсов.
export const CASES: ICase[] = [
  {
    slug: 'coca-cola-delivery-club',
    video: { mp4: '/videos/coca-cola-delivery-club.mp4', webm: '/videos/coca-cola-delivery-club.webm', poster: '/videos/coca-cola-delivery-club.jpg' },
    title: 'Coca-Cola × Delivery Club',
    size: 'l',
    colors: ['#E4002B', '#1E5B3A'],
    description: 'Модуль «Задание дня» в приложении Delivery Club: мини-игры, промокоды, розыгрыши.',
    tags: ['спецпроект', 'мини-игры', 'API'],
  },
  {
    slug: 'rosatom',
    video: { mp4: '/videos/rosatom.mp4', webm: '/videos/rosatom.webm', poster: '/videos/rosatom.jpg' },
    title: 'Росатом — «Умный атом»',
    size: 'l',
    colors: ['#1A1F4E', '#D7141A'],
    description: '3D-путешествие по космосу на Three.js с остановками у статей.',
    tags: ['3D / WebGL', 'спецпроект'],
  },
  {
    slug: 'flame-ai',
    video: { mp4: '/videos/flame-ai.mp4', webm: '/videos/flame-ai.webm', poster: '/videos/flame-ai.jpg' },
    title: 'Flame AI',
    size: 'm',
    colors: ['#262525', '#F13911'],
    description: 'AI-платформа генерации рекламных видео. Собственный продукт.',
    tags: ['AI', 'SaaS'],
  },
  {
    slug: 'tibia',
    video: { mp4: '/videos/tibia.mp4', webm: '/videos/tibia.webm', poster: '/videos/tibia.jpg' },
    title: 'Tibia / Majorpack',
    size: 'm',
    colors: ['#E8D400', '#F2F2F0'],
    description: 'Платформа маркировки и логистики труб НКТ, ПО для сканирующих терминалов.',
    tags: ['ERP', 'hardware'],
  },
  {
    slug: 'amatour',
    video: { mp4: '/videos/amatour.mp4', webm: '/videos/amatour.webm', poster: '/videos/amatour.jpg' },
    title: 'Amatour',
    size: 'm',
    colors: ['#E4141C', '#FFFFFF'],
    description: 'SaaS-платформа теннисных турниров: рейтинг, кабинеты, подписки.',
    tags: ['платформа', 'подписки'],
  },
  {
    slug: 'purina-vk',
    video: { mp4: '/videos/purina-vk.mp4', webm: '/videos/purina-vk.webm', poster: '/videos/purina-vk.jpg' },
    title: 'Purina × VK',
    size: 's',
    colors: ['#B5CC2E', '#E30613'],
    description: 'Голосование за pet-friendly города: сайт, мини-апп VK, карта.',
    tags: ['mini-app'],
  },
  {
    slug: 'alibox',
    video: { mp4: '/videos/alibox.mp4', webm: '/videos/alibox.webm', poster: '/videos/alibox.jpg' },
    title: 'AliExpress × ОК',
    size: 's',
    colors: ['#D9EEF9', '#FF4A1F'],
    description: 'Розыгрыш промокодов в мини-аппе Одноклассников.',
    tags: ['промо'],
  },
  {
    slug: 'majorpack',
    video: { mp4: '/videos/majorpack.mp4', webm: '/videos/majorpack.webm', poster: '/videos/majorpack.jpg' },
    title: 'Majorpack',
    size: 's',
    colors: ['#2F3A44', '#FFFFFF'],
    description: 'Корпоративный сайт и калькулятор выбросов.',
    tags: ['сайт'],
  },
  {
    slug: 'sozidanie',
    video: { mp4: '/videos/sozidanie.mp4', webm: '/videos/sozidanie.webm', poster: '/videos/sozidanie.jpg' },
    title: 'Фонд «Созидание»',
    size: 's',
    colors: ['#F26B1D', '#1E4D2B'],
    description: 'Сайт с онлайн-пожертвованиями, CMS, CloudPayments.',
    tags: ['сайт'],
  },
];

export const HERO_REEL_SLUGS = ['coca-cola-delivery-club', 'rosatom', 'flame-ai', 'tibia', 'amatour'];

export const HERO_REEL: ICase[] = HERO_REEL_SLUGS.map((slug) => {
  const item = CASES.find((c) => c.slug === slug);
  if (!item) throw new Error(`HERO_REEL: unknown case slug "${slug}"`);
  return item;
});

export const HUAWEI_NOTE = {
  text: 'Huawei — редизайн главной, дизайн-проект',
  href: 'https://www.behance.net/gallery/101023739/huawei-mainpage-redesign',
  label: 'Behance',
};
