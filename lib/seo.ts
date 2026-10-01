import type { ICase } from '@/data/types';

// Адрес сайта для поисковиков: один канонический хост без www
export const SITE_URL = 'https://flamedev.pro';

// Превью для соцсетей и мессенджеров по умолчанию, 1200×630
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: 'Flame dev: разработка под задачи бизнеса' };

// Коды подтверждения Яндекс Вебмастера и Google Search Console. Задаются переменными окружения при сборке,
// без них метатеги не выводятся
export const SITE_VERIFICATION = {
  yandex: process.env.YANDEX_VERIFICATION,
  google: process.env.GOOGLE_SITE_VERIFICATION,
};

// Направления работы для поисковиков: формулировки, по которым ищут клиенты
const SERVICES_LD = [
  'Разработка сайтов',
  'Разработка веб-сервисов и платформ',
  'Спецпроекты для брендов',
  'Разработка ИИ-решений и внедрение нейросетей',
  '3D и WebGL для сайтов',
];

// Организация и сайт для поисковиков (schema.org)
export const SITE_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Flame dev',
      url: SITE_URL,
      email: 'start@flamedev.pro',
      logo: `${SITE_URL}/icon.svg`,
      description: 'Разработка сайтов, веб-сервисов, спецпроектов и ИИ-решений на нейросетях для бизнеса',
      knowsAbout: ['разработка сайтов', 'веб-разработка', 'искусственный интеллект', 'нейросети', 'Next.js', 'Three.js', 'WebGL', 'мини-приложения VK'],
      makesOffer: SERVICES_LD.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Flame dev',
      inLanguage: 'ru',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

// Кейс для поисковиков: проект и хлебные крошки «Главная, Кейсы, проект»
export const caseLd = (item: ICase, summary?: string) => {
  const url = `${SITE_URL}/cases/${item.slug}`;
  const image = item.videoWide?.poster ?? item.poster;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#case`,
        name: item.title,
        headline: item.title,
        description: summary ? `${item.description}. ${summary}` : item.description,
        url,
        keywords: item.tags.join(', '),
        ...(image ? { image: `${SITE_URL}${image}` } : {}),
        creator: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'ru',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Кейсы', item: `${SITE_URL}/cases` },
          { '@type': 'ListItem', position: 3, name: item.title, item: url },
        ],
      },
    ],
  };
};
