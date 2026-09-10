import BaseTag from '@/components/ui/BaseTag/BaseTag';
import type { IService } from '@/data/types';
import ServiceVisual from './visuals/ServiceVisual';
import styles from './ServiceCard.module.scss';

export interface ServiceCardProps {
  item: IService;
}

const ServiceCard = ({ item }: ServiceCardProps) => {
  return (
    <article className={styles.serviceCard} data-reveal>
      <span className={styles.serviceCard__hint} aria-hidden="true">интерактив</span>
      <div className={styles.serviceCard__visual}>
        <ServiceVisual kind={item.visual} />
      </div>
      <h3 className={styles.serviceCard__title}>{item.title}</h3>
      <p className={styles.serviceCard__text}>{item.description}</p>
      <div className={styles.serviceCard__stack}>
        {item.stack.map((tech) => (
          <BaseTag key={tech}>{tech}</BaseTag>
        ))}
      </div>
    </article>
  );
};

export default ServiceCard;
