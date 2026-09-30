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
// Вокруг ядра переливается кромка. На телефоне сцена скрыта, проекты показаны в отдельной галерее
const HeroOrbit = ({ items, core, morphing }: HeroOrbitProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 901px)');
    const currentVideos = videos.current;
    let visible = false;
    const sync = () => currentVideos.forEach((video, index) => {
      if (!video) return;
      if (index === core && !morphing && visible && desktop.matches && !motion.matches && !document.hidden) {
        // Attach only the visible core video: the mobile layout never downloads hidden hero clips
        const source = items[index].videoWide ?? items[index].video;
        if (!video.getAttribute('src') && source) video.src = source.mp4;
        void video.play().catch(() => undefined);
      } else video.pause();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    motion.addEventListener('change', sync);
    desktop.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', sync);
      desktop.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      currentVideos.forEach(video => video?.pause());
    };
  }, [core, morphing, items]);

  return (
    <div ref={stage} className={styles.orbit} data-carousel>
      <div className={styles.orbit__paths} data-morph-fade aria-hidden="true">
        {[1, 2, 3, 4].map(path => <span key={path} className={clsx(styles.orbit__path, styles[`orbit__path--${path}`])} />)}
      </div>
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
                <video ref={(node) => { videos.current[index] = node; }} poster={source.poster} preload="none" muted loop playsInline aria-hidden="true" />
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
