# P2 production release gate

Run these checks after migrations and before approving a Worker release.

## Automated non-destructive smoke suite

Use a short-lived platform-owner access token:

```powershell
$env:LENSPIRE_OWNER_ACCESS_TOKEN = '<short-lived token>'
npm.cmd run smoke:production
Remove-Item -LiteralPath 'Env:LENSPIRE_OWNER_ACCESS_TOKEN' -ErrorAction SilentlyContinue
```

Alternatively, set `LENSPIRE_SMOKE_USERNAME` and `LENSPIRE_SMOKE_PASSWORD` only
for the current shell. The runner signs in, keeps the resulting token in memory,
and clears its local reference before exiting. Never place credentials in a
file, command history, source control, or CI logs.

The suite verifies:

- public API and database health;
- platform-owner authentication;
- tenant-scoped workspace access;
- current schema migration version;
- validated tenant relationship constraints;
- zero detected cross-tenant relationships for customers, bookings,
  production jobs, client portals, and file metadata;
- Cloudflare object-storage binding availability;
- file metadata and client-portal schema readiness.

This suite performs no production writes. Actual file uploads, portal creation,
and two-tenant mutation tests belong to a separately authorized disposable-data
rehearsal with explicit cleanup and rollback steps.

## Rollback-only two-tenant write rehearsal

The owner-only `POST /api/platform/tenant-rehearsal` route creates two temporary
organizations and representative lead, customer, booking, portal, and file
metadata records inside one database transaction. It verifies that composite
tenant foreign keys reject cross-tenant writes and that tenant-scoped reads,
updates, and deletes cannot reach the other tenant.

The handler then deliberately throws its rollback sentinel. After rollback it
queries for residual rehearsal organizations and reports success only when the
count is zero. It never uploads a real file and never commits rehearsal data.

## Release command and rollback evidence

- `npm run release:local-check` rebuilds the web bundle, runs all tests, checks
  the active Worker version, hashes release inputs, and writes a non-deploying
  evidence record.
- `npm run release:check` adds the authenticated production smoke suite but does
  not deploy.
- `npm run release:production` runs the complete pre-deploy gate, deploys, and
  reruns production smoke checks.

Each attempt writes an immutable JSON file under `release-records`. A deployment
that fails its post-deploy smoke test stops and prints the exact Wrangler command
for rolling back to the previously active version. Rollback is intentionally
manual so an operator reviews the failure and target version before changing
production traffic.
