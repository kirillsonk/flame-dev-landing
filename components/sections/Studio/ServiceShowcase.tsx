'use client';

import { useId, useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import { SERVICES, SERVICES_PLAYER_CHIPS } from '@/data/services';
import { STUDIO } from '@/data/studio';
import { SHOWCASE } from '@/data/showcase';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import styles from './ServiceShowcase.module.scss';

const Loading = () => <p className={styles.loading} role="status">{SHOWCASE.loading}</p>;
const Report = dynamic(() => import('@/components/sections/Services/visuals/tibia/TibiaReport'), { loading: Loading });
const Catch = dynamic(() => import('@/components/sections/Services/visuals/game/GameCatch'), { loading: Loading });
const Flight = dynamic(() => import('@/components/sections/Services/visuals/web3d/Web3dFlight'), { ssr: false, loading: Loading });
const Invoice = dynamic(() => import('@/components/sections/Services/visuals/ai/AiInvoice'), { loading: Loading });
const DEMOS = [Report, Catch, Flight, Invoice];

const ServiceShowcase = () => {
  const [active, setActive] = useState(0);
  const id = useId();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '250px', once: true });
  const Demo = DEMOS[active];
  return <div className={styles.showcase} ref={ref}>
    <div className={styles.directions}>
      {SERVICES.map((item, index) => <div key={item.slug} className={clsx(styles.direction, active === index && styles['direction--active'])}>
        <h3><button type="button" className={styles.direction__button} aria-expanded={index === active} aria-controls={`${id}-${item.slug}`} onClick={() => setActive(index)}>{item.title}<span aria-hidden="true">{active === index ? '−' : '+'}</span></button></h3>
        <div id={`${id}-${item.slug}`} hidden={active !== index} className={styles.direction__details}>
          <p>{item.description}</p>
          <BaseButton href="#contact" variant="text" className={styles.link}>{STUDIO.services.link}<BaseArrow direction="right" /></BaseButton>
        </div>
      </div>)}
    </div>
    <div className={styles.player}>
      <div data-theme="dark" data-part="visual" id={`${id}-demo`} className={clsx(styles.stage, (active === 0 || active === 3) && styles['stage--document'])} role="region" aria-label={`${SHOWCASE.demoLabel} · ${SHOWCASE.names[active]}`}>
        <div className={styles.scene} key={active}>{inView ? <Demo /> : <Loading />}</div>
      </div>
      <div className={styles.rail} role="group" aria-label={SHOWCASE.demoLabel}>
        {SERVICES_PLAYER_CHIPS.map((label, index) => <button key={label} type="button" aria-pressed={index === active} aria-controls={`${id}-demo`} onClick={() => setActive(index)}><span aria-hidden="true" />{label}</button>)}
        <p className={styles.caption}>{SHOWCASE.names[active]}</p>
      </div>
    </div>
  </div>;
};
export default ServiceShowcase;
