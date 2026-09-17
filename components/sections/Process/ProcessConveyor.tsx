'use client';

import { PROCESS_STEPS } from '@/data/process';
import ProcessConveyorShapes from './ProcessConveyorShapes';
import ProcessHead from './ProcessHead';
import { stepNumber } from './helpers';
import useProcessConveyor from './hooks/useProcessConveyor';
import styles from './ProcessConveyor.module.scss';

// Вариант «Конвейер»: заготовка едет по ленте, каждый пресс опускается и штампует новую форму.
const ProcessConveyor = () => {
  const { sectionRef } = useProcessConveyor();

  return (
    <section ref={sectionRef} className={styles.conveyor} id="process">
      <div className={styles.conveyor__inner}>
        <ProcessHead />
        <div className={styles.conveyor__machine} aria-hidden="true">
          <div className={styles.conveyor__gantry}>
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className={styles.conveyor__press} data-part="press" data-on>
                <i className={styles.conveyor__rod} data-part="rod" />
                <i className={styles.conveyor__hammer} data-part="hammer" />
              </div>
            ))}
          </div>
          <div className={styles.conveyor__lane} data-part="lane">
            <div className={styles.conveyor__item} data-part="item">
              <ProcessConveyorShapes active={PROCESS_STEPS.length} />
            </div>
          </div>
          <div className={styles.conveyor__belt} data-part="belt" />
        </div>
        <div className={styles.conveyor__labels}>
          {PROCESS_STEPS.map((step, index) => (
            <article key={step.title} className={styles.conveyor__label} data-part="label">
              <p className={styles.conveyor__num}>{[stepNumber(index), step.duration].filter(Boolean).join(' · ')}</p>
              <h3 className={styles.conveyor__title}>{step.title}</h3>
              <p className={styles.conveyor__text}>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessConveyor;
