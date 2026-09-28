'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CASES } from '@/data/cases';
import { FEATURED_CASES } from '@/data/studio';
import HeroOrbit from './HeroOrbit';
import useHeroMorph from './hooks/useHeroMorph';
import useFloat from './hooks/useFloat';
import styles from './HeroStage.module.scss';

export interface HeroStageProps {
  /** Слоган, подзаголовок и кнопки */
  children: ReactNode;
}

const items = FEATURED_CASES.map(slug => CASES.find(item => item.slug === slug)!);

// Первый экран «Созвездие»: кадры проектов летают вокруг слогана, по скроллу собираются в колоду «Наших проектов»
const HeroStage = ({ children }: HeroStageProps) => {
  const ref = useRef<HTMLElement>(null);
  const [morphing, setMorphing] = useState(false);

  useHeroMorph(ref, 'orbit', () => items[0].slug, setMorphing);
  useFloat(ref, 'orbit');

  return (
    <section ref={ref} id="hero" className={clsx(styles.hero, morphing && styles['hero--morphing'])}>
      <div className={styles.aurora} data-morph-fade aria-hidden="true">
        <span className={clsx(styles.aurora__blob, styles['aurora__blob--1'])} />
        <span className={clsx(styles.aurora__blob, styles['aurora__blob--2'])} />
        <span className={clsx(styles.aurora__blob, styles['aurora__blob--3'])} />
      </div>
      <div className={styles.hero__copy} data-morph-fade>{children}</div>
      <HeroOrbit items={items} morphing={morphing} />
    </section>
  );
};

export default HeroStage;
