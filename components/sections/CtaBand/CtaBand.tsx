import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_LABEL } from '@/data/site';
import styles from './CtaBand.module.scss';

const CtaBand = () => {
  return (
    <section className={styles.band}>
      <div className={styles.band__inner}>
        <p className={styles.band__text}>{CTA_BAND.text}</p>
        <BaseButton href="#contact" variant="inverse" arrow>{CTA_LABEL}</BaseButton>
      </div>
    </section>
  );
};

export default CtaBand;
