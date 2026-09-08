const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { encryptPayload, decryptPayload, isEncryptedPayload } = require('../src/main/backup-crypto');

const testPassword = 'TestPassword123!';
const testPayload = {
    format: 'LenspireCRM-Pro-Backup',
    version: 1,
    leads: [
        { id: 1, name: 'Rahul & Priya', mobile: '9876543210', event_type: 'Wedding' }
    ],
    customers: [],
    bookings: [],
    payments: [],
    events: [],
    production: [],
    productionActivities: [],
    activities: [],
    salesTargets: [],
    salesExecutives: [],
    photographers: [],
    photographerDetails: []
};

test('encryptPayload creates valid encrypted envelope', () => {
    const encrypted = encryptPayload(testPayload, testPassword);
    
    assert.equal(encrypted.encrypted, true);
    assert.equal(encrypted.version, 2);
    assert.equal(encrypted.kdf, 'pbkdf2-sha256');
    assert.equal(encrypted.iterations, 310000);
    assert.ok(typeof encrypted.salt === 'string' && encrypted.salt.length > 0);
    assert.ok(typeof encrypted.iv === 'string' && encrypted.iv.length > 0);
    assert.ok(typeof encrypted.authTag === 'string' && encrypted.authTag.length > 0);
    assert.ok(typeof encrypted.ciphertext === 'string' && encrypted.ciphertext.length > 0);
});

test('decryptPayload restores original payload', () => {
    const encrypted = encryptPayload(testPayload, testPassword);
    const decrypted = decryptPayload(encrypted, testPassword);
    
    assert.deepEqual(decrypted, testPayload);
    assert.equal(decrypted.format, 'LenspireCRM-Pro-Backup');
    assert.equal(decrypted.version, 1);
    assert.equal(decrypted.leads.length, 1);
    assert.equal(decrypted.leads[0].name, 'Rahul & Priya');
});

test('isEncryptedPayload validates envelopes correctly', () => {
    const encrypted = encryptPayload(testPayload, testPassword);
    
    assert.equal(isEncryptedPayload(encrypted), true);
    assert.equal(isEncryptedPayload({}), false);
    assert.equal(isEncryptedPayload({ encrypted: true }), false);
    assert.equal(isEncryptedPayload({ encrypted: true, salt: 'x', iv: 'x', authTag: 'x', ciphertext: 'x' }), true);
    assert.equal(isEncryptedPayload(undefined), undefined);
    assert.equal(isEncryptedPayload(null), false);
});

test('encryption with wrong password fails', () => {
    const encrypted = encryptPayload(testPayload, testPassword);
    
    assert.throws(() => {
        decryptPayload(encrypted, 'WrongPassword123!');
    }, /decrypt|authentication|invalid/i);
});

test('encryption produces different ciphertext for same payload', () => {
    const encrypted1 = encryptPayload(testPayload, testPassword);
    const encrypted2 = encryptPayload(testPayload, testPassword);
    
    assert.notEqual(encrypted1.ciphertext, encrypted2.ciphertext);
    assert.notEqual(encrypted1.iv, encrypted2.iv);
    assert.notEqual(encrypted1.salt, encrypted2.salt);
    
    const decrypted1 = decryptPayload(encrypted1, testPassword);
    const decrypted2 = decryptPayload(encrypted2, testPassword);
    
    assert.deepEqual(decrypted1, decrypted2);
});

test('large payload encryption and decryption', () => {
    const largePayload = {
        ...testPayload,
        leads: Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            name: `Lead ${i + 1}`,
            mobile: `98765432${String(i).padStart(2, '0')}`,
            event_type: 'Wedding',
            event_date: '2026-12-25',
            status: 'New'
        }))
    };
    
    const encrypted = encryptPayload(largePayload, testPassword);
    const decrypted = decryptPayload(encrypted, testPassword);
    
    assert.equal(decrypted.leads.length, 1000);
    assert.equal(decrypted.leads[0].name, 'Lead 1');
    assert.equal(decrypted.leads[999].name, 'Lead 1000');
});

test('corrupted ciphertext fails decryption', () => {
    const encrypted = encryptPayload(testPayload, testPassword);
    encrypted.ciphertext = encrypted.ciphertext.slice(0, -10) + 'XXXXXXXXXX';
    
    assert.throws(() => {
        decryptPayload(encrypted, testPassword);
    }, /decrypt|authentication|invalid/i);
});

test('corrupted auth tag fails decryption', () => {
    const encrypted = encryptPayload(testPayload, testPassword);
    encrypted.authTag = 'a'.repeat(encrypted.authTag.length);
    
    assert.throws(() => {
        decryptPayload(encrypted, testPassword);
    }, /decrypt|authentication|invalid/i);
});

test('empty payload encryption', () => {
    const emptyPayload = {
        format: 'LenspireCRM-Pro-Backup',
        version: 1,
        leads: [],
        customers: [],
        bookings: [],
        payments: [],
        events: [],
        production: [],
        productionActivities: [],
        activities: [],
        salesTargets: [],
        salesExecutives: [],
        photographers: [],
        photographerDetails: []
    };
    
    const encrypted = encryptPayload(emptyPayload, testPassword);
    const decrypted = decryptPayload(encrypted, testPassword);
    
    assert.deepEqual(decrypted, emptyPayload);
});

test('unicode and special characters in payload', () => {
    const unicodePayload = {
        ...testPayload,
        leads: [{
            id: 1,
            name: '测试用户 👰🤵',
            mobile: '+91 98765 43210',
            event_type: 'Wedding',
            notes: 'Special chars: \n\t\r"\'\\{[]}'
        }]
    };
    
    const encrypted = encryptPayload(unicodePayload, testPassword);
    const decrypted = decryptPayload(encrypted, testPassword);
    
    assert.equal(decrypted.leads[0].name, '测试用户 👰🤵');
    assert.equal(decrypted.leads[0].notes, 'Special chars: \n\t\r"\'\\{[]}');
});
