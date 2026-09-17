import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { GAME_SCRATCH as copy } from '@/data/demosGame';
import { makePromoCode } from '@/components/sections/Services/visuals/game/promo';

interface IPoint {
  x: number;
  y: number;
}

const pickPrize = () => Math.floor(Math.random() * copy.prizes.length);

/**
 * Скретч-карта: защитный слой рисуется в canvas и стирается `destination-out`.
 * После `copy.threshold` % стёртой площади слой гаснет и открывается приз с промокодом.
 * Монтируется только на клиенте (см. GameScratch): приз и код случайные.
 */
const useGameScratch = (reduced: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const autoRef = useRef<HTMLButtonElement>(null);
  const [prizeIndex, setPrizeIndex] = useState(pickPrize);
  const [code, setCode] = useState(() => makePromoCode(copy.prizes[prizeIndex].prefix, 3));
  const [percent, setPercent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState(copy.idle);
  const [copied, setCopied] = useState(false);

  const size = useRef({ width: 0, height: 0, dpr: 1, rem: 10 });
  const down = useRef(false);
  const last = useRef<IPoint | null>(null);
  const moves = useRef(0);
  const revealedRef = useRef(false);
  const autoFrame = useRef(0);

  const context = () => canvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;

  const cover = () => {
    const canvas = canvasRef.current;
    const ctx = context();
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const style = getComputedStyle(canvas);
    const token = (name: string) => style.getPropertyValue(name).trim();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
    const { width, height } = rect;
    size.current = { width, height, dpr, rem };
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, token('--color-elevated'));
    gradient.addColorStop(0.5, token('--color-border-strong'));
    gradient.addColorStop(1, token('--color-elevated'));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = token('--color-text');
    ctx.globalAlpha = 0.07;
    ctx.lineWidth = 1;
    for (let x = -height; x < width; x += rem) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = token('--color-bg');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${token('--type-title')} ${style.fontFamily}`;
    ctx.fillText(copy.coverTitle, width / 2, height / 2 - 1.4 * rem);
    ctx.font = `500 ${token('--type-body')} ${style.fontFamily}`;
    ctx.fillText(copy.coverSubtitle, width / 2, height / 2 + 1.6 * rem);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4.4 * rem;
  };

  const reveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    cancelAnimationFrame(autoFrame.current);
    setRevealed(true);
    setPercent(100);
    setMessage(copy.won);
    // Кнопка копирования становится фокусируемой после перерисовки.
    requestAnimationFrame(() => copyRef.current?.focus({ preventScroll: true }));
  };

  const measure = () => {
    const canvas = canvasRef.current;
    const ctx = context();
    if (!canvas || !ctx || !canvas.width || !canvas.height) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const step = Math.max(1, Math.floor(12 * size.current.dpr));
    let clear = 0;
    let total = 0;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        total += 1;
        if (data[(y * canvas.width + x) * 4 + 3] < 40) clear += 1;
      }
    }
    const value = Math.round((clear / total) * 100);
    if (value >= copy.threshold) {
      reveal();
      return;
    }
    setPercent(value);
    if (value > 15) setMessage(copy.almost);
  };

  const line = (a: IPoint, b: IPoint) => {
    const ctx = context();
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x + 0.01, b.y);
    ctx.stroke();
  };

  const point = (event: PointerEvent<HTMLCanvasElement>): IPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    down.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    last.current = point(event);
    line(last.current, last.current);
    moves.current += 1;
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!down.current || !last.current) return;
    const next = point(event);
    line(last.current, next);
    last.current = next;
    moves.current += 1;
    if (moves.current % 6 === 0) measure();
  };

  const onPointerUp = () => {
    if (!down.current) return;
    down.current = false;
    measure();
  };

  const autoErase = () => {
    if (revealedRef.current) return;
    if (reduced) {
      reveal();
      return;
    }
    const { width, height, rem } = size.current;
    const rows = 5;
    let t = 0;
    let prev: IPoint | null = null;
    moves.current += 1;
    const step = () => {
      t += 0.022;
      const row = Math.floor(t);
      const f = t - row;
      if (row >= rows) {
        reveal();
        return;
      }
      const y = ((row + 0.5) / rows) * height;
      const x = (row % 2 ? 1 - f : f) * (width + 2 * rem) - rem;
      const p = { x, y: y + Math.sin(f * Math.PI * 6) * rem };
      line(prev && Math.abs(prev.y - y) < 2 * rem ? prev : p, p);
      prev = p;
      if (Math.random() < 0.2) measure();
      if (!revealedRef.current) autoFrame.current = requestAnimationFrame(step);
    };
    autoFrame.current = requestAnimationFrame(step);
  };

  const next = () => {
    cancelAnimationFrame(autoFrame.current);
    const index = pickPrize();
    revealedRef.current = false;
    moves.current = 0;
    setPrizeIndex(index);
    setCode(makePromoCode(copy.prizes[index].prefix, 3));
    setRevealed(false);
    setPercent(0);
    setMessage(copy.idle);
    setCopied(false);
    cover();
    requestAnimationFrame(() => autoRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let width = 0;
    let cancelled = false;
    const observer = new ResizeObserver(() => {
      const current = canvas.getBoundingClientRect().width;
      // Перерисовываем слой, только пока его не начали стирать.
      if (Math.abs(current - width) > 2 && !revealedRef.current && moves.current === 0) {
        width = current;
        cover();
      }
    });
    observer.observe(canvas);
    document.fonts?.ready.then(() => {
      if (!cancelled && moves.current === 0 && !revealedRef.current) cover();
    });
    const frame = autoFrame;
    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
    // cover читает только refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    canvasRef,
    copyRef,
    autoRef,
    prize: copy.prizes[prizeIndex],
    code,
    percent,
    progress: Math.min(100, (percent / copy.threshold) * 100),
    revealed,
    message,
    copied,
    setCopied,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    autoErase,
    next,
  };
};

export default useGameScratch;
