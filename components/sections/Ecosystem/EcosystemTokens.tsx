'use client';

import { ECOSYSTEM_CARDS, ECOSYSTEM_TITLE, ECOSYSTEM_TOKENS } from '@/data/why';
import EcosystemLink from './EcosystemLink';
import useEcosystemTokens from './hooks/useEcosystemTokens';
import styles from './EcosystemTokens.module.scss';

// Вариант «Токены»: заголовок выдаётся чипами-токенами, как ответ языковой модели, потом
// символ за символом печатаются два продолжения — про Flame CGI и Flame AI, вплоть до адреса.
// Курсор мигает, счётчик токенов растёт. На мобильном и без анимации текст показан целиком.
const EcosystemTokens = () => {
  const { sectionRef } = useEcosystemTokens(styles.tokens__caret);

  return (
    <section ref={sectionRef} className={styles.tokens}>
      <h2 className={styles.tokens__title} aria-label={ECOSYSTEM_TITLE}>
        {ECOSYSTEM_TOKENS.heading.map((token, index) => (
          <span key={index} className={styles.tokens__token} data-part="token" aria-hidden="true">
            {token}
          </span>
        ))}
      </h2>
      <div className={styles.tokens__lines}>
        {ECOSYSTEM_CARDS.map((card) => (
          <EcosystemLink key={card.href} card={card} className={styles.tokens__line} typed />
        ))}
      </div>
      <div className={styles.tokens__meta} aria-hidden="true">
        <span className={styles.tokens__tag}>
          {ECOSYSTEM_TOKENS.counter}
          <b className={styles.tokens__count} data-part="count">
            0
          </b>
        </span>
        {ECOSYSTEM_TOKENS.meta.map((tag) => (
          <span key={tag} className={styles.tokens__tag}>
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default EcosystemTokens;
