"use client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { boundary: "global-error" } });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main
          className="globalError"
          role="alert"
          aria-live="assertive"
        >
          <div className="globalErrorCard">
            <span className="globalErrorEyebrow">Unexpected error</span>
            <h1>Something went wrong.</h1>
            <p>
              The application hit an unrecoverable error. The team has been
              notified automatically. You can try again, or reload the page.
            </p>
            {error.digest ? (
              <p className="globalErrorDigest">
                Reference: <code>{error.digest}</code>
              </p>
            ) : null}
            <div className="globalErrorActions">
              <button type="button" className="loginSubmit" onClick={() => reset()}>
                Try again
              </button>
              <button
                type="button"
                className="btnSecondary"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Reload workspace
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
