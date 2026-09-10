# Local availability audit — 8 September 2026

## Outcome

Neither port 3000 nor 8000 had a listener at the beginning of this audit. Started Next.js on 127.0.0.1:3000 and Django on 127.0.0.1:8000. Both now return HTTP 200 (frontend root and API /api/health/). Browser verification reaches the sign-in page. These development processes must remain running.

## Findings

1. **High — broken backend launch environments.** Both backend/.venv and backend/.venv-local reference Python installations under other Windows users. Executing .venv-local fails because its interpreter is missing. start-backend.bat uses .venv; the README uses .venv-local. Neither is a reliable startup route on this machine. The current system Python 3.12.10 successfully initializes Django and was used to restore the API. Recreate a project virtual environment with the current interpreter and align the launcher and README.
2. **Medium — misleading dashboard during API outage.** Browser inspection while port 8000 was offline showed an existing stored user session, zero leads and sales, and empty-state messages without a visible API failure banner. After restoring the API and reloading, the browser reached sign-in. Zero values during an outage should not imply actual business totals.
3. **Medium — rate-limit retry counter is unstable.** frontend/lib/api.ts:15 and :101 keep retry state in a WeakMap keyed by the Axios config. Retried requests receive a merged config, so the five-retry cap can lose its counter. This mechanism remains in the current code; the earlier audit records a mocked reproduction. This audit confirmed the source, but did not rerun that reproduction.
4. **Medium — password recovery does nothing.** frontend/app/page.tsx:214 renders a button with no handler or navigation target.
5. **Medium — Remember me does not control persistence.** frontend/app/page.tsx:212 renders an uncontrolled checkbox, while frontend/stores/auth.ts always persists the session. Unchecking it does not change token persistence.
6. **Medium — browser-test authentication fixtures disagree.** frontend/scripts/run-backend-for-e2e.mjs creates an admin fixture, while frontend/e2e/global-setup.ts signs in as another user. Setup also swallows the sidebar timeout and saves state without establishing successful login.

## Verification

- Frontend TypeScript: passed.
- Frontend ESLint: passed with 173 warnings, zero errors.
- System Python: Django system check passed with zero issues.
- Migration check: passed; no pending migrations reported.
- HTTP: frontend root and backend health both 200.
- Browser: frontend renders; final state is the sign-in page.

## Scope

Availability and focused source/configuration audit only. No fresh authenticated workflow, production build, dependency vulnerability scan, role authorization, CRUD, payments, uploads, backup/restore, or responsive coverage was completed. Application code and customer data were not edited. Existing uncommitted changes and the earlier audit were preserved. The frontend and API were left running for local use.
