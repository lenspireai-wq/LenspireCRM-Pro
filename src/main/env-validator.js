const path = require('path');
const fs = require('fs');

const REQUIRED_VARS = [
    { name: 'LENSPIRE_DB_PATH', description: 'Path to SQLite database file', required: false, default: './src/database/tracker.db' },
    { name: 'LENSPIRE_CLOUD_API_URL', description: 'Cloud API endpoint URL', required: false, default: 'https://crm.lenspireai.com' },
    { name: 'LENSPIRE_BACKUP_PASSWORD', description: 'Password for encrypted backups', required: false, sensitive: true },
];

const PROD_ONLY_VARS = [
    { name: 'CSC_LINK', description: 'Code signing certificate (base64)', required: false, sensitive: true },
    { name: 'CSC_KEY_PASSWORD', description: 'Code signing certificate password', required: false, sensitive: true },
];

function validateEnv() {
    const errors = [];
    const warnings = [];
    const isDev = process.env.NODE_ENV !== 'production';
    
    console.log('\n' + '='.repeat(70));
    console.log('  LenspireCRM Pro (Electron) - Environment Validation');
    console.log('='.repeat(70));
    console.log();
    
    if (isDev) {
        console.log('  ℹ Running in DEVELOPMENT mode\n');
    } else {
        console.log('  ⚠ RUNNING IN PRODUCTION MODE\n');
    }
    
    for (const varDef of REQUIRED_VARS) {
        const value = process.env[varDef.name];
        
        if (!value) {
            if (varDef.required) {
                errors.push(`  ✗ ${varDef.name}: ${varDef.description} (REQUIRED)`);
            } else if (varDef.default) {
                console.log(`  ℹ ${varDef.name}: Using default: ${varDef.default}`);
            } else {
                warnings.push(`  ⚠ ${varDef.name}: ${varDef.description} (optional, not set)`);
            }
        } else {
            if (varDef.sensitive) {
                console.log(`  ✓ ${varDef.name}: [REDACTED]`);
            } else {
                const displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
                console.log(`  ✓ ${varDef.name}: ${displayValue}`);
            }
            
            if (varDef.name === 'LENSPIRE_DB_PATH') {
                const dbPath = path.resolve(value);
                if (!fs.existsSync(dbPath)) {
                    warnings.push(`  ⚠ ${varDef.name}: Database file does not exist at ${dbPath}`);
                }
            }
        }
    }
    
    if (!isDev) {
        console.log('\n  Production-specific checks:\n');
        for (const varDef of PROD_ONLY_VARS) {
            const value = process.env[varDef.name];
            if (!value && varDef.required) {
                errors.push(`  ✗ ${varDef.name}: ${varDef.description} (REQUIRED for production builds)`);
            } else if (!value) {
                warnings.push(`  ⚠ ${varDef.name}: ${varDef.description} (recommended for signed builds)`);
            } else {
                console.log(`  ✓ ${varDef.name}: [REDACTED]`);
            }
        }
    }
    
    console.log();
    
    if (errors.length > 0) {
        console.log('  ERRORS (must fix):');
        errors.forEach(err => console.log(err));
        console.log();
    }
    
    if (warnings.length > 0) {
        console.log('  WARNINGS:');
        warnings.forEach(warn => console.log(warn));
        console.log();
    }
    
    if (errors.length === 0) {
        console.log('  ✓ Environment validation passed');
        if (warnings.length > 0) {
            console.log('  ⚠ Some warnings present (see above)');
        }
    }
    
    console.log('='.repeat(70) + '\n');
    
    if (errors.length > 0 && !isDev) {
        console.error('  🛑 Fatal: Missing required environment variables\n');
        process.exit(1);
    }
    
    return errors.length === 0;
}

function validateBeforeStart() {
    try {
        const isValid = validateEnv();
        if (!isValid && process.env.NODE_ENV === 'production') {
            throw new Error('Environment validation failed');
        }
        return isValid;
    } catch (error) {
        console.error('  🛑 Environment validation error:', error.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        return false;
    }
}

module.exports = { validateEnv, validateBeforeStart };

if (require.main === module) {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
    validateEnv();
}
