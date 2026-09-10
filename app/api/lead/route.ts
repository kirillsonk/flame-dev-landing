import { NextResponse } from 'next/server';
import { ValidationError } from 'yup';
import { leadValidationSchema } from '@/components/sections/Contact/LeadForm.validationSchema';

const escapeHtml = (value: string) => value.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  let lead;
  try {
    lead = await leadValidationSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    const details = err instanceof ValidationError ? err.errors : ['invalid'];
    return NextResponse.json({ error: 'validation', details }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.info('[lead] (no telegram config)', lead);
    return NextResponse.json({ ok: true });
  }

  const text = [
    `<b>Заявка с Flame Dev</b> (${lead.source})`,
    `Имя: ${escapeHtml(lead.name)}`,
    `Контакт: ${escapeHtml(lead.contact)}`,
    lead.message ? `Задача: ${escapeHtml(lead.message)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    console.error('[lead] telegram failed', res.status, await res.text());
    return NextResponse.json({ error: 'delivery' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
