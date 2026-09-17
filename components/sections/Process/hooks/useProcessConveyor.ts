import { gsap } from 'gsap';
import { part, parts, pinTrigger, toggleOn } from '../helpers';
import useProcessScene from './useProcessScene';

// Поворот катков ленты на пиксель хода заготовки.
const BELT_ROLL = 1 / 1.2;

const useProcessConveyor = () =>
  useProcessScene(({ root }) => {
    const lane = part(root, 'lane');
    const item = part(root, 'item');
    const belt = part(root, 'belt');
    if (!lane || !item || !belt) return;
    const presses = parts(root, 'press');
    const hammers = parts(root, 'hammer');
    const rods = parts(root, 'rod');
    const shapes = parts<Element>(root, 'shape');
    const labels = parts(root, 'label');
    const count = presses.length;

    // Центр заготовки под прессом `index`.
    const stationX = (index: number) => (lane.offsetWidth * (index + 0.5)) / count - item.offsetWidth / 2;
    // Ход молота до верхней кромки заготовки.
    const hammerTravel = () =>
      item.getBoundingClientRect().top -
      hammers[0].getBoundingClientRect().bottom +
      Number(gsap.getProperty(hammers[0], 'y'));

    let shown = -1;
    const show = (stamped: number) => {
      if (stamped === shown) return;
      shown = stamped;
      toggleOn(shapes, (index) => index === stamped);
      toggleOn(labels, (index) => index === stamped - 1 || (stamped === 0 && index === 0));
      toggleOn(presses, (index) => index < stamped);
    };
    const syncBelt = () => {
      const x = Number(gsap.getProperty(item, 'x'));
      belt.style.backgroundPosition = `${x}px 0`;
      belt.style.setProperty('--roll', `${x * BELT_ROLL}deg`);
    };

    gsap.set(item, { x: () => stationX(0) });
    show(0);
    syncBelt();

    const stamps: number[] = [];
    const tl = gsap.timeline({ scrollTrigger: pinTrigger(root, 420) });
    tl.to({}, { duration: 0.3 });
    presses.forEach((_, i) => {
      if (i) {
        tl.fromTo(
          item,
          { x: () => stationX(i - 1) },
          { x: () => stationX(i), duration: 1, ease: 'power2.inOut', immediateRender: false, onUpdate: syncBelt },
        );
      }
      tl.to(hammers[i], { y: hammerTravel, duration: 0.3, ease: 'power3.in' }).to(
        rods[i],
        { scaleY: 1, duration: 0.3, ease: 'power3.in' },
        '<',
      );
      stamps.push(tl.duration());
      tl.to(item, { scale: 0.94, duration: 0.08, transformOrigin: '50% 100%' })
        .to(item, { scale: 1, duration: 0.2, ease: 'back.out(3)' })
        .to(hammers[i], { y: 0, duration: 0.35, ease: 'power2.out' }, '<')
        .to(rods[i], { scaleY: 0.4, duration: 0.35, ease: 'power2.out' }, '<')
        .to({}, { duration: 0.4 });
    });
    tl.eventCallback('onUpdate', () => {
      const time = tl.time();
      show(stamps.filter((stamp) => time >= stamp - 0.01).length);
    });

    return () => {
      belt.style.removeProperty('background-position');
      belt.style.removeProperty('--roll');
      shown = -1;
      show(count);
      toggleOn(labels, () => false);
    };
  });

export default useProcessConveyor;
