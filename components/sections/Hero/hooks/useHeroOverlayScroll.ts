import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Дополнение к `mobile` из styles/_mixins.scss: пин только на широких экранах.
const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Сколько прокрутки занимает пин, в долях высоты окна: раскрытие кадра плюс запас,
// на котором карточка уже собрана и просто стоит, чтобы момент не проскакивался.
const PIN_BASE = 1.6;
// Доля базового пина, за которую анимация заканчивается; остаток — запас с готовой карточкой.
const REVEAL_SHARE = 0.7;
// Если следующая секция накрывает первый экран, пин длиннее ещё на высоту окна:
// на этом отрезке hero стоит, а кейсы заезжают поверх (см. useHomeTransition).
const COVER_EXTRA = 1;

export interface IUseHeroOverlayScrollOptions {
  coverNext?: boolean;
}

export interface IUseHeroOverlayScroll {
  sectionRef: React.RefObject<HTMLElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  infoRef: React.RefObject<HTMLDivElement | null>;
  veilRef: React.RefObject<HTMLDivElement | null>;
  shadeRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  footRef: React.RefObject<HTMLDivElement | null>;
  /** Плавно докрутить до раскрытого кадра, где заголовок уже скрыт. Без пина — ничего не делает. */
  reveal: () => void;
}

// Значение CSS-переменной из :root в пикселях (переменные заданы в rem).
const rootRem = (name: string): number => {
  const root = document.documentElement;
  const value = parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
  return value * parseFloat(getComputedStyle(root).fontSize);
};

// Пропорция роликов кейсов (`videoWide`): к ней сжимается фрейм в раскрытом состоянии.
const FRAME_RATIO = 16 / 9;

export interface IHeroCardBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Бокс карточки в раскрытом состоянии относительно секции: между шапкой и переключателем,
 * в пропорции роликов, по центру. Общий для пина hero и перехода к кейсам.
 */
export const heroCardBox = (section: HTMLElement, foot: HTMLElement): IHeroCardBox => {
  const gap = rootRem('--space-card');
  const top = rootRem('--size-header') + gap;
  const maxHeight = foot.offsetTop - gap - top;
  const maxWidth = section.clientWidth - rootRem('--space-gutter') * 2;
  const height = Math.min(maxHeight, maxWidth / FRAME_RATIO);
  const width = height * FRAME_RATIO;
  return { top, left: (section.clientWidth - width) / 2, width, height };
};

/**
 * Первый экран раскрывается по скроллу: секция пинится, заголовок уезжает вверх и гаснет,
 * а полноэкранный затемнённый кадр превращается в карточку в исходной пропорции роликов,
 * которая помещается между шапкой и переключателем проектов. Затемнение уходит совсем.
 * На мобильном и при `prefers-reduced-motion` пина нет: экран ведёт себя как обычная секция.
 */
const useHeroOverlayScroll = ({ coverNext = false }: IUseHeroOverlayScrollOptions = {}): IUseHeroOverlayScroll => {
  // Точка собранной карточки в долях всего пина.
  const pinLength = PIN_BASE + (coverNext ? COVER_EXTRA : 0);
  const revealAt = (PIN_BASE * REVEAL_SHARE) / pinLength;
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!desktop || !motion) return;

      const section = sectionRef.current;
      const frame = frameRef.current;
      const info = infoRef.current;
      const veil = veilRef.current;
      const shade = shadeRef.current;
      const bottom = bottomRef.current;
      const foot = footRef.current;
      if (!section || !frame || !info || !veil || !shade || !bottom || !foot) return;

      // Целевой бокс карточки считается заново на refresh.
      const card = () => heroCardBox(section, foot);

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          // Закрепляем по нижней кромке: секция ниже окна на высоту шапки, и пин по верху
          // оставлял снизу полосу следующей секции. Так низ кадра совпадает с низом окна.
          start: 'bottom bottom',
          end: `+=${Math.round(pinLength * 100)}%`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          // Два осмысленных состояния: заголовок и собранная карточка. Между ними экран
          // доматывается к ближайшему, а в зоне запаса после карточки снап не вмешивается:
          // там ничего не меняется, и прокрутка должна быть свободной.
          snap: {
            snapTo: (value: number) => (value >= revealAt ? value : value < revealAt / 2 ? 0 : revealAt),
            duration: { min: 0.2, max: 0.5 },
            delay: 0.08,
            ease: 'power2.inOut',
            inertia: false,
          },
        },
      });

      // Порядок важен: сначала уходит заголовок, и только потом снимается затемнение.
      // Если вести их вместе, к середине кадр уже светлеет, а полупрозрачный белый текст
      // превращается в блёклый след поверх яркой картинки (замер: яркость подложки до 104).
      timeline.to(bottom, { yPercent: -35, autoAlpha: 0, duration: 0.42 }, 0);
      // Затемнение и подложка низа уходят совсем: карточка должна быть чистой.
      timeline.to([veil, shade], { opacity: 0, duration: 0.7 }, 0.3);
      // Фрейм сжимается из полного экрана в карточку. Функции вместо чисел: бокс зависит
      // от размера окна и пересчитывается на invalidateOnRefresh.
      timeline.to(
        frame,
        {
          top: () => card().top,
          left: () => card().left,
          width: () => card().width,
          height: () => card().height,
          borderRadius: () => rootRem('--radius-card'),
          duration: 0.7,
        },
        0.3,
      );
      // Описание кейса проявляется внутри карточки в самом конце, когда фрейм уже почти сжат.
      // fromTo, а не CSS: без пина (мобильный, reduced-motion) блок должен быть виден сразу.
      timeline.fromTo(info, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.8);
      // Пустой хвост растягивает таймлайн так, чтобы анимация заняла REVEAL_SHARE пина,
      // а остаток прокрутки прошёл с уже собранной карточкой.
      const animated = timeline.duration();
      timeline.to({}, { duration: animated * (1 / revealAt - 1) });
      triggerRef.current = timeline.scrollTrigger ?? null;

      return () => {
        triggerRef.current = null;
        timeline.scrollTrigger?.kill();
        timeline.revert().kill();
      };
    });

    return () => mm.revert();
  }, [pinLength, revealAt]);

  // Собранная карточка — это REVEAL_SHARE пути пина: туда же доматывает snap.
  // Если карточка уже собрана или прокручена дальше, страницу не трогаем.
  const reveal = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const target = trigger.start + (trigger.end - trigger.start) * revealAt;
    if (window.scrollY >= target - 2) return;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return { sectionRef, frameRef, infoRef, veilRef, shadeRef, bottomRef, footRef, reveal };
};

export default useHeroOverlayScroll;
