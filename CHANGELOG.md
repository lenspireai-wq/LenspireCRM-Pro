# Changelog

All notable changes to LenspireCRM Pro are documented here.
Entries are grouped by release and sourced from code and release records.

## [1.0.21] - 2026

### Desktop (Electron + SQLite)
- Department-scoped access control for Sales, Operations, Accounts, and Post Production.
  Non-administrator users can be granted `full`, `view`, or `none` per department
  (`src/database/db.js`, `src/main/main.js`).
- Password-protected, AES-256-GCM encrypted backups (`src/main/backup-crypto.js`).
  Legacy plaintext backups require the migration script (`scripts/migrate-legacy-backups.js`).
- Encrypted offline workspace cache and per-account credentials via Windows DPAPI
  (`safeStorage`) (`src/main/main.js`).
- Offline event queue: calendar edits made while the Cloud is unreachable are queued
  locally and replayed on reconnect (`flushOfflineEventQueue`).
- Quotation attachments stored alongside the workspace and restored transactionally.

### Cloud (Cloudflare Worker)
- Organization/tenant isolation with composite foreign keys and advisory locks
  (`index.js`).
- Owner-only platform routes for organizations, schema migrations, smoke tests,
  and tenant-isolation rehearsal (`scripts/migrate:cloud`, `scripts/smoke:production`).
- Client Portal links with expiry, revocation, access audit, and automatic delivery
  closure (`index.js` client_portal routes).
- Google Drive integration for quotation upload/list/download.

### Web / PWA
- Browser client mirrored from the Windows renderer via
  `scripts/build-web-renderer.js` and the `cloudflare-worker/` wrapper.
- Service worker caching with versioned cache name (`lenspirecrm-web-v5`).

### Security
- Bearer and refresh tokens kept in memory only; never persisted to disk or
  localStorage/sessionStorage for auth secrets (`src/main/main.js`,
  `cloudflare-worker/web-bridge.js`).
- 12–128 character password policy enforced for creation/reset
  (`src/database/db.js`).
- Legacy `admin`/`admin` bootstrap credential invalidated on upgrade.
- HttpOnly, Secure, SameSite=Strict cookies for web auth.

## [Unreleased]

- See `release-records/` JSON files for per-version build status and evidence.
