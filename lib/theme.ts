// Тема сайта. Ручной выбор посетителя хранится в localStorage и всегда важнее автоматики.
// Без выбора тема идет по местному времени: днем светлая, вечером и ночью темная
export const THEME_KEY = 'flame-theme';
export const THEME_EVENT = 'flame-theme-change';
export const DAY_START = 7;
export const NIGHT_START = 20;

export type Theme = 'light' | 'dark';

export const themeByTime = (date = new Date()): Theme => {
  const hour = date.getHours();
  return hour >= DAY_START && hour < NIGHT_START ? 'light' : 'dark';
};

// Тот же выбор до первой отрисовки: скрипт в <head>, без него страница мигала бы чужой темой
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){var h=new Date().getHours();t=h>=${DAY_START}&&h<${NIGHT_START}?'light':'dark'}d.dataset.theme=t})()`;
