# End-to-end tests (Playwright)

This directory contains end-to-end tests that drive the running web app in a
real browser. They protect the critical paths: sign in, sign out, and the
Audit workspace.

## Running

```bash
npm run test:e2e        # headless run
npm run test:e2e:ui     # open the Playwright inspector
```

The tests assume the dev servers are already running:

- Web: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:8000`

Override with `PLAYWRIGHT_WEB_URL` / `PLAYWRIGHT_API_URL` if needed.

## How it works

- `global-setup.ts` signs in once as `admin` and saves the browser storage to
  `e2e/.auth/admin.json`. Every test reuses that session so the login
  endpoint is only hit once per run.
- `playwright.config.ts` reuses any running dev server (`reuseExistingServer: true`).
- We launch the locally-installed Google Chrome via `channel: "chrome"` — no
  Playwright browser download is required for the chromium project.

## Throttle note

The login endpoint is rate-limited to 5/minute. If you re-run the suite
inside the throttle window, set `LOGIN_THROTTLE_RATE=1000/minute` in the
environment of the Django process before re-running.

```bash
LOGIN_THROTTLE_RATE=1000/minute npm run test:e2e
```

## Adding a new test

1. Put the spec under `e2e/`.
2. Reuse the stored session by **not** navigating through the login form.
   If a test needs to log out, call `signOut` and then `clearCookies` +
   `localStorage.clear` before the next test (see `auth.spec.ts`).
3. Avoid selectors tied to implementation details. Prefer `getByRole` /
   `getByLabel` / data attributes that already exist in the UI.
4. The tests run against live demo data. Be conservative about creating
   leads / payments in tests — pick a `playwright_test_*` prefix so the
   seed data is recognisable.
