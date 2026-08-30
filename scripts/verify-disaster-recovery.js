const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const Database = require('better-sqlite3');
const { decryptPayload, isEncryptedPayload } = require('../src/main/backup-crypto');

function encryptedFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(target, entry.name);
    return entry.isDirectory() ? encryptedFiles(child) : (/\.(lenspirebackup|lenspirearchive)$/i.test(entry.name) ? [child] : []);
  });
}

function collectionCounts(payload) {
  const names = ['users', 'leads', 'customers', 'bookings', 'production', 'events', 'payments', 'activities', 'salesTargets', 'photographers', 'productionActivities', 'clientPortalAccess', 'clientPortalAccessLog'];
  return Object.fromEntries(names.filter((name) => Array.isArray(payload?.[name])).map((name) => [name, payload[name].length]));
}

function rehearseSqlite(payload, rehearsalRoot) {
  if (payload?.format !== 'LenspireCRM-Pro-Backup' || payload?.version !== 1 || typeof payload.database !== 'string') {
    throw new Error('Desktop backup structure is incomplete.');
  }
  const databasePath = path.join(rehearsalRoot, 'restored-workspace.db');
  fs.writeFileSync(databasePath, Buffer.from(payload.database, 'base64'));
  const candidate = new Database(databasePath, { readonly: true, fileMustExist: true });
  try {
    const tables = candidate.prepare("select name from sqlite_master where type='table'").all().map((row) => row.name);
    for (const required of ['leads', 'users']) if (!tables.includes(required)) throw new Error(`Restored database is missing ${required}.`);
    if (candidate.pragma('integrity_check', { simple: true }) !== 'ok') throw new Error('Restored SQLite database failed integrity_check.');
    const counts = Object.fromEntries(['users', 'leads'].map((table) => [table, Number(candidate.prepare(`select count(*) as count from ${table}`).get().count)]));
    return { kind: payload.format, sqliteIntegrity: 'ok', tables: tables.length, counts };
  } finally {
    candidate.close();
  }
}

function rehearseCloud(payload) {
  const required = ['leads', 'customers', 'bookings', 'production', 'events', 'payments', 'activities', 'salesTargets', 'photographers'];
  for (const name of required) if (!Array.isArray(payload?.[name])) throw new Error(`Cloud restore rehearsal is missing ${name}.`);
  const restored = JSON.parse(JSON.stringify(Object.fromEntries(required.map((name) => [name, payload[name]]))));
  return { kind: payload.kind, collections: collectionCounts(restored), jsonRoundTrip: 'ok' };
}

function verifyPayload(payload, rehearsalRoot) {
  if (payload?.kind === 'lenspirecrm-sensitive-file-archive') {
    if (!Array.isArray(payload.files) || !payload.files.length) throw new Error('Sensitive archive contains no files.');
    let bytes = 0;
    for (const item of payload.files) {
      const content = Buffer.from(item.data || '', 'base64');
      const digest = crypto.createHash('sha256').update(content).digest('hex');
      if (content.length !== Number(item.bytes) || digest !== item.sha256) throw new Error(`Archived file integrity failed: ${item.name || 'unnamed file'}`);
      const stagedPath = path.join(rehearsalRoot, path.basename(item.name || 'archived-file'));
      fs.writeFileSync(stagedPath, content);
      const stagedDigest = crypto.createHash('sha256').update(fs.readFileSync(stagedPath)).digest('hex');
      if (stagedDigest !== item.sha256) throw new Error(`Staged restore checksum failed: ${item.name || 'unnamed file'}`);
      bytes += content.length;
    }
    return { kind: payload.kind, files: payload.files.length, bytes, stagedRestore: 'ok' };
  }
  if (!payload || typeof payload !== 'object' || (!payload.format && !payload.kind && !payload.database && !Array.isArray(payload.leads))) {
    throw new Error('Decrypted content is not a recognized LenspireCRM backup.');
  }
  if (payload.kind === 'lenspirecrm-cloud-backup') return rehearseCloud(payload);
  return rehearseSqlite(payload, rehearsalRoot);
}

const passwordEntry = Object.entries(process.env).find(([key]) => key.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === 'LENSPIREBACKUPPASSWORD');
const password = passwordEntry?.[1] || '';
const targetArg = process.argv[2];

if (!targetArg || password.length < 12) {
  console.error('Usage: set LENSPIRE_BACKUP_PASSWORD, then run: node scripts/verify-disaster-recovery.js <encrypted-file-or-folder>');
  process.exitCode = 2;
} else {
  const files = encryptedFiles(path.resolve(targetArg));
  let failures = 0;
  for (const file of files) {
    const rehearsalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lenspire-dr-'));
    try {
      const envelope = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!isEncryptedPayload(envelope)) throw new Error('File is not an encrypted LenspireCRM envelope.');
      const summary = verifyPayload(decryptPayload(envelope, password), rehearsalRoot);
      console.log(`rehearsed\t${file}\t${JSON.stringify(summary)}`);
    } catch (error) {
      failures += 1;
      console.error(`failed\t${file}\t${error.message}`);
    } finally {
      fs.rmSync(rehearsalRoot, { recursive: true, force: true });
    }
  }
  console.log(`dr-summary\trehearsed=${files.length - failures}\tfailed=${failures}\ttotal=${files.length}\tproductionWrites=0\ttemporaryDataRemoved=true`);
  if (!files.length || failures) process.exitCode = 1;
}
