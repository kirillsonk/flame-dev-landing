import type { Ref } from 'react';
import BaseTag from '@/components/ui/BaseTag/BaseTag';
import type { IService } from '@/data/types';
import { FLAME_BASE } from './flame';
import ServiceVisual from './visuals/ServiceVisual';
import type { IServiceDemoVariants } from './visuals/ServiceVisual';
import styles from './ServiceSlide.module.scss';

export interface ServiceSlideProps {
  item: IService;
  ref?: Ref<HTMLElement>;
  demos?: IServiceDemoVariants;
}

const ServiceSlide = ({ item, ref, demos }: ServiceSlideProps) => {
  const clipId = `flame-clip-${item.slug}`;

  return (
    <article ref={ref} className={styles.slide}>
      <div className={styles.slide__text} data-part="text" data-reveal>
        <h3 className={styles.slide__title}>{item.title}</h3>
        <p className={styles.slide__description}>{item.description}</p>
        <div className={styles.slide__stack}>
          {item.stack.map((tech) => (
            <BaseTag key={tech}>{tech}</BaseTag>
          ))}
        </div>
      </div>
      <div className={styles.slide__sticky}>
        {/* Огонёк для проявления визуала на десктопе (useServicesStack): визуал обрезан clipPath в форме
            огонька из логотипа, контур растёт по скроллу из нижней кромки рамки. */}
        <svg className={styles.slide__clip} aria-hidden="true" focusable="false">
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={FLAME_BASE} data-part="flame" />
          </clipPath>
        </svg>
        <div className={styles.slide__visual} data-part="visual" data-kind={item.visual} data-clip={clipId}>
          <div className={styles.slide__stage}>
            <ServiceVisual kind={item.visual} demos={demos} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceSlide;
