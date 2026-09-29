import { handleLead } from '@/lib/server/lead';
export const POST = (request: Request) => handleLead(request, { TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID, RELAY_URL: process.env.RELAY_URL, RELAY_SECRET: process.env.RELAY_SECRET });
