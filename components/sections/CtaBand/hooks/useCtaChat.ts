import { useRef } from 'react';
import type { RefObject } from 'react';
import { CTA_CHAT } from '@/data/site';
import { easeBack, easeOut, lerp, seg } from '../progress';
import useCtaScroll from './useCtaScroll';

export interface IUseCtaChat {
  sectionRef: RefObject<HTMLElement | null>;
  questionRef: RefObject<HTMLParagraphElement | null>;
  typingRef: RefObject<HTMLDivElement | null>;
  answerRef: RefObject<HTMLParagraphElement | null>;
  inputRef: RefObject<HTMLDivElement | null>;
  draftRef: RefObject<HTMLSpanElement | null>;
}

// Пузырь вырастает из нижнего левого угла, как сообщение в мессенджере.
const pop = (el: HTMLElement, t: number) => {
  el.style.opacity = String(seg(t, 0, 0.35));
  el.style.transform = `translateY(${(1 - easeOut(t)) * 3}rem) scale(${lerp(0.6, 1, easeBack(t))})`;
};

const useCtaChat = (): IUseCtaChat => {
  const questionRef = useRef<HTMLParagraphElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLParagraphElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLSpanElement>(null);

  const { sectionRef } = useCtaScroll(
    (progress) => {
      const question = questionRef.current;
      const typing = typingRef.current;
      const answer = answerRef.current;
      const input = inputRef.current;
      const draft = draftRef.current;
      if (!question || !typing || !answer || !input || !draft) return;

      pop(question, seg(progress, 0, 0.16));
      const typingIn = seg(progress, 0.2, 0.26);
      typing.style.opacity = String(typingIn * (1 - seg(progress, 0.36, 0.4)));
      typing.style.transform = `scale(${lerp(0.6, 1, easeOut(typingIn))})`;
      pop(answer, seg(progress, 0.38, 0.54));

      const inputIn = easeOut(seg(progress, 0.56, 0.64));
      input.style.opacity = String(inputIn);
      input.style.transform = `translateY(${(1 - inputIn) * 2}rem)`;

      // Черновик брифа набирается по буквам, полная фраза подсвечивает кнопку.
      const count = Math.round(seg(progress, 0.64, 0.92) * CTA_CHAT.draft.length);
      draft.textContent = CTA_CHAT.draft.slice(0, count);
      input.dataset.ready = String(count === CTA_CHAT.draft.length);
    },
    { length: 1 },
  );

  return { sectionRef, questionRef, typingRef, answerRef, inputRef, draftRef };
};

export default useCtaChat;
