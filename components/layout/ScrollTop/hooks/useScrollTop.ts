import { useEffect, useState } from 'react';
import jump from '@/components/layout/AnchorScroll/jump';

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Кнопка появляется, когда прокрутили больше стольких высот окна: на первом экране она не нужна.
const SHOW_AFTER = .8;
// Возврат наверх, как в ленте: прыжок почти к началу, последнюю высоту окна страница доезжает плавно —
// первый экран успевает собраться обратно. Ехать плавно через все пины было бы долго.
const GLIDE = 1;

export interface IUseScrollTop {
  visible: boolean;
  scrollTop: () => void;
}

const useScrollTop = (): IUseScrollTop => {
  const [past, setPast] = useState(false);
  // У подвала кнопка прячется: иначе она закрывает ссылки на документы у правого края
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      setPast(window.scrollY > window.innerHeight * SHOW_AFTER);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Наблюдатель срабатывает и без прокрутки, когда блоки выше подвала меняют высоту
    const footer = document.querySelector('[data-site-footer]');
    const observer = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting));
    if (footer) observer.observe(footer);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollTop = () => {
    if (!window.matchMedia(MOTION_QUERY).matches) {
      jump(0);
      return;
    }
    const glide = window.innerHeight * GLIDE;
    if (window.scrollY > glide) jump(glide);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  return { visible: past && !atFooter, scrollTop };
};

export default useScrollTop;
