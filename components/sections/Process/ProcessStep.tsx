import clsx from 'clsx';
import type { IProcessStep } from '@/data/types';
import styles from './ProcessStep.module.scss';

export interface ProcessStepProps {
  step: IProcessStep;
  active: boolean;
}

const ProcessStep = ({ step, active }: ProcessStepProps) => {
  return (
    <article className={clsx(styles.step, active && styles['step--active'])}>
      <h3 className={styles.step__title}>{step.title}</h3>
      <p className={styles.step__text}>
        {step.duration && `${step.duration}. `}
        {step.description}
      </p>
    </article>
  );
};

export default ProcessStep;
