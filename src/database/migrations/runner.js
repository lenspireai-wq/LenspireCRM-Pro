const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class MigrationRunner {
    constructor(db, migrationsDir) {
        this.db = db;
        this.migrationsDir = migrationsDir;
        this.ensureMigrationsTable();
    }

    ensureMigrationsTable() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id TEXT PRIMARY KEY,
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                checksum TEXT NOT NULL
            )
        `);
    }

    getAppliedMigrations() {
        return this.db.prepare('SELECT id, checksum FROM schema_migrations').all();
    }

    getPendingMigrations() {
        const applied = new Map(this.getAppliedMigrations().map(m => [m.id, m.checksum]));
        const files = this.loadMigrationFiles();
        
        return files.filter(f => !applied.has(f.id));
    }

    loadMigrationFiles() {
        if (!fs.existsSync(this.migrationsDir)) {
            return [];
        }

        const files = fs.readdirSync(this.migrationsDir)
            .filter(f => f.endsWith('.js'))
            .sort();

        return files.map(filename => {
            const filepath = path.join(this.migrationsDir, filename);
            const content = fs.readFileSync(filepath, 'utf8');
            const checksum = crypto.createHash('sha256').update(content).digest('hex');
            
            return {
                id: filename.replace('.js', ''),
                filename,
                filepath,
                checksum,
                up: require(filepath).up,
                down: require(filepath).down
            };
        });
    }

    async migrate() {
        const pending = this.getPendingMigrations();
        
        if (pending.length === 0) {
            console.log('[Migrations] No pending migrations');
            return { applied: 0 };
        }

        console.log(`[Migrations] Found ${pending.length} pending migration(s)`);
        
        const results = { applied: 0, errors: [] };

        for (const migration of pending) {
            try {
                console.log(`[Migrations] Applying: ${migration.id}`);
                
                const statement = this.db.transaction(() => {
                    migration.up(this.db);
                    
                    this.db.prepare(`
                        INSERT INTO schema_migrations (id, checksum)
                        VALUES (?, ?)
                    `).run(migration.id, migration.checksum);
                });

                statement();
                
                console.log(`[Migrations] ✓ Applied: ${migration.id}`);
                results.applied++;
            } catch (error) {
                console.error(`[Migrations] ✗ Failed: ${migration.id}`, error.message);
                results.errors.push({ id: migration.id, error: error.message });
                throw error;
            }
        }

        return results;
    }

    async rollback(steps = 1) {
        const applied = this.getAppliedMigrations().reverse().slice(0, steps);
        
        if (applied.length === 0) {
            console.log('[Migrations] No migrations to rollback');
            return { rolledBack: 0 };
        }

        console.log(`[Migrations] Rolling back ${applied.length} migration(s)`);
        
        const results = { rolledBack: 0, errors: [] };

        for (const record of applied) {
            const migration = this.loadMigrationFiles().find(m => m.id === record.id);
            
            if (!migration || !migration.down) {
                console.error(`[Migrations] No down migration for: ${record.id}`);
                continue;
            }

            try {
                console.log(`[Migrations] Rolling back: ${record.id}`);
                
                const statement = this.db.transaction(() => {
                    migration.down(this.db);
                    
                    this.db.prepare('DELETE FROM schema_migrations WHERE id = ?').run(record.id);
                });

                statement();
                
                console.log(`[Migrations] ✓ Rolled back: ${record.id}`);
                results.rolledBack++;
            } catch (error) {
                console.error(`[Migrations] ✗ Rollback failed: ${record.id}`, error.message);
                results.errors.push({ id: record.id, error: error.message });
                throw error;
            }
        }

        return results;
    }

    status() {
        const applied = this.getAppliedMigrations();
        const pending = this.getPendingMigrations();
        
        return {
            applied: applied.length,
            pending: pending.length,
            lastApplied: applied.length > 0 ? applied[applied.length - 1].id : null,
            nextPending: pending.length > 0 ? pending[0].id : null
        };
    }
}

function createMigration(id, up, down = null) {
    return { id, up, down };
}

module.exports = { MigrationRunner, createMigration };
