'use client';

import { useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { WEB3D_FLIGHT as copy } from '@/data/demosWeb3d';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import w3d from './Web3d.module.scss';
import { FlightScene } from './FlightScene';
import { powerOfTen } from './format';
import useWeb3dScene from './hooks/useWeb3dScene';
import styles from './Web3dFlight.module.scss';

const EXPONENTS = copy.stops.map((stop) => stop.exponent);

// «Полёт в микромир»: перетаскивание, стрелки и кнопки ведут камеру от молекулы воды к кваркам.
const Web3dFlight = () => {
  const hintId = useId();
  const progressRef = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(0);
  const [exponent, setExponent] = useState(EXPONENTS[0]);
  const { viewRef, sceneRef, failed } = useWeb3dScene(
    (node) =>
      new FlightScene(node, {
        exponents: EXPONENTS,
        onStop: setStop,
        onExponent: setExponent,
        progress: progressRef.current,
      }),
  );
  const current = copy.stops[stop];

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
      <div className={styles.flight__scale}>
        <span className={w3d.web3d__dim}>{copy.scale}</span>
        <b className={clsx(styles.flight__exponent, w3d.web3d__number)}>
          {powerOfTen(exponent)} {copy.unit}
        </b>
      </div>
      <nav className={styles.flight__rail} aria-label={copy.stopsLabel}>
        {copy.stops.map((item, index) => (
          <button
            key={item.title}
            type="button"
            disabled={failed}
            className={clsx(styles.flight__stop, index === stop && styles['flight__stop--active'])}
            aria-current={index === stop ? 'step' : undefined}
            aria-label={`${copy.stop} ${index + 1}: ${item.title}`}
            onClick={() => sceneRef.current?.goTo(index)}
          >
            <i className={styles.flight__dot} />
            <span className={styles.flight__name}>{item.title}</span>
          </button>
        ))}
      </nav>
      <div className={clsx(w3d.web3d__card, styles.flight__card)} aria-live="polite">
        <div key={stop} className={w3d.web3d__swap}>
          <div className={w3d.web3d__dim}>
            {copy.stop} {stop + 1} {copy.of} {copy.stops.length}
          </div>
          <div className={clsx(w3d.web3d__title, styles.flight__heading)}>{current.title}</div>
          <div className={clsx(w3d.web3d__dim, styles.flight__text)}>{current.text}</div>
        </div>
      </div>
      <div className={w3d.web3d__bar}>
        <button
          type="button"
          disabled={failed || stop === 0}
          className={clsx(ui.button, w3d.web3d__control)}
          aria-label={copy.back}
          onClick={() => sceneRef.current?.step(-1)}
        >
          ↑
        </button>
        <button
          type="button"
          disabled={failed || stop === copy.stops.length - 1}
          className={clsx(ui.button, ui['button--primary'])}
          onClick={() => sceneRef.current?.step(1)}
        >
          {copy.deeper}
        </button>
        <button
          type="button"
          disabled={failed}
          className={ui.button}
          onClick={() => sceneRef.current?.goTo(0)}
        >
          {copy.reset}
        </button>
        <span id={hintId} className={w3d.web3d__hint}>
          {copy.hint}
        </span>
      </div>
      <div ref={progressRef} className={styles.flight__progress} />
      {failed && <p className={w3d.web3d__fallback}>{copy.fallback}</p>}
    </div>
  );
};

export default Web3dFlight;
