// Sentry configuration for client and server runtime errors. Safe to omit SENTRY_DSN locally.
(() => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  Promise.all([
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.init({
        dsn,
        tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_SAMPLE_RATE ?? 0.1),
        environment: process.env.NODE_ENV,
        beforeSend(event) {
          if (event.request?.headers) {
            delete event.request.headers.Authorization;
            delete event.request.headers.Cookie;
          }
          if (event.user) {
            delete event.user.email;
            delete event.user.ip_address;
          }
          return event;
        },
        beforeSendTransaction(event) {
          if (event.request?.headers) {
            delete event.request.headers.Authorization;
            delete event.request.headers.Cookie;
          }
          return event;
        },
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          'Network request failed',
          'Failed to fetch',
          'Load failed',
          'Non-Error promise rejection captured',
          'ChunkLoadError',
          /ChunkLoadError/,
        ],
      });
    }),
  ]).catch(() => undefined);
})();
