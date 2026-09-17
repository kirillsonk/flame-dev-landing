'use client';

import clsx from 'clsx';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_CHAT, CTA_LABEL } from '@/data/site';
import useCtaChat from './hooks/useCtaChat';
import styles from './CtaChat.module.scss';

// Вариант «Диалог»: прокрутка ведёт переписку — вопрос, «печатает…», ответ и черновик брифа.
const CtaChat = () => {
  const { sectionRef, questionRef, typingRef, answerRef, inputRef, draftRef } = useCtaChat();

  return (
    <section ref={sectionRef} className={styles.chat}>
      <div className={styles.chat__inner}>
        <h2 className={styles.chat__sr}>{CTA_BAND.text}</h2>

        <div className={styles.chat__thread} aria-hidden="true">
          <div className={styles.chat__row}>
            <span className={styles.chat__avatar}>{CTA_CHAT.avatar}</span>
            <p ref={questionRef} className={styles.chat__bubble}>
              {CTA_BAND.question}
            </p>
          </div>
          <div className={styles.chat__row}>
            <span className={clsx(styles.chat__avatar, styles['chat__avatar--ghost'])} />
            <div className={styles.chat__slot}>
              <div ref={typingRef} className={clsx(styles.chat__bubble, styles['chat__bubble--typing'])}>
                <i className={styles.chat__dot} />
                <i className={styles.chat__dot} />
                <i className={styles.chat__dot} />
              </div>
              <p ref={answerRef} className={styles.chat__bubble}>
                {CTA_BAND.answerLead}
                {CTA_BAND.answerAccent}
              </p>
            </div>
          </div>
        </div>

        <div ref={inputRef} className={styles.chat__input}>
          <span className={styles.chat__field} aria-hidden="true">
            <span ref={draftRef} className={styles.chat__draft} data-placeholder={CTA_CHAT.placeholder} />
            <span className={styles.chat__caret} />
          </span>
          <BaseButton href="#contact" size="l" arrow className={styles.chat__button}>
            {CTA_LABEL}
          </BaseButton>
        </div>
      </div>
    </section>
  );
};

export default CtaChat;
