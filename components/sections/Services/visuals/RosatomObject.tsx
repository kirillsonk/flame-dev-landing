'use client';

import { useEffect, useRef } from 'react';
import { RosatomScene } from './RosatomScene';
import styles from './RosatomObject.module.scss';

const RosatomObject = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scene = new RosatomScene(ref.current);
    return () => scene.dispose();
  }, []);

  return <div ref={ref} className={styles.object} aria-hidden="true" />;
};

export default RosatomObject;
