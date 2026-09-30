import { readPayload, type IServerEnv } from '@/lib/server/http';
import { hasTelegram, telegramSend } from '@/lib/server/upstream';
import { ValidationError } from 'yup';
import { leadValidationSchema } from '@/components/sections/Contact/LeadForm.validationSchema';

const escapeHtml = (value: string) => value.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c);

export async function handleLead(request: Request, env: IServerEnv) {
  let payload: unknown;
  try {
    payload = await readPayload(request);
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  let lead;
  try {
    lead = await leadValidationSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    const details = err instanceof ValidationError ? err.errors : ['invalid'];
    return Response.json({ error: 'validation', details }, { status: 400 });
  }

  if (!hasTelegram(env)) {
    console.error('[lead] delivery is not configured');
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }

  const text = [
    `<b>Заявка с Flame dev</b> (${lead.source})`,
    `Имя: ${escapeHtml(lead.name)}`,
    `Контакт: ${escapeHtml(lead.contact)}`,
    lead.message ? `Задача: ${escapeHtml(lead.message)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await telegramSend(env, { text, parse_mode: 'HTML' }, 12_000);

    if (!res.ok) {
      console.error('[lead] delivery failed', res.status);
      return Response.json({ error: 'delivery' }, { status: 502 });
    }

    const delivery: { ok?: boolean } = await res.json();
    if (delivery.ok !== true) {
      console.error('[lead] delivery was not confirmed');
      return Response.json({ error: 'delivery' }, { status: 502 });
    }
  } catch {
    console.error('[lead] delivery request failed');
    return Response.json({ error: 'delivery' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
