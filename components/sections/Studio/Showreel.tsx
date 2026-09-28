'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import styles from './Showreel.module.scss';

export interface ShowreelProps {
  items: ICase[];
  active: number;
  incoming: number | null;
  cycle: number;
  playing: boolean;
}

// Ролики проектов друг за другом: следующий наплывает мягкой шторкой, по ее кромке идет световая полоса.
// Играют только активный и наплывающий ролики, остальные ждут с постером и без загрузки
const Showreel = ({ items, active, incoming, cycle, playing }: ShowreelProps) => {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const next = (active + 1) % items.length;

  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (playing && (index === active || index === incoming)) void video.play().catch(() => {});
      else video.pause();
    });
  }, [active, incoming, playing]);

  return (
    <div className={styles.reel} aria-hidden="true">
      {items.map((item, index) => {
        const source = item.videoWide ?? item.video;
        if (!source) return null;
        const needed = index === active || index === incoming || index === next;
        return (
          <video
            key={item.slug}
            ref={(node) => { videos.current[index] = node; }}
            className={clsx(styles.reel__clip, index === active && styles['reel__clip--active'], index === incoming && styles['reel__clip--in'])}
            poster={source.poster}
            preload={needed ? 'auto' : 'none'}
            muted
            loop
            playsInline
          >
            <source src={source.mp4} type="video/mp4" />
          </video>
        );
      })}
      {incoming !== null && <span key={cycle} className={styles.reel__glow} />}
    </div>
  );
};

export default Showreel;
