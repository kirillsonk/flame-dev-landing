'use client';

import { SERVICES_TITLE } from '@/data/site';
import { SERVICES } from '@/data/services';
import ServiceSlide from './ServiceSlide';
import type { IServiceDemoVariants } from './visuals/ServiceVisual';
import useServicesStack from './hooks/useServicesStack';
import styles from './Services.module.scss';

export interface ServicesProps {
  demos?: IServiceDemoVariants;
}

const Services = ({ demos }: ServicesProps) => {
  const { setSlideRef } = useServicesStack(SERVICES.length);

  return (
    <section className={styles.services} id="services">
      <h2 className={styles.services__title} data-reveal>{SERVICES_TITLE}</h2>
      <div className={styles.services__list}>
        {SERVICES.map((item, index) => (
          <ServiceSlide key={item.slug} ref={setSlideRef(index)} item={item} demos={demos} />
        ))}
      </div>
    </section>
  );
};

export default Services;
