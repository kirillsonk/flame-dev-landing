import { useSyncExternalStore } from 'react';

export interface IUseFinePointer {
  fine: boolean;
}

const QUERY = '(hover: hover) and (pointer: fine)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

// Есть ли мышь с наведением. На сервере и до гидрации считаем, что нет: подсказка для тача безопаснее.
const useFinePointer = (): IUseFinePointer => {
  const fine = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  return { fine };
};

export default useFinePointer;
