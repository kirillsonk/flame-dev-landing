'use client';

import { CONTACT } from '@/data/site';
import ContactLinks from './ContactLinks';
import LeadForm from './LeadForm';
import useContactChat from './hooks/useContactChat';
import styles from './ContactChat.module.scss';

// Вариант «Чат»: секция разыгрывается как переписка — «печатает…», пузыри с заголовком
// и сроками, иконки как быстрые ответы, форма поднимается снизу, как поле ввода.
const ContactChat = () => {
  const { sectionRef, typingRef, titleRef, textRef, linksRef, formRef } = useContactChat();

  return (
    <section ref={sectionRef} className={styles.chat} id="contact">
      <div className={styles.chat__inner}>
        <div className={styles.chat__info}>
          <div ref={typingRef} className={styles.chat__typing} aria-hidden="true">
            <i className={styles.chat__dot} />
            <i className={styles.chat__dot} />
            <i className={styles.chat__dot} />
          </div>
          <h2 ref={titleRef} className={styles.chat__title}>
            {CONTACT.title}
          </h2>
          <p ref={textRef} className={styles.chat__text}>
            {CONTACT.text}
            <span className={styles.chat__time}>{CONTACT.chatTime}</span>
          </p>
          <ContactLinks ref={linksRef} />
        </div>
        <div ref={formRef} className={styles.chat__form}>
          <LeadForm />
        </div>
      </div>
    </section>
  );
};

export default ContactChat;
