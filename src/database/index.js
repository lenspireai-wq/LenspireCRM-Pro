const fs = require('fs');
const path = require('path');

function runMigrations(db) {
    const migrationsDir = path.join(__dirname, 'migrations');
    const { MigrationRunner } = require('./migrations/runner');
    
    const runner = new MigrationRunner(db, migrationsDir);
    
    const status = runner.status();
    console.log('[DB] Migration status:', status);
    
    if (status.pending > 0) {
        console.log('[DB] Running pending migrations...');
        return runner.migrate();
    }
    
    return { applied: 0 };
}

function getMigrationStatus(db) {
    const migrationsDir = path.join(__dirname, 'migrations');
    const { MigrationRunner } = require('./migrations/runner');
    
    const runner = new MigrationRunner(db, migrationsDir);
    return runner.status();
}

function rollbackMigration(db, steps = 1) {
    const migrationsDir = path.join(__dirname, 'migrations');
    const { MigrationRunner } = require('./migrations/runner');
    
    const runner = new MigrationRunner(db, migrationsDir);
    return runner.rollback(steps);
}

module.exports = {
    runMigrations,
    getMigrationStatus,
    rollbackMigration
};
