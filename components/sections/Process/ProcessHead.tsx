import { PROCESS_NOTE, PROCESS_TITLE } from '@/data/process';
import styles from './ProcessHead.module.scss';

// Шапка вариантов с широкой сценой: заголовок слева, примечание справа.
const ProcessHead = () => {
  return (
    <div className={styles.head}>
      <h2 className={styles.head__title}>{PROCESS_TITLE}</h2>
      <p className={styles.head__note}>{PROCESS_NOTE}</p>
    </div>
  );
};

export default ProcessHead;
