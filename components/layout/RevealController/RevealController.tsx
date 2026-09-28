'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Сколько ждать первого ответа наблюдателя. Он приходит сразу после observe(), тишина значит,
// что наблюдатель не работает (фрейм без отрисовки, песочница), и блоки нельзя оставлять скрытыми
const OBSERVER_TIMEOUT = 1200;

const RevealController = () => {
  const pathname = usePathname();
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)'));
    if (nodes.length === 0) return;
    const reveal = (node: Element) => node.classList.add('is-revealed');

    let answered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        answered = true;
        entries.forEach((entry) => {
          // Блок выше окна тоже показываем, иначе после якорного перехода над ним остается пустота
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      // Порог 0: высокий блок не должен ждать, пока в окно войдет заметная доля его высоты
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    const fallback = window.setTimeout(() => {
      if (answered) return;
      nodes.forEach(reveal);
      observer.disconnect();
    }, OBSERVER_TIMEOUT);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
};

export default RevealController;
