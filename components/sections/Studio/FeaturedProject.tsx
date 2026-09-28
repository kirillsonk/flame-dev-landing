'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import useInView from '@/hooks/useInView';
import { CASES } from '@/data/cases';
import { CASE_TYPES, HERO_CASES, STUDIO } from '@/data/studio';
import ProjectVisual from './ProjectVisual';
import styles from './Studio.module.scss';

const projects = HERO_CASES.map(slug => CASES.find(item => item.slug === slug)!);

const FeaturedProject = () => {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [automatic, setAutomatic] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '0px' });
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = projects[active];

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAutomatic(!motion.matches && !document.hidden);
    sync();
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (!inView || !automatic || interacting) return;
    const timer = window.setTimeout(() => setActive(value => (value + 1) % projects.length), 8500);
    return () => window.clearTimeout(timer);
  }, [active, automatic, inView, interacting]);

  const select = (index: number) => {
    const next = (index + projects.length) % projects.length;
    setActive(next);
    setAnnouncement(`${projects[next].title} · ${CASE_TYPES[projects[next].slug]}`);
  };

  return <div ref={ref} className={styles.hero__projectSlot} role="region" aria-label={STUDIO.feature.label}
    onMouseEnter={() => setInteracting(true)} onMouseLeave={event => setInteracting(event.currentTarget.contains(document.activeElement))}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(event.currentTarget.matches(':hover')); }}>
    <div className={clsx(styles.hero__project, !inView && styles['hero__project--paused'])}
      onTouchStart={event => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY }; }}
      onTouchEnd={event => {
        const point = event.changedTouches[0];
        if (touch.current) {
          const dx = point.clientX - touch.current.x;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(point.clientY - touch.current.y) * 1.5) {
            if (event.cancelable) event.preventDefault();
            select(active + (dx < 0 ? 1 : -1));
          }
        }
        touch.current = null;
      }}>
      <div key={item.slug} className={styles.hero__slide}>
        <ProjectVisual item={item} active={inView} />
        <Link href={`/cases/${item.slug}`} className={styles.hero__caption}>
          <div><h2>{item.title}</h2><p>{CASE_TYPES[item.slug]}</p></div><span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
    <div className={styles.hero__navigation}>
      <span className={styles.hero__status} role="status">{announcement}</span>
      <div className={styles.hero__dots}>
        {projects.map((project, index) => <button key={project.slug} type="button" aria-label={`${STUDIO.feature.select} ${project.title}`} aria-pressed={active === index} onClick={() => select(index)}><span /></button>)}
      </div>
      <button type="button" onClick={() => select(active - 1)} aria-label={STUDIO.feature.previous}>←</button>
      <button type="button" onClick={() => select(active + 1)} aria-label={STUDIO.feature.next}>→</button>
    </div>
  </div>;
};
export default FeaturedProject;
