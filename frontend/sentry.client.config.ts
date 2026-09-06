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
          }
          return event;
        },
      });
    }),
  ]).catch(() => undefined);
})();
