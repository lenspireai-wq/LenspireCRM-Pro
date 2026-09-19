const WEB_ORIGIN = "http://crm-origin.lenspireai.com:8080";
// Cloudflare Workers can reliably reach the public CRM proxy on port 8080.
// The Next.js proxy forwards /api requests privately to Django on port 8000.
const API_ORIGIN = WEB_ORIGIN;

function originFor(pathname) {
  return pathname.startsWith("/api/") ? API_ORIGIN : WEB_ORIGIN;
}

function rewriteLocation(value, origin, publicOrigin) {
  return value.startsWith(origin) ? value.replace(origin, publicOrigin) : value;
}

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const origin = originFor(incomingUrl.pathname);
    const upstreamUrl = new URL(incomingUrl.pathname + incomingUrl.search, origin);
    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.set("X-Forwarded-Host", incomingUrl.host);
    headers.set("X-Forwarded-Proto", "https");
    headers.set("X-Forwarded-For", request.headers.get("CF-Connecting-IP") || "");

    const upstreamRequest = new Request(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual"
    });
    const upstreamResponse = await fetch(upstreamRequest);
    const responseHeaders = new Headers(upstreamResponse.headers);
    const location = responseHeaders.get("location");

    if (location) {
      responseHeaders.set("location", rewriteLocation(location, origin, incomingUrl.origin));
    }
    responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  }
};
