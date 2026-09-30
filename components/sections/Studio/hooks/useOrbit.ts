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
  /** Название проекта над кадром, `[data-orbit-title]` в том же слоте */
  title: HTMLElement | null;
  /** Место на орбите, у ядра -1 */
  seat: number;
  /** Место, с которого кадр ушел в ядро: второй конец его дуги */
  origin: number;
  /** 0 кадр на орбите, 1 кадр в ядре */
  core: { value: number };
  /** Дуга перелета, знак выбирает сторону */
  arc: number;
  /** 0 название в перспективе орбиты, 1 развернуто к зрителю */
  focus: number;
  /** Сглаженная горизонтальная скорость кадра на экране, px/s: от нее легкий наклон букв при довороте орбиты */
  drift: number;
  lastX: number;
  /** Размеры строки названия без трансформаций, px */
  titleW: number;
  titleH: number;
  zIndex: string;
  transform: string;
  dimOpacity: string;
  titleTransform: string;
  titleOpacity: string;
  titleFilter: string;
  titleFocus: boolean;
}

interface IPose {
  x: number;
  y: number;
  scale: number;
  depth: number;
}

// Поза кадра в текущем кадре анимации для его названия: положение до затухания и итоговые значения трансформации кадра
interface ITitlePose {
  x: number;
  y: number;
  depth: number;
  c: number;
  X: number;
  Y: number;
  RX: number;
  RY: number;
  /** Масштаб места на орбите, без роста в перелете */
  seatScale: number;
  /** Масштаб кадра на экране */
  total: number;
  /** Вертикаль ядра: оно слегка покачивается */
  coreY: number;
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

// Названия над кадрами орбиты. Точка схода та же, что у кадров, в ядре, но объектив короче:
// слово длиннее кадра, и с объективом кадров его перспектива почти не читалась бы.
// Ближний конец слова снаружи орбиты, дальний уходит в глубину к ядру: слева слово уходит вправо, справа влево.
// Углы в градусах, расстояния в px пространства кадра, время в секундах
const TITLE = {
  lens: 560,
  // Кегль на экране в долях ширины кадра, умножается на масштаб места
  em: .18,
  // Самое мелкое слово на экране, px: задняя дуга на узком экране остается читаемой
  minEm: 16,
  // Длинное название сжимается, чтобы быть не шире 1.6 кадра
  maxWidth: 1.6,
  // Сужение букв: у фирменной гарнитуры нет узкого начертания
  condense: .88,
  // От верхнего края кадра до строки
  gap: 14,
  // Опорная точка слова ходит по верхнему краю кадра от левого угла к правому
  inset: .9,
  // Разворот слова по сторонам орбиты, на задней дуге слабее
  yaw: 24,
  back: .45,
  // Наклон назад: на задней дуге почти ровно, на передней слово ложится в глубину
  pitchBack: 6,
  pitchFront: 22,
  // Дальний конец слова чуть клонится к ядру на диагоналях орбиты
  roll: 6,
  // Передние слова крупнее, задние мельче и тусклее
  depthScale: .12,
  tone: .5,
  // Размытие самых дальних слов на экране, px
  blur: .4,
  // Переднее слово над рамкой ядра и слово у колонки с заголовком притухают
  guard: .72,
  copy: .45,
  // Слово ближе к зрителю, чем кадр: сильнее следует за курсором и дышит не в фазе с кадром, px
  leadBack: 4,
  leadFront: 10,
  breath: 2,
  // Наведение: слово подрастает, выходит к зрителю и разворачивается лицом
  focusScale: .08,
  focusZ: 24,
  // Постоянные времени разворота к зрителю и обратно: 95% пути примерно за .5 и .65 с
  focusIn: .16,
  focusOut: .22,
  // Слово бывшего ядра смотрит на зрителя, пока кадр не прошел две трети дуги
  release: .35,
  // Слово кадра, летящего в ядро, гаснет на этом участке перелета: в ядре у кадра своя подпись
  fadeFrom: .25,
  fadeTo: .7,
  // Инерция: при довороте орбиты буквы на градусы отстают, deg на px/s и предел
  skew: .01,
  skewMax: 3,
};

const MOBILE = '(max-width: 900px)';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Орбиты первого экрана. Один кадр стоит в ядре по центру сцены, остальные едут вокруг него
 * по наклонным эллипсам: задние меньше и темнее и уходят под ядро, передние крупнее и проходят поверх.
 * Наведенный кадр по дуге подлетает в ядро, бывшее ядро по дуге уходит на его место, орбита доворачивается.
 * Кадры: `[data-orbit-item]` с `data-index` внутри неподвижного слота, затемнение `[data-orbit-dim]`.
 * Над кадрами орбиты стоят названия `[data-orbit-title]`, соседи кадра в слоте: их позу считает этот же цикл.
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
      title: element.parentElement!.querySelector<HTMLElement>('[data-orbit-title]'),
      seat: index === coreRef.current ? -1 : seat++,
      origin: 0,
      core: { value: index === coreRef.current ? 1 : 0 },
      arc: 1,
      focus: index === coreRef.current ? 1 : 0,
      drift: 0,
      lastX: 0,
      titleW: 0,
      titleH: 0,
      zIndex: '',
      transform: '',
      dimOpacity: '',
      titleTransform: '',
      titleOpacity: '',
      titleFilter: '',
      titleFocus: false,
    }));
    if (items.length === 0) return;

    const size = { w: stage.offsetWidth, h: stage.offsetHeight };
    // Рамка кадра без трансформаций (у всех слотов одна), ее центр от левого края сцены и кегль, в котором растрируются названия
    const frame = { w: 0, h: 0, cx: 0, type: 1 };
    const measure = () => {
      const { slot } = items[0];
      frame.w = slot.offsetWidth;
      frame.h = slot.offsetHeight;
      frame.cx = slot.offsetLeft + frame.w / 2;
      items.forEach((item) => {
        if (!item.title) return;
        item.titleW = item.title.offsetWidth;
        item.titleH = item.title.offsetHeight;
      });
      const sample = items.find(item => item.title)?.title;
      if (sample) frame.type = parseFloat(getComputedStyle(sample).fontSize) || 1;
    };
    // Смена языка и подгрузка шрифта меняют ширину названий: их тоже наблюдаем
    const resize = new ResizeObserver(() => {
      size.w = stage.offsetWidth;
      size.h = stage.offsetHeight;
      measure();
      if (motion.matches && !mobile.matches) render(0);
    });
    resize.observe(stage);
    items.forEach(({ title }) => { if (title) resize.observe(title); });

    const pointer = { x: 0, y: 0, clientX: 0, clientY: 0, inside: false };
    const smooth = { x: 0, y: 0 };
    // Раскрытие орбит при появлении и скорость вращения
    const spread = { value: .55 };
    const pace = { value: 1 };
    let last = 0;
    let visible = true;
    let heroVisible = true;
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

    // Намерение навести: кандидат под курсором и время, когда курсор на него заехал
    const intent = { index: -1, since: 0 };
    let lockUntil = 0;

    // Название живет в пространстве кадра: цепочка начинается с позы кадра (та же точка схода в ядре),
    // затем опорная точка над верхним краем кадра и собственный поворот слова вокруг нее
    const renderTitle = (item: IOrbitItem, index: number, pose: ITitlePose, time: number, calm: number, dt: number) => {
      const { title } = item;
      if (!title || !item.titleW || !frame.w) return;
      const { x, y, depth, c, X, Y, RX, RY, seatScale, total, coreY } = pose;
      // К зрителю повернуто наведенное слово, слово кадра в ядре и слово бывшего ядра в начале его дуги
      const target = item.seat < 0 || c > TITLE.release || (intent.index === index && !motion.matches) ? 1 : 0;
      const tau = target > item.focus ? TITLE.focusIn : TITLE.focusOut;
      item.focus += (target - item.focus) * (motion.matches ? 1 : 1 - Math.exp(-dt / tau));
      const f = item.focus;
      // Место на орбите: nx от -1 слева до 1 справа, ny от -1 сверху (задняя дуга) до 1 снизу
      const nx = clamp(x / (ORBIT.rx * size.w), -1, 1);
      const ny = clamp(y / (ORBIT.ry * size.h), -1, 1);
      const near = (depth + 1) / 2;
      // Опорная точка слова: слева его начало, справа конец, посередине центр. Ближний конец всегда снаружи орбиты
      const u = (1 + nx) / 2;
      const base = frame.w * TITLE.em / frame.type;
      const fit = Math.min(1, TITLE.maxWidth * frame.w / (item.titleW * TITLE.condense * base));
      const k = Math.max(TITLE.minEm / frame.type, seatScale * base * fit * (1 + depth * TITLE.depthScale)) * (1 + f * TITLE.focusScale);
      const ax = (u - .5) * frame.w * TITLE.inset * total + smooth.x * mix(TITLE.leadBack, TITLE.leadFront, near) * calm;
      const ay = -(frame.h / 2 + TITLE.gap) * total + Math.sin(time * .0013 + index * 2.3) * TITLE.breath * calm;
      const az = f * TITLE.focusZ;
      // Слева дальний край справа, справа слева, сверху поворот слабее. Лицом к зрителю: поворот слова гасит поворот кадра
      const yaw = mix(-nx * TITLE.yaw * mix(TITLE.back, 1, near), -RY, f);
      const pitch = mix(mix(TITLE.pitchBack, TITLE.pitchFront, near), -RX, f);
      const roll = TITLE.roll * nx * ny * (1 - f);
      if (dt > 0 && running) item.drift += ((X - item.lastX) / dt - item.drift) * Math.min(1, dt * 8);
      else item.drift = 0;
      item.lastX = X;
      const skew = clamp(item.drift * TITLE.skew, -TITLE.skewMax, TITLE.skewMax) * (1 - f);

      // Проекция слова на экран, приблизительно: ширина, высота, левый и нижний край от центра ядра
      const w = item.titleW * TITLE.condense * k * Math.cos((yaw + RY) * Math.PI / 180);
      const h = item.titleH * k * Math.cos(pitch * Math.PI / 180);
      const left = X + ax - u * w;
      const bottom = Y + ay;
      let guard = 1;
      // Переднее слово над рамкой ядра притухает, пока его не выбрали: видео и подпись ядра остаются главными
      if (depth > 0 && item.seat >= 0) {
        const coverX = clamp((Math.min(left + w, frame.w / 2) - Math.max(left, -frame.w / 2)) / w, 0, 1);
        const coverY = clamp((Math.min(bottom, coreY + frame.h / 2) - Math.max(bottom - h, coreY - frame.h / 2)) / h, 0, 1);
        guard = 1 - TITLE.guard * smoothstep(0, .35, coverX * coverY) * (1 - f);
      }
      // У колонки с главным заголовком слово уходит в тень, пока его не выбрали
      guard *= 1 - TITLE.copy * smoothstep(24, 96, -(frame.cx + left)) * (1 - f);
      // Гаснет на подлете к ядру, в начале перелета в галерею и пока орбиты раскрываются. При возврате наверх
      // кадры догоняют скролл с задержкой: слово ждет, пока его кадр долетит обратно
      const away = motion.matches ? 0 : Math.max(morphState.progress, morphState.visual);
      const presence = (1 - smoothstep(TITLE.fadeFrom, TITLE.fadeTo, c)) * smoothstep(.8, 1, 1 - away * 1.25) * smoothstep(.75, 1, spread.value);
      const alpha = presence * guard * mix(mix(TITLE.tone, 1, near), 1, f);
      const opacity = alpha < .002 ? '0' : alpha.toFixed(3);
      if (item.titleOpacity !== opacity) {
        title.style.opacity = opacity;
        item.titleOpacity = opacity;
      }
      const focused = target === 1;
      if (item.titleFocus !== focused) {
        title.toggleAttribute('data-focus', focused);
        item.titleFocus = focused;
      }
      if (opacity === '0') return;

      const transform = `perspective(${TITLE.lens}px) translate3d(${X}px, ${Y}px, 0) rotateX(${RX}deg) rotateY(${RY}deg) translate3d(${ax}px, ${ay}px, ${az}px) rotateZ(${roll}deg) rotateY(${yaw}deg) rotateX(${pitch}deg) skewX(${skew}deg) scale(${k * TITLE.condense}, ${k}) translate(${-u * item.titleW}px, ${-item.titleH}px)`;
      if (item.titleTransform !== transform) {
        title.style.transform = transform;
        item.titleTransform = transform;
      }
      // Фильтр размывает слово до трансформации, поэтому радиус делим на масштаб; шаг .25px, чтобы не перерисовывать каждый кадр
      const blur = Math.round(TITLE.blur * smoothstep(.4, 1, -depth) * (1 - f) / k * 4) / 4;
      const filter = blur > 0 ? `blur(${blur}px)` : 'none';
      if (item.titleFilter !== filter) {
        title.style.filter = filter;
        item.titleFilter = filter;
      }
    };

    const renderDesktop = (time: number, calm: number, dt: number) => {
      smooth.x += (pointer.x - smooth.x) * .06;
      smooth.y += (pointer.y - smooth.y) * .06;
      const center = corePose(time);
      items.forEach((item, index) => {
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
        const X = (x + px) * calm;
        const Y = (y + py) * calm;
        const RX = rx * calm;
        const RY = ry * calm;
        const transform = `perspective(1400px) translate3d(${X}px, ${Y}px, 0) rotateX(${RX}deg) rotateY(${RY}deg) scale(${total})`;
        const dimOpacity = String(((1 - depth) / 2) * .62 * (1 - c) * calm);
        // Последняя часть перелета уже неподвижна: не инвалидируем одинаковые стили каждый кадр.
        if (item.transform !== transform) {
          item.element.style.transform = transform;
          item.transform = transform;
        }
        if (item.dim && item.dimOpacity !== dimOpacity) {
          item.dim.style.opacity = dimOpacity;
          item.dimOpacity = dimOpacity;
        }
        // Ядро над задней орбитой, передняя проходит поверх. Кадр в перелете выше всех
        const moving = c > .02 && c < .98;
        const z = moving ? (item.seat < 0 ? 30 : 25) : item.seat < 0 ? 10 : depth > 0 ? 11 + Math.round(depth * 4) : 2 + Math.round((depth + 1) * 3);
        setZ(item, String(z));
        renderTitle(item, index, { x, y, depth, c, X, Y, RX, RY, seatScale: from.scale, total, coreY: center.y }, time, calm, dt);
      });
    };

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
      renderDesktop(time, calm, dt);
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

    const syncDecorations = () => {
      root.toggleAttribute('data-hero-paused', !heroVisible || document.hidden);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === stage) visible = entry.isIntersecting;
        if (entry.target === root) heroVisible = entry.isIntersecting;
      });
      syncDecorations();
      if (visible) start(); else stop();
    });
    const visibility = () => {
      syncDecorations();
      if (document.hidden) stop(); else start();
    };
    // Слой уже вне окна, но еще летит в галерею: кадр на каждый скролл, чтобы наклон погас вместе с перелетом
    const scroll = () => {
      if (!running && !mobile.matches && !motion.matches && !document.hidden && morphState.progress > 0 && morphState.progress < 1) tick();
    };

    const reset = () => items.forEach((item) => {
      const { element, slot, dim, title } = item;
      element.style.transform = '';
      slot.style.zIndex = '';
      item.zIndex = '';
      item.transform = '';
      item.dimOpacity = '';
      if (dim) dim.style.opacity = '';
      if (title) {
        title.style.transform = '';
        title.style.opacity = '';
        title.style.filter = '';
        title.removeAttribute('data-focus');
      }
      item.titleTransform = '';
      item.titleOpacity = '';
      item.titleFilter = '';
      item.titleFocus = false;
      item.drift = 0;
    });
    const mode = () => {
      stop();
      if (mobile.matches) {
        reset();
        return;
      }
      size.w = stage.offsetWidth;
      size.h = stage.offsetHeight;
      measure();
      if (motion.matches) {
        gsap.killTweensOf([spread, orbit, ...items.map(item => item.core)]);
        spread.value = 1;
        items.forEach((item, index) => {
          item.core.value = index === coreRef.current ? 1 : 0;
          item.focus = item.core.value;
          item.drift = 0;
        });
        pointer.x = pointer.y = smooth.x = smooth.y = 0;
        render(0);
      } else start();
    };

    if (!motion.matches && !mobile.matches) gsap.to(spread, { value: 1, duration: 1.8, ease: 'expo.out', delay: .15 });
    else spread.value = 1;

    observer.observe(stage);
    observer.observe(root);
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
      root.removeAttribute('data-hero-paused');
      reset();
    };
  }, [rootRef]);

  return { coreRef };
};

export default useOrbit;
