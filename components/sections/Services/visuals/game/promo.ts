import { GAME_PROMO } from '@/data/demosGame';

// Вызывать только на клиенте (обработчики, эффекты): иначе расхождение гидрации.
export const makePromoCode = (prefix: string, length: number) =>
  prefix +
  Array.from({ length }, () => GAME_PROMO.alphabet[Math.floor(Math.random() * GAME_PROMO.alphabet.length)]).join('');

export const copyText = (text: string) => {
  try {
    navigator.clipboard?.writeText(text).catch(() => undefined);
  } catch {
    // Буфер обмена недоступен (http, iframe) — демо продолжает работать.
  }
};
