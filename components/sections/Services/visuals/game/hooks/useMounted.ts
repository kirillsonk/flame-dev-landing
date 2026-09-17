import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

// true только после гидрации: случайные поля и промокоды не попадают в серверный HTML.
const useMounted = () => {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return { mounted };
};

export default useMounted;
