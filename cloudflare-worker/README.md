# LenspireCRM Cloud Worker

This folder is the controlled home for the Cloudflare Worker source used by
LenspireCRM. It must be the only source used for future Worker deployments.

## Current position

The production Worker was previously maintained only in Cloudflare Quick Edit.
The active source snapshot is stored at `../index.js` and linked by
`wrangler.toml`. Do not replace production with an old attachment
or a partial source file: it could remove existing CRM routes.

## Recovery checklist

1. In Cloudflare Workers, open **lenspirecrm-api** and select the active latest
   version.
2. Replace `../index.js` only after taking a new complete snapshot of the
   active production Worker.
3. Add the matching `wrangler.toml` bindings for `CRM_DB`, `JWT_SECRET`, Google
   Drive secrets, and any other current bindings. Secrets must be added through
   Cloudflare, never written into this repository.
4. Run local Worker checks before deploying.
5. Deploy from this folder with Wrangler, not Quick Edit.

## Existing production state to preserve

- Organization-based tenant isolation
- `platform_admins` owner authorization
- `organization_profiles` status, plan, expiry, and license fields
- Existing lead, calendar, payments, operations, and production routes

## Safe deployment rule

Every Worker change must be made locally, reviewed, tested, and then deployed
as a new version. Keep the prior deployed version available for rollback.

## Versioned database migrations

Production requests perform read-only schema readiness checks and never create
or alter database objects. Schema changes run through the owner-only migration
endpoint and are serialized with a PostgreSQL advisory transaction lock.

1. Sign in as a registered LenspireCRM platform owner and obtain a short-lived
   access token without saving it to disk.
2. Set that value only for the current shell as `LENSPIRE_OWNER_ACCESS_TOKEN`.
3. Run `npm run migrate:cloud` from the repository root.
4. Confirm the reported schema version before deploying code that depends on
   the migration, then remove the environment variable from the shell.

The command is idempotent. Applied versions are recorded in
`schema_migrations`; ordinary requests return HTTP 503 with
`schema_migration_required` if required schema is unavailable.
