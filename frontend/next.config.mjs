/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : " 'unsafe-inline'"}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https:${isDev ? " http:" : ""}`,
  "font-src 'self' data:",
  "connect-src 'self' http: https: ws: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

if (!isDev) {
  securityHeaders.push(
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  );
}

const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.0.109", "192.168.1.6"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Django's API endpoints use trailing slashes.  The catch-all parameter
        // omits the original final slash, so add it back before proxying.
        destination: `${process.env.API_INTERNAL_URL || (isDev ? "http://127.0.0.1:8000/api" : "http://api:8000/api")}/:path*/`,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/reset-mobile-cache",
        headers: [
          { key: "Clear-Site-Data", value: '"cache", "storage"' },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Service-Worker-Allowed", value: "/" }] },
      { source: "/manifest.webmanifest", headers: [{ key: "Cache-Control", value: "no-cache" }] },
    ];
  },
};
export default nextConfig;
