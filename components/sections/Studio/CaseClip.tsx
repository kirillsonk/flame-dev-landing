'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { ICaseVideo } from '@/data/types';
import styles from './CaseClip.module.scss';

export interface CaseClipProps {
  video?: ICaseVideo;
}

// Ролик кейса поверх постера: грузится и играет без звука, только пока карточка на экране.
// Постер под ним остается, ролик проявляется с первым кадром. При prefers-reduced-motion видео не запускается
const CaseClip = ({ video }: CaseClipProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [readySrc, setReadySrc] = useState<string>();
  const src = video?.mp4;

  useEffect(() => {
    const node = ref.current;
    if (!node || !src) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (visible && !motion.matches && !document.hidden) {
        if (node.getAttribute('src') !== src) node.src = src;
        if (node.paused) void node.play().catch(() => undefined);
      } else node.pause();
    };
    const onPlaying = () => setReadySrc(src);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.35 });
    observer.observe(node);
    node.addEventListener('playing', onPlaying);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      node.removeEventListener('playing', onPlaying);
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      // Карточку пролистали: обрываем загрузку ролика, а не только ставим на паузу
      node.pause();
      node.removeAttribute('src');
      node.load();
    };
  }, [src]);

  if (!src) return null;
  return <video ref={ref} className={clsx(styles.clip, readySrc === src && styles['clip--ready'])} muted loop playsInline preload="none" aria-hidden="true" />;
};

export default CaseClip;
