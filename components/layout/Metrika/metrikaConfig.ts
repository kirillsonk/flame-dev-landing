// Счетчик Яндекс Метрики. Считаем только боевой домен: локалхост и превью статистику не засоряют
export const METRIKA_ID = 113166760;
export const METRIKA_HOSTS = ['flamedev.pro', 'www.flamedev.pro'];

// Класс Метрики: Вебвизор не записывает ввод в поле. Ставим на все поля с данными клиента
export const NO_RECORD = 'ym-disable-keys';

declare global {
  interface Window { ym?: (id: number, method: string, ...args: unknown[]) => void }
}
