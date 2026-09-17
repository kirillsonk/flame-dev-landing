import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { Web3dScene } from '../Web3dScene';

export interface IUseWeb3dScene<T extends Web3dScene> {
  viewRef: RefObject<HTMLDivElement | null>;
  sceneRef: RefObject<T | null>;
  failed: boolean;
}

// Монтирует класс сцены в рамку и освобождает GPU при размонтировании; без WebGL отдаёт failed для фолбэка.
const useWeb3dScene = <T extends Web3dScene>(create: (node: HTMLDivElement) => T): IUseWeb3dScene<T> => {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<T | null>(null);
  const createRef = useRef(create);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = viewRef.current;
    if (!node) return;
    try {
      sceneRef.current = createRef.current(node);
    } catch {
      node.querySelector('canvas')?.remove();
      queueMicrotask(() => setFailed(true));
    }
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  return { viewRef, sceneRef, failed };
};

export default useWeb3dScene;
