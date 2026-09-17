import { gsap } from 'gsap';
import useEcosystemScene, { part, parts, pinTrigger } from './useEcosystemScene';

// Длина пина в процентах высоты окна.
const PIN = 300;
// Один токен заголовка «стоит» столько символов печати.
const TOKEN_STEP = 6;
// Пауза между заголовком и строками и между строками, в символах.
const PAUSE = 8;
// Адрес показывается через столько символов после конца описания.
const URL_DELAY = 3;
// Примерно столько символов в одном токене для счётчика.
const CHARS_PER_TOKEN = 4;

interface ITypedLine {
  el: HTMLElement;
  name: HTMLElement;
  text: HTMLElement;
  fullName: string;
  fullText: string;
  start: number;
  end: number;
}

/**
 * Заголовок выдаётся токенами, затем печатаются две строки продуктов; курсор стоит
 * у последнего напечатанного символа, счётчик считает выданные токены.
 */
const useEcosystemTokens = (caretClass: string) =>
  useEcosystemScene((root) => {
    const tokens = parts(root, 'token');
    const count = part(root, 'count');
    if (!count) return;

    let total = tokens.length * TOKEN_STEP + PAUSE;
    const lines: ITypedLine[] = parts(root, 'line').map((el) => {
      const name = part(el, 'name') as HTMLElement;
      const text = part(el, 'text') as HTMLElement;
      const fullName = name.textContent ?? '';
      const fullText = text.textContent ?? '';
      const start = total;
      const end = start + fullName.length + fullText.length + URL_DELAY;
      total = end + PAUSE;
      return { el, name, text, fullName, fullText, start, end };
    });

    const caret = document.createElement('i');
    caret.className = caretClass;
    const state = { n: 0 };
    let last = -1;

    const render = () => {
      const n = Math.floor(state.n);
      if (n === last) return;
      last = n;

      let shown = 0;
      tokens.forEach((token, index) => {
        const on = n >= index * TOKEN_STEP;
        token.toggleAttribute('data-on', on);
        if (on) shown += 1;
      });

      let chars = 0;
      let active: HTMLElement | null = null;
      lines.forEach((line) => {
        const typed = n - line.start;
        const typedName = Math.max(0, Math.min(line.fullName.length, typed));
        const typedText = Math.max(0, Math.min(line.fullText.length, typed - line.fullName.length));
        line.name.textContent = line.fullName.slice(0, typedName);
        line.text.textContent = line.fullText.slice(0, typedText);
        line.el.toggleAttribute('data-on', n >= line.end);
        chars += typedName + typedText;
        if (typed >= 0 && n < line.end) active = typedName < line.fullName.length ? line.name : line.text;
      });
      count.textContent = String(shown + Math.floor(chars / CHARS_PER_TOKEN));

      if (active) (active as HTMLElement).append(caret);
      else caret.remove();
    };
    render();

    const tween = gsap.to(state, {
      n: total,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: pinTrigger(root, PIN),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      caret.remove();
      tokens.forEach((token) => token.removeAttribute('data-on'));
      lines.forEach((line) => {
        line.name.textContent = line.fullName;
        line.text.textContent = line.fullText;
        line.el.removeAttribute('data-on');
      });
      count.textContent = '0';
    };
  });

export default useEcosystemTokens;
