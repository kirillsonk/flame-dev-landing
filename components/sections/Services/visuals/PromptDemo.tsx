'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { AI_DEMO as copy } from '@/data/demos';
import ui from '@/components/sections/Services/visuals/Demo.module.scss';
import styles from './PromptDemo.module.scss';
const PromptDemo = () => {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(-1);
  const scenario = copy.scenarios[selected];
  const running = step >= 0 && step < copy.steps.length;
  const done = step === copy.steps.length;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 600);
    return () => window.clearTimeout(timer);
  }, [step, running]);
  return (
    <div className={ui.panel}>
      <div className={ui.header}>
        <span className={ui.wordmark}>{copy.name}</span>
        <span className={ui.badge}>{copy.badge}</span>
      </div>
      <div className={ui.toolbar} role="group" aria-label={copy.title}>
        {copy.scenarios.map((item, index) => (
          <button
            key={item.tab}
            className={clsx(ui.button, selected === index && ui['button--active'])}
            aria-pressed={selected === index}
            onClick={() => {
              setSelected(index);
              setStep(-1);
            }}
          >
            {item.tab}
          </button>
        ))}
      </div>
      <div className={styles.demo__workspace}>
        <div className={styles.demo__input}>
          <span className={ui.wordmark}>{scenario.type}</span>
          <p>{scenario.prompt}</p>
          <button
            className={clsx(ui.button, ui['button--primary'])}
            disabled={running}
            onClick={() => setStep(0)}
          >
            {running ? copy.busy : done ? copy.rerun : copy.run}
            <span aria-hidden="true"> ↗</span>
          </button>
        </div>
        <div className={clsx(styles.demo__result, done && styles['demo__result--done'])} aria-busy={running}>
          {done ? (
            <>
              <div className={ui.status}>
                <span className={ui.dot} />
                {copy.ready}
              </div>
              <h4 className={ui.title}>{scenario.heading}</h4>
              <dl className={styles.demo__fields}>
                {scenario.fields.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.demo__summary}>{scenario.result}</p>
            </>
          ) : (
            <>
              <div
                className={clsx(styles.demo__orb, running && styles['demo__orb--active'])}
                aria-hidden="true"
              >
                ✦
              </div>
              <p className={styles.demo__status} role="status">
                {running ? copy.steps[step] : copy.idle}
              </p>
              <div className={styles.demo__steps} aria-hidden="true">
                {copy.steps.map((label, index) => (
                  <span
                    key={label}
                    className={clsx(styles.demo__step, index <= step && styles['demo__step--active'])}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <span className={styles.demo__announcement} role="status">
        {done ? copy.ready : ''}
      </span>
    </div>
  );
};
export default PromptDemo;
