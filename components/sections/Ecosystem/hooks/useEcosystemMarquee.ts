import { gsap } from 'gsap';
import useEcosystemScene, { part, parts, pinTrigger } from './useEcosystemScene';

// Длина пина в процентах высоты окна.
const PIN = 220;
// Пробег строк в процентах их ширины: строки навстречу, ни одна не уезжает целиком.
const TRAVEL = 40;

/**
 * Строки едут навстречу весь пин, карточки поднимаются на последней трети,
 * строки при этом приглушаются.
 */
const useEcosystemMarquee = () =>
  useEcosystemScene((root) => {
    const rows = parts(root, 'row');
    const cards = part(root, 'cards');
    if (rows.length < 2 || !cards) return;

    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pinTrigger(root, PIN) });
    timeline
      .fromTo(rows[0], { xPercent: 0 }, { xPercent: -TRAVEL, duration: 1 }, 0)
      .fromTo(rows[1], { xPercent: -TRAVEL }, { xPercent: 0, duration: 1 }, 0)
      .fromTo(cards, { y: '6rem', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0.55)
      .to(rows, { opacity: 0.4, duration: 0.35 }, 0.55);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.revert().kill();
    };
  });

export default useEcosystemMarquee;
