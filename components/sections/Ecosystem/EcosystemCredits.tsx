'use client';

import clsx from 'clsx';
import { ECOSYSTEM_CARDS, ECOSYSTEM_CREDITS, ECOSYSTEM_TITLE } from '@/data/why';
import type { IEcosystemCredit } from '@/data/types';
import EcosystemLink from './EcosystemLink';
import useEcosystemCredits from './hooks/useEcosystemCredits';
import styles from './EcosystemCredits.module.scss';

// Последняя строка титров — мост к следующему блоку: едет вместе с титрами, а после пина
// остаётся у нижнего края экрана и ложится сверху на «Расскажите о задаче».
const ROLL = ECOSYSTEM_CREDITS.slice(0, -1);
const BRIDGE = ECOSYSTEM_CREDITS[ECOSYSTEM_CREDITS.length - 1];

const renderLine = (line: IEcosystemCredit) => {
  const card = line.card === undefined ? undefined : ECOSYSTEM_CARDS[line.card];
  return (
    <div key={line.role} className={clsx(styles.credits__line, card && styles['credits__line--card'])} data-part="line">
      <span className={styles.credits__role}>{line.role}</span>
      {card ? <EcosystemLink card={card} className={styles.credits__card} /> : <span className={styles.credits__name}>{line.name}</span>}
    </div>
  );
};

// Вариант «Титры»: финальные титры ролика едут вверх по скроллу — роли и имена,
// среди них две строки-карточки продуктов, которые подсвечиваются, проходя через центр.
// Мост лежит рядом с секцией, а не внутри: пин оставляет секции трансформ, и настоящий
// position: fixed внутри неё невозможен. На мобильном обычный список без пина.
const EcosystemCredits = () => {
  const { sectionRef, bridgeRef } = useEcosystemCredits();

  return (
    <>
      <section ref={sectionRef} className={styles.credits}>
        <h2 className={styles.credits__title}>{ECOSYSTEM_TITLE}</h2>
        <div className={styles.credits__stage}>
          <div className={styles.credits__roll} data-part="roll">
            {ROLL.map(renderLine)}
          </div>
        </div>
      </section>
      <div ref={bridgeRef} className={clsx(styles.credits__line, styles['credits__line--bridge'])}>
        <span className={styles.credits__role}>{BRIDGE.role}</span>
        <span className={styles.credits__name}>{BRIDGE.name}</span>
      </div>
    </>
  );
};

export default EcosystemCredits;
