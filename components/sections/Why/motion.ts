import { gsap } from 'gsap';

// Complement of the `mobile` mixin in styles/_mixins.scss
export const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
export const SCRUB = 0.6;

/** Все элементы `[data-part="name"]` внутри секции, в порядке DOM. */
export const parts = <T extends Element = HTMLElement>(root: Element, name: string) =>
  gsap.utils.toArray<T>(root.querySelectorAll(`[data-part="${name}"]`));

/** Первый элемент `[data-part="name"]`; отсутствие — ошибка вёрстки варианта. */
export const part = <T extends Element = HTMLElement>(root: Element, name: string) =>
  root.querySelector(`[data-part="${name}"]`) as T;

export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
