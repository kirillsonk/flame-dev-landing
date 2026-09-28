import Image from 'next/image';
import Link from 'next/link';
import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CASES } from '@/data/cases';
import { SERVICES } from '@/data/services';
import { PROCESS_STEPS, PROCESS_NOTE } from '@/data/process';
import { CTA_LABEL, HERO_INTRO } from '@/data/site';
import { STUDIO, FEATURED_CASES, CASE_CAPTIONS } from '@/data/studio';
import ProjectVisual from './ProjectVisual';
import BriefContact from '@/components/sections/Brief/BriefContact';
import styles from './Studio.module.scss';

const Studio = () => {
  const feature = CASES.find((item) => item.slug === STUDIO.feature.slug)!;
  return (
    <div className={styles.studio}>
      <section className={styles.hero} id="hero">
        <svg className={styles.hero__flame} viewBox="0 0 500 660" fill="none" aria-hidden="true">
          <path d="M270 30C335 180 102 192 142 357C165 452 296 451 295 321C421 432 375 607 238 624C89 641 24 509 56 408C83 320 77 205 270 30Z" />
          <path d="M270 30C287 214 197 247 213 356C255 427 258 521 181 569C331 600 443 461 358 282C341 372 311 393 295 321" />
        </svg>
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>{STUDIO.eyebrow}</p>
          <h1 className={styles.hero__title}>{STUDIO.title.map((line, index) => <span key={line} className={index === 2 ? styles.hero__accent : undefined}>{line}</span>)}</h1>
          <p className={styles.hero__text}>{STUDIO.text}</p>
          <div className={styles.actions}>
            <BaseButton href="#contact" size="l">{CTA_LABEL}</BaseButton>
            <a className={styles.textLink} href="#cases">{HERO_INTRO.secondary.label} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.hero__project}>
          <div className={styles.hero__projectTop}><span>{STUDIO.feature.label}</span><span>Flame Dev / 01</span></div>
          <ProjectVisual item={feature} />
          <Link href={`/cases/${feature.slug}`} className={styles.hero__caption}>
            <div><h2>{STUDIO.feature.title}</h2><p>{STUDIO.feature.description}</p></div><span aria-label={STUDIO.feature.link}>↗</span>
          </Link>
        </div>
        <div className={styles.hero__signature}><span>{STUDIO.signature}</span><span aria-hidden="true">↓</span></div>
      </section>
      <section className={styles.section} id="cases">
        <div className={styles.section__head}><div><p className={styles.eyebrow}>{STUDIO.cases.eyebrow}</p><h2 className={styles.section__title}>{STUDIO.cases.title}</h2></div><p className={styles.section__intro}>{STUDIO.cases.text}</p></div>
        <div className={styles.projects}>
          {FEATURED_CASES.map((slug, index) => {
            const item = CASES.find((entry) => entry.slug === slug)!;
            const poster = item.videoWide?.poster ?? item.video?.poster ?? item.poster;
            return <Link className={styles.project} href={`/cases/${slug}`} key={slug}>
              <div className={styles.project__image}>{poster && <Image src={poster} alt={item.title} fill sizes="(max-width: 900px) 100vw, 50vw" />}<span className={styles.project__number}>0{index + 1}</span><span className={styles.project__arrow} aria-hidden="true">↗</span></div>
              <div className={styles.project__head}><h3>{item.title}</h3><span>{item.tags[0]}</span></div><p>{CASE_CAPTIONS[slug]}</p>
            </Link>;
          })}
        </div>
        <Link href="/cases" className={styles.allProjects}>{STUDIO.cases.all}<span aria-hidden="true">↗</span></Link>
      </section>
      <section className={styles.services} id="services">
        <div className={styles.section__head}><div><p className={styles.eyebrow}>{STUDIO.services.eyebrow}</p><h2 className={styles.section__title}>{STUDIO.services.title}</h2></div></div>
        <div className={styles.services__list}>{SERVICES.map((item, index) => <article className={styles.service} key={item.slug} id={`service-${item.slug}`}><span className={styles.service__number}>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p><a href="#contact" aria-label={`${STUDIO.services.link} · ${item.title}`}><span aria-hidden="true">↗</span></a></article>)}</div>
      </section>
      <section className={styles.section} id="process">
        <div className={styles.section__head}><div><p className={styles.eyebrow}>{STUDIO.process.eyebrow}</p><h2 className={styles.section__title}>{STUDIO.process.title}</h2></div><p className={styles.section__intro}>{PROCESS_NOTE}</p></div>
        <ol className={styles.process}>{PROCESS_STEPS.map((step, index) => <li key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </section>
      <BriefContact />
    </div>
  );
};
export default Studio;
