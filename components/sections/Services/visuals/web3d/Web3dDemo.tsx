'use client';

import dynamic from 'next/dynamic';
import RosatomLazy from '@/components/sections/Services/visuals/RosatomLazy';
import useInView from '@/hooks/useInView';
import type { Web3dDemoVariant } from './variants';
import styles from './Web3dDemo.module.scss';

export interface Web3dDemoProps {
  variant: Web3dDemoVariant;
}

// Three.js живёт только в клиентских чанках: каждая сцена грузится, когда рамка подходит к экрану.
const VARIANTS: Record<Web3dDemoVariant, React.ComponentType> = {
  flight: dynamic(() => import('./Web3dFlight'), { ssr: false }),
  reactor: dynamic(() => import('./Web3dReactor'), { ssr: false }),
  material: dynamic(() => import('./Web3dMaterial'), { ssr: false }),
  plant: dynamic(() => import('./Web3dPlant'), { ssr: false }),
  scale: dynamic(() => import('./Web3dScale'), { ssr: false }),
  current: RosatomLazy,
};

// Демо «3D» (Росатом) в блоке «Что мы делаем»; вариант выбирается меню вариантов (data/variants.ts).
const Web3dDemo = ({ variant }: Web3dDemoProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px 0px', once: true });
  const Variant = VARIANTS[variant];
  return (
    <div ref={ref} className={styles.demo}>
      {inView && <Variant />}
    </div>
  );
};

export default Web3dDemo;
