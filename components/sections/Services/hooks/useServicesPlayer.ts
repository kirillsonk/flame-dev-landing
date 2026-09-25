import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Дополнение к `mobile` из styles/_mixins.scss: пин только на широких экранах.
const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Смена сцены: уходящая гаснет чуть раньше границы, входящая проявляется сразу после неё.
const SWAP = 0.06;
// Прокрутка на одну сцену, в высотах окна.
const SCENE_LENGTH = 0.75;
// Куда встаёт клик по метке: чуть дальше границы сцены, когда смена уже доиграла.
const SCENE_ENTRY = 0.15;

/** Событие «открыть услугу»: detail — индекс в SERVICES. Шлют пилюли первого экрана. */
export const SERVICES_GOTO_EVENT = 'flame-dev:services-goto';

export interface IUseServicesPlayer {
  sectionRef: RefObject<HTMLElement | null>;
  /** Докрутить пин до сцены: метки под рамкой работают как якоря шапки. */
  goTo: (index: number) => void;
}

/**
 * Секция пинится на count × SCENE_LENGTH высот окна, таймлайн длиной count проигрывается скраб-скроллом:
 * на каждой целой отметке сцена сменяется следующей, полоса дорожки заполняется, в списке слева
 * раскрыта текущая услуга. Интерактивна только активная сцена: остальные `inert`, без событий мыши
 * и получают `demo-visibility-change`, чтобы 3D-сцена не рендерилась впустую.
 * На мобильном и при reduced motion пина нет: список раскрыт, сцены идут столбиком.
 */
const useServicesPlayer = (count: number): IUseServicesPlayer => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || count < 1) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!desktop || !motion) return;

      const query = <T extends Element>(part: string) =>
        Array.from(section.querySelectorAll<T & HTMLElement>(`[data-part="${part}"]`));
      const items = query<HTMLLIElement>('item');
      const chips = query<HTMLSpanElement>('chip');
      const scenes = query<HTMLDivElement>('visual');
      const [progress] = query<HTMLSpanElement>('progress');
      if (scenes.length !== count || items.length !== count || !progress) return;

      section.dataset.live = '';
      let active = -1;
      const setActive = (index: number) => {
        if (index === active) return;
        active = index;
        items.forEach((el, i) => el.toggleAttribute('data-active', i === index));
        chips.forEach((el, i) => el.toggleAttribute('data-active', i === index));
        scenes.forEach((scene, i) => {
          const inert = i !== index;
          scene.style.zIndex = inert ? '0' : '1';
          scene.style.pointerEvents = inert ? 'none' : 'auto';
          if (scene.inert !== inert) {
            scene.inert = inert;
            scene.dispatchEvent(new Event('demo-visibility-change'));
          }
        });
      };

      gsap.set(scenes.slice(1), { autoAlpha: 0 });
      setActive(0);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => `+=${window.innerHeight * count * SCENE_LENGTH}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
        },
      });

      triggerRef.current = tl.scrollTrigger ?? null;

      tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: count }, 0);
      for (let k = 1; k < count; k += 1) {
        tl.to(scenes[k - 1], { autoAlpha: 0, scale: 0.97, duration: SWAP }, k - SWAP / 2).fromTo(
          scenes[k],
          { autoAlpha: 0, scale: 1.03 },
          { autoAlpha: 1, scale: 1, duration: SWAP, immediateRender: false },
          k + 0.01,
        );
      }

      return () => {
        triggerRef.current = null;
        delete section.dataset.live;
        items.forEach((el) => el.removeAttribute('data-active'));
        chips.forEach((el) => el.removeAttribute('data-active'));
        scenes.forEach((scene) => {
          scene.style.removeProperty('z-index');
          scene.style.removeProperty('pointer-events');
          if (scene.inert) {
            scene.inert = false;
            scene.dispatchEvent(new Event('demo-visibility-change'));
          }
        });
      };
    });

    return () => mm.revert();
  }, [count]);

  const goTo = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const progress = index === 0 ? 0 : (index + SCENE_ENTRY) / count;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' });
  };

  // Пилюля первого экрана — обычный якорь #services: AnchorScroll уже поставил страницу на старт
  // пина, отсюда доезжаем до нужной сцены. Без пина (мобильный) остается переход к началу блока.
  useEffect(() => {
    const onGoTo = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (index >= 0 && index < count) goTo(index);
    };
    window.addEventListener(SERVICES_GOTO_EVENT, onGoTo);
    return () => window.removeEventListener(SERVICES_GOTO_EVENT, onGoTo);
    // goTo читает только ref и count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return { sectionRef, goTo };
};

export default useServicesPlayer;
