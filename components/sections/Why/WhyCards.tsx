import type { ReactNode } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { WHY_CARDS, WHY_POSTER } from '@/data/why';
import styles from './WhyCards.module.scss';

type WhyCardsPart = 'list' | 'card' | 'featured' | 'image' | 'body' | 'text';

export interface WhyCardsProps {
  /** Классы варианта поверх базовой разметки карточек. */
  classNames?: Partial<Record<WhyCardsPart, string>>;
  /** Постер Flame AI в карточке-продукте: до текста или после. Без пропа постера нет. */
  image?: 'start' | 'end';
  /** Дополнительный элемент в начале карточки (например, тег). */
  renderLead?: (index: number) => ReactNode;
}

// Три карточки «Почему мы», общие для всех вариантов блока. Каждая помечена `data-part="card"`.
const WhyCards = ({ classNames = {}, image, renderLead }: WhyCardsProps) => {
  return (
    <div className={clsx(styles.whyCards, classNames.list)}>
      {WHY_CARDS.map((card, index) => {
        const poster =
          card.featured && image ? (
            <Image
              className={clsx(styles.whyCards__image, classNames.image)}
              src={WHY_POSTER.src}
              alt={WHY_POSTER.alt}
              width={WHY_POSTER.width}
              height={WHY_POSTER.height}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : null;

        return (
          <article
            key={card.title}
            className={clsx(styles.whyCards__card, classNames.card, card.featured && classNames.featured)}
            data-part="card"
          >
            {renderLead?.(index)}
            {image === 'start' && poster}
            <div className={clsx(styles.whyCards__body, classNames.body)}>
              <h3 className={styles.whyCards__title}>{card.title}</h3>
              <p className={clsx(styles.whyCards__text, classNames.text)}>{card.description}</p>
            </div>
            {image === 'end' && poster}
          </article>
        );
      })}
    </div>
  );
};

export default WhyCards;
