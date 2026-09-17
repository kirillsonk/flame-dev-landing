import { useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useEcosystemScene, { ECOSYSTEM_SCRUB, part, parts } from './useEcosystemScene';
import type { IUseEcosystemScene } from './useEcosystemScene';

// Первая строка титров в момент пина уже стоит на экране (доля высоты окна): пустой экран
// с одним заголовком, пока лента доезжает снизу, выглядит как пауза.
const START = 0.5;
// Строка-мост («Следующий проект — Ваш ↓») останавливается у нижнего края (доля высоты окна):
// на ней пин отпускается, дальше она держится на месте, пока снизу не подъедет следующий блок.
const BRIDGE_LINE = 0.86;
// Ниже этой доли высоты окна строка-мост растворяется, как титры под маской сцены.
const FADE = 0.9;
// Строка загорается, когда её центр поднялся выше этой доли высоты окна, и больше не гаснет:
// титры читаются, пока идут, а не только у центра экрана.
const REVEAL = 0.88;
// Приглушение строки, пока она не вошла на экран, как у остальных строк титров.
const DIM = 0.35;
// Пикселей прокрутки на пиксель пробега титров: скорость не зависит от длины списка.
const SPEED = 2;
// Зазор между строкой-мостом и содержимым следующего блока, на который она ложится.
const LANDING_GAP = 4.8;

// Три состояния моста. «roll» — едет в ленте титров. «fixed» — держится на экране: у нижнего
// края или над запиненным соседом. «ride» — лёг на следующий блок и едет с ним по документу.
// В первых двух мост — настоящий position: fixed, в третьем — absolute с одним постоянным top:
// эмуляция трансформом на каждом событии прокрутки отстаёт на кадр и дрожит.
type Mode = 'roll' | 'fixed' | 'ride';

export interface IUseEcosystemCredits extends IUseEcosystemScene {
  bridgeRef: RefObject<HTMLDivElement | null>;
}

const remPx = (value: number) => value * parseFloat(getComputedStyle(document.documentElement).fontSize);

const isSpacer = (el: Element | null) => Boolean(el?.classList.contains('pin-spacer'));

/** Пока секцию держит её ScrollTrigger, она стоит на экране как fixed. */
const isPinned = (el: Element) => ScrollTrigger.getAll().some((trigger) => trigger.pin === el && trigger.isActive);

/**
 * Титры едут вверх, пока строка-мост не встанет у нижнего края; строка получает `data-on`,
 * как только вошла на экран, и не гаснет. После пина мост стоит на месте, следующий блок подъезжает под него, и когда его
 * содержимое подходит вплотную, мост ложится сверху и едет дальше вместе с ним — в том числе
 * стоит с ним всё время, пока тот запинен и играет свою анимацию.
 */
const useEcosystemCredits = (): IUseEcosystemCredits => {
  const bridgeRef = useRef<HTMLDivElement>(null);

  const scene = useEcosystemScene((root) => {
    const roll = part(root, 'roll');
    const bridge = bridgeRef.current;
    if (!roll || !bridge) return;
    const lines = parts(root, 'line');
    bridge.setAttribute('data-live', '');

    // Следующая секция лежит за мостом; если её уже запинил свой ScrollTrigger — внутри pin-spacer.
    const nextSection = () => {
      const el = bridge.nextElementSibling;
      return isSpacer(el) ? (el as Element).firstElementChild : el;
    };

    const height = () => root.clientHeight;
    const gap = () => parseFloat(getComputedStyle(roll).gap) || 0;
    // Смещение моста относительно верха ленты: сразу под последней строкой ленты.
    const bridgeOffset = () => roll.offsetHeight + gap();
    const from = () => height() * START;
    const to = () => height() * BRIDGE_LINE - (bridgeOffset() + bridge.offsetHeight / 2);

    let mode: Mode = 'roll';
    const state = { y: 0 };

    const render = () => {
      const h = height();
      gsap.set(roll, { y: state.y });
      lines.forEach((line) => {
        const center = state.y + line.offsetTop + line.offsetHeight / 2;
        line.toggleAttribute('data-on', center <= h * REVEAL);
      });

      const rootRect = root.getBoundingClientRect();
      const rootStyle = getComputedStyle(root);
      const padLeft = parseFloat(rootStyle.paddingLeft);
      const padRight = parseFloat(rootStyle.paddingRight);
      const bh = bridge.offsetHeight;
      // Положения верха моста в координатах окна: у нижнего края, на следующем блоке, в ленте.
      const rest = h * BRIDGE_LINE - bh / 2;
      const section = nextSection();
      const target = section?.firstElementChild ?? section;
      const landed = target ? target.getBoundingClientRect().top - remPx(LANDING_GAP) - bh : Infinity;
      const held = Math.min(rest, landed);
      const followTop = state.y + bridgeOffset() + rootRect.top;

      let next: Mode;
      if (followTop >= held) next = 'roll';
      else if (landed < rest && section && !isPinned(section)) next = 'ride';
      else next = 'fixed';

      const top = next === 'roll' ? followTop : held;
      const horizontal = { left: rootRect.left + padLeft, width: root.clientWidth - padLeft - padRight };
      if (next === 'ride') {
        // Один раз при посадке: top в документе, дальше мост едет с прокруткой сам.
        if (mode !== 'ride') {
          gsap.set(bridge, { position: 'absolute', ...horizontal });
          const parentTop = (bridge.offsetParent ?? document.documentElement).getBoundingClientRect().top;
          gsap.set(bridge, { top: top - parentTop });
        }
      } else {
        gsap.set(bridge, { position: 'fixed', top, ...horizontal });
      }
      mode = next;

      const center = top + bh / 2;
      const on = center <= h * REVEAL;
      const fade = 1 - gsap.utils.clamp(0, 1, (center - h * FADE) / (h * (1 - FADE)));
      bridge.toggleAttribute('data-on', on);
      gsap.set(bridge, { visibility: top < h ? 'visible' : 'hidden', opacity: (on ? 1 : DIM) * fade });
    };

    const tween = gsap.fromTo(
      state,
      { y: from },
      {
        y: to,
        ease: 'none',
        immediateRender: true,
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${(from() - to()) * SPEED}`,
          pin: true,
          scrub: ECOSYSTEM_SCRUB,
          invalidateOnRefresh: true,
        },
      },
    );
    // После пина лента стоит, но мост продолжает путь: положение зависит от следующего блока,
    // поэтому пересчитывается на каждом шаге прокрутки всей страницы. Пин соседней секции может
    // обновиться в том же тике позже нас, так что считаем ещё раз следующим кадром и в конце прокрутки.
    let frame = 0;
    const settle = () => {
      render();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    // После пересчёта разметки посадка считается заново.
    const refresh = () => {
      mode = 'roll';
      settle();
    };
    const follow = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: settle, onRefresh: refresh });
    ScrollTrigger.addEventListener('scrollEnd', settle);
    render();

    return () => {
      ScrollTrigger.removeEventListener('scrollEnd', settle);
      cancelAnimationFrame(frame);
      follow.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(roll, { clearProps: 'transform' });
      gsap.set(bridge, { clearProps: 'all' });
      lines.forEach((line) => line.removeAttribute('data-on'));
      bridge.removeAttribute('data-on');
      bridge.removeAttribute('data-live');
    };
  });

  return { ...scene, bridgeRef };
};

export default useEcosystemCredits;
