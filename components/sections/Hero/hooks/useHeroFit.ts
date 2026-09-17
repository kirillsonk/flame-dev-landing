import { useEffect } from 'react';
import type { RefObject } from 'react';

// Hero ограничен высотой окна, но лента не сжимается ниже --size-reel-min. Если минимум
// не влезает, CSS сам это не разрулит (max-height просто обрежет), поэтому снимаем лимит
// атрибутом data-free и секция уходит под скролл. Пересчёт на ресайзе и после загрузки шрифта.
const useHeroFit = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      node.removeAttribute('data-free');
      if (node.scrollHeight > node.clientHeight) node.setAttribute('data-free', '');
    };
    update();
    document.fonts?.ready.then(update);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [ref]);
};

export default useHeroFit;
