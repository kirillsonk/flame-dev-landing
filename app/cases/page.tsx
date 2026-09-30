import type { Metadata } from 'next';
import Link from 'next/link';
import CasesCatalog from '@/components/sections/Cases/CasesCatalog';
import BriefContact from '@/components/sections/Brief/BriefContact';
import Ecosystem from '@/components/sections/Ecosystem/Ecosystem';
import StarField from '@/components/layout/StarField/StarField';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import { CASES } from '@/data/cases';
import { CASES_BACK_LABEL, CASES_INDEX_TITLE } from '@/data/site';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: `${CASES_INDEX_TITLE} | Flame dev`,
  description: 'Все проекты Flame dev: спецпроекты для брендов, платформы, сайты и AI-продукты',
};

// Полный каталог с фильтрами и параллакс-колонками на фоне звездного неба.
// Внизу та же форма-бриф и лента продуктов Flame, что на главной
const CasesPage = () => {
  return (
    <main className={styles.page}>
      <StarField />
      <div className={styles.page__inner}>
        <Link href="/" className={styles.page__back}><BaseArrow direction="left" />{CASES_BACK_LABEL}</Link>
        <h1 className={styles.page__title}>{CASES_INDEX_TITLE}</h1>
        <CasesCatalog items={CASES} />
      </div>
      <BriefContact />
      <Ecosystem />
    </main>
  );
};

export default CasesPage;
