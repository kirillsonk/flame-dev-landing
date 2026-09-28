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

// Глубина реакции на курсор, амплитуда полета по осям и базовый наклон. Первые три кадра ложатся в колоду галереи
const FRAMES = [
  { depth: 1, amp: 10, tilt: -2, role: 'card' },
  { depth: .7, amp: 16, tilt: 4, role: 'back-1' },
  { depth: .8, amp: 14, tilt: -5, role: 'back-2' },
  { depth: .45, amp: 22, tilt: 6, role: 'extra' },
  { depth: .4, amp: 18, tilt: -8, role: 'extra' },
  { depth: .35, amp: 24, tilt: 3, role: 'extra' },
];

// Кадры проектов летают вокруг слогана. Наведенный вылетает вперед, вокруг переднего кадра переливается кромка.
// На телефоне кадры стоят лентой с горизонтальной прокруткой
const HeroOrbit = ({ items, morphing }: HeroOrbitProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const focused = morphing ? null : hovered;
  // Кромка у переднего кадра: в покое у центрального, при наведении у вылетевшего
  const front = focused ?? 0;

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === (morphing ? -1 : front) && !motion) void video.play().catch(() => {});
      else video.pause();
    });
  }, [front, morphing]);

  return (
    <div className={clsx(styles.orbit, focused !== null && styles['orbit--focused'])} data-carousel>
      {FRAMES.map((frame, index) => {
        const item = items[index];
        const source = item?.videoWide ?? item?.video;
        if (!item || !source) return null;
        return (
          <div key={item.slug} className={clsx(styles.orbit__slot, styles[`orbit__slot--${index}`], focused === index && styles['orbit__slot--focused'])} data-morph-slot>
            <div className={styles.orbit__float} data-float data-depth={frame.depth} data-amp={frame.amp} data-tilt={frame.tilt} data-focus={focused === index ? '1' : '0'}>
              <span className={clsx(styles.orbit__ring, front === index && styles['orbit__ring--on'])} data-morph-fade aria-hidden="true" />
              <Link
                href={`/cases/${item.slug}`}
                className={clsx(styles.orbit__frame, frame.role === 'extra' && styles['orbit__frame--far'], focused === index && styles['orbit__frame--focused'])}
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
                  <span className={styles.orbit__chip} data-float-label>{item.title}<span>{CASE_TYPES[item.slug]}</span></span>
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
