import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Прогресс перелета для покадровых эффектов (дрейф, наклон): они гаснут, пока визуал летит в галерею.
// `progress` идет за скроллом, `visual` за сглаженной анимацией кадров, которая догоняет скролл с задержкой
export const morphState = { progress: 0, visual: 0 };

// Галерея подхватывает проект, который первый экран показывал в момент передачи
export const HANDOFF_EVENT = 'flame-dev:hero-handoff';

export interface IHandoffDetail { slug: string }

interface IBox { x: number; y: number; w: number; h: number }
interface IFit { x: number; y: number; scale: number; rotation: number; clip: string; from: string }
type MorphRole = 'card' | 'back-1' | 'back-2' | 'extra';

const MEDIA = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';

const box = (element: Element): IBox => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, w: rect.width, h: rect.height };
};

const radius = (element: Element) => parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;

// Рамка задней карты без ее поворота: слой лежит в колоде без трансформаций, поворот и масштаб
// берем из вычисленной матрицы, чтобы итоговая позиция совпала с картой
const backBox = (element: HTMLElement) => {
  const deck = box(element.offsetParent ?? element);
  const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
  const scale = Math.hypot(matrix.a, matrix.b);
  const w = element.offsetWidth * scale;
  const h = element.offsetHeight * scale;
  const cx = deck.x + element.offsetLeft + element.offsetWidth / 2 + matrix.e;
  const cy = deck.y + element.offsetTop + element.offsetHeight / 2 + matrix.f;
  return { box: { x: cx - w / 2, y: cy - h / 2, w, h }, rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI };
};

// Равномерное масштабирование с обрезкой по центру: кадр источника ложится в рамку цели без искажения.
// Трансформация от центра, поэтому x и y это смещение центров
const fit = (source: IBox, target: IBox, sourceRadius: number, targetRadius: number, rotation = 0): IFit => {
  const scale = Math.max(target.w / source.w, target.h / source.h);
  const insetX = Math.max(0, (source.w - target.w / scale) / 2);
  const insetY = Math.max(0, (source.h - target.h / scale) / 2);
  return {
    x: target.x + target.w / 2 - (source.x + source.w / 2),
    y: target.y + target.h / 2 - (source.y + source.h / 2),
    scale,
    rotation,
    from: `inset(0px 0px 0px 0px round ${sourceRadius}px)`,
    clip: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${targetRadius / scale}px)`,
  };
};

/**
 * Перелет визуала первого экрана в колоду «Наших проектов» по скроллу.
 * Источники в hero: `[data-morph-source]` (card, back-1, back-2, extra) с неподвижным родителем
 * `[data-morph-slot]`, по нему и считается геометрия. Роли зависят от кадра в ядре и сверяются в начале перелета.
 * Цели в галерее: `[data-morph-target]`.
 * Колода и список проектов проявляются в конце, источник в этот момент гаснет поверх карты.
 * Смещение источника линейно по прокрутке, поэтому к концу диапазона он стоит ровно на карте
 */
const useHeroMorph = (heroRef: RefObject<HTMLElement | null>, key: string, getSlug: () => string, onMorphing: (value: boolean) => void) => {
  const slug = useRef(getSlug);
  const toggle = useRef(onMorphing);
  useEffect(() => {
    slug.current = getSlug;
    toggle.current = onMorphing;
  });

  useEffect(() => {
    const hero = heroRef.current;
    const cases = document.getElementById('cases');
    if (!hero || !cases) return;
    const mm = gsap.matchMedia();

    mm.add(MEDIA, (context) => {
      // Колода стоит на месте, а карта внутри пересоздается при смене проекта: ее ищем при каждом пересчете
      const deck = cases.querySelector<HTMLElement>('[data-morph-deck]');
      const findCard = () => cases.querySelector<HTMLElement>('[data-morph-target="card"]') ?? deck!;
      const sources = Array.from(hero.querySelectorAll<HTMLElement>('[data-morph-source]'));
      if (!deck || sources.length === 0) return;
      const deckParts = cases.querySelectorAll<HTMLElement>('[data-morph-part]');
      const index = cases.querySelector<HTMLElement>('[data-morph-index]');
      const fades = hero.querySelectorAll<HTMLElement>('[data-morph-fade]');
      hero.dataset.morph = '';

      // Все роли измеряем при refresh, а не на первом scroll после смены ядра.
      // Переключение проекта меняет роль карточки, но не геометрию ее неподвижного слота.
      const cache = new Map<HTMLElement, Record<MorphRole, IFit>>();
      const measure = () => {
        cache.clear();
        const target = findCard();
        const card = box(target);
        const cardRadius = radius(target);
        const backs = (['back-1', 'back-2'] as const).map(role => {
          const element = cases.querySelector<HTMLElement>(`[data-morph-target="${role}"]`);
          return element ? { ...backBox(element), radius: radius(element) } : null;
        });
        sources.forEach((source) => {
          const slot = source.closest('[data-morph-slot]') ?? source.parentElement!;
          const from = box(slot);
          const sourceRadius = radius(source);
          const front = fit(from, card, sourceRadius, cardRadius);
          const backFits = backs.map(back => back ? fit(from, back.box, sourceRadius, back.radius, back.rotation) : front);
          // Лишние кадры созвездия уходят в глубину колоды и гаснут
          const center = { x: card.x + card.w / 2 - from.w * .1, y: card.y + card.h / 2 - from.h * .1, w: from.w * .2, h: from.h * .2 };
          cache.set(source, {
            card: front,
            'back-1': backFits[0],
            'back-2': backFits[1],
            extra: fit(from, center, sourceRadius, sourceRadius),
          });
        });
      };
      measure();
      const get = (source: HTMLElement) => cache.get(source)![source.dataset.morphSource as MorphRole];

      let handed = false;
      let morphing = false;
      // Роли кадров зависят от того, какой кадр в ядре: твины кадров пересобираются, если роли сменились
      let built = '';
      let sourceTweens: gsap.core.Tween[] = [];
      const roles = () => sources.map(source => source.dataset.morphSource).join();
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => { morphState.visual = timeline.progress(); },
        scrollTrigger: {
          start: 0,
          // Совпадает с остановкой якоря: секция встает под фиксированной шапкой
          endTrigger: cases,
          end: () => `top ${parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0}px`,
          scrub: .5,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onUpdate: (self) => {
            morphState.progress = self.progress;
            const active = self.progress > .01;
            if (active !== morphing) { morphing = active; toggle.current(active); }
            if (self.progress > .8 && !handed) {
              handed = true;
              window.dispatchEvent(new CustomEvent<IHandoffDetail>(HANDOFF_EVENT, { detail: { slug: slug.current() } }));
            } else if (self.progress < .5) handed = false;
          },
        },
      });

      function build() {
        sourceTweens.forEach(tween => tween.kill());
        built = roles();
        sourceTweens = sources.flatMap((source) => {
          const extra = source.dataset.morphSource === 'extra';
          const move = gsap.fromTo(source,
            { x: 0, y: 0, scale: 1, rotation: 0, clipPath: () => get(source).from },
            { x: () => get(source).x, y: () => get(source).y, scale: () => get(source).scale, rotation: () => get(source).rotation, clipPath: () => get(source).clip, duration: extra ? .7 : .92, ease: 'none' });
          const fade = gsap.to(source, { opacity: 0, duration: extra ? .3 : .08, ease: 'power1.in' });
          timeline.add(move, extra ? .06 : .04).add(fade, extra ? .46 : .92);
          return [move, fade];
        });
        timeline.render(timeline.totalTime(), true, true);
      }

      timeline.to(fades, { opacity: 0, y: -48, filter: 'blur(8px)', duration: .32 }, 0);
      build();
      timeline.fromTo(deckParts, { opacity: 0 }, { opacity: 1, duration: .1 }, .88);
      if (index) timeline.fromTo(index, { opacity: 0, x: 64 }, { opacity: 1, x: 0, duration: .36, ease: 'power2.out' }, .64);

      // React обновляет роли при смене ядра. Подготовка проходит до следующего кадра,
      // поэтому начало скролла не создает твины и не вызывает синхронный пересчет layout.
      const roleObserver = new MutationObserver(() => context.add(() => {
        if (roles() !== built) build();
      }));
      sources.forEach(source => roleObserver.observe(source, { attributes: true, attributeFilter: ['data-morph-source'] }));

      // Шрифты и постеры меняют высоту страницы после первого расчета
      const settle = window.setTimeout(() => ScrollTrigger.refresh(), 1800);
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad);

      return () => {
        window.clearTimeout(settle);
        window.removeEventListener('load', onLoad);
        roleObserver.disconnect();
        delete hero.dataset.morph;
        morphState.progress = 0;
        morphState.visual = 0;
        if (morphing) toggle.current(false);
      };
    });

    return () => mm.revert();
  }, [heroRef, key]);
};

export default useHeroMorph;
