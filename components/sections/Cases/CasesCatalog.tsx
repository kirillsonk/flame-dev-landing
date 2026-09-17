'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import { CASE_FILTERS, caseMatchesFilter } from '@/data/cases';
import CaseTile from './CaseTile';
import styles from './CasesCatalog.module.scss';

export interface CasesCatalogProps {
  items: ICase[];
}

const COLUMNS = 3;

// Полный каталог кейсов: табы по типу работ и три колонки, которые по скроллу едут
// с разной скоростью (CSS scroll-driven animation, без JS). Карточки раскладываются
// по колонкам по кругу, поэтому после фильтра колонки остаются ровными.
const CasesCatalog = ({ items }: CasesCatalogProps) => {
  const [filterId, setFilterId] = useState(CASE_FILTERS[0].id);
  const filter = CASE_FILTERS.find((entry) => entry.id === filterId) ?? CASE_FILTERS[0];
  const visible = items.filter((item) => caseMatchesFilter(item, filter));
  const columns = Array.from({ length: COLUMNS }, (_, column) => visible.filter((_, index) => index % COLUMNS === column));

  return (
    <div className={styles.catalog}>
      <div className={styles.catalog__tabs} role="tablist" aria-label="Тип работ">
        {CASE_FILTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === filterId}
            className={clsx(styles.catalog__tab, entry.id === filterId && styles['catalog__tab--active'])}
            onClick={() => setFilterId(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className={styles.catalog__columns}>
        {columns.map((column, index) => (
          <div key={index} className={styles.catalog__column}>
            {column.map((item) => (
              // key с фильтром: при смене таба карточка монтируется заново и проигрывает появление.
              <div key={`${filterId}-${item.slug}`} className={styles.catalog__item}>
                <CaseTile item={item} withText />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesCatalog;
