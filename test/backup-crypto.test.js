const test = require('node:test');
const assert = require('node:assert/strict');
const { encryptPayload, decryptPayload, isEncryptedPayload } = require('../src/main/backup-crypto');

const strongPassword = 'Str0ng!Backup#Passphrase-2026';

test('encryptPayload produces a recognized encrypted envelope', () => {
  const payload = { format: 'LenspireCRM-Pro-Backup', version: 1, leads: [] };
  const encrypted = encryptPayload(payload, strongPassword);
  assert.equal(encrypted.encrypted, true);
  assert.equal(encrypted.version, 2);
  assert.equal(encrypted.kdf, 'pbkdf2-sha256');
  assert.equal(encrypted.iterations, 310000);
  assert.ok(typeof encrypted.salt === 'string' && encrypted.salt.length);
  assert.ok(typeof encrypted.iv === 'string' && encrypted.iv.length);
  assert.ok(typeof encrypted.authTag === 'string' && encrypted.authTag.length);
  assert.ok(typeof encrypted.ciphertext === 'string' && encrypted.ciphertext.length);
});

test('decryptPayload restores the original payload', () => {
  const payload = { format: 'LenspireCRM-Pro-Backup', version: 1, leads: [{ id: 1, name: 'Rahul & Priya' }] };
  const encrypted = encryptPayload(payload, strongPassword);
  const decrypted = decryptPayload(encrypted, strongPassword);
  assert.deepEqual(decrypted, payload);
});

test('isEncryptedPayload recognizes valid envelopes and rejects impostors', () => {
  const encrypted = encryptPayload({ leads: [] }, strongPassword);
  assert.equal(isEncryptedPayload(encrypted), true);
  assert.equal(isEncryptedPayload({}), false);
  assert.equal(isEncryptedPayload({ encrypted: true }), false);
  assert.equal(isEncryptedPayload({ encrypted: true, salt: 'x', iv: 'x', authTag: 'x', ciphertext: 'x' }), true);
  assert.equal(isEncryptedPayload(undefined), undefined);
  assert.ok(!isEncryptedPayload(null));
  assert.ok(!isEncryptedPayload('encrypted-string'));
  assert.ok(!isEncryptedPayload({ encrypted: 'true' }));
});

test('encryptPayload rejects a password shorter than 12 characters', () => {
  assert.throws(() => encryptPayload({ leads: [] }, 'short'), /at least 12 characters/);
});

test('decryptPayload throws on a wrong password', () => {
  const encrypted = encryptPayload({ leads: [] }, strongPassword);
  assert.throws(() => decryptPayload(encrypted, 'Wrong!Password#9999'));
});

test('decryptPayload rejects tampered ciphertext', () => {
  const encrypted = encryptPayload({ leads: [] }, strongPassword);
  const tampered = { ...encrypted, ciphertext: encrypted.ciphertext.slice(0, -4) + 'AAAA' };
  assert.throws(() => decryptPayload(tampered, strongPassword));
});

test('decryptPayload rejects out-of-range iteration counts', () => {
  const encrypted = encryptPayload({ leads: [] }, strongPassword);
  assert.throws(() => decryptPayload({ ...encrypted, iterations: 999 }, strongPassword), /Invalid backup key-derivation settings/);
  assert.throws(() => decryptPayload({ ...encrypted, iterations: 5000000 }, strongPassword), /Invalid backup key-derivation settings/);
});

test('encrypted envelopes are non-deterministic across encryptions', () => {
  const payload = { leads: [{ id: 1 }] };
  const a = encryptPayload(payload, strongPassword);
  const b = encryptPayload(payload, strongPassword);
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.iv, b.iv);
  assert.equal(a.ciphertext.length > 0, true);
});
