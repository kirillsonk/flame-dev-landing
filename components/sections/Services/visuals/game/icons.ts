// Пиктограммы фишек и падающих заказов (viewBox 0 0 24 24).
export type GameIconKind = 'drink' | 'burger' | 'ice' | 'star' | 'pizza' | 'dud';

export const GAME_ICON_PATHS: Record<Exclude<GameIconKind, 'dud'>, string> = {
  drink: 'M10 2h4v2.5c0 1.2 2.5 2.3 2.5 5.5v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V10c0-3.2 2.5-4.3 2.5-5.5z',
  burger: 'M4 10c0-3.5 3.6-6 8-6s8 2.5 8 6zM3 12h18v2.5H3zM4 16.5h16c0 2-1.8 3.5-4 3.5H8c-2.2 0-4-1.5-4-3.5z',
  ice: 'M12 2l8 4.5v9L12 20l-8-4.5v-9z',
  star: 'M12 2l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 16.8 6.1 20l1.3-6.5L2.5 8.9l6.6-.8z',
  pizza: 'M12 3c3.9 0 7.4 1.3 9 3L12 21 3 6c1.6-1.7 5.1-3 9-3z',
};

// Порядок совпадает с GAME_COMBO.kinds.
export const COMBO_KINDS: GameIconKind[] = ['drink', 'burger', 'ice', 'star', 'pizza'];
