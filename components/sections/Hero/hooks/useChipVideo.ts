import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

// Ролик в чипе «видео»: грузится и играет только пока чип в наведении или фокусе.
const useChipVideo = (active: boolean): RefObject<HTMLVideoElement | null> => {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active]);

  return ref;
};

export default useChipVideo;
