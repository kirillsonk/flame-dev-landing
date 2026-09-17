'use client';

import clsx from 'clsx';
import { PROCESS_NOTE, PROCESS_STEPS, PROCESS_TERMINAL, PROCESS_TITLE } from '@/data/process';
import useProcessTerminal from './hooks/useProcessTerminal';
import styles from './ProcessTerminal.module.scss';

// Вариант «Терминал»: по скроллу печатается лог проекта, чек-лист слева отмечает пройденные шаги.
const ProcessTerminal = () => {
  const { sectionRef } = useProcessTerminal(styles.terminal__caret);

  return (
    <section ref={sectionRef} className={styles.terminal} id="process">
      <div className={styles.terminal__inner}>
        <div className={styles.terminal__aside}>
          <h2 className={styles.terminal__title}>{PROCESS_TITLE}</h2>
          <ul className={styles.terminal__checklist}>
            {PROCESS_STEPS.map((step) => (
              <li key={step.title} className={styles.terminal__check} data-part="check">
                <i className={styles.terminal__box} />
                {step.title}
              </li>
            ))}
          </ul>
          <p className={styles.terminal__note}>{PROCESS_NOTE}</p>
        </div>
        <div className={styles.terminal__window}>
          <div className={styles.terminal__bar} aria-hidden="true">
            <i className={styles.terminal__light} />
            <i className={styles.terminal__light} />
            <i className={styles.terminal__light} />
            <span className={styles.terminal__file}>{PROCESS_TERMINAL.file}</span>
          </div>
          <div className={styles.terminal__body} data-part="body">
            <div className={styles.terminal__lines} data-part="lines">
              {PROCESS_TERMINAL.lines.map((line, index) => (
                <p
                  key={index}
                  className={clsx(styles.terminal__line, styles[`terminal__line--${line.kind}`])}
                  data-part="line"
                  data-done={line.done}
                >
                  <span className={styles.terminal__text} data-part="text">
                    {line.text}
                  </span>
                  {line.status && (
                    <>
                      <i className={styles.terminal__lead} data-part="lead" />
                      <span
                        className={clsx(styles.terminal__status, line.live && styles['terminal__status--live'])}
                        data-part="status"
                      >
                        {line.status}
                      </span>
                    </>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTerminal;
