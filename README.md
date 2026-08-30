# LenspireCRM Pro

Electron and SQLite CRM for photography-studio sales, operations, accounts, and post-production workflows.

## Development

```powershell
npm.cmd install
npm.cmd run check
npm.cmd test
npm.cmd start
```

Create an unpacked release with `npm.cmd run pack` and an installer with `npm.cmd run dist`.

## Security and data

- Cloud access and refresh tokens stay in memory and are cleared at sign-out or application exit.
- Databases, backups, and quotation attachments contain sensitive customer and financial information. Never commit them.
- New backup files are always password-encrypted. Existing unencrypted backups must be migrated or securely destroyed.
- Backup creation and restore currently require the desktop app; browser backup handling is disabled until encrypted browser export is implemented.
- Migrate legacy plaintext backups non-destructively by setting `LENSPIRE_BACKUP_PASSWORD` and running `npm run migrate:backups -- <file-or-folder>`. Verified encrypted copies are written separately; originals are retained.
- Normal authentication is provided by LenspireCRM Cloud. Fresh local databases do not use a known administrator password.
- Sign and timestamp production installers using the standard electron-builder CSC environment variables.

## Release checklist

1. Run `npm.cmd run check`, `npm.cmd test`, and `npm.cmd audit --omit=dev`.
2. Test sign-in, all department roles, imports, exports, backup, and restore using test data.
3. Build with the organization’s Windows code-signing certificate.
4. Install on a clean Windows VM and verify signature details, database creation, cloud sync, and uninstall.
5. Never distribute `src/database/tracker.db` if it contains real customer or reusable credential data.
