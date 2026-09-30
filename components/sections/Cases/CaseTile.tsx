'use client';

import { useLocale } from '@/components/i18n/LocaleProvider';
import Link from 'next/link';
import Poster from '@/components/ui/Poster/Poster';
import type { ICase } from '@/data/types';
import styles from './CaseTile.module.scss';

export interface CaseTileProps {
  item: ICase;
  /** Показать описание под подписью (каталог на /cases). */
  withText?: boolean;
}

// Карточка бегущей строки: ролик 16:9 (играет по вьюпорту, как у карточек кейсов) и подпись.
const CaseTile = ({ item, withText = false }: CaseTileProps) => {
  const { t } = useLocale();
  return (
    <Link href={`/cases/${item.slug}`} className={styles.tile}>
      <span className={styles.tile__media} data-transition="tile-media">
        <Poster item={item} wide showTitle={false} zoomOnHover className={styles.tile__poster} />
      </span>
      <span className={styles.tile__caption}>
        <span className={styles.tile__title}>{t(item.title)}</span>
        <span className={styles.tile__tag}>{t(item.tags[0])}</span>
      </span>
      {withText && <span className={styles.tile__text}>{t(item.description)}</span>}
    </Link>
  );
};

export default CaseTile;
