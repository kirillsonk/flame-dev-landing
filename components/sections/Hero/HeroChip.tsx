'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import clsx from 'clsx';
import type { IHeroTitlePart } from '@/data/types';
import useChipSize from './hooks/useChipSize';
import useChipVideo from './hooks/useChipVideo';
import useChipMagnet from './hooks/useChipMagnet';
import styles from './Hero.module.scss';

export interface HeroChipProps {
  part: IHeroTitlePart;
}

const HeroChip = ({ part }: HeroChipProps) => {
  const chip = part.chip;
  const ref = useRef<HTMLAnchorElement | null>(null);
  const measure = chip?.kind === 'design';
  const stack = chip?.kind === 'dev' ? chip.stack ?? [] : [];
  const video = chip?.kind === 'video' ? chip.video : undefined;
  const [active, setActive] = useState(false);
  const videoRef = useChipVideo(active);
  const { size } = useChipSize(ref, measure);
  useChipMagnet(ref);
  if (!chip) return null;
  const external = chip.href.startsWith('http');

  return (
    <span className={styles.hero__word}>
      {part.prefix}
      <a
        ref={ref}
        href={chip.href}
        className={clsx(styles.hero__chip, styles[`hero__chip--${chip.kind}`])}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        data-meta={measure ? size ?? chip.meta : undefined}
        onMouseEnter={video ? () => setActive(true) : undefined}
        onMouseLeave={video ? () => setActive(false) : undefined}
        onFocus={video ? () => setActive(true) : undefined}
        onBlur={video ? () => setActive(false) : undefined}
      >
        {stack.length > 0 ? (
          // Слот: слово в потоке задаёт базовую линию, остальные строки абсолютные ниже,
          // на ховере колонка уезжает вверх на (n + 1) строк и останавливается на копии слова.
          <span className={styles.hero__slot}>
            <span className={styles.hero__slotRoll} style={{ '--slot-shift': `-${(stack.length + 1) * 100}%` } as CSSProperties}>
              {part.text}
              {/* Слова стека не попадают в текст h1 (сниппет в поиске остаётся чистым):
                  спаны пустые, слово рисует CSS через content: attr(data-word). */}
              {[...stack, part.text].map((item, index, all) => (
                <span
                  key={item}
                  className={clsx(styles.hero__slotItem, index === all.length - 1 && styles['hero__slotItem--last'])}
                  style={{ top: `${(index + 1) * 100}%` }}
                  aria-hidden="true"
                >
                  <span className={styles.hero__slotWord} data-word={item} />
                </span>
              ))}
            </span>
          </span>
        ) : video ? (
          // Ролик лежит поверх слова и виден только сквозь буквы: SVG-маска из контуров шрифта.
          <span className={styles.hero__mword}>
            {part.text}
            <video ref={videoRef} className={styles.hero__mvid} muted playsInline loop preload="none" aria-hidden="true">
              {video.webm && <source src={video.webm} type="video/webm" />}
              <source src={video.mp4} type="video/mp4" />
            </video>
          </span>
        ) : (
          part.text
        )}
      </a>
      {part.suffix}
    </span>
  );
};

export default HeroChip;
