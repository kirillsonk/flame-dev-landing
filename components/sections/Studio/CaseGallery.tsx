'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { CASES } from '@/data/cases';
import { FEATURED_CASES, CASE_CAPTIONS, CASE_TYPES } from '@/data/studio';
import { CASE_GALLERY } from '@/data/appearance';
import { HANDOFF_EVENT } from './hooks/useHeroMorph';
import type { IHandoffDetail } from './hooks/useHeroMorph';
import BaseArrow from '@/components/ui/BaseArrow/BaseArrow';
import styles from './CaseGallery.module.scss';

const projects = FEATURED_CASES.map(slug => CASES.find(item => item.slug === slug)!);
const poster = (index: number) => {
  const item = projects[index];
  return item.videoWide?.poster ?? item.video?.poster ?? item.poster;
};

const CaseGallery = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  // Проект пришел с первого экрана: карта встает без анимации входа, ее скрывает перелет
  const [quiet, setQuiet] = useState(false);
  const touched = useRef(false);
  const indexRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const container = indexRef.current;
    const button = buttons.current[active];
    if (!container || !button || container.scrollWidth <= container.clientWidth) return;
    const viewport = container.getBoundingClientRect();
    const selected = button.getBoundingClientRect();
    const delta = selected.left < viewport.left ? selected.left - viewport.left : selected.right > viewport.right ? selected.right - viewport.right : 0;
    if (delta) container.scrollTo({ left: container.scrollLeft + delta, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [active]);
  useEffect(() => {
    const handoff = (event: Event) => {
      const index = projects.findIndex(project => project.slug === (event as CustomEvent<IHandoffDetail>).detail.slug);
      if (touched.current || index < 0) return;
      setQuiet(true);
      setActive(index);
    };
    window.addEventListener(HANDOFF_EVENT, handoff);
    return () => window.removeEventListener(HANDOFF_EVENT, handoff);
  }, []);
  const item = projects[active];
  const select = (next: number) => {
    const index = (next + projects.length) % projects.length;
    touched.current = true;
    setQuiet(false);
    setDirection(next > active ? 1 : -1);
    setActive(index);
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next++;
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next--;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = projects.length - 1;
    else return;
    event.preventDefault();
    select(next);
    buttons.current[(next + projects.length) % projects.length]?.focus();
  };
  return <div className={styles.gallery} aria-label={CASE_GALLERY.label}>
    <div className={styles.gallery__stage}>
      <div className={styles.gallery__deck} data-morph-part data-morph-deck onTouchStart={event => { const touch = event.touches[0]; start.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={event => {
        const touch = event.changedTouches[0];
        if (start.current) {
          const dx = touch.clientX - start.current.x;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(touch.clientY - start.current.y) * 1.5) {
            if (event.cancelable) event.preventDefault();
            select(active + (dx < 0 ? 1 : -1));
          }
        }
        start.current = null;
      }}>
        {[2, 1].map(offset => <div className={clsx(styles.gallery__back, styles[`gallery__back--${offset}`])} key={offset} data-morph-target={`back-${offset}`} aria-hidden="true">
          {poster((active + offset) % projects.length) && <Image src={poster((active + offset) % projects.length)!} alt="" fill sizes="(max-width: 900px) 90vw, 60vw" />}
        </div>)}
        <Link id="selected-case" className={clsx(styles.gallery__card, direction < 0 && styles['gallery__card--reverse'], quiet && styles['gallery__card--quiet'])} href={`/cases/${item.slug}`} key={item.slug} aria-label={`${CASE_GALLERY.open} · ${item.title}`}>
          <div className={styles.gallery__image} data-morph-target="card">{poster(active) && <Image src={poster(active)!} alt={item.title} fill sizes="(max-width: 900px) 90vw, 60vw" />}<span className={styles.gallery__tag}>{CASE_TYPES[item.slug]}</span><span className={styles.gallery__arrow} aria-hidden="true"><BaseArrow size="l" /></span></div>
          <div className={styles.gallery__caption}><h3>{item.title}</h3><p>{CASE_CAPTIONS[item.slug]}</p></div>
        </Link>
      </div>
      <div className={styles.gallery__controls} data-morph-part>
        <span className={styles.gallery__sr} aria-live="polite" aria-atomic="true">{item.title}</span>
        <div className={styles.gallery__track} aria-hidden="true"><span style={{ width: `${(active + 1) / projects.length * 100}%` }} /></div>
        <button type="button" onClick={() => select(active - 1)} aria-label={CASE_GALLERY.previous}><BaseArrow direction="left" /></button>
        <button type="button" onClick={() => select(active + 1)} aria-label={CASE_GALLERY.next}><BaseArrow direction="right" /></button>
      </div>
    </div>
    <div ref={indexRef} className={styles.gallery__index} data-morph-index role="group" aria-label={CASE_GALLERY.index}>
      {projects.map((project, index) => <button type="button" ref={node => { buttons.current[index] = node; }} key={project.slug} className={clsx(styles.gallery__item, active === index && styles['gallery__item--active'])} aria-pressed={active === index} aria-controls="selected-case" onClick={() => select(index)} onKeyDown={event => onKey(event, index)}>
        <span className={styles.gallery__thumb}>{poster(index) && <Image src={poster(index)!} alt="" fill sizes="(max-width: 900px) 240px, 120px" />}</span>
        <span className={styles.gallery__name}>{project.title}<span>{CASE_TYPES[project.slug]}</span></span>
        <span className={styles.gallery__indicator} aria-hidden="true"><BaseArrow /></span>
      </button>)}
    </div>
  </div>;
};
export default CaseGallery;
