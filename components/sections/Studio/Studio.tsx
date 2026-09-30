'use client';

import { useLocale } from '@/components/i18n/LocaleProvider';
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
import styles from './Studio.module.scss';

const Studio = () => {
  const { t } = useLocale();
  return (
    <div className={styles.studio}>
      <FlameField />
      <HeroStage>
        <div className={styles.hero__copy}>
          <h1 className={styles.hero__title}>{STUDIO.title.map((line, index) => <span key={line} className={index === 2 ? styles.hero__accent : undefined}>{t(line)}</span>)}</h1>
          <p className={styles.hero__text}>{t(STUDIO.text)}</p>
          <div className={styles.actions}>
            <BaseButton href="#contact" size="l">{t(CTA_LABEL)}</BaseButton>
            <BaseButton variant="secondary" size="l" href="#cases">{t(HERO_INTRO.secondary.label)}</BaseButton>
          </div>
        </div>
      </HeroStage>
      <section className={styles.section} id="cases">
        <div className={styles.section__head} data-reveal><h2 className={styles.section__title}>{t(STUDIO.cases.title)}</h2><p className={styles.section__intro}>{t(STUDIO.cases.text)}</p></div>
        <CaseGallery />
        <div className={styles.more}><BaseButton href="/cases" variant="secondary">{t(STUDIO.cases.all)}</BaseButton></div>
      </section>
      <section className={styles.services} id="services">
        <div className={styles.section__head} data-reveal><h2 className={styles.section__title}>{t(STUDIO.services.title)}</h2></div>
        <ServiceShowcase />
      </section>
      <section className={styles.section} id="process">
        <div className={styles.section__head} data-reveal><h2 className={styles.section__title}>{t(STUDIO.process.title)}</h2><p className={styles.section__intro}>{t(PROCESS_NOTE)}</p></div>
        <FlameProcess />
      </section>
      <BriefContact />
      <Ecosystem />
    </div>
  );
};
export default Studio;
