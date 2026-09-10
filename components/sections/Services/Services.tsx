import { SERVICES } from '@/data/services';
import ServiceCard from './ServiceCard';
import styles from './Services.module.scss';

const Services = () => {
  return (
    <section className={styles.services} id="services">
      <h2 className={styles.services__title} data-reveal>Что мы делаем</h2>
      <div className={styles.services__grid}>
        {SERVICES.map((item) => (
          <ServiceCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Services;
