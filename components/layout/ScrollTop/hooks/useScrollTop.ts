import { useEffect, useState } from 'react';
import jump from '@/components/layout/AnchorScroll/jump';

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
// Кнопка появляется, когда прокрутили больше стольких высот окна: на первом экране она не нужна.
const SHOW_AFTER = 1.5;
// Возврат наверх, как в ленте: прыжок почти к началу, последнюю высоту окна страница доезжает плавно —
// первый экран успевает собраться обратно. Ехать плавно через все пины было бы долго.
const GLIDE = 1;

export interface IUseScrollTop {
  visible: boolean;
  scrollTop: () => void;
}

const useScrollTop = (): IUseScrollTop => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * SHOW_AFTER);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
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

  return { visible, scrollTop };
};

export default useScrollTop;
