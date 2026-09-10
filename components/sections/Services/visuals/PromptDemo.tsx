'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import styles from './PromptDemo.module.scss';

const PROMPT = 'Рекламный ролик крема для лица, студийный свет, 6 секунд';
const TYPE_DELAY_MS = 45;

const PromptDemo = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView || typed >= PROMPT.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const skipId = window.setTimeout(() => setTyped(PROMPT.length), 0);
      return () => window.clearTimeout(skipId);
    }
    const id = window.setTimeout(() => setTyped((n) => n + 1), TYPE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [inView, typed]);

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
