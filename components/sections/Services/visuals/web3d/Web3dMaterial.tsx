'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import { WEB3D_MATERIAL as copy } from '@/data/demosWeb3d';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import w3d from './Web3d.module.scss';
import { MaterialScene } from './MaterialScene';
import useWeb3dScene from './hooks/useWeb3dScene';
import styles from './Web3dMaterial.module.scss';

const START_ROUGHNESS = 18;
const SWATCH_CLASSES = [
  'material__swatch--metal',
  'material__swatch--glass',
  'material__swatch--ceramic',
  'material__swatch--glow',
];

// «Лаборатория материалов»: переключение PBR-материала, шероховатость и цвет вращаемого света.
const Web3dMaterial = () => {
  const hintId = useId();
  const [material, setMaterial] = useState(0);
  const [roughness, setRoughness] = useState(START_ROUGHNESS);
  const [light, setLight] = useState(0);
  const [turning, setTurning] = useState(false);
  const { viewRef, sceneRef, failed } = useWeb3dScene((node) => new MaterialScene(node));

  return (
    <div className={clsx(ui.panel, w3d.web3d)}>
      <div
        ref={viewRef}
        className={clsx(w3d.web3d__view, styles.material__view)}
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
      <div className={clsx(w3d.web3d__card, styles.material__side)}>
        <span className={clsx(w3d.web3d__dim, styles.material__caption)}>{copy.material}</span>
        <div className={styles.material__grid} role="group" aria-label={copy.material}>
          {copy.materials.map((label, index) => (
            <button
              key={label}
              type="button"
              disabled={failed}
              aria-pressed={material === index}
              aria-label={label}
              className={clsx(styles.material__option, material === index && styles['material__option--active'])}
              onClick={() => {
                setMaterial(index);
                sceneRef.current?.setMaterial(index);
              }}
            >
              <i className={clsx(styles.material__swatch, styles[SWATCH_CLASSES[index]])} />
              <span className={styles.material__name}>{label}</span>
            </button>
          ))}
        </div>
        <label className={styles.material__control}>
          <span className={w3d.web3d__dim}>{copy.roughness}</span>
          <input
            className={clsx(w3d.web3d__range, styles.material__range)}
            type="range"
            min={0}
            max={100}
            value={roughness}
            disabled={failed}
            onChange={(event) => {
              const value = Number(event.target.value);
              setRoughness(value);
              sceneRef.current?.setRoughness(value / 100);
            }}
          />
        </label>
        <div className={styles.material__control}>
          <span className={clsx(w3d.web3d__dim, styles.material__caption)}>{copy.light}</span>
          <div className={styles.material__lights} role="group" aria-label={copy.light}>
            {copy.lights.map((item, index) => (
              <button
                key={item.label}
                type="button"
                disabled={failed}
                aria-pressed={light === index}
                aria-label={item.label}
                className={clsx(styles.material__light, light === index && styles['material__light--active'])}
                style={{ background: item.color }}
                onClick={() => {
                  setLight(index);
                  sceneRef.current?.setLight(item.color);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={w3d.web3d__bar}>
        <button
          type="button"
          disabled={failed}
          aria-pressed={turning}
          className={clsx(ui.button, turning && ui['button--active'])}
          onClick={() => {
            setTurning(!turning);
            sceneRef.current?.setTurning(!turning);
          }}
        >
          {copy.turn}
        </button>
        <button
          type="button"
          disabled={failed}
          className={ui.button}
          onClick={() => {
            setMaterial(0);
            setRoughness(START_ROUGHNESS);
            setLight(0);
            sceneRef.current?.reset(copy.lights[0].color);
          }}
        >
          {copy.reset}
        </button>
        <span id={hintId} className={w3d.web3d__hint}>
          {copy.hint}
        </span>
      </div>
      {failed && <p className={w3d.web3d__fallback}>{copy.fallback}</p>}
    </div>
  );
};

export default Web3dMaterial;
