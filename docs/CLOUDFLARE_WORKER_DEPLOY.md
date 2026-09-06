# Cloudflare Worker Deployment Guide

## Prerequisites

- Cloudflare account with Workers access
- Wrangler CLI installed (`npm install -g wrangler` or use `npx wrangler`)
- Logged in: `wrangler login`

## Required Secrets

Set these secrets using `wrangler secret put`. **Never** commit secret values to git.

```bash
cd F:\LenspireCRM-Pro\cloudflare-worker

# JWT signing secret (>= 32 chars, strong random)
npx wrangler secret put JWT_SECRET

# Google Drive OAuth2 client credentials
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

# 32-char key for encrypting Google Drive refresh tokens in database
npx wrangler secret put DRIVE_TOKEN_KEY

# 32-char key for encrypting auto-backup data (strongly recommended)
npx wrangler secret put BACKUP_ENCRYPTION_KEY

# Recovery/owner-password-reset token (>= 48 bytes, Base64URL)
npx wrangler secret put SETUP_TOKEN
```

## Optional: Local Development

Create `.dev.vars` in `cloudflare-worker/` for local testing:

```bash
cd F:\LenspireCRM-Pro\cloudflare-worker
cp .dev.vars.example .dev.vars  # if example exists
# Edit .dev.vars with your local test values
```

## Deploy

```bash
cd F:\LenspireCRM-Pro\cloudflare-worker

# Dry run / validate
npx wrangler deploy --dry-run

# Production deploy
npx wrangler deploy
```

## Post-Deploy Verification

1. Test the worker endpoint:
   ```bash
   curl https://lenspirecrm-api.lenspireai.workers.dev/api/health
   ```

2. Verify database connection (Hyperdrive binding `CRM_DB`):
   ```bash
   curl https://lenspirecrm-api.lenspireai.workers.dev/api/health
   ```

3. Check Cloudflare dashboard for:
   - Worker status: `lenspirecrm-api`
   - Secrets are set (values hidden)
   - Hyperdrive binding `CRM_DB` is connected
   - R2 bucket `STUDIO_ASSETS` is bound
   - Cron trigger `0 2 * * *` is active

## Rollback

If issues arise, rollback from Cloudflare dashboard:
1. Workers → `lenspirecrm-api`
2. Select previous version
3. Click "Rollback"

## Environment Variables (Non-Secret)

These are set in `wrangler.toml` under `[vars]`:
- `PORTAL_DOMAIN = "portal.lenspireai.com"`

To override for staging, create `wrangler.staging.toml`:
```toml
name = "lenspirecrm-api-staging"
[vars]
PORTAL_DOMAIN = "portal-staging.lenspireai.com"
```

Then deploy with: `npx wrangler deploy --config wrangler.staging.toml`
