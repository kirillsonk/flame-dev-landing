import type { ICase } from './types';

export const CASES: ICase[] = [
  {
    slug: 'coca-cola-delivery-club',
    title: 'Coca-Cola × Delivery Club',
    size: 'l',
    colors: ['#E4002B', '#1E5B3A'],
    description: 'Модуль «Задание дня» в приложении Delivery Club: мини-игры, промокоды, розыгрыши.',
    tags: ['спецпроект', 'мини-игры', 'API'],
  },
  {
    slug: 'rosatom',
    title: 'Росатом — «Умный атом»',
    size: 'l',
    colors: ['#1A1F4E', '#D7141A'],
    description: '3D-путешествие по космосу на Three.js с остановками у статей.',
    tags: ['3D / WebGL', 'спецпроект'],
  },
  {
    slug: 'flame-ai',
    title: 'Flame AI',
    size: 'm',
    colors: ['#262525', '#F13911'],
    description: 'AI-платформа генерации рекламных видео. Собственный продукт.',
    tags: ['AI', 'SaaS'],
  },
  {
    slug: 'tibia',
    title: 'Tibia / Majorpack',
    size: 'm',
    colors: ['#E8D400', '#F2F2F0'],
    description: 'Платформа маркировки и логистики труб НКТ, ПО для сканирующих терминалов.',
    tags: ['ERP', 'hardware'],
  },
  {
    slug: 'amatour',
    title: 'Amatour',
    size: 'm',
    colors: ['#E4141C', '#FFFFFF'],
    description: 'SaaS-платформа теннисных турниров: рейтинг, кабинеты, подписки.',
    tags: ['платформа', 'подписки'],
  },
  {
    slug: 'purina-vk',
    title: 'Purina × VK',
    size: 's',
    colors: ['#B5CC2E', '#E30613'],
    description: 'Голосование за pet-friendly города: сайт, мини-апп VK, карта.',
    tags: ['mini-app'],
  },
  {
    slug: 'alibox',
    title: 'AliExpress × ОК',
    size: 's',
    colors: ['#D9EEF9', '#FF4A1F'],
    description: 'Розыгрыш промокодов в мини-аппе Одноклассников.',
    tags: ['промо'],
  },
  {
    slug: 'majorpack',
    title: 'Majorpack',
    size: 's',
    colors: ['#2F3A44', '#FFFFFF'],
    description: 'Корпоративный сайт и калькулятор выбросов.',
    tags: ['сайт'],
  },
  {
    slug: 'sozidanie',
    title: 'Фонд «Созидание»',
    size: 's',
    colors: ['#F26B1D', '#1E4D2B'],
    description: 'Сайт с онлайн-пожертвованиями, CMS, CloudPayments.',
    tags: ['сайт'],
  },
];

export const HERO_REEL_SLUGS = ['coca-cola-delivery-club', 'rosatom', 'flame-ai', 'tibia', 'amatour'];

export const HERO_REEL = HERO_REEL_SLUGS.map((slug) => CASES.find((c) => c.slug === slug)!);

export const HUAWEI_NOTE = {
  text: 'Huawei — редизайн главной, дизайн-проект',
  href: 'https://www.behance.net/gallery/101023739/huawei-mainpage-redesign',
  label: 'Behance',
};
