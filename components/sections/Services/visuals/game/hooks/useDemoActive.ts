import { useEffect, useRef, useState } from 'react';

/**
 * Демо активно, когда оно на экране, его сцена в плеере не `inert`
 * (событие `demo-visibility-change` на `[data-part="visual"]`) и вкладка видима.
 * Игровые таймеры и циклы идут только пока `active`.
 */
const useDemoActive = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const visual = node.closest<HTMLElement>('[data-part="visual"]');
    let visible = false;
    const sync = () => setActive(visible && !visual?.inert && !node.closest('[inert]') && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
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
  }, []);

  return { ref, active };
};

export default useDemoActive;
