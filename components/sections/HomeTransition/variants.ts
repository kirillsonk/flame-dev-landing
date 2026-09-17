export type HomeTransitionVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Варианты, где кейсы накрывают первый экран: hero держит пин ещё на высоту окна. */
export const COVER_VARIANTS: HomeTransitionVariant[] = [1, 3, 4, 6, 7, 8, 10];

// Основной переход — 4, «зум и размытие»: первый экран уходит в кадр, кейсы поднимаются снизу.
export const DEFAULT_TRANSITION: HomeTransitionVariant = 4;

export const parseTransition = (value: string | undefined): HomeTransitionVariant => {
  const parsed = Number(value);
  return (parsed >= 1 && parsed <= 10 ? parsed : DEFAULT_TRANSITION) as HomeTransitionVariant;
};
