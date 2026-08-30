# LenspireCRM Production Recovery

## Recovery ownership

- Store `SETUP_TOKEN` only in the approved password manager.
- Never place the token in source files, `.env` files, tickets, chat, screenshots, or backup filenames.
- Restrict Cloudflare account access and the password-manager entry to authorized platform owners.

## Rotate the recovery token

Generate at least 48 random bytes, encode them as Base64URL, store the value in the password manager, and upload it with:

```powershell
npx.cmd wrangler secret put SETUP_TOKEN
```

Run the command from `cloudflare-worker`. Never pass the token as a command-line argument.

## Non-destructive authorization test

Send an empty JSON body to `/api/auth/reset-password` with the token in `x-setup-token`. Expected result:

- HTTP `400`
- Error begins with `Username is required`
- No user or password is changed

HTTP `403` means the token is missing or incorrect.

## Emergency owner password reset

Use only after verifying the requester and confirming normal administrator recovery is unavailable. Submit the exact owner username and a new unique 12–128 character password containing uppercase, lowercase, number, and symbol. After reset:

1. Confirm the owner can sign in.
2. Confirm platform-owner access.
3. Confirm all previous refresh sessions were revoked.
4. Rotate `SETUP_TOKEN` again because it was used for a sensitive recovery action.
5. Record the recovery event without recording either secret.

## Monitoring

- Cloudflare notification: `LenspireCRM operational errors`
- Delivery: verified Cloudflare account email
- Codex health monitor: API and database checks every 15 minutes
- Owner endpoints: `/api/platform/operations`, `/api/platform/production-readiness`, and `/api/platform/tenant-integrity`

## Eventual token removal

Remove `SETUP_TOKEN` only after a separate owner-recovery mechanism has been implemented, tested, and documented. After removal, verify that `/api/setup` and `/api/auth/reset-password` reject recovery requests while normal sign-in remains healthy.
