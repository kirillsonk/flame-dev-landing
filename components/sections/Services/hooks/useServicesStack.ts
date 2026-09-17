import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FLAME_BASE } from '../flame';

gsap.registerPlugin(ScrollTrigger);

// Complement of the `mobile` mixin in styles/_mixins.scss
const STACK_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Ширина огонька в долях ширины визуала: от искры до размера, накрывающего рамку с углами.
const FLAME_MIN = 0.18;
const FLAME_MAX = 5.6;
// Отрезок скролла, на котором огонь разгорается: текст услуги идёт от 85% до 35% высоты окна.
const WIPE_START = 'top 85%';
const WIPE_END = 'top 35%';
// Та же граница, что и WIPE_END: визуал становится кликабельным ровно когда разгорелся.
const ACTIVE_AT = 0.35;

export interface IUseServicesStack {
  setSlideRef: (index: number) => (node: HTMLElement | null) => void;
}

/**
 * Визуалы услуг лежат стопкой в одном липком слоте справа (CSS, см. ServiceSlide.module.scss).
 * Как в референсе (ronasit.com/services): пока текст очередной услуги подъезжает, её визуал
 * проявляется поверх предыдущего, а предыдущий стоит на месте и темнеет. Всё привязано к
 * скроллу (scrub): остановился — огонь замер, назад — гаснет до нуля.
 * Проявление — разгорание: визуал обрезан SVG clipPath в форме огонька из логотипа, контур
 * растёт из нижней кромки рамки по прогрессу скролла. Контур статичный.
 */
const useServicesStack = (count: number): IUseServicesStack => {
  const slides = useRef<(HTMLElement | null)[]>([]);

  const setSlideRef = (index: number) => (node: HTMLElement | null) => {
    slides.current[index] = node;
  };

  useEffect(() => {
    if (count < 2) return;

    const mm = gsap.matchMedia();
    mm.add({ stack: STACK_QUERY, motion: MOTION_QUERY }, (context) => {
      const { stack, motion } = context.conditions as { stack: boolean; motion: boolean };
      if (!stack || !motion) return;

      const items = slides.current.slice(0, count).filter((el): el is HTMLElement => el !== null);
      if (items.length !== count) return;
      const query = <T extends Element>(part: string) =>
        items.map((el) => el.querySelector<T>(`[data-part="${part}"]`)).filter((el): el is T => el !== null);
      const texts = query<HTMLElement>('text');
      const visuals = query<HTMLElement>('visual');
      const flames = query<SVGPathElement>('flame');
      // Кликабелен ровно один визуал, и это задано явно, а не формой обрезки: WebKit берёт для
      // хит-теста устаревшую геометрию clipPath, и клик проваливался в нижний визуал стопки.
      // Активный считаем по геометрии текстов, а не по прогрессу таймлайнов: прогресс в WebKit
      // не всегда доходил до конца, и живой визуал оставался недоступным.
      const syncInteraction = () => {
        const active = texts.reduce(
          (active, text, i) => (text.getBoundingClientRect().top <= window.innerHeight * ACTIVE_AT ? i : active),
          0,
        );
        visuals.forEach((visual, i) => {
          const inert = i !== active;
          // Активный слой поднимаем над стопкой: при прокрутке назад соседний визуал ещё виден,
          // лежит выше по порядку в DOM, и его содержимое (канвас сцены, панель демо) перехватывает
          // клики — `pointer-events: none` на обёртке не помогает, дети включают его обратно.
          visual.style.zIndex = inert ? '0' : '1';
          visual.style.pointerEvents = inert ? 'none' : 'auto';
          if (visual.inert !== inert) {
            visual.inert = inert;
            visual.dispatchEvent(new Event('demo-visibility-change'));
          }
        });
      };
      if ([texts, visuals, flames].some((list) => list.length !== count)) return;

      // Рост: контур в единицах objectBoundingBox масштабируется от середины нижней кромки.
      // По y домножаем на отношение сторон, чтобы огонёк не сплющивался в широкой рамке.
      // Видимость тоже считается от прогресса: на нуле визуал спрятан целиком, чтобы при откате
      // назад не оставалась искра.
      const grow = (i: number, p: number) => {
        const visual = visuals[i];
        syncInteraction();
        const s = FLAME_MIN + (FLAME_MAX - FLAME_MIN) * Math.pow(p, 2.2);
        const aspect = visual.offsetWidth / Math.max(1, visual.offsetHeight);
        flames[i].setAttribute('transform', `translate(0.5 1) scale(${s} ${s * aspect}) translate(-0.5 -1)`);
        visual.style.setProperty('--glow', `${Math.pow(1 - p, 1.5)}`);
        gsap.set(visual, { autoAlpha: p > 0 ? 1 : 0 });
        // Разгорелся — обрезка снимается совсем: дальше визуал обычный прямоугольник. Ставим её
        // сами и с префиксом: WebKit хит-тестит по -webkit-clip-path, и если снять только
        // clip-path, клик продолжает проваливаться сквозь визуал в нижний слой стопки.
        const clip = p >= 1 ? 'none' : `url(#${visual.dataset.clip})`;
        visual.style.clipPath = clip;
        visual.style.setProperty('-webkit-clip-path', clip);
      };

      visuals.forEach((el, i) => {
        if (i === 0) {
          gsap.set(el, { autoAlpha: 1 });
          return;
        }
        grow(i, 0);
      });

      const timelines = items.slice(1).map((slide, i) => {
        const prev = visuals[i];
        const text = texts[i + 1];
        const state = { p: 0 };
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: text,
            start: WIPE_START,
            end: WIPE_END,
            scrub: true,
            invalidateOnRefresh: true,
            // Крайние состояния ставим явно: в WebKit скраб не всегда доводил прогресс до
            // единицы, и визуал оставался некликабельным после конца перехода.
            onLeave: () => grow(i + 1, 1),
            onEnterBack: () => grow(i + 1, 1),
            onLeaveBack: () => grow(i + 1, 0),
          },
        });
        // Входящий: огонь разгорается по прогрессу скролла, на нуле спрятан.
        tl.to(state, { p: 1, duration: 1, onUpdate: () => grow(i + 1, state.p) }, 0);
        // Уходящий стоит на месте и уходит в тень.
        tl.fromTo(prev, { filter: 'brightness(1)', scale: 1 }, { filter: 'brightness(0.25)', scale: 0.97, duration: 1 }, 0);
        return tl;
      });

      // Высоты меняются уже после расчёта триггеров: подгружается шрифт и чанк сцены Росатома.
      const resize = new ResizeObserver(() => ScrollTrigger.refresh());
      if (items[0].parentElement) resize.observe(items[0].parentElement);

      return () => {
        resize.disconnect();
        timelines.forEach((tl) => {
          tl.scrollTrigger?.kill();
          tl.revert().kill();
        });
        visuals.forEach((visual) => {
          visual.inert = false;
          visual.style.removeProperty('pointer-events');
          visual.style.removeProperty('z-index');
          visual.style.removeProperty('clip-path');
          visual.style.removeProperty('-webkit-clip-path');
          visual.style.removeProperty('--glow');
          visual.dispatchEvent(new Event('demo-visibility-change'));
        });
        flames.forEach((flame) => {
          flame.setAttribute('d', FLAME_BASE);
          flame.removeAttribute('transform');
        });
      };
    });

    return () => mm.revert();
  }, [count]);

  return { setSlideRef };
};

export default useServicesStack;
