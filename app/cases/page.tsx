import BaseButton from '@/components/ui/BaseButton/BaseButton';
import CasesCatalog from '@/components/sections/Cases/CasesCatalog';
import BriefContact from '@/components/sections/Brief/BriefContact';
import Ecosystem from '@/components/sections/Ecosystem/Ecosystem';
import StarField from '@/components/layout/StarField/StarField';
import LocalizedText from '@/components/i18n/LocalizedText';
import { CATALOG_CASES } from '@/data/cases';
import { CASES_BACK_LABEL, CASES_INDEX_TITLE } from '@/data/site';
import styles from './page.module.scss';

// Полный каталог с фильтрами и параллакс-колонками на фоне звездного неба.
// Внизу та же форма-бриф и лента продуктов Flame, что на главной
const CasesPage = () => {
  return (
    <main className={styles.page}>
      <StarField />
      <div className={styles.page__inner}>
        <BaseButton href="/" variant="secondary" className={styles.page__back}><LocalizedText>{CASES_BACK_LABEL}</LocalizedText></BaseButton>
        <h1 className={styles.page__title}><LocalizedText>{CASES_INDEX_TITLE}</LocalizedText></h1>
        <CasesCatalog items={CATALOG_CASES} />
      </div>
      <BriefContact />
      <Ecosystem />
    </main>
  );
};

export default CasesPage;
