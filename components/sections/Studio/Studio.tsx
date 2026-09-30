import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { PROCESS_NOTE } from '@/data/process';
import { CTA_LABEL, HERO_INTRO } from '@/data/site';
import { STUDIO } from '@/data/studio';
import HeroStage from './HeroStage';
import CaseGallery from './CaseGallery';
import FlameProcess from './FlameProcess';
import FlameField from './FlameField';
import ServiceShowcase from './ServiceShowcase';
import BriefContact from '@/components/sections/Brief/BriefContact';
import Ecosystem from '@/components/sections/Ecosystem/Ecosystem';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import styles from './Studio.module.scss';

const Studio = () => {
  return (
    <div className={styles.studio}>
      <FlameField />
      <HeroStage>
        <div className={styles.hero__copy}>
          <h1 className={styles.hero__title}>{STUDIO.title.map((line, index) => <span key={line} className={index === 2 ? styles.hero__accent : undefined}>{line}</span>)}</h1>
          <p className={styles.hero__text}>{STUDIO.text}</p>
          <div className={styles.actions}>
            <BaseButton href="#contact" size="l">{CTA_LABEL}</BaseButton>
            <BaseButton variant="text" href="#cases">{HERO_INTRO.secondary.label} <BaseArrow direction="right" /></BaseButton>
          </div>
        </div>
      </HeroStage>
      <section className={styles.section} id="cases">
        <div className={styles.section__head} data-reveal><div><p className={styles.eyebrow}>{STUDIO.cases.eyebrow}</p><h2 className={styles.section__title}>{STUDIO.cases.title}</h2></div><p className={styles.section__intro}>{STUDIO.cases.text}</p></div>
        <CaseGallery />
        <div className={styles.more}><BaseButton href="/cases" variant="secondary" arrow>{STUDIO.cases.all}</BaseButton></div>
      </section>
      <section className={styles.services} id="services">
        <div className={styles.section__head} data-reveal><div><p className={styles.eyebrow}>{STUDIO.services.eyebrow}</p><h2 className={styles.section__title}>{STUDIO.services.title}</h2></div></div>
        <ServiceShowcase />
      </section>
      <section className={styles.section} id="process">
        <div className={styles.section__head} data-reveal><div><p className={styles.eyebrow}>{STUDIO.process.eyebrow}</p><h2 className={styles.section__title}>{STUDIO.process.title}</h2></div><p className={styles.section__intro}>{PROCESS_NOTE}</p></div>
        <FlameProcess />
      </section>
      <BriefContact />
      <Ecosystem />
    </div>
  );
};
export default Studio;
