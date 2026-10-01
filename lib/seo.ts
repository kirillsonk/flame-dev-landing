// Адрес сайта для поисковиков: один канонический хост без www
export const SITE_URL = 'https://flamedev.pro';

// Организация для поисковиков (schema.org): название, сайт и почта для связи
export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Flame dev',
  url: SITE_URL,
  email: 'start@flamedev.pro',
  description: 'Разработка сайтов, цифровых сервисов, спецпроектов и AI-решений для бизнеса',
};
