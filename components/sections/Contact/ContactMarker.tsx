'use client';

import { CONTACT } from '@/data/site';
import ContactLinks from './ContactLinks';
import LeadForm from './LeadForm';
import useContactMarker from './hooks/useContactMarker';
import styles from './ContactMarker.module.scss';

// Вариант «Маркер»: слова заголовка прописываются белым, под «задаче» ложится росчерк,
// обещания по срокам закрашиваются маркером с градиентом Flame.
const ContactMarker = () => {
  const { sectionRef, titleRef, textRef, linksRef, formRef } = useContactMarker();
  const words = CONTACT.title.split(' ');

  return (
    <section ref={sectionRef} className={styles.marker} id="contact">
      <div className={styles.marker__inner}>
        <div className={styles.marker__info}>
          <h2 ref={titleRef} className={styles.marker__title}>
            {words.map((word, index) => (
              <span key={word + index}>
                {index > 0 && ' '}
                <span className={styles.marker__word} data-word>
                  {word}
                  {index === words.length - 1 && (
                    <svg className={styles.marker__swash} viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                      <path pathLength={1} d="M4 17C48 7 120 5 196 12" />
                    </svg>
                  )}
                </span>
              </span>
            ))}
          </h2>
          <p ref={textRef} className={styles.marker__text}>
            {CONTACT.textMarked.map((part) =>
              part.mark ? (
                <mark key={part.text} className={styles.marker__mark} data-mark>
                  {part.text}
                </mark>
              ) : (
                part.text
              ),
            )}
          </p>
          <ContactLinks ref={linksRef} />
        </div>
        <div ref={formRef} className={styles.marker__form}>
          <LeadForm />
        </div>
      </div>
    </section>
  );
};

export default ContactMarker;
