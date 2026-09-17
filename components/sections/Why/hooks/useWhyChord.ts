import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_QUERY, MOTION_QUERY, SCRUB, cssVar, part } from '../motion';

gsap.registerPlugin(ScrollTrigger);

export interface IUseWhyChord {
  rootRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

interface IWave {
  /** Периодов на ширину холста. */
  cycles: number;
  /** Амплитуда в долях половины высоты. */
  amplitude: number;
  phase: number;
  speed: number;
}

const WAVES: IWave[] = [
  { cycles: 1.2, amplitude: 0.42, phase: 0, speed: 0.5 },
  { cycles: 2.6, amplitude: 0.26, phase: 2.1, speed: -0.8 },
  { cycles: 4.1, amplitude: 0.34, phase: 4.2, speed: 1.1 },
];
const FINAL: IWave = { cycles: 2, amplitude: 0.38, phase: 1, speed: 0.35 };
const STEP = 4;
const TIME_STEP = 0.012;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/**
 * Три волны на canvas: `progress` 0 — каждая в своём ритме, 1 — совпали в одну градиентную волну.
 * Прогресс ведёт скролл (пин на десктопе, проход холста на мобильном); волны «дышат» в rAF, пока
 * холст на экране. При reduced motion — статичный кадр сведённой волны.
 */
const useWhyChord = (): IUseWhyChord => {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !canvas || !ctx) return;

    const colors = [cssVar('--color-fire-light'), cssVar('--color-action-primary-hover'), cssVar('--color-action-accent')];
    const primary = cssVar('--color-action-primary');
    const accent = cssVar('--color-action-accent');
    const state = { progress: 1 };
    let width = 0;
    let height = 0;
    let time = 0;
    let frame = 0;
    let visible = false;
    let motion = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const trace = (wave: IWave) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += STEP) {
        const envelope = Math.sin((Math.PI * x) / width);
        const y =
          height / 2 +
          Math.sin((x / width) * wave.cycles * Math.PI * 2 + wave.phase + time * wave.speed) * wave.amplitude * (height / 2) * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const p = state.progress;
      const e = p * p * (3 - 2 * p);
      WAVES.forEach((wave, i) => {
        trace({
          cycles: lerp(wave.cycles, FINAL.cycles, e),
          amplitude: lerp(wave.amplitude, FINAL.amplitude, e),
          phase: lerp(wave.phase, FINAL.phase, e),
          speed: lerp(wave.speed, FINAL.speed, e),
        });
        ctx.lineWidth = lerp(1.5, 3, e);
        ctx.globalAlpha = lerp(0.9, 0.55, e);
        ctx.strokeStyle = colors[i];
        ctx.stroke();
      });
      if (e > 0.6) {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0.2, primary);
        gradient.addColorStop(1, accent);
        ctx.globalAlpha = (e - 0.6) / 0.4;
        ctx.lineWidth = 5;
        ctx.strokeStyle = gradient;
        ctx.shadowColor = primary;
        ctx.shadowBlur = 24;
        trace(FINAL);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      time += TIME_STEP;
      draw();
      frame = requestAnimationFrame(loop);
    };
    const syncLoop = () => {
      cancelAnimationFrame(frame);
      if (visible && motion) frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncLoop();
    });
    observer.observe(canvas);

    const onResize = () => {
      size();
      draw();
    };
    window.addEventListener('resize', onResize);
    size();
    draw();

    const many = part(root, 'many');
    const one = part(root, 'one');
    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const conditions = context.conditions as { desktop: boolean; motion: boolean };
      motion = conditions.motion;
      syncLoop();
      if (!conditions.motion) {
        state.progress = 1;
        draw();
        return;
      }

      state.progress = 0;
      draw();
      const tl = gsap.timeline({
        scrollTrigger: conditions.desktop
          ? { trigger: root, start: 'top top', end: '+=150%', scrub: SCRUB, pin: true }
          : { trigger: canvas, start: 'top 85%', end: 'bottom 30%', scrub: SCRUB },
      });
      tl.to(state, { progress: 1, duration: 1, ease: 'none', onUpdate: draw })
        .fromTo(many, { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.7)
        .fromTo(one, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.85);
      if (conditions.desktop) tl.to({}, { duration: 0.2 });

      return () => {
        state.progress = 1;
        draw();
      };
    });

    return () => {
      mm.revert();
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { rootRef, canvasRef };
};

export default useWhyChord;
