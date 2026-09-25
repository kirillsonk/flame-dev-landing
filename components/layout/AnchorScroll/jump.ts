import { ScrollTrigger } from 'gsap/ScrollTrigger';

// `auto` подчиняется scroll-behavior: smooth на html, поэтому прыжок задаётся явно.
// После прыжка анимации со scrub всё равно догоняли бы новую позицию за свои 0,6 с — это
// выглядело как обратная анимация. Все триггеры обновляются сразу, а их scrub-твины доводятся до конца.
const jump = (top: number) => {
  window.scrollTo({ top, behavior: 'instant' });
  ScrollTrigger.update();
  ScrollTrigger.getAll().forEach((trigger) => trigger.getTween()?.progress(1));
};

export default jump;
