// Тексты, призы и промокоды для вариантов демо «Игра» (components/sections/Services/visuals/game).
// Тексты текущего демо «Три в ряд» (вариант 'current') остаются в data/demos.ts.

export interface IGamePrize {
  label: string;
  prefix: string;
}

export const GAME_PROMO = {
  dialog: 'Награда',
  copy: 'Скопировать',
  copied: 'Скопировано',
  points: 'очков',
  // Алфавит суффикса промокода: без похожих символов 0/O, 1/I.
  alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
};

export const GAME_COMBO = {
  tag: 'Задание дня · мини-игра',
  title: 'Соберите 1200 очков за 30 секунд',
  hint: 'Поменяйте местами соседние фишки: перетаскиванием, двумя кликами или стрелками и Enter. Каскады умножают очки',
  time: 'Время',
  score: 'Очки',
  reset: 'Заново',
  goal: 1200,
  duration: 30,
  size: 7,
  board: 'Игровое поле 7 на 7',
  row: 'ряд',
  column: 'столбец',
  kinds: ['Бутылка', 'Бургер', 'Лед', 'Звезда', 'Пицца'],
  idle: 'Таймер стартует с первого хода',
  go: 'Поехали!',
  invalid: 'Здесь нет тройки, попробуйте другую пару',
  cascade: 'Каскад! Очки ×',
  combo: 'Комбо ×',
  shuffle: 'Ходов нет, перемешиваем',
  winTop: 'Цель взята',
  winBase: 'Время вышло',
  note: 'Промокод действует 24 часа в приложении доставки',
  again: 'Сыграть еще',
  prizeTop: { label: '−30% на заказ от 900 ₽', prefix: 'DAY30-' } as IGamePrize,
  prizeBase: {
    label: '−10% на заказ, почти получилось',
    prefix: 'DAY10-',
  } as IGamePrize,
};

export const GAME_SCRATCH = {
  tag: 'Скретч-карта',
  title: 'Сотрите слой, под ним приз',
  hint: 'Ведите пальцем или мышью по билету. Когда сотрете больше половины, слой осыплется сам',
  erased: 'Стерто',
  auto: 'Стереть за меня',
  next: 'Новый билет',
  canvas: 'Защитный слой билета, сотрите его',
  coverTitle: 'Сотрите слой',
  coverSubtitle: 'приз дня внутри',
  kicker: 'Ваш приз дня',
  kickerWin: 'Поздравляем! Ваш приз дня',
  idle: 'Начните стирать с любого места',
  almost: 'Еще немного…',
  won: 'Приз ваш, промокод действует 24 часа',
  threshold: 55,
  prizes: [
    { big: '−25%', sub: 'на заказ от 900 ₽', prefix: 'SCRATCH25-' },
    { big: '0 ₽', sub: 'доставка на 3 заказа', prefix: 'FREEDLV3-' },
    { big: '1+1', sub: 'второй напиток в подарок', prefix: 'DRINK11-' },
    { big: '−400 ₽', sub: 'на заказ из ресторана', prefix: 'MINUS400-' },
  ],
};

export const GAME_CATCH = {
  tag: 'Мини-игра · 25 секунд',
  title: 'Поймайте заказ в сумку',
  hint: 'Ведите сумку мышью, пальцем или стрелками. Пустые коробки отнимают очки',
  time: 'Время',
  score: 'Очки',
  duration: 25,
  goal: 250,
  canvas: 'Игровое поле: стрелки влево и вправо двигают сумку',
  intro: 'Наберите 250 очков и получите скидку 25% на следующий заказ',
  start: 'Начать игру',
  winLabel: 'Смена закрыта',
  note: 'Промокод действует 24 часа',
  again: 'Еще раз',
  legend: [
    { kind: 'drink', label: 'Напиток', points: 10, weight: 4 },
    { kind: 'burger', label: 'Бургер', points: 10, weight: 4 },
    { kind: 'star', label: 'Бонус', points: 30, weight: 1 },
    { kind: 'dud', label: 'Пустышка', points: -20, weight: 3 },
  ] as const,
  prizeTop: {
    label: '−25% на следующий заказ',
    prefix: 'CATCH25-',
  } as IGamePrize,
  prizeBase: {
    label: '−10% на заказ, до цели чуть-чуть',
    prefix: 'CATCH10-',
  } as IGamePrize,
};
