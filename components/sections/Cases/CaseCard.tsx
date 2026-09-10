import clsx from 'clsx';
import Poster from '@/components/ui/Poster/Poster';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import type { ICase } from '@/data/types';
import styles from './CaseCard.module.scss';

export interface CaseCardProps {
  item: ICase;
}

const CaseCard = ({ item }: CaseCardProps) => {
  return (
    <article className={clsx(styles.caseCard, styles[`caseCard--${item.size}`])} data-reveal>
      <div className={styles.caseCard__poster}>
        <Poster item={item} showTitle={false} />
      </div>
      <div className={styles.caseCard__body}>
        <h3 className={styles.caseCard__title}>{item.title}</h3>
        <p className={styles.caseCard__text}>{item.description}</p>
        <div className={styles.caseCard__tags}>
          {item.tags.map((tag, index) => (
            <BaseTag key={tag} variant={index === 0 ? 'accent' : 'outline'}>{tag}</BaseTag>
          ))}
        </div>
      </div>
    </article>
  );
};

export default CaseCard;
