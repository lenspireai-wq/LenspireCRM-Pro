# Hostinger CRM gateway

This directory is the deployable document root for `crm.lenspireai.com` on a
Hostinger PHP website. It preserves Hostinger as the authoritative DNS provider
and forwards browser and API traffic to the existing Cloudflare Worker.

The gateway has a fixed upstream and does not store CRM credentials or data.
Do not add secrets to this directory.

Deployment gate:

1. Upload `index.php` and `.htaccess` to the subdomain document root.
2. Confirm HTTPS is active for `crm.lenspireai.com`.
3. Verify `/app`, `/manifest.webmanifest`, `/sw.js`, and the read-only health
   endpoint before using production credentials.
4. Run the production smoke test against `https://crm.lenspireai.com`.
5. Keep the `workers.dev` endpoint enabled as the rollback target.

