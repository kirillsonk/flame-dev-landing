import BaseIcon from '@/components/ui/BaseIcon/BaseIcon';
import { CONTACT } from '@/data/site';
import LeadForm from './LeadForm';
import styles from './Contact.module.scss';

const Contact = () => {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contact__info} data-reveal>
        <h2 className={styles.contact__title}>{CONTACT.title}</h2>
        <p className={styles.contact__text}>{CONTACT.text}</p>
        <ul className={styles.contact__links}>
          {CONTACT.links.map((link) => {
            const external = link.href.startsWith('http');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.contact__link}
                  aria-label={link.label}
                  title={link.label}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                >
                  <BaseIcon name={link.icon} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.contact__form} data-reveal>
        <LeadForm />
      </div>
    </section>
  );
};

export default Contact;
