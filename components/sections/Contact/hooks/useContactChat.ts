import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = '(min-width: 769px), (orientation: landscape)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

export interface IUseContactChat {
  sectionRef: RefObject<HTMLElement | null>;
  typingRef: RefObject<HTMLDivElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  textRef: RefObject<HTMLParagraphElement | null>;
  linksRef: RefObject<HTMLUListElement | null>;
  formRef: RefObject<HTMLDivElement | null>;
}

// Пузырь вырастает из нижнего левого угла, как сообщение в мессенджере.
const BUBBLE_FROM = { autoAlpha: 0, scale: 0.4, y: 30, transformOrigin: '0% 100%' };

/**
 * Секция пинится на 100% экрана: «печатает…» → пузырь заголовка → снова «печатает…» →
 * пузырь со сроками → иконки быстрыми ответами → форма выезжает снизу, поля по очереди.
 * На мобильном без пина: переписка один раз проигрывается по времени, когда блок входит в экран.
 * Скраб по высоте секции проявлял поля формы, только когда она уже уезжала вверх.
 * При reduced motion — статичный блок.
 */
const useContactChat = (): IUseContactChat => {
  const sectionRef = useRef<HTMLElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const typing = typingRef.current;
    const title = titleRef.current;
    const text = textRef.current;
    const links = linksRef.current;
    const form = formRef.current;
    if (!section || !typing || !title || !text || !links || !form) return;

    const mm = gsap.matchMedia();
    mm.add({ desktop: DESKTOP_QUERY, motion: MOTION_QUERY }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;

      // Поля формы берутся из разметки LeadForm снаружи: логика формы не затрагивается.
      const fields = Array.from(form.querySelector('form')?.children ?? []);

      const tl = gsap.timeline({
        defaults: { ease: 'back.out(1.6)' },
        scrollTrigger: desktop
          ? { trigger: section, start: 'top top', end: '+=100%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true }
          : { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
      });
      // Без скраба длительности таймлайна — секунды: на телефоне вся переписка укладывается примерно в 1,5 с.
      if (!desktop) tl.timeScale(2.2);

      tl.fromTo(typing, { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 0)
        .to(typing, { autoAlpha: 0, scale: 0.6, duration: 0.2, ease: 'power2.in' }, 0.6)
        .fromTo(title, BUBBLE_FROM, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, 0.75)
        .fromTo(typing, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.2, immediateRender: false }, 1.3)
        .to(typing, { autoAlpha: 0, duration: 0.15 }, 1.6)
        .fromTo(text, BUBBLE_FROM, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, 1.7);
      Array.from(links.children).forEach((item, index) =>
        tl.fromTo(item, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35 }, 2.2 + index * 0.1),
      );
      tl.fromTo(form, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.8 }, 2.4);
      fields.forEach((field, index) =>
        tl.fromTo(field, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 2.8 + index * 0.06),
      );
    });

    return () => mm.revert();
  }, []);

  return { sectionRef, typingRef, titleRef, textRef, linksRef, formRef };
};

export default useContactChat;
