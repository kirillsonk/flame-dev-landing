'use client';

import { useEffect, useRef } from 'react';
import type { ICase } from '@/data/types';
import styles from './Studio.module.scss';

export interface ProjectVisualProps { item: ICase; active: boolean }

const ProjectVisual = ({ item, active }: ProjectVisualProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const source = item.videoWide ?? item.video;
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (active && !document.hidden && !motion.matches) void node.play().catch(() => {});
      else node.pause();
    };
    sync();
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { node.pause(); motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, [active]);
  if (!source) return null;
  return <div className={styles.visual}>
    <video ref={video} poster={source.poster} preload="metadata" playsInline muted loop aria-hidden="true">
      <source src={source.mp4} type="video/mp4" />
    </video>
  </div>;
};
export default ProjectVisual;
