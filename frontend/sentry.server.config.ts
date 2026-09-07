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
        beforeSend(event, hint) {
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
      });
    })
    .catch(() => undefined);
})();
