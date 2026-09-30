'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CASES } from '@/data/cases';
import { FEATURED_CASES } from '@/data/studio';
import HeroOrbit from './HeroOrbit';
import useHeroMorph from './hooks/useHeroMorph';
import useOrbit from './hooks/useOrbit';
import styles from './HeroStage.module.scss';
import { useLocale } from '@/components/i18n/LocaleProvider';

export interface HeroStageProps {
  /** Слоган, подзаголовок и кнопки */
  children: ReactNode;
}

const items = FEATURED_CASES.map(slug => CASES.find(item => item.slug === slug)!);

// Первый экран «Созвездие»: кадры проектов едут по орбитам вокруг ядра, по скроллу собираются в колоду «Наших проектов»
const HeroStage = ({ children }: HeroStageProps) => {
  const { locale } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const [morphing, setMorphing] = useState(false);
  const [core, setCore] = useState(0);

  const { coreRef } = useOrbit(ref, setCore);
  // Галерея подхватывает проект, который стоял в ядре
  useHeroMorph(ref, `orbit-${locale}`, () => items[coreRef.current].slug, setMorphing);

  return (
    <section ref={ref} id="hero" className={clsx(styles.hero, morphing && styles['hero--morphing'])}>
      <div className={styles.aurora} data-morph-fade aria-hidden="true">
        <span className={clsx(styles.aurora__blob, styles['aurora__blob--1'])} />
        <span className={clsx(styles.aurora__blob, styles['aurora__blob--2'])} />
        <span className={clsx(styles.aurora__blob, styles['aurora__blob--3'])} />
      </div>
      <div className={styles.hero__copy} data-morph-fade>{children}</div>
      <HeroOrbit items={items} core={core} morphing={morphing} />
    </section>
  );
};

export default HeroStage;
