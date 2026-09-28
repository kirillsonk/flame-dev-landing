'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import { SERVICES } from '@/data/services';
import { STUDIO } from '@/data/studio';
import { SHOWCASE } from '@/data/showcase';
import styles from './ServiceShowcase.module.scss';

const Loading = () => <p className={styles.loading} role="status">{SHOWCASE.loading}</p>;
const Scanner = dynamic(() => import('@/components/sections/Services/visuals/tibia/TibiaScanner'), { loading: Loading });
const Game = dynamic(() => import('@/components/sections/Services/visuals/game/GameScratch'), { loading: Loading });
const Flight = dynamic(() => import('@/components/sections/Services/visuals/web3d/Web3dFlight'), { ssr: false, loading: Loading });
const Documents = dynamic(() => import('@/components/sections/Services/visuals/ai/AiDocuments'), { loading: Loading });
const DEMOS = [Scanner, Game, Flight, Documents];

const ServiceShowcase = () => {
  const [active, setActive] = useState(2);
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '250px', once: true });
  const item = SERVICES[active];
  const Demo = DEMOS[active];
  return (
    <div className={styles.showcase} ref={ref}>
      <div className={styles.tabs} role="group" aria-label={STUDIO.services.title.replace('\n', ' ')}>
        {SHOWCASE.tabs.map((label, index) => <button key={label} type="button" aria-pressed={index === active} aria-controls="service-demo" className={clsx(styles.tab, index === active && styles['tab--active'])} onClick={() => setActive(index)}><span>0{index + 1}</span>{label}<span aria-hidden="true">↗</span></button>)}
      </div>
      <div className={styles.body}>
        <div className={styles.copy} key={item.slug}>
          <p className={styles.label}>{SHOWCASE.label}</p>
          <h3>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
          <a href="#contact" className={styles.link}>{STUDIO.services.link}<span aria-hidden="true">↗</span></a>
          <p className={styles.caption}>{SHOWCASE.captions[active]}</p>
        </div>
        <div data-theme="dark" id="service-demo" className={styles.stage} role="region" aria-label={`${SHOWCASE.demoLabel} · ${SHOWCASE.tabs[active]}`}>
          <div className={styles.scene} key={active}>{inView ? <Demo /> : <Loading />}</div>
        </div>
      </div>
      <p className={styles.note}>{SHOWCASE.note}</p>
    </div>
  );
};
export default ServiceShowcase;
