const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { encryptPayload, decryptPayload } = require('../src/main/backup-crypto');

const passwordEntry = Object.entries(process.env).find(([key]) => key.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === 'LENSPIREBACKUPPASSWORD');
const password = passwordEntry?.[1] || '';
const output = path.resolve(process.argv[2] || 'Backup/Encrypted Backups/Local-Sensitive-Data.encrypted.lenspirearchive');
const sources = process.argv.slice(3).map(value => path.resolve(value));

if (password.length < 12 || !sources.length) {
  console.error('Usage: set LENSPIRE_BACKUP_PASSWORD, then run: node scripts/archive-sensitive-files.js <output> <file...>');
  process.exitCode = 2;
} else if (fs.existsSync(output)) {
  console.error(`Refusing to overwrite existing archive: ${output}`);
  process.exitCode = 1;
} else {
  const files = sources.map(source => {
    const data = fs.readFileSync(source);
    return { name:path.basename(source), sourceRelative:path.relative(process.cwd(), source), bytes:data.length, sha256:crypto.createHash('sha256').update(data).digest('hex'), data:data.toString('base64') };
  });
  const payload = { kind:'lenspirecrm-sensitive-file-archive', version:1, createdAt:new Date().toISOString(), files };
  const encrypted = encryptPayload(payload, password);
  fs.mkdirSync(path.dirname(output), { recursive:true });
  const temporary = output + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(encrypted));
  const verified = decryptPayload(JSON.parse(fs.readFileSync(temporary, 'utf8')), password);
  for (const item of verified.files || []) {
    const bytes = Buffer.from(item.data, 'base64');
    if (bytes.length !== item.bytes || crypto.createHash('sha256').update(bytes).digest('hex') !== item.sha256) {
      fs.rmSync(temporary, { force:true });
      throw new Error(`Archive verification failed for ${item.name}`);
    }
  }
  fs.renameSync(temporary, output);
  console.log(`verified-encrypted-archive\t${output}\tfiles=${files.length}\tbytes=${files.reduce((sum,item)=>sum+item.bytes,0)}`);
}
