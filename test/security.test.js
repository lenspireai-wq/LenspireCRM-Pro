const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mainSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'main', 'main.js'), 'utf8');
const rendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer', 'app.js'), 'utf8');
const rendererHtml = fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer', 'index.html'), 'utf8');
const databaseSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'database', 'db.js'), 'utf8');
const cloudApiSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'main', 'cloud-api.js'), 'utf8');
const preloadSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'main', 'preload.js'), 'utf8');
const workerSource = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8');
const webBridgeSource = fs.readFileSync(path.join(__dirname, '..', 'cloudflare-worker', 'web-bridge.js'), 'utf8');
const backupMigrationSource = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'migrate-legacy-backups.js'), 'utf8');
const gitignoreSource = fs.readFileSync(path.join(__dirname, '..', '.gitignore'), 'utf8');
const drVerifierSource = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'verify-disaster-recovery.js'), 'utf8');
const wranglerSource = fs.readFileSync(path.join(__dirname, '..', 'cloudflare-worker', 'wrangler.toml'), 'utf8');
const releaseSource = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'release-production.js'), 'utf8');
const { mapLeadRows, mapEventRows } = require('../src/main/import-mappers');

test('session restoration does not accept a renderer-supplied user id', () => {
  assert.match(mainSource, /ipcMain\.handle\('get-session-user', async event =>/);
  assert.doesNotMatch(rendererSource, /invoke\('get-session-user',\s*state\.user\.id/);
});

test('expired web sessions clear rendered workspace data and return to sign in', () => {
  assert.match(webBridgeSource, /if\(!currentUser\)\{const error=new Error\('Your cloud session has expired\. Please sign in again\.'\);error\.status=401;throw error;\}/);
  assert.doesNotMatch(webBridgeSource, /!accessToken\|\|!currentUser/);
  assert.match(rendererSource, /function authenticationExpired\(error\)/);
  assert.match(rendererSource, /applyWorkspace\(\{leads:\[\],customers:\[\],bookings:\[\],production:\[\]/);
  assert.match(rendererSource, /if\(authenticationExpired\(error\)\)clearExpiredSession\(\)/);
});

test('sensitive reads require authentication or department access', () => {
  assert.match(mainSource, /'get-workspace-data'.*requireAuthenticated\(event\)/);
  assert.match(mainSource, /'get-accounts-data'.*requireDepartmentRead\(event,'accounts'\)/);
  assert.match(mainSource, /'open-quotation-attachment'[\s\S]*?requireDepartmentRead\(event, 'sales'\)/);
});

test('cloud bearer tokens are not persisted to disk', () => {
  assert.doesNotMatch(mainSource, /function persistCloudSession/);
  assert.doesNotMatch(mainSource, /cloud-sessions\.json/);
});

test('the desktop uses the signed-in organization as the workspace brand', () => {
  assert.match(mainSource, /const organizationName=String\(result\?\.organization\?\.name/);
  assert.match(rendererSource, /function workspaceName\(\)/);
  assert.match(rendererSource, /Powered by LenspireCRM/);
  assert.match(rendererSource, /© 2026 LenspireCRM\. All rights reserved\./);
  assert.doesNotMatch(rendererHtml, /Ankit Studios · CRM/);
});

test('cloud login retries temporary gateway and service outages', () => {
  assert.match(cloudApiSource, /for \(let attempt = 0; attempt < 5; attempt\+\+\)/);
  assert.match(cloudApiSource, /\[502,503,504\]\.includes\(error\.status\)/);
  assert.match(cloudApiSource, /Cloud is temporarily unavailable/);
});

test('post-login cloud synchronization retries temporary outages and shows the real error', () => {
  assert.match(mainSource, /retryTemporaryCloudFailure/);
  assert.match(rendererSource, /loginScreen\(error\.message\|\|'Unable to load the cloud workspace/);
});

test('cloud outages use an encrypted last-synced workspace instead of hiding records', () => {
  assert.match(mainSource, /safeStorage\.encryptString/);
  assert.match(mainSource, /safeStorage\.decryptString/);
  assert.match(mainSource, /saveCloudWorkspaceCache\(session\.user\?\.username,snapshot\)/);
  assert.match(mainSource, /Last synced data is read-only until the connection returns/);
  assert.match(mainSource, /cloudStatus:'offline'/);
  assert.match(rendererSource, /Showing last synced data on this computer/);
});

test('cloud server errors never trigger a whole-workspace restore fallback', () => {
  const mutationHelper = mainSource.match(/async function cloudMutation[\s\S]*?\n\}/)?.[0] || '';
  assert.match(mutationHelper, /if\(!\[404,405\]\.includes\(error\.status\)\)throw error/);
  assert.doesNotMatch(mutationHelper, /\[404,405,500\]/);
});

test('database requires strong passwords for all newly created or reset accounts', () => {
  assert.match(databaseSource, /db\.pragma\('foreign_keys = ON'\)/);
  assert.match(databaseSource, /value\.length < 12/);
  assert.match(databaseSource, /!\/\[A-Z\]\//);
  assert.match(databaseSource, /!\/\[\^A-Za-z0-9\]\//);
  assert.doesNotMatch(databaseSource, /hashPassword\('admin', salt\), salt\);/);
  assert.match(databaseSource, /Invalidate the historical admin\/admin bootstrap credential/);
});

test('new desktop backups require encryption and web sessions do not persist bearer tokens', () => {
  assert.match(mainSource, /backup password of at least 12 characters is required/);
  assert.match(mainSource, /const payload=encryptPayload\(snapshot,password\)/);
  assert.match(mainSource, /Unencrypted legacy backups cannot be restored directly/);
  assert.doesNotMatch(webBridgeSource, /localStorage\.setItem\(STORAGE\.(?:token|refresh)/);
  assert.match(webBridgeSource, /Authentication secrets are memory-only/);
});

test('web authentication uses HttpOnly cookies and legacy passwords receive restricted upgrade sessions', () => {
  assert.match(workerSource, /HttpOnly; Secure; SameSite=Strict/);
  assert.match(workerSource, /requestCookie\(request, "lp_refresh"\)/);
  assert.match(workerSource, /x-lenspire-web/);
  assert.match(workerSource, /passwordUpgradeRequired/);
  assert.match(workerSource, /Password upgrade required before accessing workspace data/);
  assert.doesNotMatch(webBridgeSource, /authorization.*Bearer/i);
});

test('production login throttling is database-backed and does not expose diagnostics', () => {
  assert.match(workerSource, /create table if not exists auth_rate_limits/);
  assert.match(workerSource, /cf-connecting-ip/);
  assert.match(workerSource, /failures \+ 1 >= 5/);
  assert.match(workerSource, /interval '15 minutes'/);
  assert.match(workerSource, /"retry-after": "900"/);
  assert.doesNotMatch(workerSource, /json\(\{ error: "Login failed", diagnostic:/);
});

test('refresh sessions rotate atomically, remain tenant-bound, and are cleaned up', () => {
  assert.match(workerSource, /function ensureAuthSessionSchema/);
  assert.match(workerSource, /pg_advisory_xact_lock\(hashtext\('lenspirecrm:refresh_tokens_user_active_created'\)\)/);
  assert.match(workerSource, /refresh_tokens_user_active_created/);
  assert.match(workerSource, /expires_at < now\(\) - interval '7 days'/);
  assert.match(workerSource, /join users u on u\.id=rt\.user_id and u\.organization_id=rt\.organization_id/);
  assert.match(workerSource, /revoked_at is null returning id/);
  assert.match(workerSource, /if \(!rotated\) return clearAuthJson\(.+401\)/);
  assert.match(workerSource, /order by created_at desc offset 5/);
});

test('production schema changes run only through the versioned owner migration route', () => {
  assert.match(workerSource, /const CLOUD_SCHEMA_VERSION = 3/);
  assert.match(workerSource, /pg_advisory_xact_lock\(hashtext\('lenspirecrm:cloud-schema-migrations'\)\)/);
  assert.match(workerSource, /create table if not exists schema_migrations/);
  assert.match(workerSource, /pathname === "\/api\/platform\/migrations"/);
  assert.match(workerSource, /url\.pathname === "\/platform-migrations"/);
  assert.match(workerSource, /SchemaMigrationRequiredError/);
  assert.match(workerSource, /code: "schema_migration_required"/);
  assert.doesNotMatch(workerSource, /unique \(organization_id, lower\(email\)\)/);
  assert.match(workerSource, /create unique index if not exists client_portal_users_org_email_key on client_portal_users \(organization_id, lower\(email\)\)/);
  const readiness = workerSource.match(/async function ensureCloudSchemaReady[\s\S]*?\n\}/)?.[0] || '';
  assert.doesNotMatch(readiness, /ensureCloudSchema\(sql\)/);
});

test('production smoke tests are owner-only, read-only, and cover release-critical boundaries', () => {
  assert.match(workerSource, /pathname === "\/api\/platform\/smoke-tests"/);
  assert.match(workerSource, /customer_lead/);
  assert.match(workerSource, /booking_customer/);
  assert.match(workerSource, /production_booking/);
  assert.match(workerSource, /portal_booking/);
  assert.match(workerSource, /file_lead/);
  assert.match(workerSource, /objectStorageBound: Boolean\(env\.STUDIO_ASSETS\)/);
  const smokeRoute = workerSource.match(/if \(request\.method === "GET" && pathname === "\/api\/platform\/smoke-tests"\)[\s\S]*?return json\([^;]+;/)?.[0] || '';
  assert.doesNotMatch(smokeRoute, /\b(insert|update|delete|alter|create|drop)\b/i);
});

test('two-tenant rehearsal exercises write paths and always rolls back disposable data', () => {
  assert.match(workerSource, /function runTenantIsolationRehearsal/);
  assert.match(workerSource, /pathname === "\/api\/platform\/tenant-rehearsal"/);
  assert.match(workerSource, /savepoint customer_lead|expectForeignKeyBlock\("customer_lead"/);
  assert.match(workerSource, /expectForeignKeyBlock\("booking_customer"/);
  assert.match(workerSource, /expectForeignKeyBlock\("portal_booking"/);
  assert.match(workerSource, /expectForeignKeyBlock\("file_lead"/);
  assert.match(workerSource, /lenspire_tenant_rehearsal_rollback/);
  assert.match(workerSource, /residualOrganizations/);
  assert.match(workerSource, /productionDataCommitted: false/);
  assert.match(workerSource, /url\.pathname === "\/tenant-rehearsal"/);
});

test('production releases are fail-closed, evidenced, and manually rollbackable', () => {
  assert.match(releaseSource, /\['run', 'build:web'\]/);
  assert.match(releaseSource, /\['test'\]/);
  assert.match(releaseSource, /\['run', 'smoke:production'\]/);
  assert.match(releaseSource, /wrangler', 'deployments', 'list'/);
  assert.match(releaseSource, /wrangler', 'deploy'/);
  assert.match(releaseSource, /wrangler rollback \$\{previousVersion\}/);
  assert.doesNotMatch(releaseSource, /run\([^\n]+\['wrangler', 'rollback'/);
  assert.match(releaseSource, /sourceSha256/);
  assert.match(releaseSource, /flag: 'wx'/);
});

test('logout is audited and password changes revoke only tenant-bound sessions', () => {
  assert.match(workerSource, /'auth\.logout'/);
  assert.match(workerSource, /where token_hash=\$\{tokenHash\} and revoked_at is null returning organization_id,user_id/);
  assert.match(workerSource, /where user_id=\$\{user\.id\} and organization_id=\$\{user\.organization_id\} and revoked_at is null/);
});

test('tenant-sensitive mutations enforce organization scope in the SQL operation', () => {
  assert.match(workerSource, /from users where id = \$\{targetId\} and organization_id = \$\{user\.organization_id\}/);
  assert.match(workerSource, /delete from files where id = \$\{record\.id\} and organization_id = \$\{user\.organization_id\}/);
  assert.match(workerSource, /where id=\$\{access\.id\} and organization_id=\$\{organizationId\} and booking_id=\$\{bookingId\}/);
  assert.match(workerSource, /where id=\$\{job\.id\} and organization_id=\$\{claims\.org\} and booking_id=\$\{claims\.booking\}/);
});

test('workspace joins bind related records to the same organization', () => {
  assert.match(workerSource, /b\.customer_id = c\.id and b\.organization_id = c\.organization_id/);
  assert.match(workerSource, /p\.booking_id = b\.id and p\.organization_id = b\.organization_id/);
  assert.match(workerSource, /p\.id=a\.production_job_id and p\.organization_id=a\.organization_id/);
});

test('database relationships reject new cross-tenant references', () => {
  assert.match(workerSource, /function ensureTenantRelationshipConstraints/);
  assert.match(workerSource, /unique index if not exists \$\{table\}_organization_id_id_key/);
  assert.match(workerSource, /foreign key \(organization_id, \$\{column\}\) references \$\{target\} \(organization_id, id\)/);
  assert.match(workerSource, /not valid/);
  for (const constraint of [
    'bookings_tenant_customer_fk', 'production_jobs_tenant_booking_fk',
    'payments_tenant_booking_fk', 'calendar_events_tenant_user_fk',
    'client_portal_log_tenant_access_fk', 'files_tenant_lead_fk'
  ]) assert.match(workerSource, new RegExp(constraint));
});

test('historical tenant relationships are validated safely and recorded durably', () => {
  assert.match(workerSource, /create table if not exists tenant_constraint_audit/);
  assert.match(workerSource, /alter table \$\{table\} validate constraint \$\{name\}/);
  assert.match(workerSource, /'needs_review'/);
  assert.match(workerSource, /\/api\/platform\/tenant-integrity/);
});

test('platform ownership requires an explicit platform_admins record', () => {
  assert.match(workerSource, /if \(!owner\) return json\(\{ error: "LenspireCRM Owner access required"/);
  assert.match(workerSource, /insert into platform_admins \(user_id\) values \(\$\{created\.id\}\)/);
  assert.doesNotMatch(workerSource, /username === "admin" && .*role === "Administrator"/);
  assert.match(workerSource, /Password upgrade required before platform administration/);
});

test('production readiness reports secret status without returning secret values', () => {
  assert.match(workerSource, /function productionConfigurationStatus/);
  assert.match(workerSource, /\/api\/platform\/production-readiness/);
  assert.match(workerSource, /jwtSecret: typeof env\.JWT_SECRET === "string" && env\.JWT_SECRET\.length >= 32/);
  assert.match(workerSource, /driveEncryptionKey: driveKeyValid/);
  assert.doesNotMatch(workerSource, /checks\s*=\s*\{[^}]*JWT_SECRET:\s*env\.JWT_SECRET/s);
  assert.match(workerSource, /error: "Database health check failed"/);
  assert.doesNotMatch(workerSource, /json\(\{ ok: false, error: error\.message \}, 503\)/);
});

test('local secret and private-key files are excluded from source control', () => {
  for (const pattern of ['.env.*', '.dev.vars.*', 'cloudflare-worker/.wrangler/', '*.pem', '*.pfx']) {
    assert.ok(gitignoreSource.includes(pattern), `Missing ${pattern} from .gitignore`);
  }
});

test('operational monitoring emits structured events and exposes owner-only aggregates', () => {
  assert.match(workerSource, /function operationalEvent/);
  assert.match(workerSource, /"auth\.rate_limit_triggered"/);
  assert.match(workerSource, /"tenant\.constraint_needs_review"/);
  assert.match(workerSource, /"database\.health_failed"/);
  assert.match(workerSource, /\/api\/platform\/operations/);
  assert.match(wranglerSource, /\[observability\][\s\S]*enabled = true[\s\S]*head_sampling_rate = 1/);
  assert.doesNotMatch(workerSource, /The server could not complete the request", diagnostic/);
});

test('disaster recovery rehearsal restores only to disposable storage and verifies integrity', () => {
  assert.match(drVerifierSource, /decryptPayload/);
  assert.match(drVerifierSource, /isEncryptedPayload/);
  assert.match(drVerifierSource, /createHash\('sha256'\)/);
  assert.match(drVerifierSource, /mkdtempSync\(path\.join\(os\.tmpdir\(\), 'lenspire-dr-'\)\)/);
  assert.match(drVerifierSource, /integrity_check/);
  assert.match(drVerifierSource, /jsonRoundTrip: 'ok'/);
  assert.match(drVerifierSource, /productionWrites=0/);
  assert.match(drVerifierSource, /temporaryDataRemoved=true/);
  assert.match(drVerifierSource, /rmSync\(rehearsalRoot, \{ recursive: true, force: true \}\)/);
});

test('privileged account changes are atomic, audited, and deactivation revokes sessions', () => {
  assert.match(workerSource, /'user\.role_changed'/);
  assert.match(workerSource, /'user\.access_changed'/);
  assert.match(workerSource, /"user\.activated" : "user\.deactivated"/);
  assert.match(workerSource, /if \(!active\) await transaction`update refresh_tokens set revoked_at=now\(\).*organization_id=\$\{user\.organization_id\}/);
});

test('legacy backup migration is non-destructive and verifies encrypted output', () => {
  assert.match(backupMigrationSource, /\.encrypted\.lenspirebackup/);
  assert.match(backupMigrationSource, /decryptPayload/);
  assert.match(backupMigrationSource, /Encrypted backup verification failed/);
  assert.doesNotMatch(backupMigrationSource, /rmSync\(source/);
});

test('cloud Excel imports receive generated lead codes', () => {
  assert.match(mainSource, /leadCode:`LD-IMP-\$\{importBatch\}-\$\{String\(index\+1\)\.padStart\(4,'0'\)\}`/);
});

test('lead Excel imports preserve booking and payment details from the current lead form', () => {
  const [lead] = mapLeadRows([{
    'Customer / Couple Name': 'Test Client', 'Wedding Dates': '20-Aug-2026, 21-Aug-2026',
    'Total Closing': 150000, 'Mode of Payment': 'Gpay', 'Advance Received': 15000,
    'Received By': 'Sandeep Jadhav', 'Payment Received Date': '15-Aug-2026'
  }]);
  assert.equal(lead.weddingDates, '2026-08-20,2026-08-21');
  assert.equal(lead.totalClosing, 150000);
  assert.equal(lead.paymentMode, 'Gpay');
  assert.equal(lead.advanceReceived, 15000);
  assert.equal(lead.receivedBy, 'Sandeep Jadhav');
  assert.equal(lead.paymentReceivedDate, '2026-08-15');
});

test('event Excel imports accept 12-hour AM and PM times', () => {
  const [morning, evening] = mapEventRows([{ Time: '9:00 AM' }, { Time: '7:30 PM' }]);
  assert.equal(morning.startTime, '09:00');
  assert.equal(evening.startTime, '19:30');
});

test('confirmed cloud imports use the normal lead conversion workflow', () => {
  assert.match(mainSource, /confirmedCodes=new Set\(mapped\.filter\(lead=>lead\.status==='Confirmed'\)/);
  assert.match(mainSource, /ensureConfirmedCloudWorkflow\(event,session,\{\.\.\.lead,id:cloudLeadUuid\(session,lead\.id\)\},'Excel Import'\)/);
});

test('confirmed imported leads use the permission-scoped cloud conversion workflow', () => {
  assert.match(mainSource, /for\(const lead of confirmedImports\)/);
  assert.match(mainSource, /ensureConfirmedCloudWorkflow\(event,session,\{\.\.\.lead,id:cloudLeadUuid\(session,lead\.id\)\},'Excel Import'\)/);
  assert.doesNotMatch(mainSource, /for\(const lead of confirmedImports\)[\s\S]{0,1500}cloudApi\.saveEvent/);
});

test('confirmed manual cloud leads create the complete connected workflow', () => {
  assert.match(mainSource, /const created=await withCloudAuth\(session,token=>cloudApi\.createLead/);
  assert.match(mainSource, /ensureConfirmedCloudWorkflow\(event,session,\{\.\.\.leadData,\.\.\.lead\}/);
  assert.match(mainSource, /updated\?\.lead\?\.status\|\|payload\?\.lead\?\.status/);
  assert.match(mainSource, /cloudApi\.convertLead\(token,cloudId,\{performedBy\}\)/);
  const workflow = mainSource.match(/async function ensureConfirmedCloudWorkflow[\s\S]*?\n}\n\nasync function authenticateCloudUser/)?.[0] || '';
  assert.match(workflow, /Cloud conversion endpoint creates its connected event atomically/);
  assert.doesNotMatch(workflow, /cloudApi\.saveEvent/);
});

test('older confirmed bookings without a calendar event remain visible to Operations', () => {
  assert.match(mainSource, /function awaitingDetailsEventForBooking\(booking,lead,customer\)/);
  assert.match(mainSource, /const awaitingDetailsEvents=bookings\.flatMap/);
  assert.match(mainSource, /String\(lead\.status\)!=='Confirmed'/);
  assert.match(mainSource, /awaiting-booking-\$\{bookingId\}/);
  assert.match(mainSource, /syntheticAwaitingEvent=String\(payload\?\.eventId\|\|''\)\.startsWith\('awaiting-booking-'/);
  assert.match(mainSource, /booking_id:data\?\.bookingId\?\?data\?\.booking_id/);
  assert.match(rendererSource, /name="bookingId" value="\$\{esc\(event\?\.booking_id/);
});

test('cloud calendar timestamps are normalized before rendering', () => {
  assert.match(rendererSource, /date_status:dateStatus,tbd_month:tbdMonth,start_date:eventDateKey\(event\)/);
});

test('TBD event saves send both date field conventions to Cloud', () => {
  assert.match(cloudApiSource, /dateStatus,/);
  assert.match(cloudApiSource, /date_status: dateStatus/);
  assert.match(cloudApiSource, /tbd_month: tbdMonth/);
});

test('the dashboard chart runtime is packaged with the application', () => {
  const packageJson = require('../package.json');
  assert.match(packageJson.dependencies?.['chart.js'] || '', /^\^?4\.5\.1$/);
  assert.match(rendererHtml, /chart\.js\/dist\/chart\.umd\.js/);
});

test('event crew search matches any part of a nested crew name or its mobile number', () => {
  assert.match(rendererSource, /querySelectorAll\('\.crew-options label'\)/);
  assert.match(rendererSource, /name\.includes\(query\)\|\|mobile\.includes\(query\)/);
});

test('cloud backup creation uses the working read APIs instead of the failing dump route', () => {
  assert.match(mainSource, /async function createCloudBackupSnapshot\(session\)/);
  assert.match(mainSource, /cloudApi\.createBackup\(token\)/);
  assert.match(mainSource, /cloudApi\.getWorkspace\(token\)/);
  assert.match(mainSource, /cloudApi\.listLeadActivities\(token\)/);
  assert.match(mainSource, /const snapshot=await createCloudBackupSnapshot\(session\)/);
  assert.match(mainSource, /function cloudBackupModuleCounts\(payload\)/);
  assert.match(mainSource, /scope:'complete-cloud-workspace'/);
});

test('cloud restore preserves login accounts and refuses an incomplete compatibility restore', () => {
  assert.match(mainSource, /const collections=\['leads','customers','bookings','production','events','payments','activities','salesTargets','photographers'\]/);
  assert.match(mainSource, /const restorable=\{kind:'lenspirecrm-cloud-backup'\}/);
  assert.doesNotMatch(mainSource, /restorable\.users/);
  assert.match(mainSource, /This Cloud server cannot perform a complete restore, so no data was changed/);
});

test('auto-backup data is encrypted at rest when BACKUP_ENCRYPTION_KEY is configured', () => {
  assert.match(workerSource, /backupAtRestEncrypt/);
  assert.match(workerSource, /backupAtRestDecrypt/);
  assert.match(workerSource, /__encryptedBackup/);
  assert.match(workerSource, /BACKUP_ENCRYPTION_KEY.*\?.*backupAtRestEncrypt/);
  assert.match(workerSource, /createAutoBackup\(sql, org, options = \{\}, env\)/);
  assert.match(workerSource, /backupAtRestDecrypt\(latest\.backupData, env\.BACKUP_ENCRYPTION_KEY\)/);
  assert.doesNotMatch(workerSource, /createAutoBackup\(sql, org, \{\}\)/);
});

test('studio slug validation enforces safe characters and collision detection', () => {
  assert.match(workerSource, /studio_slug/);
  assert.match(workerSource, /\/^\[a-z0-9\]\[a-z0-9-\]\{1,63\}\[a-z0-9\]\$|\^\[a-z0-9\]\{2,64\}\$\//);
  assert.match(workerSource, /select 1 from organization_profiles where studio_slug=\$\{studioSlug\} and organization_id!=\$\{brandingMatch\[1\]\}/);
  assert.match(workerSource, /This studio URL slug is already taken/);
  assert.match(workerSource, /Studio URL slug must be 2.{0,2}64 characters/);
  assert.match(rendererSource, /update-platform-organization-branding.*studioSlug/);
  assert.match(rendererSource, /portalUrlPreview/);
  assert.match(mainSource, /studioSlug:payload\?\.studioSlug/);
});

test('sales targets send a normalized YYYY-MM month to the cloud', () => {
  assert.match(cloudApiSource, /target\.targetMonth \|\| target\.target_month \|\| target\.month/);
  assert.match(cloudApiSource, /targetMonth,/);
  assert.match(cloudApiSource, /target_month: targetMonth/);
});

test('normal users receive the Settings navigation button only', () => {
  assert.match(rendererSource, /navItems\.filter\(\(\[name\]\)=>name==='Settings'\)/);
  assert.match(rendererSource, /\['Team Management','Backup & Restore'\]\.includes\(state\.view\)/);
});

test('department sidebar menus start collapsed after login', () => {
  assert.match(rendererSource, /salesOpen:false, operationsOpen:false, accountsOpen:false, postProductionOpen:false/);
  assert.match(rendererSource, /state\.salesOpen=false;state\.operationsOpen=false;state\.accountsOpen=false;state\.postProductionOpen=false/);
});

test('notifications are department-scoped and automatically expire after ten seconds', () => {
  assert.match(rendererSource, /if\(access\.sales!=='none'\)/);
  assert.match(rendererSource, /if\(access\.accounts!=='none'\)/);
  assert.match(rendererSource, /if\(access\.operations!=='none'\)/);
  assert.match(rendererSource, /if\(access\.postProduction!=='none'\)/);
  assert.match(rendererSource, /expiresAt:now\+10000/);
  assert.match(rendererSource, /notificationExpiryTimer=setTimeout/);
  assert.doesNotMatch(rendererSource, /data-notif-dismiss/);
});

test('receivables use the studio 10-40-40-10 payment plan', () => {
  assert.match(rendererSource, /percentages=\[10,40,40,10\]/);
  assert.match(rendererSource, /labels=\['Advance','First Shoot','Wedding Day','Final Delivery'\]/);
  assert.match(databaseSource, /40% due at first shoot/);
  assert.match(databaseSource, /40% due on wedding day/);
  assert.match(databaseSource, /10% due on final delivery/);
  assert.match(rendererSource, /Record Payment/);
  assert.match(rendererSource, /\['Advance','First Shoot','Wedding Day','Final Delivery','Balance','Full Payment','Refund'\]/);
  assert.match(rendererSource, /function accountPaymentRows\(\)/);
  assert.match(rendererSource, /Collections & Payment Schedule/);
  assert.match(rendererSource, /By Payment Milestone/);
});

test('accounts includes a complete client ledger with payment history', () => {
  assert.match(rendererSource, /\['Client Ledger','Client Account Ledger','▤'\]/);
  assert.match(rendererSource, /function clientLedgerView\(el\)/);
  assert.match(rendererSource, /Client Account Ledger/);
  assert.match(rendererSource, /function openClientLedgerModal\(row\)/);
  assert.match(rendererSource, /data-delete-ledger-payment/);
});

test('post production uses deliverable assignments and editor completion links', () => {
  for (const deliverable of ['Raw Photos','Photo Retouching','Reels','Teaser','Cinematic Highlight','Full Length Video','Wedding Album']) {
    assert.match(rendererSource, new RegExp(deliverable));
  }
  assert.doesNotMatch(rendererSource, /const WEDDING_DELIVERABLES=.*Traditional Photos/);
  assert.doesNotMatch(rendererSource, /const WEDDING_DELIVERABLES=.*Candid Photos/);
  assert.match(rendererSource, /function assignedProductionTasks/);
  assert.match(rendererSource, /Paste the Drive link before submitting for review/);
  assert.match(rendererSource, /submittedBy=state\.user\.displayName/);
  assert.match(rendererSource, /Submitted for review · Post Production head notified/);
  assert.match(rendererSource, /Revision Required/);
  assert.match(rendererSource, /Client Approved/);
  assert.match(rendererSource, /function productionOngoingJobsView\(el\)/);
  assert.match(rendererSource, /state\.user\.role==='Editor'.*'Ongoing Jobs'/);
  assert.match(rendererSource, /Head tracking view/);
  assert.match(rendererSource, /list-post-production-users/);
  assert.match(rendererSource, /data-production-sort/);
  assert.match(rendererSource, /productionSortDir.*asc.*desc/);
  assert.match(databaseSource, /\['Post Production','Editor'\]\.includes\(user\.role\)/);
  assert.match(databaseSource, /'Post Production', 'Editor', 'Sales Executive'/);
  assert.match(rendererSource, /insertAdjacentHTML\('beforebegin','<option>Editor<\/option>'\)/);
  assert.match(rendererSource, /function openRoleModal\(user\)/);
  assert.match(rendererSource, /type="submit" class="btn primary">Save Role/);
  assert.match(rendererSource, /id="roleFormError"/);
  assert.match(rendererSource, /\$\('#productionForm \.modal-actions \.primary'\)\.type='submit'/);
  assert.match(rendererSource, /'set-user-role'/);
  assert.match(databaseSource, /function setUserRole\(requesterId,userId,role\)/);
  assert.match(databaseSource, /postProduction:'full'/);
});

test('client portal approvals are isolated and visible to post production', () => {
  assert.match(workerSource, /\/api\/client-portal\/feedback/);
  assert.match(workerSource, /jobId = uuidOrNull\(body\?\.jobId\)/);
  assert.match(workerSource, /id=\$\{jobId\} and booking_id=\$\{claims\.booking\} and organization_id=\$\{claims\.org\}/);
  assert.match(workerSource, /client_feedback_status/);
  assert.match(workerSource, /Approve Delivery/);
  assert.match(workerSource, /Request Changes/);
  assert.match(rendererSource, /Client Portal Response/);
});

test('client portal links support expiry, revocation, access audit, and automatic delivery closure', () => {
  assert.match(workerSource, /create table if not exists client_portal_access \(/);
  assert.match(workerSource, /create table if not exists client_portal_access_log \(/);
  assert.match(workerSource, /token_version=client_portal_access\.token_version\+1/);
  assert.match(workerSource, /portalVersion: Number\(access\.token_version\)/);
  assert.match(workerSource, /function validateClientPortalAccess/);
  assert.match(workerSource, /function closeClientPortalIfDelivered/);
  assert.match(workerSource, /Portal Opened/);
  assert.match(workerSource, /Access Revoked/);
  assert.match(workerSource, /Portal Closed/);
  assert.match(workerSource, /clientPortalAccess: await sql/);
  assert.match(workerSource, /clientPortalAccessLog: await sql/);
  assert.match(rendererSource, /function openClientPortalAccessModal\(booking\)/);
  assert.match(rendererSource, /Copy Link/);
  assert.match(rendererSource, /Regenerate Link/);
  assert.match(rendererSource, /Revoke Access/);
  assert.match(rendererSource, /Access Audit/);
  assert.match(mainSource, /get-client-portal-access/);
  assert.match(mainSource, /revoke-client-portal-access/);
  assert.match(mainSource, /restorable\.clientPortalAccess/);
  assert.match(mainSource, /restorable\.clientPortalAccessLog/);
});

test('final delivery requires portal approval and full payment with no administrator bypass', () => {
  assert.match(workerSource, /function productionDeliveryEligibility\(sql, job, organizationId\)/);
  assert.match(workerSource, /job\.client_feedback_status === "Approved" && Boolean\(job\.client_approved_at\)/);
  assert.match(workerSource, /Final delivery is locked until the client approves the gallery in the Client Portal/);
  assert.match(workerSource, /Final delivery is locked until Accounts records full payment/);
  assert.match(workerSource, /delivery_status='Delivered & Closed'/);
  assert.match(workerSource, /Final Payment Due/);
  assert.match(workerSource, /Payment complete · Studio can complete delivery/);
  assert.match(rendererSource, /function productionDeliveryAccount\(job\)/);
  assert.match(rendererSource, /Complete Delivery/);
  assert.match(rendererSource, /Approval Pending/);
  assert.match(rendererSource, /Payment Pending/);
  assert.doesNotMatch(rendererSource, /administrator override and mark delivered/i);
  assert.match(databaseSource, /function requireLocalProductionDelivery\(job\)/);
});

test('production approvals, payments, and delivery actions create alerts and permanent history', () => {
  assert.match(workerSource, /create table if not exists production_activity_log/);
  assert.match(workerSource, /production_activity_log_org_job_created/);
  assert.match(workerSource, /function recordProductionActivity\(sql/);
  assert.match(workerSource, /Client Requested Changes/);
  assert.match(workerSource, /Payment Recorded/);
  assert.match(workerSource, /Delivery Completed/);
  assert.match(workerSource, /productionActivities/);
  assert.match(rendererSource, /Client approved · Final payment due/);
  assert.match(rendererSource, /Ready to complete delivery/);
  assert.match(rendererSource, /Permanent Activity History/);
  assert.match(rendererSource, /state\.productionActivities/);
  assert.match(databaseSource, /CREATE TABLE IF NOT EXISTS production_activity_log/);
  assert.match(mainSource, /productionActivities:workspace\?\.productionActivities\|\|\[\]/);
  assert.match(mainSource, /restorable\.productionActivities/);
});

test('post production gates standalone events at 50 percent and wedding-related events at 90 percent', () => {
  assert.match(rendererSource, /function bookingReceivedAmount\(booking,lead,payments=state\.payments\|\|\[\]\)/);
  assert.match(rendererSource, /recorded\+Math\.max\(0,\(Number\(lead\?\.advance_received\)\|\|0\)-recordedAdvance\)/);
  assert.match(rendererSource, /function postProductionEligible\(job\)/);
  assert.match(rendererSource, /function postProductionEventType\(event\)/);
  assert.match(rendererSource, /function weddingRelatedEvent\(event\)/);
  assert.match(rendererSource, /haldi\|mehendi\|mehndi\|sangeet\|reception/);
  assert.match(rendererSource, /function postProductionPaymentThreshold\(event\)/);
  assert.match(rendererSource, /weddingRelatedEvent\(event\)\?\.9:\.5/);
  assert.match(rendererSource, /const received=bookingReceivedAmount\(booking,lead\)/);
  assert.match(rendererSource, /received>=total\*postProductionPaymentThreshold\(event\)/);
  assert.match(rendererSource, /state\.production=\(data\.production\|\|\[\]\)\.filter\(postProductionEligible\)/);
});

test('completed events tab includes every event counted by operations dashboard', () => {
  assert.match(rendererSource, /mode==='completed'\?\(event\.date_status!=='TBD Month'&&eventHasCompleted\(event\)\)/);
});

test('TBD operations KPI opens the visible TBD event section', () => {
  assert.match(rendererSource, /data-ops-focus="tbd"[^>]*><span>TBD Date Events/);
  assert.match(rendererSource, /id="operationsTbd"/);
  assert.match(rendererSource, /button\.dataset\.opsFocus==='tbd'\?'#operationsTbd':'#operationsAttention'/);
});

test('event venue is mapped to the cloud city field', () => {
  assert.match(cloudApiSource, /city: event\?\.venue \|\| event\?\.city/);
});

test('cloud lead deletion falls back to a complete connected-record cleanup', () => {
  assert.match(mainSource, /function removeLeadFromCloudBackup[\s\S]*backup\.activities[\s\S]*backup\.customers[\s\S]*backup\.bookings[\s\S]*backup\.production[\s\S]*backup\.events[\s\S]*backup\.payments/);
  assert.match(mainSource, /'delete-lead'[\s\S]*cloudMutation[\s\S]*removeLeadFromCloudBackup[\s\S]*error\.status===500[\s\S]*mutateWorkspace/);
  assert.match(mainSource, /DELETED_LEAD_MARKER[\s\S]*softDeleted[\s\S]*cloudApi\.updateLead/);
});

test('cloud Worker deletes a lead and its connected departmental workflow atomically', () => {
  const start = workerSource.indexOf('if (request.method === "DELETE" && leadId)');
  const end = workerSource.indexOf('return json({ error: "Method not allowed"', start);
  const deletion = workerSource.slice(start, end);
  assert.match(deletion, /await sql\.begin/);
  assert.match(deletion, /delete from production_activity_log/);
  assert.match(deletion, /delete from client_portal_access_log/);
  assert.match(deletion, /delete from production_jobs/);
  assert.match(deletion, /delete from payments/);
  assert.match(deletion, /delete from calendar_events/);
  assert.match(deletion, /delete from bookings/);
  assert.match(deletion, /delete from customers/);
  assert.match(deletion, /delete from lead_activities/);
  assert.match(deletion, /delete from leads/);
});

test('missing local quotation falls back to the lead Google Drive copy', () => {
  assert.match(mainSource, /'open-quotation-attachment'[\s\S]*localFileExists[\s\S]*listDriveFiles[\s\S]*drive\.google\.com/);
  assert.match(mainSource, /normalizeFileName[\s\S]*listDriveFiles\(token,''\)/);
  assert.match(rendererSource, /Select the file now to repair this attachment/);
});

test('operations removes exact duplicate events and blocks duplicate saves', () => {
  assert.match(rendererSource, /function eventEntryKey\(event\)/);
  assert.match(rendererSource, /function uniqueEvents\(events\)/);
  assert.match(rendererSource, /Change a detail before creating the duplicate/);
});

test('upcoming events can be duplicated into a separately editable entry', () => {
  assert.match(rendererSource, /data-slot-duplicate/);
  assert.match(rendererSource, /openEventModal\(item,'',true\)/);
  assert.match(rendererSource, /openEventModal = function\(event=null,date='',duplicate=false\)/);
  assert.match(rendererSource, /Duplicate event created/);
});

test('completed events are deduplicated, newest first, and known crew are verified', () => {
  assert.match(rendererSource, /uniqueCompletedEvents\(\[\.\.\.allSlots\]\.sort/);
  assert.match(rendererSource, /eventDateKey\(b\).*localeCompare\(String\(eventDateKey\(a\)/);
  assert.match(rendererSource, /function resolveCrewDisplay/);
  assert.match(rendererSource, /match\?'crew-assigned'/);
});

test('event Excel imports skip matching business events', () => {
  assert.match(mainSource, /areDuplicateImportedEvents/);
  assert.match(mainSource, /knownEvents\.some\([\s\S]*?areDuplicateImportedEvents\(item,row\)/);
});

test('all departmental Excel importers prevent repeated business entries', () => {
  assert.match(mainSource, /const leadImportKey=/);
  assert.match(mainSource, /knownLeadKeys\.has\(key\)/);
  assert.match(mainSource, /const paymentImportKey=/);
  assert.match(mainSource, /knownKeys\.has\(key\)/);
  assert.match(databaseSource, /const existingKeys = new Set\(/);
  assert.match(databaseSource, /existingKeys\.has\(key\)/);
  assert.match(mainSource, /existingMobiles\.has\(mobileKey\)/);
  assert.match(mainSource, /areDuplicateImportedEvents\(item,row\)/);
});

test('event Excel imports continue after an individual cloud row fails', () => {
  assert.match(mainSource, /for \(const \[rowIndex,row\] of rows\.entries\(\)\)/);
  assert.match(mainSource, /importErrors\.push\(`row \$\{rowIndex\+2\}/);
  assert.match(mainSource, /catch \(error\) \{[\s\S]*?skipped\+\+;[\s\S]*?continue;/);
});

test('large event imports report progress and fail fast on repeated cloud rejection', () => {
  assert.match(mainSource, /sender\.send\('events-import-progress'/);
  assert.match(mainSource, /consecutiveCloudFailures>=3/);
  assert.match(rendererSource, /Importing \$\{data\.processed\}\/\$\{data\.total\}/);
  assert.match(rendererSource, /removeListener\('events-import-progress',progress\)/);
  assert.match(preloadSource, /allowedReceiveChannels = new Set\(\['events-import-progress'.*\]\)/);
  assert.match(preloadSource, /ipcRenderer\.on\(channel, listener\)/);
});

test('event import file picker is attached to the active CRM window', () => {
  assert.match(mainSource, /function showOwnedOpenDialog\(event,options\)/);
  assert.match(mainSource, /dialog\.showOpenDialog\(owner,options\)/);
  assert.match(mainSource, /showOwnedOpenDialog\(ipcEvent,\{/);
  assert.match(rendererSource, /Select Excel file…/);
});

test('login password remains interactive and receives focus', () => {
  assert.match(rendererSource, /loginPassword\.disabled=false;loginPassword\.readOnly=false/);
  assert.match(rendererSource, /loginPassword\.onpointerdown=\(\)=>loginPassword\.focus\(\)/);
  assert.match(rendererSource, /#loginForm \[name=password\]/);
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer', 'style.css'), 'utf8'), /input:-webkit-autofill[\s\S]*?-webkit-box-shadow:0 0 0 1000px/);
});
