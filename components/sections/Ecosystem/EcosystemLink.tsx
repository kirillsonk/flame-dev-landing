import clsx from 'clsx';
import type { IEcosystemCard } from '@/data/types';
import styles from './EcosystemLink.module.scss';

export interface EcosystemLinkProps {
  card: IEcosystemCard;
  className?: string;
  /** Метки `data-part` (line / name / text / url) для вариантов, где текст печатается по скроллу. */
  typed?: boolean;
}

// Ссылка на продукт экосистемы: название, описание и адрес акцентом. Общая для вариантов блока.
const EcosystemLink = ({ card, className, typed }: EcosystemLinkProps) => {
  return (
    <a
      href={card.href}
      target="_blank"
      rel="noreferrer"
      className={clsx(styles.link, className)}
      data-part={typed ? 'line' : undefined}
    >
      <span className={styles.link__name} data-part={typed ? 'name' : undefined}>
        {card.title}
      </span>
      <span className={styles.link__text} data-part={typed ? 'text' : undefined}>
        {card.description}
      </span>
      <span className={styles.link__url} data-part={typed ? 'url' : undefined}>
        {card.label}
      </span>
    </a>
  );
};

export default EcosystemLink;
