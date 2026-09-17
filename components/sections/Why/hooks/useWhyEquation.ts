import { gsap } from 'gsap';
import { SCRUB, cssVar, part, parts } from '../motion';
import useWhyMotion from './useWhyMotion';
import type { IUseWhyMotion, WhyMotionSetup } from './useWhyMotion';

// Плюсы гаснут, слагаемые съезжаются в одно и сжимаются, на их месте вспыхивает «Flame Dev»;
// «=» и итог подъезжают к нему, «3 договора» сменяются на «1 договор». Только десктоп с пином.
const setup: WhyMotionSetup = (root, desktop) => {
  if (!desktop) return;

  const row = part(root, 'row');
  const terms = parts(root, 'term');
  const plus = parts(root, 'plus');
  const equal = part(root, 'equal');
  const result = part(root, 'result');
  const before = part(root, 'before');
  const after = part(root, 'after');
  const one = part(root, 'one');

  gsap.set(one, { opacity: 0, xPercent: -50, yPercent: -50 });
  gsap.set(before, { opacity: 1 });
  gsap.set(after, { opacity: 0 });

  // Итоговая группа «Flame Dev = 1 договор» центрируется в строке.
  const gap = () => parseFloat(getComputedStyle(row).columnGap) || 16;
  const groupLeft = () => row.clientWidth / 2 - (one.offsetWidth + equal.offsetWidth + result.offsetWidth + gap() * 2) / 2;
  const middle = () => groupLeft() + one.offsetWidth / 2;
  const shiftTo = (el: HTMLElement) => middle() - (el.offsetLeft + el.offsetWidth / 2);
  const equalX = () => groupLeft() + one.offsetWidth + gap() - equal.offsetLeft;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: 'top top', end: '+=160%', scrub: SCRUB, pin: true, invalidateOnRefresh: true },
  });
  tl.to(plus, { rotation: 90, scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
    .to(terms, { x: (_i: number, el: HTMLElement) => shiftTo(el), duration: 1, ease: 'power3.inOut' }, 0.25)
    .to(terms, { scaleX: 0.5, opacity: 0, duration: 0.35, ease: 'power2.in' }, 1)
    .set(one, { left: () => `${middle()}px` }, 0)
    .fromTo(one, { opacity: 0, scaleX: 1.6, scaleY: 0.8 }, { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.45, ease: 'back.out(1.6)' }, 1.2)
    .to(equal, { x: () => equalX(), duration: 0.6, ease: 'power3.inOut' }, 0.9)
    .to(
      result,
      { x: () => equalX() + equal.offsetLeft + equal.offsetWidth + gap() - result.offsetLeft, duration: 0.6, ease: 'power3.inOut' },
      0.9,
    )
    .to(before, { opacity: 0, y: -16, duration: 0.3 }, 1.1)
    .fromTo(after, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, 1.3)
    .to(equal, { color: cssVar('--color-text'), duration: 0.2 }, 1.3)
    .to({}, { duration: 0.3 });
};

const useWhyEquation = (): IUseWhyMotion => useWhyMotion(setup);

export default useWhyEquation;
