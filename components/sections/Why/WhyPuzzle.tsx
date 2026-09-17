'use client';

import { WHY_PUZZLE, WHY_TITLE } from '@/data/why';
import WhyCards from './WhyCards';
import useWhyPuzzle from './hooks/useWhyPuzzle';
import styles from './WhyPuzzle.module.scss';

// Вариант «Пазл»: карточки-детали разбросаны с поворотом и по скроллу защёлкиваются в одну полосу.
const WhyPuzzle = () => {
  const { rootRef } = useWhyPuzzle();

  const renderTag = (index: number) =>
    WHY_PUZZLE.tags[index] ? <span className={styles.puzzle__tag}>{WHY_PUZZLE.tags[index]}</span> : null;

  return (
    <section ref={rootRef} className={styles.puzzle}>
      <div className={styles.puzzle__top}>
        <h2 className={styles.puzzle__title}>{WHY_TITLE}</h2>
        <p className={styles.puzzle__lead}>{WHY_PUZZLE.lead}</p>
      </div>
      <div className={styles.puzzle__row} data-part="row">
        <WhyCards
          image="start"
          renderLead={renderTag}
          classNames={{ list: styles.puzzle__list, card: styles.puzzle__piece, image: styles.puzzle__image }}
        />
      </div>
    </section>
  );
};

export default WhyPuzzle;
