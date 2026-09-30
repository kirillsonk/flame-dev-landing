import { STUDIO } from '@/data/studio';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import Brief from './Brief';
import styles from './Brief.module.scss';

const BriefContact = () => {
  return <section className={styles.contact} id="contact"><div className={styles.contact__inner}><div className={styles.contact__intro}><p className={styles.hint}>{STUDIO.contact.eyebrow}</p><h2>{STUDIO.contact.title}</h2><a href={`mailto:${STUDIO.contact.link}`}>{STUDIO.contact.link} <BaseArrow size="l" /></a></div><div className={styles.contact__form}><Brief /></div></div></section>;
};
export default BriefContact;
