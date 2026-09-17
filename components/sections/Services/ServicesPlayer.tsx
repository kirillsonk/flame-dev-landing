'use client';

import BaseTag from '@/components/ui/BaseTag/BaseTag';
import { SERVICES, SERVICES_PLAYER_CHIPS } from '@/data/services';
import { SERVICES_TITLE } from '@/data/site';
import ServiceVisual from './visuals/ServiceVisual';
import type { IServiceDemoVariants } from './visuals/ServiceVisual';
import useServicesPlayer from './hooks/useServicesPlayer';
import styles from './ServicesPlayer.module.scss';

// Вариант «Сцена-плеер»: скролл как перемотка — в закреплённой рамке по очереди идут живые демо услуг,
// слева раскрывается описание текущей, под рамкой дорожка с метками и полосой прогресса.
export interface ServicesPlayerProps {
  demos?: IServiceDemoVariants;
}

const ServicesPlayer = ({ demos }: ServicesPlayerProps) => {
  const { sectionRef } = useServicesPlayer(SERVICES.length);

  return (
    <section ref={sectionRef} className={styles.player} id="services">
      {/* Заголовок над колонками и без data-reveal: внутри пина наблюдатель появления не срабатывал,
          и заголовок оставался прозрачным, оставляя пустоту над списком. */}
      <h2 className={styles.player__title}>{SERVICES_TITLE}</h2>
      <div className={styles.player__grid}>
        <ol className={styles.player__nav}>
          {SERVICES.map((item, index) => (
            <li key={item.slug} className={styles.player__item} data-part="item">
              <div className={styles.player__top}>
                <span className={styles.player__number}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className={styles.player__name}>{item.title}</h3>
              </div>
              <div className={styles.player__body}>
                <div className={styles.player__inner}>
                  <p className={styles.player__description}>{item.description}</p>
                  <div className={styles.player__tags}>
                    {item.stack.map((tech) => (
                      <BaseTag key={tech}>{tech}</BaseTag>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.player__deck}>
          <div className={styles.player__screen}>
            {SERVICES.map((item) => (
              // data-part="visual" — контракт с визуалами: RosatomScene ищет эту обёртку и слушает
              // на ней `demo-visibility-change`, чтобы останавливать рендер, пока сцена неактивна.
              <div key={item.slug} className={styles.player__scene} data-part="visual" data-kind={item.visual}>
                <ServiceVisual kind={item.visual} demos={demos} />
              </div>
            ))}
          </div>
          <div className={styles.player__rail} aria-hidden="true">
            <div className={styles.player__chips}>
              {SERVICES_PLAYER_CHIPS.map((chip) => (
                <span key={chip} className={styles.player__chip} data-part="chip">
                  {chip}
                </span>
              ))}
            </div>
            <div className={styles.player__track}>
              <span className={styles.player__progress} data-part="progress" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPlayer;
