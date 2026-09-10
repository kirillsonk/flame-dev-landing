import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Complement of the `mobile` mixin in styles/_mixins.scss
const PINNED_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

export interface IUseProcessScroll {
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  progress: number;
  onMobileScroll: () => void;
}

const useProcessScroll = (): IUseProcessScroll => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add({ pinned: PINNED_QUERY, motion: MOTION_QUERY }, (context) => {
      const { pinned, motion } = context.conditions as { pinned: boolean; motion: boolean };
      if (!pinned || !motion) return;

      const distance = () => track.scrollWidth - track.clientWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.revert().kill();
      };
    });

    return () => mm.revert();
  }, []);

  const onMobileScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 0);
  };

  return { sectionRef, trackRef, progress, onMobileScroll };
};

export default useProcessScroll;
