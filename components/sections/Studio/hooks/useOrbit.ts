import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { morphState } from './useHeroMorph';

interface ISeat {
  /** Место на орбите в долях оборота */
  offset: number;
  /** Размер кадра относительно ядра */
  size: number;
  /** Своя дуга места: доворот оси орбиты в градусах и множитель ее высоты */
  tilt: number;
  ry: number;
}

interface IOrbitItem {
  element: HTMLElement;
  slot: HTMLElement;
  dim: HTMLElement | null;
  /** Место на орбите, у ядра -1 */
  seat: number;
  /** Место, с которого кадр ушел в ядро: второй конец его дуги */
  origin: number;
  /** 0 кадр на орбите, 1 кадр в ядре */
  core: { value: number };
  /** Дуга перелета, знак выбирает сторону */
  arc: number;
  zIndex: string;
}

interface IPose {
  x: number;
  y: number;
  scale: number;
  depth: number;
}

export interface IUseOrbit {
  /** Индекс кадра в ядре на момент вызова */
  coreRef: RefObject<number>;
}

// Орбита вокруг ядра: полуоси в долях сцены, наклон оси в градусах, оборотов в секунду.
// Места разнесены равномерно, у каждого своя дуга: так кадры едут по разным осям и не наезжают друг на друга,
// а спереди лишь краем проходят по ядру
const ORBIT = { rx: .46, ry: .36, tilt: -8, speed: 1 / 70 };
const SEATS: ISeat[] = [
  { offset: 0, size: .5, tilt: 10, ry: .94 },
  { offset: 1 / 5, size: .44, tilt: 6, ry: .94 },
  { offset: 2 / 5, size: .48, tilt: 10, ry: .88 },
  { offset: 3 / 5, size: .42, tilt: -6, ry: 1 },
  { offset: 4 / 5, size: .46, tilt: -6, ry: 1.06 },
];
// Задние кадры меньше, передние крупнее
const DEPTH_SCALE = .22;
// Перелет в ядро и обратно
const FLIGHT = 1.15;
// Доворот орбиты при смене ядра, в оборотах: остальные кадры проезжают по своим дугам
const KICK = .14;
// Пока курсор над сценой, орбита замедляется, чтобы кадр было легко поймать
const HOVER_SPEED = .22;
// Намерение: курсор сам заехал на кадр, а не кадр подъехал под курсор, и задержался на нем
const INTENT_MS = 110;
// После смены ядра новые наведения ждут, пока кадры разъедутся
const LOCK_MS = 520;

const MOBILE = '(max-width: 900px)';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Орбиты первого экрана. Один кадр стоит в ядре по центру сцены, остальные едут вокруг него
 * по наклонным эллипсам: задние меньше и темнее и уходят под ядро, передние крупнее и проходят поверх.
 * Наведенный кадр по дуге подлетает в ядро, бывшее ядро по дуге уходит на его место, орбита доворачивается.
 * Кадры: `[data-orbit-item]` с `data-index` внутри неподвижного слота, затемнение `[data-orbit-dim]`.
 * Слоты всех кадров совпадают с ядром, поэтому перелет в галерею считает геометрию от одной рамки.
 * Мобильная компоновка скрывает сцену и не запускает вычисления орбит
 */
const useOrbit = (rootRef: RefObject<HTMLElement | null>, onCore: (index: number) => void): IUseOrbit => {
  const coreRef = useRef(0);
  const callback = useRef(onCore);
  useEffect(() => {
    callback.current = onCore;
  });

  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.querySelector<HTMLElement>('[data-carousel]');
    if (!root || !stage) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia(MOBILE);
    // Угол орбиты и доворот после смены ядра, в оборотах
    const orbit = { angle: .08, kick: 0 };
    let seat = 0;
    const items: IOrbitItem[] = Array.from(stage.querySelectorAll<HTMLElement>('[data-orbit-item]')).map((element, index) => ({
      element,
      slot: element.parentElement!,
      dim: element.querySelector<HTMLElement>('[data-orbit-dim]'),
      seat: index === coreRef.current ? -1 : seat++,
      origin: 0,
      core: { value: index === coreRef.current ? 1 : 0 },
      arc: 1,
      zIndex: '',
    }));
    if (items.length === 0) return;

    const size = { w: stage.offsetWidth, h: stage.offsetHeight };
    const resize = new ResizeObserver(() => {
      size.w = stage.offsetWidth;
      size.h = stage.offsetHeight;
      if (motion.matches && !mobile.matches) render(0);
    });
    resize.observe(stage);

    const pointer = { x: 0, y: 0, clientX: 0, clientY: 0, inside: false };
    const smooth = { x: 0, y: 0 };
    // Раскрытие орбит при появлении и скорость вращения
    const spread = { value: .55 };
    const pace = { value: 1 };
    let last = 0;
    let visible = true;
    let running = false;

    const seatPose = (index: number, time: number): IPose => {
      const { offset, size: scale, tilt, ry } = SEATS[index];
      const theta = (offset + orbit.angle + orbit.kick) * Math.PI * 2;
      const lx = Math.cos(theta) * ORBIT.rx * size.w * spread.value;
      const ly = Math.sin(theta) * ORBIT.ry * ry * size.h * spread.value;
      const depth = Math.sin(theta);
      const t = (ORBIT.tilt + tilt) * Math.PI / 180;
      // Легкое покачивание, чтобы движение не выглядело механическим
      const bob = Math.sin(time * .0011 + index * 1.7) * 5;
      return {
        x: lx * Math.cos(t) - ly * Math.sin(t),
        y: lx * Math.sin(t) + ly * Math.cos(t) + bob,
        scale: scale * (1 + depth * DEPTH_SCALE),
        depth,
      };
    };

    const corePose = (time: number): IPose => ({ x: 0, y: Math.sin(time * .0009) * 6, scale: 1, depth: 1 });

    const setZ = (item: IOrbitItem, value: string) => {
      if (item.zIndex === value) return;
      item.zIndex = value;
      item.slot.style.zIndex = value;
    };

    const renderDesktop = (time: number, calm: number) => {
      smooth.x += (pointer.x - smooth.x) * .06;
      smooth.y += (pointer.y - smooth.y) * .06;
      const center = corePose(time);
      items.forEach((item) => {
        const c = item.core.value;
        const from = seatPose(item.seat >= 0 ? item.seat : item.origin, time);
        // Путь в ядро и обратно идет по дуге, а не по прямой: сдвиг поперек хорды, максимум посередине
        const dx = center.x - from.x;
        const dy = center.y - from.y;
        const bend = Math.sin(Math.PI * c) * .22 * item.arc;
        const x = mix(from.x, center.x, c) - dy * bend;
        const y = mix(from.y, center.y, c) + dx * bend;
        // Кадр на подлете чуть выходит к зрителю, потом садится в ядро
        const lift = Math.sin(Math.PI * c) * .08;
        const scale = mix(from.scale, 1, c) * (1 + lift);
        const depth = mix(from.depth, 1, c);
        // Кадры разворачиваются к ядру, вся сцена чуть следует за курсором
        const ry = (-x / size.w) * 26 * (1 - c) + smooth.x * 5;
        const rx = (y / size.h) * 10 * (1 - c) - smooth.y * 4;
        const px = smooth.x * (8 + depth * 10);
        const py = smooth.y * (6 + depth * 6);
        const total = 1 + (scale - 1) * calm;
        item.element.style.transform = `perspective(1400px) translate3d(${(x + px) * calm}px, ${(y + py) * calm}px, 0) rotateX(${rx * calm}deg) rotateY(${ry * calm}deg) scale(${total})`;
        if (item.dim) item.dim.style.opacity = String(((1 - depth) / 2) * .62 * (1 - c) * calm);
        // Ядро над задней орбитой, передняя проходит поверх. Кадр в перелете выше всех
        const moving = c > .02 && c < .98;
        const z = moving ? (item.seat < 0 ? 30 : 25) : item.seat < 0 ? 10 : depth > 0 ? 11 + Math.round(depth * 4) : 2 + Math.round((depth + 1) * 3);
        setZ(item, String(z));
      });
    };

    // Намерение навести: кандидат под курсором и время, когда курсор на него заехал
    const intent = { index: -1, since: 0 };
    let lockUntil = 0;

    const swap = (index: number) => {
      const current = coreRef.current;
      if (index === current || mobile.matches) return;
      const incoming = items[index];
      const outgoing = items[current];
      if (!incoming || !outgoing) return;
      const quick = motion.matches;
      // Бывшее ядро занимает место пришедшего кадра, орбиты доворачиваются, и место уезжает из-под курсора.
      // Дуги выгнуты в разные стороны, чтобы кадры разошлись, а не прошли друг сквозь друга
      outgoing.seat = incoming.seat;
      incoming.origin = incoming.seat;
      incoming.seat = -1;
      incoming.arc = 1;
      outgoing.arc = -1;
      gsap.to(incoming.core, { value: 1, duration: quick ? 0 : FLIGHT, ease: 'power3.inOut', overwrite: true });
      gsap.to(outgoing.core, { value: 0, duration: quick ? 0 : FLIGHT, ease: 'power3.inOut', overwrite: true });
      if (!quick) gsap.to(orbit, { kick: `+=${KICK}`, duration: 1.8, ease: 'power2.out' });
      coreRef.current = index;
      lockUntil = performance.now() + LOCK_MS;
      intent.index = -1;
      callback.current(index);
      if (quick) render(0);
    };

    const hit = (target: EventTarget | null): number => {
      const element = target instanceof Element ? target.closest<HTMLElement>('[data-orbit-item]') : null;
      return element ? Number(element.dataset.index) : -1;
    };

    const checkIntent = (now: number) => {
      if (intent.index < 0 || now < lockUntil || morphState.progress > .01) return;
      if (now - intent.since < INTENT_MS) return;
      // Кадр мог уехать из-под неподвижного курсора, пока шла задержка
      if (hit(document.elementFromPoint(pointer.clientX, pointer.clientY)) !== intent.index) {
        intent.index = -1;
        return;
      }
      swap(intent.index);
    };

    const render = (time: number) => {
      if (mobile.matches || size.w === 0 || size.h === 0) return;
      const dt = last ? Math.min(time - last, 64) / 1000 : 0;
      last = time;
      // Гаснет к 80% перелета, чтобы к посадке в галерею слой уже стоял ровно
      const calm = motion.matches ? 1 : Math.max(0, 1 - morphState.progress * 1.25);
      pace.value += ((pointer.inside ? HOVER_SPEED : 1) - pace.value) * Math.min(1, dt * 3);
      if (!motion.matches) orbit.angle += ORBIT.speed * dt * pace.value;
      checkIntent(time);
      renderDesktop(time, calm);
    };
    const tick = () => render(performance.now());

    const start = () => {
      if (running || !visible || document.hidden || mobile.matches || motion.matches) return;
      running = true;
      last = 0;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
    };

    const move = (event: PointerEvent) => {
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.y = event.clientY / window.innerHeight * 2 - 1;
    };
    const stageMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer.inside = true;
      const index = hit(event.target);
      if (index < 0 || index === coreRef.current) {
        intent.index = -1;
        return;
      }
      // Событие без сдвига курсора: кадр подъехал сам, это не наведение
      if (index === intent.index || (!event.movementX && !event.movementY)) return;
      intent.index = index;
      intent.since = performance.now();
    };
    const stageLeave = () => {
      pointer.inside = false;
      intent.index = -1;
    };
    // Клавиатура и тап: кадр сразу встает в ядро, без проверки намерения. Тап по кадру на орбите
    // не открывает проект, а выводит его в ядро; открывает повторный тап
    let touch = false;
    const down = (event: PointerEvent) => { touch = event.pointerType === 'touch'; };
    const click = (event: MouseEvent) => {
      const index = hit(event.target);
      if (!touch || mobile.matches || index < 0 || index === coreRef.current) return;
      event.preventDefault();
      swap(index);
    };
    const focus = (event: FocusEvent) => {
      const index = hit(event.target);
      if (index >= 0 && (event.target as HTMLElement).matches(':focus-visible')) swap(index);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const visibility = () => (document.hidden ? stop() : start());
    // Слой уже вне окна, но еще летит в галерею: кадр на каждый скролл, чтобы наклон погас вместе с перелетом
    const scroll = () => {
      if (!running && !mobile.matches && !motion.matches && !document.hidden && morphState.progress > 0 && morphState.progress < 1) tick();
    };

    const reset = () => items.forEach((item) => {
      const { element, slot, dim } = item;
      element.style.transform = '';
      slot.style.zIndex = '';
      item.zIndex = '';
      if (dim) dim.style.opacity = '';
    });
    const mode = () => {
      stop();
      if (mobile.matches) {
        reset();
        return;
      }
      size.w = stage.offsetWidth;
      size.h = stage.offsetHeight;
      if (motion.matches) {
        gsap.killTweensOf([spread, orbit, ...items.map(item => item.core)]);
        spread.value = 1;
        items.forEach((item, index) => { item.core.value = index === coreRef.current ? 1 : 0; });
        pointer.x = pointer.y = smooth.x = smooth.y = 0;
        render(0);
      } else start();
    };

    if (!motion.matches && !mobile.matches) gsap.to(spread, { value: 1, duration: 1.8, ease: 'expo.out', delay: .15 });
    else spread.value = 1;

    observer.observe(stage);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    stage.addEventListener('pointermove', stageMove, { passive: true });
    stage.addEventListener('pointerleave', stageLeave);
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('click', click);
    stage.addEventListener('focusin', focus);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', mode);
    mobile.addEventListener('change', mode);
    mode();

    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      gsap.killTweensOf([spread, orbit, ...items.map(item => item.core)]);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
      stage.removeEventListener('pointermove', stageMove);
      stage.removeEventListener('pointerleave', stageLeave);
      stage.removeEventListener('pointerdown', down);
      stage.removeEventListener('click', click);
      stage.removeEventListener('focusin', focus);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', mode);
      mobile.removeEventListener('change', mode);
      reset();
    };
  }, [rootRef]);

  return { coreRef };
};

export default useOrbit;
