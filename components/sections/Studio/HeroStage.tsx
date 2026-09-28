'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import { CASES } from '@/data/cases';
import { FEATURED_CASES, HERO_CASES } from '@/data/studio';
import Showreel from './Showreel';
import ReelCaption from './ReelCaption';
import HeroOrbit from './HeroOrbit';
import HeroSwitch from './HeroSwitch';
import useHeroVariant, { SHOW_HERO_SWITCH } from './hooks/useHeroVariant';
import useHeroMorph from './hooks/useHeroMorph';
import useShowreel from './hooks/useShowreel';
import useFloat from './hooks/useFloat';
import styles from './HeroStage.module.scss';

export interface HeroStageProps {
  /** Слоган, подзаголовок и кнопки: общие для всех вариантов */
  children: ReactNode;
}

const reelItems = HERO_CASES.map(slug => CASES.find(item => item.slug === slug)!);
const orbitItems = FEATURED_CASES.map(slug => CASES.find(item => item.slug === slug)!);

const Aurora = ({ className }: { className?: string }) => (
  <div className={clsx(styles.aurora, className)} data-morph-fade aria-hidden="true">
    <span className={clsx(styles.aurora__blob, styles['aurora__blob--1'])} />
    <span className={clsx(styles.aurora__blob, styles['aurora__blob--2'])} />
    <span className={clsx(styles.aurora__blob, styles['aurora__blob--3'])} />
  </div>
);

// Первый экран в трех вариантах. Во всех главный визуал по скроллу перелетает в колоду «Наших проектов»
const HeroStage = ({ children }: HeroStageProps) => {
  const { variant, select } = useHeroVariant();
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '0px' });
  const [morphing, setMorphing] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const running = inView && !morphing && !reduced && variant !== 'orbit';
  const reel = useShowreel(reelItems.length, running);
  const current = reel.incoming ?? reel.active;

  useHeroMorph(ref, variant, () => (variant === 'orbit' ? orbitItems[0].slug : reelItems[current].slug), setMorphing);
  useFloat(ref, variant);

  const showreel = <Showreel items={reelItems} active={reel.active} incoming={reel.incoming} cycle={reel.cycle} playing={inView && !reduced} />;
  const caption = (className: string) => <ReelCaption className={className} items={reelItems} current={current} cycle={reel.cycle} running={running} onSelect={reel.select} />;

  return (
    <section ref={ref} id="hero" className={clsx(styles.hero, styles[`hero--${variant}`], morphing && styles['hero--morphing'])}>
      {variant === 'full' && (
        <div className={styles.full} data-morph-slot>
          <div className={styles.full__media} data-morph-source="card">
            {showreel}
            <span className={styles.full__veil} data-morph-fade />
          </div>
        </div>
      )}
      <Aurora className={styles[`aurora--${variant}`]} />
      <div className={styles.hero__copy} data-morph-fade>{children}</div>
      {variant === 'portal' && (
        <div className={styles.portal}>
          <div className={styles.portal__slot} data-morph-slot>
            <div className={styles.portal__float} data-float data-depth="1" data-amp="5" data-tilt="0">
              <span className={styles.portal__ring} data-morph-fade aria-hidden="true" />
              <div className={styles.portal__media} data-morph-source="card">{showreel}</div>
            </div>
          </div>
          {caption(styles.portal__caption)}
        </div>
      )}
      {variant === 'orbit' && <HeroOrbit items={orbitItems} morphing={morphing} />}
      {variant === 'full' && caption(styles.full__caption)}
      {SHOW_HERO_SWITCH && <HeroSwitch variant={variant} onSelect={select} />}
    </section>
  );
};

export default HeroStage;
