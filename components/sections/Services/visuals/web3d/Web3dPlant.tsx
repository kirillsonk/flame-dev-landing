'use client';

import { useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { WEB3D_PLANT as copy } from '@/data/demosWeb3d';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import w3d from './Web3d.module.scss';
import { PlantScene } from './PlantScene';
import useWeb3dScene from './hooks/useWeb3dScene';
import styles from './Web3dPlant.module.scss';

// «Облёт макета станции»: хотспоты, стрелки и зум кнопками подводят камеру к зданиям АЭС.
const Web3dPlant = () => {
  const hintId = useId();
  const hotspotsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(-1);
  const { viewRef, sceneRef, failed } = useWeb3dScene(
    (node) => new PlantScene(node, { hotspots: () => hotspotsRef.current, onSelect: setSelected }),
  );
  const current = copy.hotspots[selected];

  return (
    <div className={clsx(ui.panel, w3d.web3d)}>
      <div
        ref={viewRef}
        className={w3d.web3d__view}
        tabIndex={0}
        role="application"
        aria-label={copy.label}
        aria-describedby={hintId}
      />
      <div className={w3d.web3d__head}>
        <div className={ui.header}>
          <span className={ui.wordmark}>{copy.name}</span>
          <span className={ui.badge}>{copy.badge}</span>
        </div>
        <h4 className={ui.title}>{copy.title}</h4>
      </div>
      {copy.hotspots.map((item, index) => (
        <button
          key={item.title}
          ref={(node) => {
            hotspotsRef.current[index] = node;
          }}
          type="button"
          disabled={failed}
          data-hidden="true"
          aria-pressed={selected === index}
          aria-label={item.title}
          className={clsx(styles.plant__hotspot, selected === index && styles['plant__hotspot--active'])}
          onClick={() => sceneRef.current?.focus(index)}
        >
          {index + 1}
        </button>
      ))}
      <div className={clsx(w3d.web3d__card, styles.plant__card)} aria-live="polite">
        <div key={selected} className={w3d.web3d__swap}>
          <span className={w3d.web3d__dim}>
            {current ? `${copy.object} ${selected + 1} ${copy.of} ${copy.hotspots.length}` : copy.overview}
          </span>
          <b className={clsx(w3d.web3d__title, styles.plant__heading)}>{current ? current.title : copy.overviewTitle}</b>
          <span className={w3d.web3d__dim}>{current ? current.text : copy.overviewText}</span>
        </div>
      </div>
      <div className={w3d.web3d__bar}>
        <button
          type="button"
          disabled={failed}
          aria-label={copy.prev}
          className={clsx(ui.button, w3d.web3d__control)}
          onClick={() => sceneRef.current?.step(-1)}
        >
          ←
        </button>
        <button
          type="button"
          disabled={failed}
          aria-label={copy.next}
          className={clsx(ui.button, w3d.web3d__control)}
          onClick={() => sceneRef.current?.step(1)}
        >
          →
        </button>
        <button
          type="button"
          disabled={failed}
          aria-label={copy.zoomIn}
          className={clsx(ui.button, w3d.web3d__control)}
          onClick={() => sceneRef.current?.zoom(-1)}
        >
          +
        </button>
        <button
          type="button"
          disabled={failed}
          aria-label={copy.zoomOut}
          className={clsx(ui.button, w3d.web3d__control)}
          onClick={() => sceneRef.current?.zoom(1)}
        >
          −
        </button>
        <button
          type="button"
          disabled={failed}
          aria-pressed={selected < 0}
          className={clsx(ui.button, selected < 0 && ui['button--active'])}
          onClick={() => sceneRef.current?.overview()}
        >
          {copy.overview}
        </button>
        <span id={hintId} className={w3d.web3d__hint}>
          {copy.hint}
        </span>
      </div>
      {failed && <p className={w3d.web3d__fallback}>{copy.fallback}</p>}
    </div>
  );
};

export default Web3dPlant;
