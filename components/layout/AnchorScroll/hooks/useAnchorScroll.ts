import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANCHORS } from '@/data/site';
import jump from '../jump';
import type { AnchorStop } from '@/data/types';

gsap.registerPlugin(ScrollTrigger);

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Ссылка на текущую страницу без якоря (логотип): то же, что `#top`.
const TOP = 'top';

/** Секция, которую держит пин: у неё есть свой ScrollTrigger с pin на этом же элементе. */
const pinOf = (el: Element) => ScrollTrigger.getAll().find((trigger) => trigger.pin === el);

/** Доля пина для точки остановки. */
const fraction = (stop: AnchorStop | undefined) => (stop === 'end' ? 1 : typeof stop === 'number' ? stop : 0);

/**
 * Откуда и куда ведёт якорь. Запиненная секция: открывается в точке `open` (по умолчанию старт
 * пина), анимация идёт до точки `stop` — обе доли пина (data/site.ts, ANCHORS). Остальное:
 * верх элемента минус scroll-padding-top, как у обычного якоря браузера, без анимации.
 */
const anchorRange = (el: Element, id: string) => {
  const pin = pinOf(el);
  if (pin) {
    const at = (stop: AnchorStop | undefined) => pin.start + (pin.end - pin.start) * fraction(stop);
    return { from: at(ANCHORS[id]?.open), to: at(ANCHORS[id]?.stop) };
  }
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - padding);
  return { from: top, to: top };
};


/**
 * Переход к якорю: без прокрутки через страницу. Блок сразу открывается в точке `open`,
 * и анимация плавно проигрывается до точки `stop` — вперёд или назад. Без анимации совсем — если так
 * задано в ANCHORS, при reduced motion или когда точка совпадает со стартом.
 */
const scrollToAnchor = (id: string, animated: boolean) => {
  const el = document.getElementById(id);
  if (!el) return false;
  const { from, to } = anchorRange(el, id);
  const motion = animated && !ANCHORS[id]?.instant && window.matchMedia(MOTION_QUERY).matches;
  jump(motion ? from : to);
  if (motion && to !== from) window.scrollTo({ top: to, behavior: 'smooth' });
  return true;
};

/**
 * Якоря по странице ведут в осмысленные точки запиненных секций, а не к их положению
 * в документе: у пина оно совпадает с началом секции, а браузер ещё и смещает на
 * scroll-padding-top, останавливаясь перед стартом анимации. Ссылки остаются обычными
 * `<a href="#…">`: клик перехватывается на документе в фазе захвата — раньше Next Link,
 * который не переходит по отменённому событию, — адрес обновляется без прыжка.
 */
const useAnchorScroll = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search) return;
      const id = url.hash ? decodeURIComponent(url.hash.slice(1)) : TOP;
      if (!scrollToAnchor(id, true)) return;
      event.preventDefault();
      window.history.pushState(null, '', url.hash || url.pathname + url.search);
    };
    document.addEventListener('click', onClick, true);

    // Адрес с якорем при загрузке: браузер прыгает к элементу до того, как появились пины.
    // После первого пересчёта ScrollTrigger встаём в нужную точку без анимации.
    const id = decodeURIComponent(window.location.hash.slice(1));
    const onRefresh = () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      scrollToAnchor(id, false);
    };
    if (id) ScrollTrigger.addEventListener('refresh', onRefresh);

    return () => {
      document.removeEventListener('click', onClick, true);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
    };
  }, []);
};

export default useAnchorScroll;
