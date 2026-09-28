'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import { CASE_TYPES, HERO_STAGE } from '@/data/studio';
import styles from './HeroStage.module.scss';

export interface HeroOrbitProps {
  items: ICase[];
  morphing: boolean;
}

// Глубина, амплитуда дрейфа и базовый наклон каждого кадра. Первые три ложатся в колоду галереи
const FRAMES = [
  { depth: 1, amp: 6, tilt: -2, role: 'card' },
  { depth: .7, amp: 9, tilt: 4, role: 'back-1' },
  { depth: .8, amp: 8, tilt: -5, role: 'back-2' },
  { depth: .4, amp: 12, tilt: 6, role: 'extra' },
  { depth: .35, amp: 10, tilt: -8, role: 'extra' },
  { depth: .3, amp: 14, tilt: 3, role: 'extra' },
];

const HeroOrbit = ({ items, morphing }: HeroOrbitProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const playing = morphing ? null : hovered ?? 0;

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === playing && !motion) void video.play().catch(() => {});
      else video.pause();
    });
  }, [playing]);

  return (
    <div className={styles.orbit}>
      {FRAMES.map((frame, index) => {
        const item = items[index];
        const source = item?.videoWide ?? item?.video;
        if (!item || !source) return null;
        return (
          <div key={item.slug} className={clsx(styles.orbit__slot, styles[`orbit__slot--${index}`])} data-morph-slot>
            <div className={styles.orbit__float} data-float data-depth={frame.depth} data-amp={frame.amp} data-tilt={frame.tilt}>
              <Link
                href={`/cases/${item.slug}`}
                className={clsx(styles.orbit__frame, frame.role === 'extra' && styles['orbit__frame--far'], hovered === index && styles['orbit__frame--hovered'])}
                data-morph-source={frame.role}
                aria-label={`${HERO_STAGE.open} · ${item.title}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
              >
                <video ref={(node) => { videos.current[index] = node; }} poster={source.poster} preload={index === 0 ? 'auto' : 'none'} muted loop playsInline aria-hidden="true">
                  <source src={source.mp4} type="video/mp4" />
                </video>
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
