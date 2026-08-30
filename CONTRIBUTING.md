# Contributing to LenspireCRM Pro

## Prerequisites
- Node.js LTS (>= 20) with `npm`.
- Windows for the desktop (Electron) build; the web/PWA branch runs anywhere.
- `npx wrangler` is required only for Cloudflare Worker deployments.

## Development setup

```powershell
npm.cmd install
npm.cmd run check          # node --check syntax validation across main, db, renderer
npm.cmd test               # node --test test/*.test.js (security + mapper + crypto tests)
npm.cmd start              # launch the Electron dev app
```

## Running the full local release check

```powershell
npm.cmd run release:local-check
```

This rebuilds the web bundle, runs all tests, checks the active Worker version,
hashes release inputs, and writes a non-deploying evidence record to
`release-records/`. It performs no production writes.

## Code style
- The codebase is plain JavaScript (no TypeScript or ESLint configuration).
  New code should match the surrounding style (2-space indentation, single quotes,
  no semicolons in renderer code).
- Do **not** commit databases, backups, environment files, build outputs,
  private keys, or the bundled `index.js` worker artifact. See `.gitignore`.

## Security
- Report vulnerabilities privately. See `SECURITY.md`.
- Never store real secrets, tokens, or customer data in issues or PRs.
- Review `cloudflare-worker/P2-RELEASE-GATE.md` before any Worker change.
