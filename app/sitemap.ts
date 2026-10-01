import type { MetadataRoute } from 'next';
import { CATALOG_CASES } from '@/data/cases';
import { SITE_URL } from '@/lib/seo';

// Главная, каталог, все опубликованные кейсы и документы
const sitemap = (): MetadataRoute.Sitemap => [
  { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
  { url: `${SITE_URL}/cases`, changeFrequency: 'weekly', priority: .9 },
  ...CATALOG_CASES.map((item) => ({ url: `${SITE_URL}/cases/${item.slug}`, changeFrequency: 'monthly' as const, priority: .7 })),
  { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: .2 },
  { url: `${SITE_URL}/consent`, changeFrequency: 'yearly', priority: .2 },
];

export default sitemap;
