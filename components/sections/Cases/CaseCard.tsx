import Image from 'next/image';
import Poster from '@/components/ui/Poster/Poster';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import type { ICase } from '@/data/types';
import styles from './CaseCard.module.scss';

export interface CaseCardProps {
  item: ICase;
}

const CaseCard = ({ item }: CaseCardProps) => {
  return (
    <article className={styles.caseCard} data-reveal>
      <Poster item={item} showTitle={false} zoomOnHover wide className={styles.caseCard__poster} />
      {item.logo && (
        <div className={styles.caseCard__logo}>
          <Image src={item.logo.src} alt={item.logo.alt} fill className={styles.caseCard__logoImage} />
        </div>
      )}
      <div className={styles.caseCard__plate}>
        <div className={styles.caseCard__head}>
          <h3 className={styles.caseCard__title}>{item.title}</h3>
          <BaseTag className={styles.caseCard__tag}>{item.tags[0]}</BaseTag>
        </div>
        <p className={styles.caseCard__text}>{item.description}</p>
      </div>
    </article>
  );
};

export default CaseCard;
