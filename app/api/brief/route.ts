import { handleBrief } from '@/lib/server/brief';
export const POST = (request: Request) => handleBrief(request, { OPENAI_API_KEY: process.env.OPENAI_API_KEY, OPENAI_MODEL: process.env.OPENAI_MODEL, RELAY_URL: process.env.RELAY_URL, RELAY_SECRET: process.env.RELAY_SECRET });
