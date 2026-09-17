'use client';

import { useRef } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import CtaButton from '@/components/cta/CtaButton/CtaButton';
import { HERO_REEL } from '@/data/cases';
import { HERO } from '@/data/site';
import HeroReel from '@/components/sections/Hero/HeroReel';
import HeroChip from '@/components/sections/Hero/HeroChip';
import useHeroFit from './hooks/useHeroFit';
import useHeroCoverPin from './hooks/useHeroCoverPin';
import styles from './Hero.module.scss';

const enterDelay = (seconds: number) => ({ '--enter-delay': `${seconds}s` }) as CSSProperties;

export interface HeroProps {
  /** Следующая секция накрывает первый экран: лента закрепляется на высоту окна. */
  coverNext?: boolean;
}

const Hero = ({ coverNext = false }: HeroProps) => {
  const ref = useRef<HTMLElement | null>(null);
  useHeroFit(ref);
  useHeroCoverPin(ref, coverNext);

  return (
    <section ref={ref} className={styles.hero} id="hero">
      {/* Обёртка содержимого: переход к кейсам трансформирует её, а не секцию, которую держит пин. */}
      <div className={styles.hero__body} data-transition="hero-body">
      <h1 className={clsx(styles.hero__title, styles.hero__enter)} style={enterDelay(0)}>
        {HERO.title.map((part, index) =>
          part.chip ? <HeroChip key={index} part={part} /> : <span key={index}>{part.text}</span>,
        )}
      </h1>
      <div className={clsx(styles.hero__reel, styles.hero__enter)} style={enterDelay(0.12)}>
        <HeroReel items={HERO_REEL} />
      </div>
      <div className={styles.hero__mobileCta}>
        <CtaButton block />
      </div>
      </div>
    </section>
  );
};

export default Hero;
