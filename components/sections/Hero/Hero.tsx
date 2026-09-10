import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { HERO_REEL } from '@/data/cases';
import { CTA_LABEL, HERO } from '@/data/site';
import HeroReel from './HeroReel';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.hero__top}>
        <h1 className={styles.hero__title}>{HERO.title}</h1>
        <ul className={styles.hero__stats}>
          {HERO.stats.map((stat) => (
            <li key={stat} className={styles.hero__stat}>{stat}</li>
          ))}
        </ul>
      </div>
      <HeroReel items={HERO_REEL} />
      <div className={styles.hero__mobileCta}>
        <BaseButton href="#contact" block>{CTA_LABEL}</BaseButton>
      </div>
    </section>
  );
};

export default Hero;
