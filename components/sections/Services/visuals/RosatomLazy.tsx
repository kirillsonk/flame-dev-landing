'use client';

import dynamic from 'next/dynamic';
import useInView from '@/hooks/useInView';
import styles from './RosatomObject.module.scss';

const RosatomObject = dynamic(() => import('./RosatomObject'), { ssr: false });

const RosatomLazy = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px 0px', once: true });
  return (
    <div ref={ref} className={styles.object}>
      {inView && <RosatomObject />}
    </div>
  );
};

export default RosatomLazy;
