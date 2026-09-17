import type { Metadata } from 'next';
import CasesCatalog from '@/components/sections/Cases/CasesCatalog';
import { CASES } from '@/data/cases';
import { CASES_INDEX_TITLE } from '@/data/site';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: `${CASES_INDEX_TITLE} — Flame Dev`,
  description: 'Все проекты Flame Dev: спецпроекты для брендов, платформы, сайты и AI-продукты.',
};

// Полный каталог с фильтрами и параллакс-колонками: на главной — только бегущие строки.
const CasesPage = () => {
  return (
    <main className={styles.page}>
      <h1 className={styles.page__title}>{CASES_INDEX_TITLE}</h1>
      <CasesCatalog items={CASES} />
    </main>
  );
};

export default CasesPage;
