'use client';

import { useRef, useState } from 'react';
import type { ICase } from '@/data/types';
import { STUDIO } from '@/data/studio';
import styles from './Studio.module.scss';

export interface ProjectVisualProps { item: ICase }

const ProjectVisual = ({ item }: ProjectVisualProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const source = item.videoWide ?? item.video;
  if (!source) return null;
  const toggle = async () => {
    if (!video.current) return;
    if (playing) video.current.pause();
    else { try { await video.current.play(); } catch { setPlaying(false); } }
  };
  return (
    <div className={styles.visual}>
      <video ref={video} poster={source.poster} preload="none" playsInline muted loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src={source.mp4} type="video/mp4" />
      </video>
      <button type="button" className={styles.visual__play} onClick={toggle} aria-pressed={playing}>
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? STUDIO.feature.pause : STUDIO.feature.play}
      </button>
    </div>
  );
};
export default ProjectVisual;
