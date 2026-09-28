'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import { CASE_TYPES, HERO_STAGE } from '@/data/studio';
import styles from './HeroStage.module.scss';

export interface HeroOrbitProps {
  items: ICase[];
  /** Кадр в ядре */
  core: number;
  morphing: boolean;
}

// Роль кадра в перелете в колоду галереи: ядро ложится картой, два следующих задними картами
const morphRole = (index: number, core: number, count: number) => {
  const order = (index - core + count) % count;
  return order === 0 ? 'card' : order <= 2 ? `back-${order}` : 'extra';
};

// Ядро по центру, остальные кадры едут вокруг него по орбитам (см. useOrbit).
// Вокруг ядра переливается кромка. На телефоне кадры стоят лентой с горизонтальной прокруткой
const HeroOrbit = ({ items, core, morphing }: HeroOrbitProps) => {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === (morphing ? -1 : core) && !motion) void video.play().catch(() => {});
      else video.pause();
    });
  }, [core, morphing]);

  return (
    <div className={styles.orbit} data-carousel>
      {items.map((item, index) => {
        const source = item.videoWide ?? item.video;
        if (!source) return null;
        const isCore = index === core;
        return (
          <div key={item.slug} className={clsx(styles.orbit__slot, styles[`orbit__slot--${index}`])} data-morph-slot>
            <div className={styles.orbit__float} data-orbit-item data-index={index}>
              <span className={clsx(styles.orbit__ring, isCore && styles['orbit__ring--on'])} data-morph-fade aria-hidden="true" />
              <Link
                href={`/cases/${item.slug}`}
                className={clsx(styles.orbit__frame, isCore && styles['orbit__frame--core'])}
                data-morph-source={morphRole(index, core, items.length)}
                aria-label={`${HERO_STAGE.open} · ${item.title}`}
              >
                <video ref={(node) => { videos.current[index] = node; }} poster={source.poster} preload={index === 0 ? 'auto' : 'none'} muted loop playsInline aria-hidden="true">
                  <source src={source.mp4} type="video/mp4" />
                </video>
                <span className={styles.orbit__dim} data-orbit-dim aria-hidden="true" />
                <span className={styles.orbit__label} data-morph-fade>
                  <span className={styles.orbit__chip}>{item.title}<span>{CASE_TYPES[item.slug]}</span></span>
                </span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroOrbit;
