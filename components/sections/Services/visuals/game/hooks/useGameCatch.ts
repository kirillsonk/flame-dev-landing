import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { GAME_CATCH as copy, GAME_PROMO } from '@/data/demosGame';
import { GAME_ICON_PATHS } from '@/components/sections/Services/visuals/game/icons';
import { makePromoCode } from '@/components/sections/Services/visuals/game/promo';
import type { IGameResult } from './useGameCombo';

type CatchKind = (typeof copy.legend)[number]['kind'];
type CatchPhase = 'idle' | 'playing' | 'done';

interface IItem {
  kind: CatchKind;
  points: number;
  x: number;
  y: number;
  speed: number;
}

interface IPop {
  x: number;
  y: number;
  value: number;
  t: number;
}

interface IWorld {
  width: number;
  height: number;
  rem: number;
  bag: number;
  target: number;
  items: IItem[];
  pops: IPop[];
  score: number;
  elapsed: number;
  spawn: number;
  shake: number;
  keys: Record<string, boolean>;
  colors: Record<string, string>;
  font: string;
}

const COLOR_TOKENS = {
  drink: '--color-error',
  burger: '--color-success',
  star: '--color-demo-gold',
  dud: '--color-text-dim',
  from: '--color-action-primary',
  to: '--color-action-accent',
  text: '--color-text',
  plus: '--color-success',
  minus: '--color-fire-light',
  grid: '--color-border',
  shadow: '--color-bg',
};

const PATHS = {
  drink: GAME_ICON_PATHS.drink,
  burger: GAME_ICON_PATHS.burger,
  star: GAME_ICON_PATHS.star,
};

const pickKind = () => {
  const total = copy.legend.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of copy.legend) {
    roll -= item.weight;
    if (roll < 0) return item;
  }
  return copy.legend[0];
};

/**
 * «Лови заказ»: canvas-игра на `copy.duration` секунд. Старт только по кнопке,
 * цикл requestAnimationFrame стоит на паузе, пока демо неактивно (вне экрана, `inert`, скрытая вкладка).
 */
const useGameCatch = (active: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<CatchPhase>('idle');
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState<number>(copy.duration);
  const [result, setResult] = useState<IGameResult | null>(null);
  const world = useRef<IWorld>({
    width: 0,
    height: 0,
    rem: 10,
    bag: 0,
    target: 0,
    items: [],
    pops: [],
    score: 0,
    elapsed: 0,
    spawn: 0,
    shake: 0,
    keys: {},
    colors: {},
    font: 'sans-serif',
  });
  const phaseRef = useRef<CatchPhase>('idle');

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    const w = world.current;
    if (!ctx || !w.width) return;
    const { width, height, rem, colors } = w;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = colors.grid;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    for (let x = 4 * rem; x < width; x += 8 * rem) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const items =
      phaseRef.current === 'idle'
        ? ([
            { kind: 'drink', x: width * 0.18, y: height * 0.2 },
            { kind: 'star', x: width * 0.62, y: height * 0.1 },
            { kind: 'dud', x: width * 0.86, y: height * 0.3 },
            { kind: 'burger', x: width * 0.14, y: height * 0.62 },
          ] as Pick<IItem, 'kind' | 'x' | 'y'>[])
        : w.items;
    items.forEach((item) => {
      const s = 5 * rem;
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.scale(s / 24, s / 24);
      ctx.translate(-12, -12);
      if (item.kind === 'dud') {
        ctx.strokeStyle = colors.dud;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.roundRect(4, 6, 16, 14, 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(9, 11);
        ctx.lineTo(15, 17);
        ctx.moveTo(15, 11);
        ctx.lineTo(9, 17);
        ctx.stroke();
      } else {
        ctx.fillStyle = colors[item.kind];
        ctx.fill(new Path2D(PATHS[item.kind]));
      }
      ctx.restore();
    });

    // Сумка курьера.
    const bagW = 10 * rem;
    const bagH = 6 * rem;
    const y = height - bagH - 2.4 * rem;
    const x = w.bag - bagW / 2 + (w.shake ? Math.sin(w.shake * 60) * rem * 0.6 : 0);
    ctx.fillStyle = colors.shadow;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(w.bag, height - 1.8 * rem, bagW * 0.45, rem * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    const gradient = ctx.createLinearGradient(x, y, x + bagW, y);
    gradient.addColorStop(0, colors.from);
    gradient.addColorStop(1, colors.to);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, bagW, bagH, 1.2 * rem);
    ctx.fill();
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 0.4 * rem;
    ctx.beginPath();
    ctx.moveTo(x + 2.6 * rem, y);
    ctx.bezierCurveTo(x + 2.6 * rem, y - 2.6 * rem, x + bagW - 2.6 * rem, y - 2.6 * rem, x + bagW - 2.6 * rem, y);
    ctx.stroke();
    ctx.fillStyle = colors.text;
    ctx.font = `700 ${1.6 * rem}px ${w.font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(w.score), w.bag, y + bagH / 2);

    w.pops.forEach((pop) => {
      ctx.globalAlpha = Math.max(0, 1 - pop.t);
      ctx.fillStyle = pop.value > 0 ? colors.plus : colors.minus;
      ctx.font = `700 ${2.4 * rem}px ${w.font}`;
      ctx.fillText(`${pop.value > 0 ? '+' : ''}${pop.value}`, pop.x, pop.y - pop.t * 4 * rem);
      ctx.globalAlpha = 1;
    });
  };

  const clampBag = (x: number) => {
    const { width, rem } = world.current;
    return Math.max(5 * rem, Math.min(width - 5 * rem, x));
  };

  // Размер canvas по devicePixelRatio (≤2) и токены цветов.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const style = getComputedStyle(canvas);
      const w = world.current;
      w.width = rect.width;
      w.height = rect.height;
      w.rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      w.font = style.fontFamily;
      w.colors = Object.fromEntries(
        Object.entries(COLOR_TOKENS).map(([key, token]) => [key, style.getPropertyValue(token).trim()]),
      );
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!w.bag) w.bag = w.target = rect.width / 2;
      w.bag = clampBag(w.bag);
      w.target = clampBag(w.target);
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.fonts?.ready.then(() => draw());
    return () => observer.disconnect();
  }, []);

  // Игровой цикл: идёт только в фазе игры и пока демо активно.
  useEffect(() => {
    if (phase !== 'playing' || !active) return;
    let frame = 0;
    let last = performance.now();
    let shownLeft = -1;

    const step = (time: number) => {
      const w = world.current;
      const dt = Math.min(0.04, (time - last) / 1000);
      last = time;
      w.elapsed += dt;
      const speedK = 1 + (w.elapsed / copy.duration) * 1.3;
      if (w.keys.ArrowLeft) w.target -= w.width * 1.1 * dt;
      if (w.keys.ArrowRight) w.target += w.width * 1.1 * dt;
      w.target = clampBag(w.target);
      w.bag += (w.target - w.bag) * Math.min(1, dt * 18);

      w.spawn -= dt;
      if (w.spawn <= 0) {
        const kind = pickKind();
        w.items.push({
          kind: kind.kind,
          points: kind.points,
          x: 3 * w.rem + Math.random() * (w.width - 6 * w.rem),
          y: -3 * w.rem,
          speed: (18 + Math.random() * 10) * w.rem * speedK,
        });
        w.spawn = Math.max(0.32, 0.8 - w.elapsed * 0.018);
      }

      const catchY = w.height - 8.4 * w.rem;
      let caught = false;
      w.items = w.items.filter((item) => {
        item.y += item.speed * dt;
        if (item.y > catchY && item.y < catchY + 3 * w.rem && Math.abs(item.x - w.bag) < 5.6 * w.rem) {
          w.score = Math.max(0, w.score + item.points);
          w.pops.push({ x: item.x, y: catchY, value: item.points, t: 0 });
          if (item.points < 0) w.shake = 0.3;
          caught = true;
          return false;
        }
        return item.y < w.height + 4 * w.rem;
      });
      if (caught) setScore(w.score);
      w.pops.forEach((pop) => {
        pop.t += dt * 1.6;
      });
      w.pops = w.pops.filter((pop) => pop.t < 1);
      if (w.shake) w.shake = Math.max(0, w.shake - dt);

      const remaining = Math.max(0, copy.duration - w.elapsed);
      const seconds = Math.ceil(remaining);
      if (seconds !== shownLeft) {
        shownLeft = seconds;
        setLeft(seconds);
      }
      draw();

      if (remaining <= 0) {
        const top = w.score >= copy.goal;
        const prize = top ? copy.prizeTop : copy.prizeBase;
        w.keys = {};
        phaseRef.current = 'done';
        setPhase('done');
        setResult({
          label: `${copy.winLabel} · ${w.score} ${GAME_PROMO.points}`,
          prize: prize.label,
          code: makePromoCode(prize.prefix, 3),
        });
        return;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    const state = world.current;
    return () => {
      cancelAnimationFrame(frame);
      state.keys = {};
    };
  }, [phase, active]);

  const start = () => {
    const w = world.current;
    w.items = [];
    w.pops = [];
    w.score = 0;
    w.elapsed = 0;
    w.spawn = 0;
    w.shake = 0;
    w.keys = {};
    phaseRef.current = 'playing';
    setScore(0);
    setLeft(copy.duration);
    setResult(null);
    setPhase('playing');
    canvasRef.current?.focus({ preventScroll: true });
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const w = world.current;
    const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
    w.target = clampBag(x);
    if (phaseRef.current !== 'playing') {
      w.bag = w.target;
      draw();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    world.current.keys[event.key] = true;
  };

  const onKeyUp = (event: KeyboardEvent<HTMLCanvasElement>) => {
    world.current.keys[event.key] = false;
  };

  const onBlur = () => {
    world.current.keys = {};
  };

  return {
    canvasRef,
    phase,
    score,
    left,
    result,
    start,
    onPointerMove,
    onPointerDown: onPointerMove,
    onKeyDown,
    onKeyUp,
    onBlur,
  };
};

export default useGameCatch;
