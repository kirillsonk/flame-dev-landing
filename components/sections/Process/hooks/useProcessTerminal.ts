import { gsap } from 'gsap';
import { part, parts, pinTrigger, toggleOn } from '../helpers';
import useProcessScene from './useProcessScene';

// Пауза между строками в символах печати.
const PAUSE = 8;
// Статус проявляется через столько символов после конца строки.
const STATUS_DELAY = 3;

interface ILogLine {
  el: HTMLElement;
  text: HTMLElement;
  lead: HTMLElement | null;
  status: HTMLElement | null;
  full: string;
  start: number;
  end: number;
  done?: number;
}

const useProcessTerminal = (caretClass: string) =>
  useProcessScene(({ root }) => {
    const body = part(root, 'body');
    const wrap = part(root, 'lines');
    if (!body || !wrap) return;
    const checks = parts(root, 'check');

    let total = 0;
    const lines: ILogLine[] = parts(wrap, 'line').map((el) => {
      const text = part(el, 'text') as HTMLElement;
      const status = part(el, 'status');
      const full = text.textContent ?? '';
      const start = total;
      const end = start + full.length + (status ? STATUS_DELAY : 0);
      total = end + PAUSE;
      return {
        el,
        text,
        status,
        lead: part(el, 'lead'),
        full,
        start,
        end,
        done: el.dataset.done === undefined ? undefined : Number(el.dataset.done),
      };
    });

    const caret = document.createElement('i');
    caret.className = caretClass;
    const state = { n: 0 };
    let last = -1;

    const render = () => {
      const n = Math.floor(state.n);
      if (n === last) return;
      last = n;
      let active: ILogLine | null = null;
      const done = new Set<number>();
      lines.forEach((line) => {
        const typed = n - line.start;
        line.el.style.display = typed > 0 || line.start === 0 ? '' : 'none';
        line.text.textContent = line.full.slice(0, Math.max(0, Math.min(line.full.length, typed)));
        if (line.status) line.status.style.visibility = n >= line.end ? 'visible' : 'hidden';
        if (line.lead) line.lead.style.visibility = typed >= line.full.length ? 'visible' : 'hidden';
        if (typed >= 0) active = line;
        if (line.done !== undefined && n >= line.end) done.add(line.done);
      });
      toggleOn(checks, (index) => done.has(index));

      const current = active as ILogLine | null;
      if (!current) return;
      (current.status && n >= current.end ? current.status : current.text).after(caret);
      // Лог уезжает вверх, когда печать доходит до нижнего края окна.
      const padding = parseFloat(getComputedStyle(body).paddingTop) * 2;
      const overflow = current.el.offsetTop + current.el.offsetHeight - (body.clientHeight - padding);
      gsap.to(wrap, { y: -Math.max(0, overflow), duration: 0.35, ease: 'power2.out', overwrite: true });
    };
    render();

    gsap.to(state, { n: total, ease: 'none', onUpdate: render, scrollTrigger: pinTrigger(root, 220) });

    return () => {
      caret.remove();
      gsap.killTweensOf(wrap);
      gsap.set(wrap, { clearProps: 'transform' });
      lines.forEach((line) => {
        line.el.style.removeProperty('display');
        line.text.textContent = line.full;
        line.status?.style.removeProperty('visibility');
        line.lead?.style.removeProperty('visibility');
      });
      toggleOn(checks, () => false);
    };
  });

export default useProcessTerminal;
