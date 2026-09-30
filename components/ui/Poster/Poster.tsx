'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import type { ICase } from '@/data/types';
import useInView from '@/hooks/useInView';
import styles from './Poster.module.scss';
import { useLocale } from '@/components/i18n/LocaleProvider';

export interface PosterProps {
  item: ICase;
  playing?: boolean;
  /** Мягкий зум кадра при наведении. */
  zoomOnHover?: boolean;
  showTitle?: boolean;
  /** Брать 16:9-версию ролика (`videoWide`), если она есть. */
  wide?: boolean;
  className?: string;
}

const Poster = ({ item, playing = true, zoomOnHover = false, showTitle = true, wide = false, className }: PosterProps) => {
  const { t } = useLocale();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '0px' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const source = wide ? item.videoWide ?? item.video : item.video;
  const [from, to] = item.colors;
  const style = { '--poster-from': from, '--poster-to': to } as CSSProperties;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (inView && playing && !motion.matches && !document.hidden) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    sync();
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      video.pause();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [inView, playing, source?.mp4]);

  return (
    <div
      ref={ref}
      className={clsx(styles.poster, zoomOnHover && styles['poster--zoom'], className)}
      style={style}
    >
      {source && (
        <video
          key={source.mp4}
          ref={videoRef}
          className={styles.poster__video}
          muted
          playsInline
          loop
          preload="none"
          poster={source.poster}
          aria-hidden="true"
        >
          <source src={source.mp4} type="video/mp4" />
          {source.webm && <source src={source.webm} type="video/webm" />}
        </video>
      )}
      {!source && item.poster && (
        // Скриншот живого проекта вместо ролика: те же позиция и object-fit, что у видео.
        <Image src={item.poster} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.poster__video} />
      )}
      <div className={styles.poster__scrim} aria-hidden="true" />
      {showTitle && <span className={styles.poster__title}>{t(item.title)}</span>}
    </div>
  );
};

export default Poster;
