export interface IServerEnv {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}
export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export const readPayload = async (request: Request, maxBytes = 16000): Promise<unknown> => {
  const origin = request.headers.get('origin');
  // Next.js can normalize the internal URL to localhost; Host retains the public authority
  const authority = request.headers.get('host') ?? new URL(request.url).host;
  if (origin && new URL(origin).host !== authority) throw new Error('origin');
  if (!request.body) throw new Error('body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) { await reader.cancel(); throw new Error('size'); }
    text += decoder.decode(value, { stream: true });
  }
  return JSON.parse(text + decoder.decode());
};
