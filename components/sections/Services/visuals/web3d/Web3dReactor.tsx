'use client';

import { useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { WEB3D_REACTOR as copy } from '@/data/demosWeb3d';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import w3d from './Web3d.module.scss';
import { ReactorScene } from './ReactorScene';
import type { IReactorReadout } from './ReactorScene';
import useWeb3dScene from './hooks/useWeb3dScene';
import styles from './Web3dReactor.module.scss';

const START = 45;
const NUMBER = new Intl.NumberFormat('ru-RU');
const MODE_CLASSES = ['reactor__mode--off', 'reactor__mode--low', 'reactor__mode--nominal', 'reactor__mode--over'];

// «Реактор в разрезе»: слайдер стержней разжигает активную зону, аварийная защита сбрасывает их.
const Web3dReactor = () => {
  const hintId = useId();
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [rods, setRods] = useState(START);
  const [readout, setReadout] = useState<IReactorReadout>({ rods: START, power: 0, temperature: 0, mode: 0 });
  const { viewRef, sceneRef, failed } = useWeb3dScene(
    (node) => new ReactorScene(node, { labels: () => labelsRef.current, onReadout: setReadout }),
  );
  const scrammed = readout.mode < 0;

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
      {copy.labels.map((label, index) => (
        <span
          key={label}
          ref={(node) => {
            labelsRef.current[index] = node;
          }}
          className={clsx(w3d.web3d__label, styles.reactor__label)}
          aria-hidden="true"
        >
          {label}
        </span>
      ))}
      <div className={styles.reactor__panel} aria-live="polite">
        <div className={clsx(w3d.web3d__card, styles.reactor__gauge)}>
          <span className={w3d.web3d__dim}>{copy.power}</span>
          <b className={clsx(styles.reactor__value, w3d.web3d__number)}>
            {NUMBER.format(readout.power)} {copy.powerUnit}
          </b>
        </div>
        <div className={clsx(w3d.web3d__card, styles.reactor__gauge)}>
          <span className={w3d.web3d__dim}>{copy.temperature}</span>
          <b className={clsx(styles.reactor__value, w3d.web3d__number)}>
            {readout.temperature} {copy.temperatureUnit}
          </b>
        </div>
        <div className={clsx(w3d.web3d__card, styles.reactor__gauge, styles['reactor__gauge--wide'])}>
          <span
            className={clsx(
              styles.reactor__mode,
              w3d.web3d__dim,
              scrammed ? styles['reactor__mode--over'] : styles[MODE_CLASSES[readout.mode]],
            )}
          >
            {scrammed ? copy.scrammed : copy.modes[readout.mode]}
          </span>
        </div>
      </div>
      <div className={w3d.web3d__bar}>
        <label className={w3d.web3d__field}>
          <span className={w3d.web3d__dim}>{copy.rods}</span>
          <input
            className={w3d.web3d__range}
            type="range"
            min={0}
            max={100}
            value={rods}
            disabled={failed}
            aria-label={copy.rodsLabel}
            onChange={(event) => {
              const value = Number(event.target.value);
              setRods(value);
              sceneRef.current?.setInsertion(value / 100);
            }}
          />
          <b className={clsx(styles.reactor__rods, w3d.web3d__number)}>{readout.rods}%</b>
        </label>
        <button
          type="button"
          disabled={failed}
          className={clsx(ui.button, styles.reactor__scram)}
          onClick={() => {
            setRods(100);
            sceneRef.current?.scram();
          }}
        >
          {copy.scram}
        </button>
        <button
          type="button"
          disabled={failed}
          className={ui.button}
          onClick={() => {
            setRods(START);
            sceneRef.current?.reset();
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

export default Web3dReactor;
