import { gsap } from 'gsap';
import { part, parts, PROCESS_SCRUB } from '../helpers';
import useProcessScene from './useProcessScene';

// Номера смещаются к центру экрана с этой долей расстояния — глубина относительно карточек.
const NUM_PARALLAX = 0.38;
// Линейка недель едет медленнее ленты.
const RULER_SPEED = 0.45;
// Пин чуть длиннее хода ленты, чтобы последняя карточка успела постоять.
const PIN_STRETCH = 1.1;

const useProcessTimeline = () =>
  useProcessScene(({ root }) => {
    const track = part(root, 'track');
    const ruler = part(root, 'ruler');
    if (!track || !ruler) return;
    const nums = parts<SVGSVGElement>(root, 'num');

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const parallax = () => {
      const middle = window.innerWidth / 2;
      nums.forEach((num) => {
        const card = num.parentElement?.getBoundingClientRect();
        if (card) gsap.set(num, { x: (card.left + card.width / 2 - middle) * NUM_PARALLAX });
      });
    };

    const tl = gsap.timeline({
      onUpdate: parallax,
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${distance() * PIN_STRETCH}`,
        pin: true,
        scrub: PROCESS_SCRUB,
        invalidateOnRefresh: true,
      },
    });
    tl.to(track, { x: () => -distance(), ease: 'none' }, 0).to(
      ruler,
      { x: () => -Math.min(distance() * RULER_SPEED, Math.max(0, ruler.scrollWidth - window.innerWidth)), ease: 'none' },
      0,
    );
    parallax();

    return () => gsap.set(nums, { clearProps: 'transform' });
  });

export default useProcessTimeline;
