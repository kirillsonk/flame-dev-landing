import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { IProcessStep } from '@/data/types';

// Сглаживание прокрутки для всех вариантов блока.
export const PROCESS_SCRUB = 0.6;

/** Номер шага для подписи: 0 → «01». */
export const stepNumber = (index: number) => String(index + 1).padStart(2, '0');

/** Элементы варианта по `data-part`: классы модулей хешируются, поэтому ищем по атрибуту. */
export const parts = <T extends Element = HTMLElement>(root: Element, name: string) =>
  Array.from(root.querySelectorAll<T>(`[data-part="${name}"]`));

export const part = <T extends Element = HTMLElement>(root: Element, name: string) =>
  root.querySelector<T>(`[data-part="${name}"]`);

/** Пин секции на `length` процентов высоты окна. */
export const pinTrigger = (root: HTMLElement, length: number): ScrollTrigger.Vars => ({
  trigger: root,
  start: 'top top',
  end: `+=${length}%`,
  pin: true,
  scrub: PROCESS_SCRUB,
  invalidateOnRefresh: true,
});

/** Включает `data-on` у элементов списка по условию от индекса. */
export const toggleOn = (items: Element[], isOn: (index: number) => boolean) => {
  items.forEach((item, index) => item.toggleAttribute('data-on', isOn(index)));
};

/** Полное описание шага со сроком впереди, если он есть. */
export const stepText = ({ duration, description }: IProcessStep) =>
  duration ? `${duration}. ${description}` : description;

/** Координата SVG с двумя знаками: одинаковая строка на сервере и в браузере. */
export const round = (value: number) => Math.round(value * 100) / 100;
