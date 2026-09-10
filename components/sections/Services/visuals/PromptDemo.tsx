'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import styles from './PromptDemo.module.scss';

const PROMPT = 'Рекламный ролик крема, студийный свет, 6 секунд';
const TYPE_DELAY_MS = 45;
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

const PromptDemo = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setProgress((n) => (n >= PROMPT.length ? n : n + 1)), TYPE_DELAY_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const typed = reduced ? PROMPT.length : progress;
  const done = typed >= PROMPT.length;

  return (
    <div ref={ref} className={styles.demo} aria-hidden="true">
      <div className={styles.demo__prompt}>
        <span className={styles.demo__label}>prompt</span>
        <span>
          {PROMPT.slice(0, typed)}
          {!done && <span className={styles.demo__caret} />}
        </span>
      </div>
      <div className={clsx(styles.demo__frame, done && styles['demo__frame--visible'])}>
        <span className={styles.demo__meta}>00:06 · 9:16 · готово</span>
      </div>
    </div>
  );
};

export default PromptDemo;
