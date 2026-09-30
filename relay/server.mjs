// Ретранслятор Flame dev: живет в Европе и пропускает к OpenAI и Telegram только запросы сайта.
// Сайт в РФ знает адрес и общий пароль, все внешние ключи хранятся здесь. Без зависимостей, Node 20+
import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

const { RELAY_SECRET = '', OPENAI_API_KEY = '', TELEGRAM_BOT_TOKEN = '', TELEGRAM_CHAT_ID = '', PORT = '8080' } = process.env;
const MAX_BODY = 64 * 1024;
const TIMEOUT = 30_000;

if (RELAY_SECRET.length < 32) {
  console.error('[relay] RELAY_SECRET is missing or shorter than 32 characters');
  process.exit(1);
}

const secret = Buffer.from(RELAY_SECRET);
const authorized = (value) => {
  const given = Buffer.from(String(value ?? ''));
  return given.length === secret.length && timingSafeEqual(given, secret);
};

const send = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let size = 0;
  const chunks = [];
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY) { reject(new Error('size')); req.destroy(); return; }
    chunks.push(chunk);
  });
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
});

// Ответ внешнего сервиса отдаем сайту как есть: статус и тело
const pipe = async (res, upstream) => {
  const body = await upstream.text();
  res.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json', 'Cache-Control': 'no-store' });
  res.end(body);
};

const routes = {
  // Только Responses API: другие методы OpenAI через ретранслятор недоступны
  '/openai/v1/responses': async (body) => {
    if (!OPENAI_API_KEY) return null;
    return fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(TIMEOUT),
    });
  },
  // Только отправка в чат заявок: чат задается здесь, сайт не может выбрать другой
  '/telegram/sendMessage': async (body) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return null;
    const { text, parse_mode } = JSON.parse(body);
    if (typeof text !== 'string' || !text.trim() || text.length > 4096) throw new Error('text');
    return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: parse_mode === 'HTML' ? 'HTML' : undefined, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(TIMEOUT),
    });
  },
};

createServer(async (req, res) => {
  const path = (req.url ?? '/').split('?')[0];
  if (req.method === 'GET' && path === '/health') return send(res, 200, { ok: true, openai: Boolean(OPENAI_API_KEY), telegram: Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) });
  const route = routes[path];
  if (!route) return send(res, 404, { error: 'not_found' });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  if (!authorized(req.headers['x-relay-secret'])) return send(res, 401, { error: 'unauthorized' });
  try {
    const upstream = await route(await readBody(req));
    if (!upstream) return send(res, 503, { error: 'not_configured' });
    await pipe(res, upstream);
  } catch (error) {
    const status = error?.message === 'size' ? 413 : error?.message === 'text' || error instanceof SyntaxError ? 400 : 502;
    console.error('[relay]', path, status);
    if (!res.headersSent) send(res, status, { error: 'relay' });
  }
}).listen(Number(PORT), () => console.log(`[relay] listening on ${PORT}`));
