const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const PBKDF2_ITERATIONS = 310000;

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

function encryptPayload(payload, password) {
  if (typeof password !== 'string' || (!/^\d{4}$/.test(password) && (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)))) throw new Error('Backup password must be a 4-digit PIN or a 12+ character complex password.');
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    encrypted: true,
    version: 2,
    kdf: 'pbkdf2-sha256',
    iterations: PBKDF2_ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: encrypted.toString('base64')
  };
}

function decryptPayload(encryptedObj, password) {
  const salt = Buffer.from(encryptedObj.salt, 'base64');
  const iterations = Number(encryptedObj.iterations) || 100000;
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 2000000) throw new Error('Invalid backup key-derivation settings.');
  const key = crypto.pbkdf2Sync(password, salt, iterations, KEY_LENGTH, 'sha256');
  const iv = Buffer.from(encryptedObj.iv, 'base64');
  const authTag = Buffer.from(encryptedObj.authTag, 'base64');
  const ciphertext = Buffer.from(encryptedObj.ciphertext, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}

function isEncryptedPayload(payload) {
  return payload && payload.encrypted === true &&
    typeof payload.salt === 'string' &&
    typeof payload.iv === 'string' &&
    typeof payload.authTag === 'string' &&
    typeof payload.ciphertext === 'string';
}

module.exports = { encryptPayload, decryptPayload, isEncryptedPayload };
