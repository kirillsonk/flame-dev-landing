import type { IService } from './types';

export const SERVICES: IService[] = [
  {
    slug: 'systems',
    title: 'Сложные системы и платформы',
    description: 'ERP, CRM, SaaS, внутренние инструменты, интеграции с оборудованием.',
    stack: ['Django', 'Go', 'интеграции'],
    visual: 'tibia',
  },
  {
    slug: 'special',
    title: 'Спецпроекты для брендов',
    description: 'Промо-механики, мини-игры, мини-аппы VK и ОК, розыгрыши.',
    stack: ['React', 'WebView', 'VK Mini Apps'],
    visual: 'match3',
  },
  {
    slug: 'web3d',
    title: 'Сайты, 3D и WebGL',
    description: 'Корпоративные сайты, лендинги, интерактивные 3D-сцены.',
    stack: ['Three.js', 'WebGL', 'Next.js'],
    visual: 'rosatom',
  },
  {
    slug: 'ai',
    title: 'AI-решения и автоматизация',
    description: 'Боты, интеграции LLM в процессы, AI-продукты.',
    stack: ['LLM', 'боты', 'автоматизация'],
    visual: 'prompt',
  },
];

// Вариант «Сцена-плеер»: короткие метки дорожки под рамкой, по одной на услугу (в порядке SERVICES).
export const SERVICES_PLAYER_CHIPS: string[] = ['Учёт', 'Игра', '3D', 'AI'];
