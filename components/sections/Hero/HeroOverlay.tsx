'use client';

import CtaButton from '@/components/cta/CtaButton/CtaButton';
import { HERO_INTRO, HERO_PROMO } from '@/data/site';
import HeroPill from './HeroPill';
import useHeroOverlayScroll from './hooks/useHeroOverlayScroll';
import styles from './HeroOverlay.module.scss';

// Первый экран: заголовок поверх промо-ролика во весь экран. По скроллу ролик сжимается в карточку,
// дальше уходит в зум и размытие под наезжающими кейсами (см. useHomeTransition).
const HeroOverlay = () => {
  const { sectionRef, frameRef, veilRef, shadeRef, bottomRef, footRef } = useHeroOverlayScroll();

  return (
    <section ref={sectionRef} className={styles.heroOverlay} id="hero">
      {/* Обёртка содержимого: переход к кейсам трансформирует её, а не секцию, которую держит пин. */}
      <div className={styles.heroOverlay__body} data-transition="hero-body">
        {/* По скроллу фрейм из полноэкранного превращается в карточку 16:9 между шапкой
            и нижним блоком (см. useHeroOverlayScroll). */}
        <div ref={frameRef} className={styles.heroOverlay__frame} data-transition="hero-frame">
          <video
            className={styles.heroOverlay__video}
            style={{ backgroundImage: `url(${HERO_PROMO.poster})` }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_PROMO.poster}
            aria-hidden="true"
          >
            {HERO_PROMO.webm && <source src={HERO_PROMO.webm} type="video/webm" />}
            <source src={HERO_PROMO.mp4} type="video/mp4" />
          </video>
        </div>

        <div ref={veilRef} className={styles.heroOverlay__veil} aria-hidden="true" />
        {/* Подложка нижнего блока: в раскрытом состоянии гаснет вместе с затемнением,
            иначе она ложилась бы на нижний край карточки. */}
        <div ref={shadeRef} className={styles.heroOverlay__shade} aria-hidden="true" />

        <div className={styles.heroOverlay__inner}>
          {/* По скроллу уезжает только текст: кнопки остаются. */}
          <div ref={bottomRef} className={styles.heroOverlay__text} data-transition="hero-text">
            <ul className={styles.heroOverlay__pills} aria-label={HERO_INTRO.eyebrowLabel}>
              {HERO_INTRO.eyebrow.map((item) => (
                <li key={item.service}>
                  <HeroPill pill={item} />
                </li>
              ))}
            </ul>
            <h1 className={styles.heroOverlay__title}>
              {HERO_INTRO.title.map((line) => (
                <span key={line} className={styles.heroOverlay__line}>
                  {line}{' '}
                </span>
              ))}
            </h1>
            <p className={styles.heroOverlay__lead}>{HERO_INTRO.text}</p>
          </div>

          <div ref={footRef} className={styles.heroOverlay__foot} data-transition="hero-foot">
            <a href={HERO_INTRO.secondary.href} className={styles.heroOverlay__secondary}>
              {HERO_INTRO.secondary.label}
              <span className={styles.heroOverlay__arrow} aria-hidden="true">
                →
              </span>
            </a>
            <CtaButton className={styles.heroOverlay__cta} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroOverlay;
