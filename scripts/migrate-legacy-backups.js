const fs = require('fs');
const path = require('path');
const { encryptPayload, decryptPayload, isEncryptedPayload } = require('../src/main/backup-crypto');

function usage() {
  console.error('Usage: set LENSPIRE_BACKUP_PASSWORD, then run: node scripts/migrate-legacy-backups.js <file-or-folder> [output-folder]');
  process.exitCode = 2;
}

function backupFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes:true }).flatMap(entry => {
    const child = path.join(target, entry.name);
    return entry.isDirectory() ? backupFiles(child) : (/\.lenspirebackup$/i.test(entry.name) ? [child] : []);
  });
}

function migrate(source, outputRoot, password) {
  const raw = JSON.parse(fs.readFileSync(source, 'utf8'));
  if (isEncryptedPayload(raw)) return { source, status:'already-encrypted' };
  if (!raw || typeof raw !== 'object' || (!raw.format && !raw.kind && !raw.database && !Array.isArray(raw.leads))) {
    throw new Error('File is not a recognized LenspireCRM backup.');
  }
  const name = path.basename(source, path.extname(source)) + '.encrypted.lenspirebackup';
  const destination = path.join(outputRoot, name);
  if (fs.existsSync(destination)) throw new Error(`Encrypted destination already exists: ${destination}`);
  fs.mkdirSync(outputRoot, { recursive:true });
  const encrypted = encryptPayload(raw, password);
  const temporary = destination + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(encrypted));
  const verified = decryptPayload(JSON.parse(fs.readFileSync(temporary, 'utf8')), password);
  if (JSON.stringify(verified) !== JSON.stringify(raw)) {
    fs.rmSync(temporary, { force:true });
    throw new Error('Encrypted backup verification failed.');
  }
  fs.renameSync(temporary, destination);
  return { source, destination, status:'migrated' };
}

const targetArg = process.argv[2];
// Some PowerShell/Markdown copy paths escape underscores into the literal
// environment-variable name. Accept that accidental spelling for migration
// compatibility without printing or persisting the password.
const passwordEntry = Object.entries(process.env).find(([key]) => key.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === 'LENSPIREBACKUPPASSWORD');
const password = passwordEntry?.[1] || '';
if (!targetArg || password.length < 12) usage();
else {
  const target = path.resolve(targetArg);
  const outputRoot = path.resolve(process.argv[3] || path.join(path.dirname(target), 'Encrypted Backups'));
  let failures = 0;
  for (const source of backupFiles(target)) {
    try {
      const result = migrate(source, outputRoot, password);
      console.log(`${result.status}\t${source}${result.destination ? `\t${result.destination}` : ''}`);
    } catch (error) {
      failures += 1;
      console.error(`failed\t${source}\t${error.message}`);
    }
  }
  if (failures) process.exitCode = 1;
}
