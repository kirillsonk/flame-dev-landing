import type { IService } from './types';

// Направления по doc/FLAME_DEV_WEBSITE_COPY.md. Порядок держится за демо в сцене-плеере:
// учет, игра, 3D (сайт Росатома «Умный атом»), AI.
export const SERVICES: IService[] = [
  {
    slug: 'systems',
    title: 'Сложные системы и платформы',
    description: 'ERP, CRM и SaaS-платформы, учет и аналитика, интеграции с оборудованием',
    stack: ['Django', 'Go', 'интеграции'],
    visual: 'tibia',
  },
  {
    slug: 'special',
    title: 'Спецпроекты для брендов',
    description: 'Промосайты, мини-игры и приложения VK и ОК с заданиями, розыгрышами и промокодами',
    stack: ['React', 'WebView', 'VK Mini Apps'],
    visual: 'match3',
  },
  {
    slug: 'web3d',
    title: 'Сайты, 3D и WebGL',
    description: 'Корпоративные сайты, продуктовые каталоги и интерактивные 3D-сцены. От дизайна интерфейса до разработки и интеграций',
    stack: ['Next.js', 'Three.js', 'WebGL'],
    visual: 'rosatom',
  },
  {
    slug: 'ai',
    title: 'AI-решения и автоматизация',
    description: 'AI-ассистенты, обработка документов и интеграции с рабочими сервисами через API и MCP',
    stack: ['LLM', 'API', 'MCP'],
    visual: 'prompt',
  },
];

// Вариант «Сцена-плеер»: короткие метки дорожки под рамкой, по одной на услугу (в порядке SERVICES).
export const SERVICES_PLAYER_CHIPS: string[] = ['Учет', 'Игра', '3D', 'AI'];
