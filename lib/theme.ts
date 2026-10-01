// Тема сайта. Ручной выбор посетителя хранится в localStorage и всегда важнее автоматики.
// Без выбора: если устройство в темной теме, сайт темный. Иначе тема идет по солнцу, как авторежим на телефонах:
// светлая от восхода до заката, темная ночью. Восход и закат считаются по дате для средней полосы России
export const THEME_KEY = 'flame-theme';
export const THEME_EVENT = 'flame-theme-change';
export const DARK_QUERY = '(prefers-color-scheme: dark)';

export type Theme = 'light' | 'dark';

// Чистая функция без обращений к окружению: ее текст вставляется в скрипт в <head>, поэтому проверок
// вроде typeof window здесь быть не должно, сборка сервера заменила бы их константой.
// Широта 55,75° (Москва), солнечный полдень около 12:30 по местному времени
export function sunTheme(now: Date): Theme {
  const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = 23.44 * Math.PI / 180 * Math.sin(2 * Math.PI * (284 + day) / 365);
  const latitude = 55.75 * Math.PI / 180;
  const cos = Math.max(-1, Math.min(1, -Math.tan(latitude) * Math.tan(declination)));
  const half = Math.acos(cos) * 180 / Math.PI / 15;
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= 12.5 - half && hour < 12.5 + half ? 'light' : 'dark';
}

export const autoTheme = (now: Date): Theme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : sunTheme(now));

// Тот же выбор до первой отрисовки: скрипт в <head>, без него страница мигала бы чужой темой
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('${DARK_QUERY}').matches?'dark':(${sunTheme.toString()})(new Date())}d.dataset.theme=t})()`;
