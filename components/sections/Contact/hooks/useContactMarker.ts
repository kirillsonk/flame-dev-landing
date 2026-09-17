import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

export interface IUseContactMarker {
  sectionRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  textRef: RefObject<HTMLParagraphElement | null>;
  linksRef: RefObject<HTMLUListElement | null>;
  formRef: RefObject<HTMLDivElement | null>;
}

/**
 * Секция пинится на ~два экрана: слова заголовка по очереди прописываются, под последним
 * рисуется росчерк, фразы со сроками закрашиваются маркером, затем проявляются ссылки и форма.
 * На мобильном та же последовательность без пина, при reduced motion — статичный блок.
 */
const useContactMarker = (): IUseContactMarker => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const text = textRef.current;
    const links = linksRef.current;
    const form = formRef.current;
    if (!section || !title || !text || !links || !form) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;

      const words = Array.from(title.querySelectorAll<HTMLElement>('[data-word]'));
      const swash = title.querySelector('path');
      const marks = Array.from(text.querySelectorAll<HTMLElement>('[data-mark]'));
      const tail = [...Array.from(links.children), form];

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: desktop ? 'top top' : 'top 80%',
          end: desktop ? '+=180%' : 'bottom 75%',
          pin: desktop,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Стаггер разложен на отдельные твины: начальные состояния рисуются, даже если триггер стартует с середины.
      words.forEach((word, index) => tl.fromTo(word, { '--ink': '0%' }, { '--ink': '100%', duration: 0.16 }, index * 0.14));
      // Росчерк тянется заметно дольше слова. Твин через `--draw`: strokeDashoffset GSAP округляет до целых px,
      // а при pathLength=1 это прыжок 1 → 0 без промежуточных кадров.
      if (swash) tl.fromTo(swash, { '--draw': 1.05 }, { '--draw': 0, duration: 0.36, ease: 'power1.inOut' }, 0.4);
      tl.fromTo(text, { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.08 }, 0.68);
      marks.forEach((mark, index) =>
        tl.fromTo(mark, { '--hl': '0%' }, { '--hl': '100%', duration: 0.14, ease: 'power1.inOut' }, 0.76 + index * 0.16),
      );
      tail.forEach((el, index) => tl.fromTo(el, { autoAlpha: 0.15 }, { autoAlpha: 1, duration: 0.12 }, 1.04 + index * 0.03));
      tl.to({}, { duration: 0.08 });
    });

    return () => mm.revert();
  }, []);

  return { sectionRef, titleRef, textRef, linksRef, formRef };
};

export default useContactMarker;
