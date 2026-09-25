import type { IProcessGanttBar, IProcessLap, IProcessLogLine, IProcessStep } from './types';

// Неразрывные пробелы: в узкой колонке заголовок делится на «От задачи / до запуска», предлог не висит.
export const PROCESS_TITLE = 'От\u00A0задачи до\u00A0запуска';

// Этапы без сроков и недель: для разных задач ритм разный (doc/FLAME_DEV_WEBSITE_COPY.md).
export const PROCESS_STEPS: IProcessStep[] = [
  { title: 'Разбираемся в задаче', description: 'Обсуждаем цели, пользователей, ограничения и сроки. Определяем, что нужно для оценки проекта' },
  { title: 'Проектируем решение', description: 'Продумываем структуру, ключевые сценарии и интеграции. Согласуем состав первой версии' },
  { title: 'Создаем дизайн', description: 'Разрабатываем интерфейс с учетом бренда, контента и поведения пользователей' },
  { title: 'Разрабатываем и проверяем', description: 'Показываем промежуточный результат. Проверяем основные сценарии, мобильную версию и работу интеграций' },
  { title: 'Запускаем и передаем', description: 'Готовим проект к работе, передаем материалы и объясняем управление. Отдельно согласуем поддержку и развитие' },
];

export const PROCESS_NOTE = 'Заранее определяем этапы и точки согласования. Организуем работу и держим вас в курсе результата';

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
  file: 'flame-dev · project.log',
  lines: [
    { kind: 'cmd', text: 'flame project start' },
    { kind: 'step', text: '01 Разбираемся в задаче' },
    { kind: 'out', text: 'цели, пользователи, ограничения и сроки' },
    { kind: 'out', text: 'что нужно для оценки проекта', status: 'готово', done: 0 },
    { kind: 'step', text: '02 Проектируем решение' },
    { kind: 'out', text: 'структура, ключевые сценарии и интеграции' },
    { kind: 'out', text: 'состав первой версии', status: 'согласован', done: 1 },
    { kind: 'step', text: '03 Создаем дизайн' },
    { kind: 'out', text: 'интерфейс с учетом бренда и контента', status: 'готово', done: 2 },
    { kind: 'step', text: '04 Разрабатываем и проверяем' },
    { kind: 'out', text: 'промежуточный результат', status: 'показан' },
    { kind: 'out', text: 'сценарии, мобильная версия, интеграции', status: 'проверено', done: 3 },
    { kind: 'step', text: '05 Запускаем и передаем' },
    { kind: 'cmd', text: 'flame deploy --prod' },
    { kind: 'out', text: 'материалы и управление', status: 'переданы' },
    { kind: 'out', text: 'поддержка и развитие', status: 'по договоренности', live: true, done: 4 },
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
