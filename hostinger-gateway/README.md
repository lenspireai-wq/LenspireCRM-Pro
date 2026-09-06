# Hostinger CRM gateway

This directory is the deployable document root for `crm.lenspireai.com` on a
Hostinger PHP website. It preserves Hostinger as the authoritative DNS provider
and forwards browser and API traffic to the existing Cloudflare Worker.

The gateway has a fixed upstream and does not store CRM credentials or data.
Do not add secrets to this directory.

Configuration:

- `LENSPIRE_WEB_UPSTREAM` — upstream for web traffic, e.g. `http://<web-ip-or-host>:8080`
- `LENSPIRE_API_UPSTREAM` — upstream for `/api/*` traffic, e.g. `http://<api-ip-or-host>:8000`

Set these in the Hostinger environment or via a local `.env`-style override. If
unset, the gateway falls back to the current production IPs.

Deployment gate:

1. Upload `index.php` and `.htaccess` to the subdomain document root.
2. Set `LENSPIRE_WEB_UPSTREAM` and `LENSPIRE_API_UPSTREAM` in the Hostinger
   environment if the VPS IP/host changes.
3. Confirm HTTPS is active for `crm.lenspireai.com`.
4. Verify `/app`, `/manifest.webmanifest`, `/sw.js`, and the read-only health
   endpoint before using production credentials.
5. Run the production smoke test against `https://crm.lenspireai.com`.
6. Keep the `workers.dev` endpoint enabled as the rollback target.

