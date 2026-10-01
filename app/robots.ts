import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Служебные адреса закрыты от индексации, карта сайта лежит рядом
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/formats'] },
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
