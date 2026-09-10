# Webapp audit — 8 September 2026

Verdict: the local webapp cannot currently be verified as fully working. The frontend starts and passes TypeScript checking, but the backend environment cannot initialize and there are confirmed frontend defects. This audit covers the current local working tree, including pre-existing uncommitted changes; it does not certify a deployed site.

## Checks

| Check | Result |
| --- | --- |
| Frontend `npm run typecheck` | Passed, exit code 0 |
| Next.js development startup | Started successfully |
| Local frontend HTTP response | HTTP 200 after initial compilation; first request timed out at 45 seconds |
| Backend `python manage.py check` | Failed: missing `drf_spectacular` |
| Backend Django workflow tests | Blocked by the same import failure; tests did not execute |
| Backend pytest | Could not run: pytest is missing from available Python |
| Backend virtual environment | Cannot launch: configured Python executable belongs to an old Windows user path |
| Frontend lint | Passed, exit code 0; 173 warnings and 0 errors |
| Browser inspection | Browser automation timed out twice; no visual or authenticated browser validation established |
| Rate-limit retry reproduction | Failed: eight attempts observed despite an intended maximum of six total requests |

## Findings

### High: backend cannot initialize in the available local environment

`backend/.venv/Scripts/python.exe` references a missing Python 3.12 installation. The available Python 3.14 installation imports Django but fails to initialize installed applications because `drf_spectacular` is missing. The API health endpoint at port 8000 was unreachable. Restore a working project environment and install the declared runtime and test dependencies before validating login, sales, payments, operations, and production workflows.

### Medium: rate-limit retries are not bounded as intended

`frontend/lib/api.ts:101` tracks attempts in a WeakMap keyed by the Axios request config. Axios creates another config object on each retry, so the retry counter is lost. A local probe executed the current interceptor with a mocked adapter and immediate timers; it reached eight requests before the probe forcibly stopped it. No network requests were sent. Keep the retry count on a preserved config property or another stable identifier. Repeated HTTP 429 responses can otherwise keep a request pending indefinitely.

### Medium: password recovery control does nothing

`frontend/app/page.tsx:214` renders a `Forgot password?` button without an event handler or navigation target. Users cannot start account recovery from this control.

### Medium: Remember me does not control persistence

The checkbox in `frontend/app/page.tsx` is not connected to state or submitted data. `frontend/stores/auth.ts` always uses persisted Zustand storage for the access token, refresh token, and user. Unchecking the control does not disable session persistence.

### Medium: browser-test authentication setup is inconsistent

`frontend/scripts/run-backend-for-e2e.mjs` seeds an admin account, while `frontend/e2e/global-setup.ts` signs in with a different account. `frontend/e2e/auth.spec.ts` uses yet another password for the admin account. Global setup also swallows a missing-sidebar timeout and saves storage regardless of login success. Consequently, clean test runs cannot reliably establish an authenticated session. Align fixture credentials and assert successful login before saving storage.

## Scope limitations

No deployed URL was provided. Production build, real sign-in, role permissions, CRUD, uploads, exports, backup/restore, responsive behavior, and cross-browser operation were not verified. Existing database records and application source were not edited. The temporary retry probe was removed after execution.

Recommended order: restore backend dependencies, fix the retry and login-control defects, align test authentication, then run isolated API and browser workflow tests before declaring the application ready.
