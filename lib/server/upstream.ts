import type { IServerEnv } from '@/lib/server/http';

// Внешние сервисы недоступны из РФ напрямую. На боевом сервере сайт ходит в OpenAI и Telegram
// через ретранслятор в Европе (relay/), локально и без RELAY_URL — напрямую по своим ключам
const relay = (env: IServerEnv) => (env.RELAY_URL && env.RELAY_SECRET ? { url: env.RELAY_URL.replace(/\/$/, ''), secret: env.RELAY_SECRET } : null);

export const hasAi = (env: IServerEnv) => Boolean(relay(env) || env.OPENAI_API_KEY);
export const hasTelegram = (env: IServerEnv) => Boolean(relay(env) || (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID));

/** Запрос к OpenAI Responses API */
export const openaiResponses = (env: IServerEnv, body: unknown, timeout: number) => {
  const via = relay(env);
  return fetch(via ? `${via.url}/openai/v1/responses` : 'https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(via ? { 'X-Relay-Secret': via.secret } : { Authorization: `Bearer ${env.OPENAI_API_KEY}` }) },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
};

/** Сообщение в чат заявок. Через ретранслятор чат задает он сам, сайт его не выбирает */
export const telegramSend = (env: IServerEnv, message: { text: string; parse_mode?: string }, timeout: number) => {
  const via = relay(env);
  return fetch(via ? `${via.url}/telegram/sendMessage` : `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(via ? { 'X-Relay-Secret': via.secret } : {}) },
    body: JSON.stringify(via ? message : { ...message, chat_id: env.TELEGRAM_CHAT_ID }),
    signal: AbortSignal.timeout(timeout),
  });
};
