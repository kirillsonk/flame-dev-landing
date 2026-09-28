import { handleBrief } from '@/lib/server/brief';
import { handleLead } from '@/lib/server/lead';
import { json, type IServerEnv } from '@/lib/server/http';
interface ISiteEnv extends IServerEnv { ASSETS: { fetch(request: Request): Promise<Response> } }

const worker = {
  async fetch(request: Request, env: ISiteEnv) {
    const url = new URL(request.url);
    const route = url.pathname.replace(/\/$/, '') || '/';
    if (route === '/api/brief' || route === '/api/lead') {
      if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      return route === '/api/brief' ? handleBrief(request, env) : handleLead(request, env);
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
    if (!route.split('/').pop()?.includes('.')) {
      const extension = request.headers.get('rsc') === '1' ? '.txt' : '.html';
      url.pathname = route === '/' ? `/index${extension}` : `${route}${extension}`;
    }
    const result = await env.ASSETS.fetch(new Request(url, request));
    if (result.status !== 404 || url.pathname.startsWith('/_next/')) return result;
    url.pathname = '/404.html';
    const missing = await env.ASSETS.fetch(new Request(url, request));
    return new Response(missing.body, { status: 404, headers: missing.headers });
  },
};

export default worker;
