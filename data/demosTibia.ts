import { SYSTEM_DEMO } from '@/data/demos';

// Тексты интерактивных демо «Учёт» (Tibia) в блоке «Что мы делаем».
// Реальные маркировки НКТ берём из основного демо склада, чтобы все варианты говорили об одних трубах.

const [PIPE_4X8, PIPE_4X9, PIPE_5A1, PIPE_5A2] = SYSTEM_DEMO.rows;
const PIPE_5B4 = { id: 'НКТ–5B4', size: '89 × 6.5' };
const PIPE_4Y1 = { id: 'НКТ–4Y1', size: '73 × 5.5' };

export interface ITibiaTag {
  id: string;
  size: string;
  count: number;
}

export const TIBIA_SCANNER = {
  brand: 'Tibia · приёмка на складе',
  hintPointer: 'Наведите лазер на бирку — или Tab и Enter',
  hintTouch: 'Коснитесь бирки — сканер считает штрихкод',
  journal: 'Журнал приёмки',
  headers: ['Маркировка', 'Размер, мм', 'Статус'],
  empty: '— — —',
  emptyShort: '—',
  pending: 'ожидает',
  pieces: 'шт',
  tagLabel: 'Бирка',
  ready: 'Сканер готов',
  read: 'Считано',
  accepted: 'Партия принята:',
  pipes: 'труб',
  reset: 'Новая партия',
  tags: [
    { ...PIPE_4X8, count: 24 },
    { ...PIPE_4X9, count: 24 },
    { ...PIPE_5A1, count: 18 },
    { ...PIPE_5A2, count: 18 },
    { ...PIPE_5B4, count: 16 },
    { ...PIPE_4Y1, count: 24 },
  ] satisfies ITibiaTag[],
};

export interface ITibiaPassportPipe {
  id: string;
  size: string;
  grade: string;
  length: string;
  heat: string;
  /** Индекс последнего пройденного этапа в `steps`. */
  done: number;
  where: string;
}

export const TIBIA_PASSPORT = {
  label: 'Найти трубу по маркировке',
  placeholder: 'НКТ–…',
  matches: 'Совпадения',
  notFound: 'Такой маркировки нет в системе',
  qr: 'QR на бирке ведёт в этот же паспорт — с терминала или телефона.',
  passport: 'Цифровой паспорт',
  diameter: '⌀',
  mm: 'мм',
  grade: 'Группа',
  meters: 'м',
  event: 'Событие',
  of: 'из',
  time: 'Время',
  source: 'Источник',
  data: 'Данные',
  now: 'Сейчас',
  stage: 'Этап',
  events: 'Событий',
  signature: 'Подпись цепочки',
  intact: '✓ не нарушена',
  steps: ['Прокат', 'ОТК', 'Бирка', 'Приёмка', 'Склад', 'Отгрузка', 'Скважина'],
  pipes: [
    { ...PIPE_4X8, grade: 'N80', length: '9.52', heat: 'П41218', done: 6, where: 'Самотлор, куст 412' },
    { ...PIPE_4X9, grade: 'N80', length: '9.47', heat: 'П41218', done: 5, where: 'Рейс 2417, в пути' },
    { ...PIPE_5A1, grade: 'L80', length: '9.61', heat: 'П41733', done: 4, where: 'Склад №2, Б-1' },
    { ...PIPE_5A2, grade: 'L80', length: '9.58', heat: 'П41733', done: 3, where: 'Приёмка, ворота 3' },
    { ...PIPE_4Y1, grade: 'J55', length: '9.40', heat: 'П40991', done: 2, where: 'Линия маркировки 1' },
    { ...PIPE_5B4, grade: 'L80', length: '9.55', heat: 'П41802', done: 1, where: 'ОТК завода' },
  ] satisfies ITibiaPassportPipe[],
  /** События цепочки по этапам: [время, источник, данные]. */
  history: (pipe: ITibiaPassportPipe): [string, string, string][] => [
    ['02.09.2026 06:40', 'Трубный завод, стан 3', `Плавка ${pipe.heat}, длина ${pipe.length} м`],
    ['03.09.2026 14:15', 'ОТК, инженер Руденко', 'Гидроиспытание 30 МПа · годна'],
    ['05.09.2026 09:02', 'Линия 1, принтер Zebra ZT410', `Бирка ${pipe.id} · QR выдан`],
    ['09.09.2026 11:37', 'ТСД-07, кладовщик Ахметов', 'Скан бирки · партия П-118'],
    ['09.09.2026 12:05', 'Склад №2, стеллаж А-1', 'Размещено 24 шт в пачке'],
    ['14.09.2026 07:50', 'Весы В-2, рейс 2417', 'Отгрузка · 18.2 т в фуре'],
    ['15.09.2026 16:20', 'Самотлор, куст 412', 'Спуск в скважину 1804 · акт подписан'],
  ],
};

export const TIBIA_CONVEYOR = {
  line: 'Линия маркировки №1',
  queue: 'труб в очереди',
  marked: 'Маркировано',
  rejected: 'Брак отсеян',
  errors: 'Ошибки',
  detector: 'Дефектоскоп',
  marker: 'Маркиратор',
  reject: 'Отбраковка',
  introTitle: 'Маркируйте годные трубы',
  introText:
    'Нажмите «Маркировать» или пробел, когда труба в синей зоне. Трубы с красной меткой дефектоскопа не маркируйте.',
  start: 'Запустить линию',
  again: 'Ещё смена',
  mark: 'Маркировать · пробел',
  stop: 'Стоп',
  stopped: 'Линия остановлена',
  started: 'Линия запущена',
  dropped: 'Брак ушёл в отбраковку',
  missedGood: 'Годная труба ушла без бирки',
  miss: 'Промах — под головкой нет трубы',
  markedBad: 'Бирка на бракованной трубе!',
  markedOk: '✓ Промаркирована',
  endTitle: 'Смена закрыта · точность',
  endText: (marked: number, rejected: number, errors: number) =>
    `Промаркировано ${marked}, брака отсеяно ${rejected}, ошибок ${errors}. Tibia записала каждую бирку в паспорт трубы.`,
  serialPrefix: `${PIPE_4X8.id}-`,
};

export const TIBIA_SEARCH = {
  placeholder: 'Маркировка, ячейка, партия или рейс',
  label: 'Поиск по складу',
  initialQuery: '5A',
  fast: '< 1 мс',
  ms: 'мс',
  try: 'Попробуйте:',
  suggestions: ['4X8', 'Б-1', '2417'],
  headers: ['Маркировка', 'Размер', 'Ячейка', 'Статус', 'Партия'],
  results: 'Результаты поиска',
  empty: 'Ничего не найдено — проверьте маркировку',
  found: 'Найдено',
  of: 'из',
  inDom: 'В DOM строк:',
  all: 'Все',
  statuses: ['На складе', 'В отгрузке', 'Маркировка', 'Отгружена'],
  sizes: ['73 × 5.5', '89 × 6.5', '60 × 5.0', '114 × 7.4'],
  zones: 'АБВГД',
  series: 'XAYBKM',
  prefix: 'НКТ–',
  trip: 'рейс',
  lot: 'П-',
};

export const TIBIA_REPORT = {
  period: 'Период',
  days: ['день', 'дня', 'дней'] as [string, string, string],
  warehouse: 'Склад',
  shift: 'Смена',
  warehouses: [
    ['all', 'Все'],
    ['1', '№1'],
    ['2', '№2'],
    ['3', '№3'],
  ] as [string, string][],
  shifts: [
    ['all', 'Обе'],
    ['day', 'День'],
    ['night', 'Ночь'],
  ] as [string, string][],
  note: 'Данные собираются со сканеров и весов автоматически — отчёт не нужно сводить руками.',
  pdf: 'Скачать PDF',
  kpis: ['Принято', 'Отгружено', 'Тоннаж', 'Ошибки скана'],
  pieces: 'шт',
  tons: 'т',
  legendIn: 'Приёмка, шт',
  legendOut: 'Отгрузка, шт',
  chart: 'Приёмка и отгрузка по дням',
  sizes: ['73 × 5.5', '89 × 6.5', '60 × 5.0', '114 × 7.4'],
  sheetMeta: 'Majorpack · Tibia · сформировано 17.09.2026 20:05',
  sheetTitle: 'Отчёт за',
  sheetDays: 'дн.',
  allWarehouses: 'все склады',
  warehouseName: 'склад',
  bothShifts: 'день и ночь',
  rows: ['Смена', 'Принято труб', 'Отгружено', 'Ошибки сканирования', 'Подпись'],
  signature: 'мастер смены, ЭЦП',
  building: 'Собираем страницу…',
  file: (warehouse: string, days: number) => `✓ otchet_sklad_${warehouse === 'all' ? 'vse' : warehouse}_${days}d.pdf · 212 КБ`,
  close: 'Закрыть',
};
