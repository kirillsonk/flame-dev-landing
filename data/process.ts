import type { IProcessGanttBar, IProcessLap, IProcessLogLine, IProcessStep } from './types';

export const PROCESS_TITLE = 'Как проходит проект';

export const PROCESS_STEPS: IProcessStep[] = [
  { title: 'Бриф и оценка', duration: '2–3 дня', description: 'Созвон, вопросы, письменная оценка сроков и бюджета.' },
  { title: 'Проектирование', description: 'Структура, прототипы, ТЗ. Вы видите продукт до первой строки кода.' },
  { title: 'Дизайн', description: 'По вашему брендбуку или с нуля. Согласование по экранам.' },
  { title: 'Разработка', description: 'Спринты, демо каждые две недели, тестовый стенд с первой недели.' },
  { title: 'Запуск и поддержка', description: 'Деплой, мониторинг, SLA на поддержку.' },
];

export const PROCESS_NOTE = 'Один менеджер на проект, демо каждые две недели, без сюрпризов по срокам.';

// «Одометр»: барабаны номера шага и недели проекта, на которой шаг начинается.
export const PROCESS_ODOMETER = {
  stepLabel: 'Шаг',
  weekLabel: 'Неделя проекта',
  weeks: [0, 1, 3, 5, 14],
};

// «Безель»: короткие подписи секторов и того, что показывает центр циферблата.
export const PROCESS_BEZEL = {
  sectors: ['Бриф и оценка', 'Проектирование', 'Дизайн', 'Разработка', 'Запуск'],
  captions: ['2–3 дня', 'прототипы', 'по экранам', 'демо раз в две недели', 'SLA'],
};

// «Гант»: пример графика среднего проекта на 14 недель.
export const PROCESS_GANTT: {
  corner: string;
  weeks: number;
  start: string;
  finish: string;
  today: string;
  bars: IProcessGanttBar[];
} = {
  corner: 'Неделя',
  weeks: 14,
  start: 'Старт',
  finish: 'Запуск',
  today: 'Сегодня · неделя',
  bars: [
    { start: 0, end: 0.6 },
    { start: 0.6, end: 2.5 },
    { start: 2, end: 5 },
    { start: 4, end: 13, demos: [6, 8, 10, 12] },
    { start: 12.5, end: 14, open: true },
  ],
};

// «Терминал»: лог проекта, который печатается по скроллу.
export const PROCESS_TERMINAL: { file: string; lines: IProcessLogLine[] } = {
  file: 'flame-dev — project.log',
  lines: [
    { kind: 'cmd', text: 'flame project start' },
    { kind: 'step', text: '01 Бриф и оценка · 2–3 дня' },
    { kind: 'out', text: 'созвон и вопросы по задаче' },
    { kind: 'out', text: 'письменная оценка сроков и бюджета', status: 'готово', done: 0 },
    { kind: 'step', text: '02 Проектирование' },
    { kind: 'out', text: 'структура, прототипы, ТЗ' },
    { kind: 'out', text: 'продукт виден до первой строки кода', status: 'готово', done: 1 },
    { kind: 'step', text: '03 Дизайн' },
    { kind: 'out', text: 'по вашему брендбуку или с нуля' },
    { kind: 'out', text: 'согласование по экранам', status: 'готово', done: 2 },
    { kind: 'step', text: '04 Разработка' },
    { kind: 'out', text: 'тестовый стенд с первой недели', status: 'поднят' },
    { kind: 'out', text: 'спринты, демо каждые две недели' },
    { kind: 'out', text: 'финальное демо', status: 'принято', done: 3 },
    { kind: 'step', text: '05 Запуск и поддержка' },
    { kind: 'cmd', text: 'flame deploy --prod' },
    { kind: 'out', text: 'деплой, мониторинг', status: 'готово' },
    { kind: 'out', text: 'SLA на поддержку', status: 'online', live: true, done: 4 },
  ],
};

// «Секундомер»: оборот стрелки — неделя, отсечки — дни проекта, на которых закрывается шаг.
export const PROCESS_STOPWATCH: {
  days: string[];
  totalDays: number;
  week: string;
  day: string;
  head: [string, string, string];
  empty: string;
  laps: IProcessLap[];
  note: string;
} = {
  days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  totalDays: 98,
  week: 'неделя',
  day: 'день',
  head: ['Круг', 'Шаг', 'Отсечка'],
  empty: '— : —',
  laps: [
    { day: 3, split: '2–3 дня' },
    { day: 14, split: 'нед 2' },
    { day: 28, split: 'нед 4' },
    { day: 91, split: 'нед 13' },
    { day: 98, split: 'нед 14' },
  ],
  note: 'Отсечки — пример графика среднего проекта.',
};

// «Лента времени»: подписи карточек и линейка недель под лентой.
export const PROCESS_TIMELINE = {
  stepLabel: 'Шаг',
  end: 'Дальше — поддержка по SLA.',
  weekLabel: 'неделя',
  weeks: 14,
  rulerCells: 20,
};
