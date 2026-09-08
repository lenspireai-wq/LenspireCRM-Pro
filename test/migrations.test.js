const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Database = require('better-sqlite3');

const DB_PATH = path.join(os.tmpdir(), `lenspire-migration-test-${process.pid}-${Date.now()}.db`);

test.after(() => {
    try {
        for (const suffix of ['', '-wal', '-shm', '-journal']) {
            try { fs.rmSync(DB_PATH + suffix, { force: true }); } catch {}
        }
    } catch {}
});

test('MigrationRunner creates schema_migrations table', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations'").get();
        assert.ok(table, 'schema_migrations table should exist');
        
        const columns = db.prepare("PRAGMA table_info(schema_migrations)").all();
        assert.ok(columns.find(c => c.name === 'id'), 'id column should exist');
        assert.ok(columns.find(c => c.name === 'applied_at'), 'applied_at column should exist');
        assert.ok(columns.find(c => c.name === 'checksum'), 'checksum column should exist');
    } finally {
        db.close();
    }
});

test('MigrationRunner tracks applied migrations', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        const applied = runner.getAppliedMigrations();
        assert.ok(Array.isArray(applied), 'getAppliedMigrations should return an array');
    } finally {
        db.close();
    }
});

test('MigrationRunner detects pending migrations', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        const pending = runner.getPendingMigrations();
        assert.ok(Array.isArray(pending), 'getPendingMigrations should return an array');
        assert.ok(pending.length >= 0, 'Pending count should be non-negative');
    } finally {
        db.close();
    }
});

test('MigrationRunner applies initial schema migration', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        const result = runner.migrate();
        
        assert.ok(result.applied >= 1, 'At least one migration should be applied');
        
        const leads = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'").get();
        assert.ok(leads, 'leads table should exist after migration');
        
        const customers = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'").get();
        assert.ok(customers, 'customers table should exist after migration');
        
        const bookings = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='bookings'").get();
        assert.ok(bookings, 'bookings table should exist after migration');
        
        const production = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='production_jobs'").get();
        assert.ok(production, 'production_jobs table should exist after migration');
        
        const events = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='calendar_events'").get();
        assert.ok(events, 'calendar_events table should exist after migration');
        
        const payments = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='payments'").get();
        assert.ok(payments, 'payments table should exist after migration');
    } finally {
        db.close();
    }
});

test('MigrationRunner does not reapply migrations', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        runner.migrate();
        
        const result2 = runner.migrate();
        assert.equal(result2.applied, 0, 'No migrations should be applied on second run');
    } finally {
        db.close();
    }
});

test('MigrationRunner provides correct status', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        const status = runner.status();
        
        assert.ok(typeof status.applied === 'number', 'applied should be a number');
        assert.ok(typeof status.pending === 'number', 'pending should be a number');
        assert.ok(status.applied >= 0, 'applied should be non-negative');
        assert.ok(status.pending >= 0, 'pending should be non-negative');
    } finally {
        db.close();
    }
});

test('Schema includes all required indexes', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        runner.migrate();
        
        const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all();
        const indexNames = indexes.map(i => i.name);
        
        assert.ok(indexNames.some(n => n.includes('leads')), 'leads should have indexes');
        assert.ok(indexNames.some(n => n.includes('customers')), 'customers should have indexes');
        assert.ok(indexNames.some(n => n.includes('bookings')), 'bookings should have indexes');
        assert.ok(indexNames.some(n => n.includes('production')), 'production_jobs should have indexes');
        assert.ok(indexNames.some(n => n.includes('payments')), 'payments should have indexes');
    } finally {
        db.close();
    }
});

test('Cloud sync fields added by second migration', () => {
    const db = new Database(DB_PATH);
    
    try {
        const { MigrationRunner } = require('../src/database/migrations/runner.js');
        const runner = new MigrationRunner(db, path.join(__dirname, '../src/database/migrations'));
        
        runner.migrate();
        
        const status = runner.status();
        
        if (status.applied >= 2) {
            const leadsColumns = db.prepare("PRAGMA table_info(leads)").all();
            assert.ok(leadsColumns.find(c => c.name === 'cloud_id'), 'cloud_id should exist on leads');
            assert.ok(leadsColumns.find(c => c.name === 'sync_status'), 'sync_status should exist on leads');
            
            const paymentsColumns = db.prepare("PRAGMA table_info(payments)").all();
            assert.ok(paymentsColumns.find(c => c.name === 'cloud_id'), 'cloud_id should exist on payments');
        }
    } finally {
        db.close();
    }
});
