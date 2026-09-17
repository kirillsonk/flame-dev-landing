'use client';

import BaseButton from '@/components/ui/BaseButton/BaseButton';
import { CTA_BAND, CTA_LABEL, CTA_REEL } from '@/data/site';
import useCtaReel from './hooks/useCtaReel';
import styles from './CtaReel.module.scss';

// Вариант «Барабан»: привычные сроки зачёркиваются и прокручиваются, пока барабан не встанет на «дня».
const CtaReel = () => {
  const { sectionRef, windowRef, stripRef, bindWord } = useCtaReel();

  return (
    <section ref={sectionRef} className={styles.reel}>
      <div className={styles.reel__inner}>
        <h2 className={styles.reel__sr}>{CTA_BAND.text}</h2>
        <p className={styles.reel__title} aria-hidden="true">
          {CTA_REEL.lead}
          <span className={styles.reel__nowrap}>{CTA_REEL.middle}</span>{' '}
          <span ref={windowRef} className={styles.reel__window}>
            <span ref={stripRef} className={styles.reel__strip}>
              {[...CTA_REEL.words, CTA_REEL.final].map((word, index) => (
                <span
                  key={word}
                  ref={bindWord(index)}
                  className={index === CTA_REEL.words.length ? styles['reel__word--final'] : styles.reel__word}
                >
                  {word}
                </span>
              ))}
            </span>
          </span>
        </p>
        <BaseButton href="#contact" size="l" arrow>
          {CTA_LABEL}
        </BaseButton>
      </div>
    </section>
  );
};

export default CtaReel;
