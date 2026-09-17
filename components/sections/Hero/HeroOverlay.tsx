'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import CtaButton from '@/components/cta/CtaButton/CtaButton';
import { HERO, HERO_SLIDES, HERO_SLIDE_LINK } from '@/data/site';
import HeroChip from './HeroChip';
import useHeroOverlayScroll from './hooks/useHeroOverlayScroll';
import styles from './HeroOverlay.module.scss';

interface IHeroState {
  active: number;
  /** Какой проект загружен в каждый из двух постоянных слотов видео. */
  slots: [number, number];
  /** Слот, который сейчас виден спереди. */
  front: number;
  /** Идёт ли раскрытие дальнего слота поверх переднего. */
  entering: boolean;
}

type HeroAction = { type: 'go'; index: number } | { type: 'settle'; slot: number };

const INITIAL_STATE: IHeroState = { active: 0, slots: [0, 0], front: 0, entering: false };

// Переход считается атомарно из прошлого состояния — и для клика, и для автосмены.
const reduceHero = (state: IHeroState, action: HeroAction): IHeroState => {
  if (action.type === 'go') {
    if (action.index === state.active) return state;
    // Если прошлый переход ещё идёт, его кадр досрочно закрепляется спереди, а новый уходит
    // в другой слот. Иначе новый проект подменял бы источник прямо в анимируемом слоте:
    // класс анимации уже стоит, эффект не перезапускается, и видео меняется на месте.
    const front = state.entering ? 1 - state.front : state.front;
    const slots: [number, number] = [...state.slots];
    slots[1 - front] = action.index;
    return { active: action.index, slots, front, entering: true };
  }
  if (!state.entering || action.slot === state.front) return state;
  return { ...state, front: action.slot, entering: false };
};

// Вариант 6 из подборки раскладок, развёрнутый в несколько полноэкранных кадров:
// заголовок стоит на месте, меняются фон, подпись и активный проект в переключателе.
// Основной первый экран; лента 9:16 (Hero) остаётся для сравнения в меню вариантов (см. Home.tsx).
export interface HeroOverlayProps {
  /** Следующая секция накрывает первый экран: пин продлевается на высоту окна. */
  coverNext?: boolean;
}

const HeroOverlay = ({ coverNext = false }: HeroOverlayProps) => {
  const [{ active, slots, front, entering }, dispatch] = useReducer(reduceHero, INITIAL_STATE);
  const [held, setHeld] = useState(false);
  const { sectionRef, frameRef, infoRef, veilRef, shadeRef, bottomRef, footRef, reveal } = useHeroOverlayScroll({ coverNext });
  const slide = HERO_SLIDES[active];

  // Два постоянных слота под видео. Элементы никогда не пересоздаются: при смене ключа React
  // размонтировал бы их, и ролик начинался бы заново — и в начале перехода, и в конце.
  const slotOne = useRef<HTMLVideoElement>(null);
  const slotTwo = useRef<HTMLVideoElement>(null);
  const slotRefs = [slotOne, slotTwo];
  const loaded = useRef<[string, string]>([HERO_SLIDES[0].id, HERO_SLIDES[0].id]);
  // Какой проект последним получил старт с нуля: при смене active ролик перематывается
  // на начало, даже если он уже был загружен в задний слот.
  const started = useRef(HERO_SLIDES[0].id);
  const switchRef = useRef<HTMLDivElement>(null);

  // Полоса под активной вкладкой — прогресс самого ролика, а не таймера: читаем
  // currentTime / duration переднего видео на каждом кадре и отдаём остаток в CSS-переменную.
  // Кадр меняется, когда ролик доиграл; под курсором и при фокусе с клавиатуры ролик
  // просто идёт на второй круг, а полоса не замирает.
  const heldRef = useRef(held);
  useEffect(() => {
    heldRef.current = held;
  }, [held]);

  useEffect(() => {
    // Следим за роликом активного проекта, а не переднего слота: во время диафрагмы
    // активный уже въезжает, и полоса должна идти по нему с первого кадра.
    const video = slotRefs[slots.indexOf(active)]?.current;
    const switcher = switchRef.current;
    if (!video || !switcher) return;
    let frame = 0;
    const tick = () => {
      const progress = video.duration ? video.currentTime / video.duration : 0;
      switcher.style.setProperty('--slide-rest', `${(1 - progress) * 100}%`);
      frame = requestAnimationFrame(tick);
    };
    const onEnded = () => {
      if (heldRef.current || HERO_SLIDES.length < 2) {
        video.currentTime = 0;
        video.play().catch(() => undefined);
        return;
      }
      dispatch({ type: 'go', index: (active + 1) % HERO_SLIDES.length });
    };
    video.addEventListener('ended', onEnded);
    tick();
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('ended', onEnded);
    };
    // slotRefs пересоздаётся каждый рендер, но сами ref стабильны.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, slots]);

  // Источники меняем только тому слоту, у которого действительно сменился проект.
  // Скрытый задний слот ставим на паузу: он под передним и зря декодирует кадры.
  useEffect(() => {
    slots.forEach((index, slot) => {
      const video = slotRefs[slot].current;
      if (!video) return;
      const id = HERO_SLIDES[index].id;
      const visible = slot === front || entering;
      if (loaded.current[slot] !== id) {
        loaded.current[slot] = id;
        video.load();
      }
      if (index === active && started.current !== id) {
        started.current = id;
        video.currentTime = 0;
      }
      if (visible) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  });

  // Диафрагма раскрывается из активной вкладки: считаем её центр в долях секции и отдаём в CSS.
  useEffect(() => {
    const section = sectionRef.current;
    const tab = switchRef.current?.children[active];
    if (!section || !(tab instanceof HTMLElement)) return;
    const box = section.getBoundingClientRect();
    const spot = tab.getBoundingClientRect();
    section.style.setProperty('--iris-x', `${((spot.left + spot.width / 2 - box.left) / box.width) * 100}%`);
    section.style.setProperty('--iris-y', `${((spot.top + spot.height / 2 - box.top) / box.height) * 100}%`);
  }, [active, sectionRef]);

  return (
    <section ref={sectionRef} className={styles.heroOverlay} id="hero">
      {/* Обёртка содержимого: переход к кейсам трансформирует её, а не секцию, которую держит пин. */}
      <div className={styles.heroOverlay__body} data-transition="hero-body">
      {/* Фрейм с двумя слотами: по скроллу из полноэкранного превращается в карточку 16:9
          между шапкой и переключателем (см. useHeroOverlayScroll). */}
      <div ref={frameRef} className={styles.heroOverlay__frame} data-transition="hero-frame" data-active={slide.id}>
      {slots.map((index, slot) => {
        const item = HERO_SLIDES[index];
        const isEntering = entering && slot !== front;
        // Передний слот поднят явно: без этого после settle оба слота на одном z-index,
        // и второй по DOM перекрывает первый — каждый второй переход показывал бы старый кадр.
        const isFront = slot === front;
        return (
          <video
            key={slot}
            ref={slotRefs[slot]}
            className={clsx(
              styles.heroOverlay__video,
              isFront && styles['heroOverlay__video--front'],
              isEntering && styles['heroOverlay__video--enter'],
            )}
            style={{ backgroundImage: `url(${item.video.poster})` }}
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={item.video.poster}
            aria-hidden="true"
            onAnimationEnd={isEntering ? () => dispatch({ type: 'settle', slot }) : undefined}
          >
            {item.video.webm && <source key={`${item.id}-webm`} src={item.video.webm} type="video/webm" />}
            <source key={`${item.id}-mp4`} src={item.video.mp4} type="video/mp4" />
          </video>
        );
      })}
        {/* Описание кейса и ссылка живут внутри карточки: на полноэкранном кадре скрыты,
            проявляются, когда фрейм сжался в карточку (см. useHeroOverlayScroll). */}
        <div ref={infoRef} className={styles.heroOverlay__info} data-transition="hero-info">
          <div className={styles.heroOverlay__caption} role="status">
            <span className={styles.heroOverlay__captionTitle}>{slide.title}</span>
            <span className={styles.heroOverlay__captionText}>{slide.caption}</span>
          </div>
          <Link href={slide.href} className={styles.heroOverlay__link}>
            {HERO_SLIDE_LINK}
            <span className={styles.heroOverlay__arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

      <div ref={veilRef} className={styles.heroOverlay__veil} aria-hidden="true" />
      {/* Подложка нижнего блока: в раскрытом состоянии гаснет вместе с затемнением,
          иначе она ложилась бы на нижний край карточки. */}
      <div ref={shadeRef} className={styles.heroOverlay__shade} aria-hidden="true" />

      <div className={styles.heroOverlay__inner}>
        {/* По скроллу уезжает только заголовок: переключатель, подпись кадра и кнопка остаются. */}
        <div ref={bottomRef} className={styles.heroOverlay__text} data-transition="hero-text">
          <h1 className={styles.heroOverlay__title}>
            {HERO.title.map((part, index) =>
              part.chip ? <HeroChip key={index} part={part} /> : <span key={index}>{part.text}</span>,
            )}
          </h1>
        </div>

        <div ref={footRef} className={styles.heroOverlay__foot} data-transition="hero-foot">
          {/* Пауза висит на самом переключателе, а не на секции: секция во весь экран,
              и курсор над ней почти всегда — смена кадров просто не запускалась бы.
              Фокус учитываем только клавиатурный: после клика мышью фокус остаётся
              на вкладке, и пауза по нему замораживала отсчёт навсегда. */}
          <div
            ref={switchRef}
            className={styles.heroOverlay__switch}
            role="tablist"
            aria-label="Проекты на первом экране"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={(event) => {
              if (event.target.matches(':focus-visible')) setHeld(true);
            }}
            onBlur={() => setHeld(false)}
          >
            {HERO_SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={clsx(styles.heroOverlay__tab, index === active && styles['heroOverlay__tab--active'])}
                // Выбор проекта руками — это желание посмотреть кадр: докручиваем до раскрытия.
                onClick={() => {
                  dispatch({ type: 'go', index });
                  reveal();
                }}
              >
                {item.label}
                <span className={styles.heroOverlay__line} aria-hidden="true" />
              </button>
            ))}
          </div>

          <CtaButton className={styles.heroOverlay__cta} />
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroOverlay;
