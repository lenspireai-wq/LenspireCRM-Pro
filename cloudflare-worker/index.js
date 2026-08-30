import apiWorker from '../index.js';
import { DESKTOP_HTML, DESKTOP_CSS, DESKTOP_APP_JS, WEB_BRIDGE_JS, CHART_JS, XLSX_JS, LOGIN_HERO_PNG, APP_ICON_PNG, WEB_RENDERER_VERSION } from './desktop-bundle.generated.js';

const headers = (type, cache = 'public, max-age=31536000, immutable') => ({
  'content-type': type,
  'cache-control': cache,
  'x-content-type-options': 'nosniff',
  'x-lenspire-web-renderer': WEB_RENDERER_VERSION
});
const decodeBase64 = value => {
  const bytes = Uint8Array.from(atob(value), character => character.charCodeAt(0));
  return bytes.buffer;
};
const WEB_MANIFEST = JSON.stringify({
  name: 'LenspireCRM · Studio Workspace',
  short_name: 'LenspireCRM',
  description: 'Photography studio CRM for sales, operations, accounts and post production.',
  id: '/app',
  start_url: '/app',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  background_color: '#080d15',
  theme_color: '#0b1220',
  icons: [
    { src:'/icons/icon-192.png', sizes:'192x192', type:'image/png', purpose:'any maskable' },
    { src:'/icons/icon-512.png', sizes:'512x512', type:'image/png', purpose:'any maskable' }
  ]
});
const WEB_SERVICE_WORKER = `
const CACHE = 'lenspirecrm-web-${WEB_RENDERER_VERSION}';
const CORE = ['/app','/desktop-style.css','/desktop-app.js','/web-bridge.js','/desktop-chart.js','/desktop-xlsx.js','/login-studio-camera-v2.png','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await Promise.allSettled(CORE.map(url => cache.add(new Request(url, { cache:'reload' }))));
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith('lenspirecrm-') && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/app')));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreSearch:true }).then(cached => cached || fetch(event.request)));
});`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'GET') {
      if (url.pathname === '/') return Response.redirect(new URL('/app', url), 302);
      if (url.pathname === '/mobile') return Response.redirect(new URL('/app', url), 302);
      if (url.pathname === '/app' || url.pathname === '/app/') return new Response(DESKTOP_HTML, { headers:headers('text/html; charset=utf-8','no-store') });
      if (url.pathname === '/desktop-style.css') return new Response(DESKTOP_CSS, { headers:headers('text/css; charset=utf-8') });
      if (url.pathname === '/desktop-app.js') return new Response(DESKTOP_APP_JS, { headers:headers('text/javascript; charset=utf-8') });
      if (url.pathname === '/web-bridge.js') return new Response(WEB_BRIDGE_JS, { headers:headers('text/javascript; charset=utf-8') });
      if (url.pathname === '/desktop-chart.js') return new Response(CHART_JS, { headers:headers('text/javascript; charset=utf-8') });
      if (url.pathname === '/desktop-xlsx.js') return new Response(XLSX_JS, { headers:headers('text/javascript; charset=utf-8') });
      if (url.pathname === '/login-studio-camera-v2.png') return new Response(decodeBase64(LOGIN_HERO_PNG), { headers:headers('image/png') });
      if (url.pathname === '/manifest.webmanifest') return new Response(WEB_MANIFEST, { headers:headers('application/manifest+json; charset=utf-8','no-cache') });
      if (url.pathname === '/sw.js') return new Response(WEB_SERVICE_WORKER, { headers:{...headers('text/javascript; charset=utf-8','no-cache'),'service-worker-allowed':'/'} });
      if (url.pathname === '/icons/icon-192.png' || url.pathname === '/icons/icon-512.png' || url.pathname === '/favicon.ico') return new Response(decodeBase64(APP_ICON_PNG), { headers:headers('image/png') });
    }
    return apiWorker.fetch(request, env, ctx);
  }
};
