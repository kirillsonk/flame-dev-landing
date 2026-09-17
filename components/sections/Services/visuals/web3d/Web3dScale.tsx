'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import { WEB3D_SCALE as copy } from '@/data/demosWeb3d';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import w3d from './Web3d.module.scss';
import { SCALE_SLIDER_MAX, ScaleScene } from './ScaleScene';
import type { IScaleReadout } from './ScaleScene';
import { powerOfTen } from './format';
import useWeb3dScene from './hooks/useWeb3dScene';
import styles from './Web3dScale.module.scss';

// «Сравнение масштабов»: слайдер и кнопки объектов меняют ширину кадра от 10⁻⁹ до 10⁻¹⁸ м.
const Web3dScale = () => {
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [slider, setSlider] = useState(0);
  const [readout, setReadout] = useState<IScaleReadout>({ exponent: -9, barMantissa: 0, barExponent: 0, focus: 0 });
  const { viewRef, sceneRef, failed } = useWeb3dScene(
    (node) =>
      new ScaleScene(node, { labels: () => labelsRef.current, onReadout: setReadout, onSlider: setSlider }),
  );
  const focus = copy.objects[readout.focus];

  return (
    <div className={clsx(ui.panel, w3d.web3d)}>
      <div
        ref={viewRef}
        className={w3d.web3d__view}
        tabIndex={0}
        role="application"
        aria-label={copy.label}
      />
      <div className={w3d.web3d__head}>
        <div className={ui.header}>
          <span className={ui.wordmark}>{copy.name}</span>
          <span className={ui.badge}>{copy.badge}</span>
        </div>
        <h4 className={ui.title}>{copy.title}</h4>
      </div>
      <div className={styles.scale__ruler} aria-live="polite">
        <span className={w3d.web3d__dim}>{copy.frame}</span>
        <b className={clsx(styles.scale__exponent, w3d.web3d__number)}>
          {powerOfTen(readout.exponent)} {copy.unit}
        </b>
        <div className={styles.scale__bar}>
          <i className={styles.scale__tick} />
          {readout.barMantissa > 0 && (
            <span className={clsx(w3d.web3d__dim, w3d.web3d__number)}>
              ≈ {readout.barMantissa} · {powerOfTen(readout.barExponent)} {copy.unit}
            </span>
          )}
        </div>
      </div>
      <div className={clsx(w3d.web3d__card, styles.scale__object)} aria-live="polite">
        <div key={readout.focus} className={w3d.web3d__swap}>
          <span className={w3d.web3d__dim}>
            {readout.focus === 0 ? copy.focus : `${copy.smaller} ${focus.times} ${copy.times}`}
          </span>
          <b className={clsx(w3d.web3d__title, styles.scale__heading)}>{focus.title}</b>
          <span className={clsx(w3d.web3d__dim, styles.scale__text)}>{focus.text}</span>
        </div>
      </div>
      {copy.objects.map((item, index) => (
        <span
          key={item.title}
          ref={(node) => {
            labelsRef.current[index] = node;
          }}
          className={clsx(w3d.web3d__label, styles.scale__label)}
          aria-hidden="true"
        >
          {item.label}
        </span>
      ))}
      <div className={w3d.web3d__bar}>
        {copy.objects.map((item, index) => (
          <button
            key={item.title}
            type="button"
            disabled={failed}
            aria-pressed={readout.focus === index}
            className={clsx(ui.button, styles.scale__jump, readout.focus === index && ui['button--active'])}
            onClick={() => sceneRef.current?.jump(index)}
          >
            {item.short}
          </button>
        ))}
        <label className={clsx(w3d.web3d__field, styles.scale__slider)}>
          <span className={w3d.web3d__dim}>{copy.from}</span>
          <input
            className={clsx(w3d.web3d__range, styles.scale__range)}
            type="range"
            min={0}
            max={SCALE_SLIDER_MAX}
            value={slider}
            disabled={failed}
            aria-label={copy.sliderLabel}
            onChange={(event) => {
              const value = Number(event.target.value);
              setSlider(value);
              sceneRef.current?.setSlider(value);
            }}
          />
          <span className={w3d.web3d__dim}>{copy.to}</span>
        </label>
      </div>
      {failed && <p className={w3d.web3d__fallback}>{copy.fallback}</p>}
    </div>
  );
};

export default Web3dScale;
