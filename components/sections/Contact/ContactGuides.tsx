'use client';

import clsx from 'clsx';
import { CONTACT } from '@/data/site';
import ContactLinks from './ContactLinks';
import LeadForm from './LeadForm';
import useContactGuides, { GUIDE_LINES } from './hooks/useContactGuides';
import styles from './ContactGuides.module.scss';

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

// Вариант «Направляющие»: как в Figma — прочерчивается сетка, колонка текста и форма
// с рамкой выделения защёлкиваются на ней, метки показывают отступы, затем разметка гаснет.
const ContactGuides = () => {
  const { sectionRef, innerRef, infoRef, formRef, linesRef, selRef, gapTagRef, sizeTagRef } = useContactGuides();

  return (
    <section ref={sectionRef} className={styles.guides} id="contact">
      <div ref={innerRef} className={styles.guides__inner}>
        <div ref={infoRef} className={styles.guides__info}>
          <h2 className={styles.guides__title}>{CONTACT.title}</h2>
          <p className={styles.guides__text}>{CONTACT.text}</p>
          <ContactLinks />
        </div>
        <div ref={formRef} className={styles.guides__form}>
          <LeadForm />
        </div>
        <div className={styles.guides__overlay} aria-hidden="true">
          <svg ref={linesRef} className={styles.guides__lines} focusable="false">
            {Array.from({ length: GUIDE_LINES }, (_, index) => (
              <line
                key={index}
                pathLength={1}
                className={clsx(styles.guides__line, index === GUIDE_LINES - 1 && styles['guides__line--measure'])}
              />
            ))}
          </svg>
          <span ref={selRef} className={styles.guides__sel}>
            {CORNERS.map((corner) => (
              <i key={corner} className={clsx(styles.guides__handle, styles[`guides__handle--${corner}`])} />
            ))}
          </span>
          <span ref={gapTagRef} className={styles.guides__tag} />
          <span ref={sizeTagRef} className={styles.guides__tag} />
        </div>
      </div>
    </section>
  );
};

export default ContactGuides;
