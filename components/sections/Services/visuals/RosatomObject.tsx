'use client';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RosatomScene } from '@/components/sections/Services/visuals/RosatomScene';
import { ATOM_DEMO as copy } from '@/data/demos';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import styles from './RosatomObject.module.scss';
const RosatomObject = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scene = useRef<RosatomScene | null>(null);
  const [mode, setMode] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    try {
      scene.current = new RosatomScene(ref.current);
    } catch {
      queueMicrotask(() => setFailed(true));
    }
    return () => {
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);
  return (
    <div className={clsx(ui.panel, styles.object)}>
      <div className={ui.header}>
        <span className={ui.wordmark}>{copy.name}</span>
        <span className={ui.badge}>{copy.badge}</span>
      </div>
      <h4 className={ui.title}>{copy.title}</h4>
      <div
        className={styles.object__viewport}
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={copy.label}
        aria-describedby="atom-instruction"
      >
        {failed && <p className={styles.object__fallback}>{copy.fallback}</p>}
      </div>
      <div className={styles.object__controls}>
        <div className={ui.toolbar}>
          {copy.modes.map((label, index) => (
            <button
              key={label}
              disabled={failed}
              aria-pressed={mode === index}
              className={clsx(ui.button, mode === index && ui['button--active'])}
              onClick={() => {
                setMode(index);
                scene.current?.setMode(index === 1);
              }}
            >
              {label}
            </button>
          ))}
          <button
            className={ui.button}
            disabled={failed}
            aria-pressed={paused}
            onClick={() => {
              setPaused(!paused);
              scene.current?.setPaused(!paused);
            }}
          >
            {paused ? copy.play : copy.pause}
          </button>
          <button
            className={ui.button}
            disabled={failed}
            onClick={() => scene.current?.reset()}
            aria-label={copy.reset}
          >
            ↺
          </button>
        </div>
        <p id="atom-instruction" className={ui.muted}>
          {copy.hint}
        </p>
      </div>
    </div>
  );
};
export default RosatomObject;
