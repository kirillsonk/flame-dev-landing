import type { IProcessStep } from './types';

export const PROCESS_STEPS: IProcessStep[] = [
  { number: '01', title: 'Бриф и оценка', description: '2–3 дня. Созвон, вопросы, письменная оценка сроков и бюджета.' },
  { number: '02', title: 'Проектирование', description: 'Структура, прототипы, ТЗ. Вы видите продукт до первой строки кода.' },
  { number: '03', title: 'Дизайн', description: 'По вашему брендбуку или с нуля. Согласование по экранам.' },
  { number: '04', title: 'Разработка', description: 'Спринты, демо каждые две недели, тестовый стенд с первой недели.' },
  { number: '05', title: 'Запуск и поддержка', description: 'Деплой, мониторинг, SLA на поддержку.' },
];

export const PROCESS_NOTE = 'Один менеджер на проект, демо каждые две недели, без сюрпризов по срокам.';
