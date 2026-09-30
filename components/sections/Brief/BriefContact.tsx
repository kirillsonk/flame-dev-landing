import { STUDIO } from '@/data/studio';
import Brief from './Brief';
import styles from './Brief.module.scss';

const BriefContact = () => {
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-title">
      <div className={styles.contact__inner}>
        <div className={styles.contact__intro}>
          <h2 id="contact-title">{STUDIO.contact.title}</h2>
        </div>
        <div className={styles.contact__form}><Brief /></div>
      </div>
    </section>
  );
};
export default BriefContact;
