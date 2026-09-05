// Sentry server-side configuration. Loaded automatically by @sentry/nextjs.
(() => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.init({
        dsn,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
        environment: process.env.NODE_ENV,
      });
    })
    .catch(() => undefined);
})();
