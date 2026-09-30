// Счетчик Яндекс Метрики. Считаем только боевой домен: локалхост и превью статистику не засоряют
export const METRIKA_ID = 113166760;
export const METRIKA_HOSTS = ['flamedev.pro', 'www.flamedev.pro'];

// Класс Метрики: Вебвизор не записывает ввод в поле. Ставим на все поля с данными клиента
export const NO_RECORD = 'ym-disable-keys';

/**
 * Цели. Идентификаторы совпадают с целями типа «JavaScript-событие» в интерфейсе Метрики:
 * без созданной там цели событие не попадет в отчет «Конверсии»
 */
export type MetrikaGoal =
  | 'lead_sent'
  | 'lead_error'
  | 'brief_start'
  | 'brief_contact'
  | 'cta_click'
  | 'case_open'
  | 'cases_all'
  | 'project_live'
  | 'email_click'
  | 'ecosystem_click';

declare global {
  interface Window { ym?: (id: number, method: string, ...args: unknown[]) => void }
}

/** Достижение цели. Вне боевого домена счетчика нет, вызов ничего не делает */
export const reachGoal = (goal: MetrikaGoal, params?: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  window.ym?.(METRIKA_ID, 'reachGoal', goal, params);
};

/** Параметры визита, например язык интерфейса */
export const visitParams = (params: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  window.ym?.(METRIKA_ID, 'params', params);
};
