import { gsap } from 'gsap';
import { part, parts, pinTrigger, toggleOn } from '../helpers';
import useProcessScene from './useProcessScene';

// Геометрия сцены в единицах viewBox 1320×560: 1 единица = 0.1rem на всю ширину контейнера.
export const ROUTE_PATH =
  'M44 400 C176 400 264 180 396 180 C528 180 528 400 660 400 C792 400 792 180 924 180 C1056 180 1144 400 1276 400';
export const ROUTE_STOPS: [number, number][] = [
  [44, 400],
  [396, 180],
  [660, 400],
  [924, 180],
  [1276, 400],
];
// Остановки маркера в долях длины кривой.
const FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

const useProcessRoute = () =>
  useProcessScene(
    ({ root, desktop }) => {
      const stops = parts(root, 'stop');

      if (!desktop) {
        stops.forEach((stop) =>
          gsap.from(stop, {
            opacity: 0.2,
            x: -16,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: stop, start: 'top 85%' },
          }),
        );
        return;
      }

      const trail = part<SVGPathElement>(root, 'trail');
      const marker = part<SVGGElement>(root, 'marker');
      const dots = parts<SVGCircleElement>(root, 'dot');
      if (!trail || !marker) return;

      const length = trail.getTotalLength();
      const initial = marker.getAttribute('transform') ?? '';
      const state = { p: 0 };
      const render = () => {
        const drawn = length * state.p;
        trail.style.strokeDasharray = String(length);
        trail.style.strokeDashoffset = String(length - drawn);
        const point = trail.getPointAtLength(drawn);
        marker.setAttribute('transform', `translate(${point.x} ${point.y})`);
        const isOn = (index: number) => state.p >= FRACTIONS[index] - 0.002;
        toggleOn(stops, isOn);
        toggleOn(dots, isOn);
      };
      render();

      const tl = gsap.timeline({ scrollTrigger: pinTrigger(root, 360) });
      tl.to({}, { duration: 0.4 });
      FRACTIONS.slice(1).forEach((fraction) => {
        tl.to(state, { p: fraction, duration: 1, ease: 'power2.inOut', onUpdate: render });
        tl.to({}, { duration: 0.5 });
      });

      return () => {
        trail.style.removeProperty('stroke-dasharray');
        trail.style.removeProperty('stroke-dashoffset');
        marker.setAttribute('transform', initial);
        toggleOn([...stops, ...dots], () => false);
      };
    },
    { mobile: true },
  );

export default useProcessRoute;
