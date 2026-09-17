import { useEffect } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

import type { HomeTransitionVariant } from '../variants';
import { heroCardBox } from '@/components/sections/Hero/hooks/useHeroOverlayScroll';

const q = <T extends HTMLElement>(root: HTMLElement, name: string) => root.querySelector<T>(`[data-transition="${name}"]`);

/**
 * Переход от первого экрана к кейсам по скроллу. Работает на входе секции кейсов
 * (от «верх кейсов у низа окна» до «верх кейсов у верха окна»). В накрывающих вариантах
 * hero ещё держит свой пин (coverNext), а кейсы поднимаются поверх него с отрицательным
 * отступом на высоту окна — стандартная схема «cover» в ScrollTrigger. Трансформы hero
 * ложатся на внутреннюю обёртку, потому что саму секцию двигает пин.
 */
const useHomeTransition = (rootRef: RefObject<HTMLElement | null>, variant: HomeTransitionVariant) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const hero = root.querySelector<HTMLElement>('#hero');
    const cases = root.querySelector<HTMLElement>('#cases');
    if (!hero || !cases) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!desktop || !motion) return;

      const body = q<HTMLElement>(hero, 'hero-body') ?? hero;
      const veilOf = (el: HTMLElement) => el.querySelector<HTMLElement>('[class*="__veil"]');
      // У первого экрана-ленты нет отдельного кадра: зум, размытие и затухание ложатся на всё содержимое.
      const ownFrame = q<HTMLElement>(hero, 'hero-frame');
      const frame = ownFrame ?? body;
      const info = q<HTMLElement>(hero, 'hero-info');
      const title = q<HTMLElement>(cases, 'cases-title');
      const stage = q<HTMLElement>(cases, 'cases-stage');
      const rows = Array.from(cases.querySelectorAll<HTMLElement>('[data-transition="cases-row"]'));
      const firstTile = cases.querySelector<HTMLElement>('[data-transition="tile-media"]');
      const vh = () => window.innerHeight;

      let observer: MutationObserver | null = null;
      const extra: gsap.core.Timeline[] = [];
      const trigger = { trigger: cases, start: 'top bottom', end: 'top top', scrub: 0.6, invalidateOnRefresh: true };
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger });

      // Накрытие: кейсы поднимаются поверх стоящего hero (отступ и слой задаёт CSS по data-cover).
      const cover = () => {
        cases.dataset.cover = '';
      };

      switch (variant) {
        case 1:
          cover();
          timeline.to(frame, { scale: 0.94, opacity: 0.35 }, 0).to(info, { opacity: 0 }, 0);
          break;
        case 2:
          timeline.to(body, { y: () => vh() * 0.35, opacity: 0.15 }, 0);
          break;
        case 3: {
          // Кейсы уже стоят под пином у верха окна (leadIn в CasesTilt) поверх hero, который
          // ещё держит свой пин. За высоту окна: первый экран гаснет, карточка активного кейса
          // летит в свою плитку, и только потом проявляется блок кейсов — плитка накрывает карточку.
          // Отступ на два экрана: один съедает подъём кейсов к верху окна (они ещё невидимы),
          // второй — само окно перехода, совпадающее с продлённым пином hero.
          const foot = q<HTMLElement>(hero, 'hero-foot');
          // Лете в плитку нужен кадр-карточка и нижний блок HeroOverlay. У ленты их нет:
          // обычное накрытие, первый экран гаснет под кейсами.
          if (!ownFrame || !foot) {
            cover();
            timeline.to(body, { opacity: 0.2 }, 0);
            break;
          }
          cover();
          cases.dataset.coverDeep = '';
          {
            const target = () => {
              const slug = frame.dataset.active ?? '';
              const tile = cases.querySelector<HTMLElement>(`a[href="/cases/${slug}"] [data-transition="tile-media"]`) ?? firstTile;
              const card = heroCardBox(hero, foot);
              if (!tile) return { x: 0, y: 0, width: card.width, height: card.height };
              const casesBox = cases.getBoundingClientRect();
              const box = tile.getBoundingClientRect();
              const width = tile.offsetWidth;
              const height = tile.offsetHeight;
              const centerX = box.left - casesBox.left + box.width / 2;
              const centerY = box.top - casesBox.top + box.height / 2;
              return {
                x: centerX - (card.left + width / 2),
                y: centerY - (card.top + height / 2),
                width,
                height,
              };
            };
            const fade = [veilOf(hero), q(hero, 'hero-info'), foot, q(hero, 'hero-text')].filter(Boolean) as HTMLElement[];
            // На время перелёта ролики первого экрана стоят: иначе автосмена кейса по концу
            // ролика меняет цель прямо в полёте. При возврате наверх компонент сам включит нужный.
            const videos = () => Array.from(hero.querySelectorAll('video'));
            const own = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: cases,
                start: 'top top',
                end: () => `+=${vh()}`,
                scrub: 0.6,
                invalidateOnRefresh: true,
                onEnter: () => videos().forEach((video) => video.pause()),
                onEnterBack: () => videos().forEach((video) => video.pause()),
                onLeaveBack: () => videos().forEach((video) => video.play().catch(() => undefined)),
              },
            });
            own
              .to(fade, { opacity: 0, duration: 0.35 }, 0)
              .fromTo(cases, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.55)
              .to(frame, {
                x: () => target().x,
                y: () => target().y,
                width: () => target().width,
                height: () => target().height,
                rotate: -4,
                borderRadius: '1.4rem',
                duration: 0.75,
              }, 0.15)
              .to(frame, { opacity: 0, duration: 0.05 }, 0.95);
            extra.push(own);

            // Активный кейс меняется автосменой: цель пересчитывается при смене data-active.
            observer = new MutationObserver(() => ScrollTrigger.refresh());
            observer.observe(frame, { attributes: true, attributeFilter: ['data-active'] });
          }
          break;
        }
        case 4:
          cover();
          timeline.to(frame, { scale: 1.2, filter: 'blur(14px)', opacity: 0.15 }, 0).to(info, { opacity: 0, duration: 0.4 }, 0);
          break;
        case 5:
          // Ряды кейсов собираются с краёв: верхний из-за левого, нижний из-за правого.
          rows.forEach((row, index) => timeline.from(row, { xPercent: index % 2 ? 40 : -40, opacity: 0, duration: 0.8 }, 0.2));
          timeline.from(title, { y: 40, opacity: 0, duration: 0.6 }, 0);
          break;
        case 6:
          cover();
          timeline.fromTo(cases, { clipPath: 'circle(0% at 12% 92%)' }, { clipPath: 'circle(150% at 12% 92%)' }, 0);
          break;
        case 7:
          cover();
          gsap.set(hero, { perspective: 1400 });
          gsap.set(body, { transformOrigin: '50% 0%' });
          timeline.to(body, { rotateX: -60, opacity: 0 }, 0);
          break;
        case 8:
          cover();
          timeline.to(body, { xPercent: -100 }, 0);
          break;
        case 9:
          // Подпись карточки hero гаснет, заголовок кейсов поднимается ей навстречу.
          timeline.to(info, { opacity: 0, y: -20, duration: 0.5 }, 0).from(title, { y: 60, opacity: 0, duration: 0.6 }, 0.3).from(stage, { opacity: 0, duration: 0.5 }, 0.5);
          break;
        case 10: {
          cover();
          // Полоса фиксирована в окне и проходит снизу вверх вместе с кромкой кейсов
          // (внутри секции её резал бы overflow). hero гаснет под ней.
          const band = document.createElement('div');
          band.dataset.transition = 'band';
          root.appendChild(band);
          timeline.fromTo(band, { y: 0 }, { y: () => -vh() * 1.22 }, 0).to(body, { opacity: 0, duration: 0.6 }, 0.3);
          break;
        }
        default:
          break;
      }

      return () => {
        observer?.disconnect();
        extra.forEach((tl) => {
          tl.scrollTrigger?.kill();
          tl.revert().kill();
        });
        timeline.scrollTrigger?.kill();
        timeline.revert().kill();
        delete cases.dataset.cover;
        delete cases.dataset.coverDeep;
        root.querySelector('[data-transition="band"]')?.remove();
        gsap.set([hero, body], { clearProps: 'all' });
      };
    });

    return () => mm.revert();
  }, [rootRef, variant]);
};

export default useHomeTransition;
