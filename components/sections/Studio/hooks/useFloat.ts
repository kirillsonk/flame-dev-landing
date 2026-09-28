import { useEffect } from 'react';
import type { RefObject } from 'react';
import { morphState } from './useHeroMorph';

interface IFloatItem {
  element: HTMLElement;
  slot: HTMLElement;
  /** Подпись кадра: держит свой размер, пока кадр увеличен */
  label: HTMLElement | null;
  depth: number;
  amp: number;
  tilt: number;
  phase: number;
  speed: number;
  /** Пружина вылета вперед: положение и скорость */
  focus: number;
  velocity: number;
}

// Доля ширины сцены, которую занимает кадр, вылетевший вперед
const FOCUS_WIDTH = .66;

/**
 * Полет кадров созвездия. Параметры на `[data-float]`: `data-depth` сила реакции на курсор,
 * `data-amp` амплитуда полета по осям в px, `data-tilt` базовый поворот, `data-focus="1"` кадр вылетает вперед.
 * Вылет идет на пружине с небольшим перелетом, остальные кадры в это время отступают.
 * На телефоне кадры стоят лентой: поворот и масштаб зависят от расстояния до центра ленты.
 * Все смещения гаснут вместе с прогрессом перелета в галерею
 */
const useFloat = (rootRef: RefObject<HTMLElement | null>, key: string) => {
  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.querySelector<HTMLElement>('[data-carousel]');
    if (!root || !stage) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 900px)');
    const items: IFloatItem[] = Array.from(root.querySelectorAll<HTMLElement>('[data-float]')).map((element, index) => ({
      element,
      slot: element.parentElement!,
      label: element.querySelector<HTMLElement>('[data-float-label]'),
      depth: Number(element.dataset.depth ?? 1),
      amp: Number(element.dataset.amp ?? 10),
      tilt: Number(element.dataset.tilt ?? 0),
      phase: index * 1.9,
      speed: .00042 + index * .00006,
      focus: 0,
      velocity: 0,
    }));
    if (items.length === 0) return;

    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let recede = 0;
    let frame = 0;
    let visible = true;

    // Кадр вылетает к центру сцены. Геометрия из offset*: слоты не трансформируются
    const toCenter = ({ slot }: IFloatItem) => ({
      x: stage.offsetWidth / 2 - (slot.offsetLeft + slot.offsetWidth / 2),
      y: stage.offsetHeight / 2 - (slot.offsetTop + slot.offsetHeight / 2),
      scale: Math.max(1.12, stage.offsetWidth * FOCUS_WIDTH / slot.offsetWidth),
    });

    const renderDesktop = (time: number, calm: number) => {
      smooth.x += (pointer.x - smooth.x) * .06;
      smooth.y += (pointer.y - smooth.y) * .06;
      const anyFocus = calm > 0 && items.some(item => item.element.dataset.focus === '1');
      recede += ((anyFocus ? 1 : 0) - recede) * .1;
      items.forEach((item) => {
        const target = item.element.dataset.focus === '1' && calm > 0 ? 1 : 0;
        item.velocity = (item.velocity + (target - item.focus) * .14) * .7;
        item.focus += item.velocity;
        const f = Math.max(0, item.focus);
        const free = 1 - Math.min(f, 1);
        const { depth, amp, tilt, phase, speed } = item;
        // Полет по осям: у каждого кадра своя траектория и свой ритм приближения
        const t = time * speed + phase;
        const x = Math.sin(t) * amp + smooth.x * depth * 18;
        const y = Math.cos(t * 1.3) * amp * .7 + smooth.y * depth * 12;
        const z = 1 + Math.sin(t * .8) * .035;
        const rx = -smooth.y * depth * 8 + Math.sin(t * 1.1) * 2;
        const ry = smooth.x * depth * 10 + Math.cos(t * .9) * 3;
        const rz = tilt + Math.sin(t * .7) * 1.5;
        const center = f > .001 ? toCenter(item) : { x: 0, y: 0, scale: 1 };
        // Отступают все, кроме вылетевшего; скорость пружины дает кадру живой разворот в полете
        const back = 1 - recede * .1 * free;
        const scale = (z * free + center.scale * f) * back;
        const swing = item.velocity * 60;
        const total = 1 + (scale - 1) * calm;
        item.element.style.transform = `perspective(1400px) translate3d(${(x * free + center.x * f) * calm}px, ${(y * free + center.y * f) * calm}px, 0) rotateX(${rx * free * calm}deg) rotateY(${(ry * free + swing) * calm}deg) rotateZ(${rz * free * calm}deg) scale(${total})`;
        if (item.label) item.label.style.scale = f > .01 ? String(1 / total) : '';
      });
    };

    const renderMobile = (time: number) => {
      const middle = stage.scrollLeft + stage.clientWidth / 2;
      items.forEach(({ element, slot, amp, tilt, phase, speed }) => {
        const offset = (slot.offsetLeft + slot.offsetWidth / 2 - middle) / stage.clientWidth;
        const distance = Math.min(Math.abs(offset), 1.2);
        const t = time * speed + phase;
        const y = Math.cos(t * 1.3) * amp * .45 + distance * 18;
        element.style.transform = `perspective(900px) translate3d(0, ${y}px, 0) rotateY(${-offset * 30}deg) rotateZ(${offset * 5 + tilt * .3 + Math.sin(t) * 1.2}deg) scale(${1 - distance * .16})`;
      });
    };

    const render = (time: number) => {
      frame = 0;
      // Гаснет к 80% перелета, чтобы к посадке в галерею слой уже стоял ровно
      const calm = Math.max(0, 1 - morphState.progress * 1.25);
      if (mobile.matches) renderMobile(time);
      else renderDesktop(time, calm);
      if (visible && !document.hidden) frame = requestAnimationFrame(render);
    };
    const start = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const reset = () => items.forEach(({ element, label }) => {
      element.style.transform = '';
      if (label) label.style.scale = '';
    });

    // При уменьшении движения кадры стоят в базовом повороте
    if (motion.matches) {
      items.forEach(({ element, tilt }) => { element.style.transform = mobile.matches ? '' : `rotateZ(${tilt}deg)`; });
      return reset;
    }

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.y = event.clientY / window.innerHeight * 2 - 1;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const visibility = () => (document.hidden ? stop() : start());
    // Слой уже вне окна, но еще летит в галерею: кадр на каждый скролл, чтобы наклон погас вместе с перелетом
    const scroll = () => { if (!frame) frame = requestAnimationFrame(render); };
    observer.observe(root);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    stage.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      stage.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', visibility);
      reset();
    };
  }, [rootRef, key]);
};

export default useFloat;
