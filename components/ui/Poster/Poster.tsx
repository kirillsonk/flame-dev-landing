'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import useInView from '@/hooks/useInView';
import styles from './Poster.module.scss';

export interface PosterProps {
  item: ICase;
  playing?: boolean;
  showTitle?: boolean;
  className?: string;
}

const Poster = ({ item, playing = true, showTitle = true, className }: PosterProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [from, to] = item.colors;
  const style = { '--poster-from': from, '--poster-to': to } as CSSProperties;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (inView && playing && !reduced) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, playing]);

  return (
    <div ref={ref} className={clsx(styles.poster, className)} style={style}>
      {item.video && (
        <video
          ref={videoRef}
          className={styles.poster__video}
          muted
          playsInline
          loop
          preload="none"
          poster={item.video.poster}
          aria-hidden="true"
        >
          {item.video.webm && <source src={item.video.webm} type="video/webm" />}
          <source src={item.video.mp4} type="video/mp4" />
        </video>
      )}
      <div className={styles.poster__scrim} aria-hidden="true" />
      {showTitle && <span className={styles.poster__title}>{item.title}</span>}
    </div>
  );
};

export default Poster;
