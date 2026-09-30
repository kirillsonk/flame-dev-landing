'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import { CASE_FILTERS, caseMatchesFilter } from '@/data/cases';
import CaseTile from './CaseTile';
import styles from './CasesCatalog.module.scss';
import { useLocale } from '@/components/i18n/LocaleProvider';

export interface CasesCatalogProps {
  items: ICase[];
}

// Единый порядок карточек для сетки, мобильного списка и клавиатурной навигации.
// Легкий параллакс колонок остается на CSS, без перестановки DOM и дублирования видео.
const CasesCatalog = ({ items }: CasesCatalogProps) => {
  const { t } = useLocale();
  const [filterId, setFilterId] = useState(CASE_FILTERS[0].id);
  const filter = CASE_FILTERS.find((entry) => entry.id === filterId) ?? CASE_FILTERS[0];
  const visible = items.filter((item) => caseMatchesFilter(item, filter));

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog__tabs} role="group" aria-label={t('Тип работ')}>
        {CASE_FILTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={entry.id === filterId}
            className={clsx(styles.catalog__tab, entry.id === filterId && styles['catalog__tab--active'])}
            onClick={() => setFilterId(entry.id)}
          >
            {t(entry.label)}
          </button>
        ))}
      </div>

      <div className={styles.catalog__grid}>
        {visible.map((item) => (
          // key с фильтром: при смене фильтра карточка заново проигрывает появление.
          <div key={`${filterId}-${item.slug}`} className={styles.catalog__position}>
            <div className={styles.catalog__item}>
              <CaseTile item={item} withText />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesCatalog;
