import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export interface IUseDemoActive {
  active: boolean;
}

// Демо «живое», когда оно на экране, его сцена в плеере не `inert` и вкладка видна.
// Бесконечные циклы (rAF, таймеры) по этому флагу ставятся на паузу.
const useDemoActive = (ref: RefObject<HTMLElement | null>): IUseDemoActive => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const visual = node.closest<HTMLElement>('[data-part="visual"]');
    let inView = false;
    const sync = () => setActive(inView && !visual?.inert && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    visual?.addEventListener('demo-visibility-change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      visual?.removeEventListener('demo-visibility-change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref]);

  return { active };
};

export default useDemoActive;
