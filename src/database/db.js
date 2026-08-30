// ============================================================
// LenspireCRM Pro — Database module
// Canonical entry point: src/database/index.js
// ============================================================
try {
  const Native = require('better-sqlite3');
  const probe = new Native(':memory:');
  probe.close();
  Database = Native;
} catch (error) {
  throw new Error(`The desktop SQLite runtime could not be loaded: ${error.message}`);
}
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

let electronApp = {};
try { electronApp = require('electron')?.app || {}; } catch {}
const app = electronApp;
const isPackaged = app?.isPackaged === true;
// Electron uses the per-user application-data directory in both development
// and packaged builds so live CRM data is never written inside the source tree.
// Plain Node maintenance/tests retain the historical path unless explicitly
// isolated through LENSPIRE_DB_PATH.
const databasePath = process.env.LENSPIRE_DB_PATH || (typeof app?.getPath === 'function'
  ? path.join(app.getPath('userData'), 'tracker.db')
  : path.join(__dirname, 'tracker.db'));

if (isPackaged && !fs.existsSync(databasePath)) {
  const seedPath = path.join(process.resourcesPath, 'database', 'tracker.db');
  if (fs.existsSync(seedPath)) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    fs.copyFileSync(seedPath, databasePath);
  }
}
const db = new Database(databasePath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Create leads table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_code TEXT,
    name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    city TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    budget TEXT,
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Administrator',
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map(column => column.name));
if (!userColumns.has('department_access')) db.exec("ALTER TABLE users ADD COLUMN department_access TEXT NOT NULL DEFAULT '{}'");

function defaultDepartmentAccess(role) {
  if (role === 'Administrator') return { sales:'full', operations:'full', accounts:'full', postProduction:'full' };
  return { sales:'none', operations:'none', accounts:'none', postProduction:'none' };
}
function normalizeDepartmentAccess(value, role) {
  let parsed = value;
  if (typeof value === 'string') { try { parsed = JSON.parse(value); } catch { parsed = {}; } }
  const defaults = defaultDepartmentAccess(role), allowed = new Set(['full','view','none']);
  return Object.fromEntries(Object.entries(defaults).map(([key,fallback]) => [key,allowed.has(parsed?.[key]) ? parsed[key] : fallback]));
}

// Add newer lead fields without affecting databases created by earlier versions.
const leadColumns = new Set(db.prepare('PRAGMA table_info(leads)').all().map(column => column.name));
for (const [name,definition] of [
  ['mobile','TEXT'],
  ['priority',"TEXT NOT NULL DEFAULT 'Medium'"],
  ['notes','TEXT'],
  ['client_name','TEXT'],
  ['client_mobile','TEXT'],
  ['couple_name','TEXT'],
  ['wedding_dates','TEXT'],
  ['total_closing','REAL'],
  ['payment_mode','TEXT'],
  ['advance_received','REAL'],
  ['received_by','TEXT'],
  ['payment_received_date','TEXT'],
  ['quotation_path','TEXT'],
  ['quotation_name','TEXT'],
  ['next_followup_at','TEXT'],
  ['lost_reason','TEXT'],
  ['referred_by','TEXT'],
  ['referral_code','TEXT']
]) {
  if (!leadColumns.has(name)) db.exec(`ALTER TABLE leads ADD COLUMN ${name} ${definition}`);
}
db.prepare("UPDATE leads SET status = 'New' WHERE status = 'Contacted'").run();
db.prepare("UPDATE leads SET status = 'Follow-up' WHERE status IN ('Negotiation', 'Quotation Sent')").run();
db.prepare("UPDATE leads SET status = 'Confirmed' WHERE status = 'Booked'").run();

// Connected studio workflow: a converted lead becomes one customer, booking,
// production job and shoot-calendar event inside a single transaction.
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_code TEXT NOT NULL UNIQUE,
    lead_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    city TEXT,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    lead_id INTEGER,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    city TEXT,
    package_name TEXT DEFAULT 'Custom Package',
    quoted_amount REAL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );
  CREATE TABLE IF NOT EXISTS production_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    stage TEXT NOT NULL DEFAULT 'Shoot Planning',
    raw_status TEXT NOT NULL DEFAULT 'Pending',
    editing_status TEXT NOT NULL DEFAULT 'Not Started',
    album_status TEXT NOT NULL DEFAULT 'Not Started',
    video_status TEXT NOT NULL DEFAULT 'Not Started',
    delivery_status TEXT NOT NULL DEFAULT 'Pending',
    due_date TEXT,
    event_segment TEXT NOT NULL DEFAULT 'Wedding',
    source_event_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
  CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    customer_id INTEGER,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'Shoot',
    start_date TEXT NOT NULL,
    start_time TEXT,
    city TEXT,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    amount REAL NOT NULL DEFAULT 0,
    payment_type TEXT NOT NULL DEFAULT 'Advance',
    status TEXT NOT NULL DEFAULT 'Pending',
    due_date TEXT,
    paid_at TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );
  CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);

  CREATE INDEX IF NOT EXISTS idx_calendar_start ON calendar_events(start_date);
  CREATE INDEX IF NOT EXISTS idx_production_stage ON production_jobs(stage);
  CREATE TABLE IF NOT EXISTS lead_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS sales_targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salesperson TEXT NOT NULL,
    target_month TEXT NOT NULL,
    target_amount REAL NOT NULL DEFAULT 0,
    target_bookings INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(salesperson, target_month)
  );
  CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sales_targets_month ON sales_targets(target_month);
`);
// Add payment tracking columns for the Accounts module.
const paymentColumns = new Set(db.prepare('PRAGMA table_info(payments)').all().map(col => col.name));
for (const [col, def] of [
  ['payment_mode', 'TEXT'],
  ['received_by', 'TEXT'],
  ['notes', 'TEXT']
]) {
  if (!paymentColumns.has(col)) db.exec("ALTER TABLE payments ADD COLUMN " + col + " " + def);
}
// Add production tracking columns for the Post Production module.
const productionColumns = new Set(db.prepare('PRAGMA table_info(production_jobs)').all().map(col => col.name));
for (const [col, def] of [
  ['editor', 'TEXT'],
  ['photo_count', 'INTEGER NOT NULL DEFAULT 0'],
  ['video_count', 'INTEGER NOT NULL DEFAULT 0'],
  ['album_count', 'INTEGER NOT NULL DEFAULT 0'],
  ['delivered_at', 'TEXT'],
  ['client_approved_at', 'TEXT'],
  ['client_feedback_status', 'TEXT'],
  ['client_feedback_message', 'TEXT'],
  ['client_feedback_at', 'TEXT'],
  ['notes', 'TEXT'],
  ['event_segment', "TEXT NOT NULL DEFAULT 'Wedding'"],
  ['source_event_id', 'INTEGER']
]) {
  if (!productionColumns.has(col)) db.exec("ALTER TABLE production_jobs ADD COLUMN " + col + " " + def);
}
db.exec(`
  CREATE TABLE IF NOT EXISTS production_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    production_job_id INTEGER NOT NULL,
    booking_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    message TEXT,
    actor TEXT NOT NULL DEFAULT 'System',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (production_job_id) REFERENCES production_jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_production_activity_job_created ON production_activity_log(production_job_id, created_at DESC);
`);
db.prepare(`INSERT INTO lead_activities (lead_id,activity_type,description,performed_by,created_at)
  SELECT l.id,'Lead Created','Existing lead added to the activity timeline.','System',l.created_at
  FROM leads l WHERE NOT EXISTS (SELECT 1 FROM lead_activities a WHERE a.lead_id=l.id)`).run();

const eventColumns = new Set(db.prepare('PRAGMA table_info(calendar_events)').all().map(column => column.name));
for (const [name, definition] of [
  ['end_time','TEXT'],['assigned_user_id','INTEGER'],['notes','TEXT'],
  ['client_name','TEXT'],['handled_by','TEXT'],['couple_name','TEXT'],['contact_no','TEXT'],
  ['photo','TEXT'],['video','TEXT'],['candid','TEXT'],['cinematic','TEXT'],['drone','TEXT'],
  ['assistant','TEXT'],['bts','TEXT'],['slotted',"INTEGER NOT NULL DEFAULT 0"],
  ['date_status',"TEXT NOT NULL DEFAULT 'Confirmed'"],['tbd_month','TEXT']
]) {
  if (!eventColumns.has(name)) db.exec(`ALTER TABLE calendar_events ADD COLUMN ${name} ${definition}`);
}

// Populate the operations fields for calendar events created by older versions.
db.prepare(`
  UPDATE calendar_events
  SET client_name = COALESCE(NULLIF(client_name,''), (SELECT l.name FROM bookings b JOIN leads l ON l.id=b.lead_id WHERE b.id=calendar_events.booking_id)),
      handled_by = COALESCE(NULLIF(handled_by,''), (SELECT l.assigned_to FROM bookings b JOIN leads l ON l.id=b.lead_id WHERE b.id=calendar_events.booking_id)),
      couple_name = COALESCE(NULLIF(couple_name,''), (SELECT l.couple_name FROM bookings b JOIN leads l ON l.id=b.lead_id WHERE b.id=calendar_events.booking_id)),
      contact_no = COALESCE(NULLIF(contact_no,''), (SELECT l.mobile FROM bookings b JOIN leads l ON l.id=b.lead_id WHERE b.id=calendar_events.booking_id)),
      notes = COALESCE(NULLIF(notes,''), (SELECT l.notes FROM bookings b JOIN leads l ON l.id=b.lead_id WHERE b.id=calendar_events.booking_id)),
      event_type = COALESCE((SELECT l.event_type FROM bookings b JOIN leads l ON l.id=b.lead_id WHERE b.id=calendar_events.booking_id), event_type)
  WHERE booking_id IS NOT NULL
`).run();

db.exec(`
  CREATE TABLE IF NOT EXISTS photographer_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    living_in TEXT,
    work TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_photographer_details_name ON photographer_details(name COLLATE NOCASE);
`);
db.prepare("UPDATE photographer_details SET status = 'Outside' WHERE status = 'Outsource'").run();

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function validatePassword(password) {
  const value = String(password || '');
  if (value.length < 12 || value.length > 128 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
    throw new Error('Password must be 12–128 characters and include uppercase, lowercase, number, and symbol.');
  }
  return value;
}

// Create the first local administrator on a fresh installation.
if (!db.prepare('SELECT id FROM users LIMIT 1').get()) {
  const salt = crypto.randomBytes(16).toString('hex');
  const bootstrapPassword = crypto.randomBytes(32).toString('base64url');
  db.prepare(`
    INSERT INTO users (username, display_name, role, password_hash, salt)
    VALUES (?, ?, ?, ?, ?)
  `).run('admin', 'Administrator', 'Administrator', hashPassword(bootstrapPassword, salt), salt);
}

// Invalidate the historical admin/admin bootstrap credential on upgraded data.
const legacyAdmin = db.prepare("SELECT id,password_hash,salt FROM users WHERE username='admin'").get();
if (legacyAdmin && hashPassword('admin', legacyAdmin.salt) === legacyAdmin.password_hash) {
  const salt = crypto.randomBytes(16).toString('hex');
  db.prepare('UPDATE users SET password_hash=?,salt=? WHERE id=?').run(hashPassword(crypto.randomBytes(32).toString('base64url'), salt), salt, legacyAdmin.id);
}


function changeOwnPassword(userId, currentPassword, newPassword) {
  if (!currentPassword) throw new Error('Enter your current password.');
  const user = db.prepare('SELECT * FROM users WHERE id = ? AND active = 1').get(Number(userId));
  if (!user) throw new Error('User account not found.');
  validatePassword(newPassword);
  const supplied = Buffer.from(hashPassword(currentPassword, user.salt), 'hex');
  const stored = Buffer.from(user.password_hash, 'hex');
  if (supplied.length !== stored.length || !crypto.timingSafeEqual(supplied, stored)) throw new Error('Current password is incorrect.');
  const salt = crypto.randomBytes(16).toString('hex');
  db.prepare('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?').run(hashPassword(newPassword, salt), salt, user.id);
  return { success: true };
}

function authenticateUser(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
    return { success: false, message: 'Enter your username and password.' };
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND active = 1').get(username.trim());
  if (!user) return { success: false, message: 'Incorrect username or password.' };
  const supplied = Buffer.from(hashPassword(password, user.salt), 'hex');
  const stored = Buffer.from(user.password_hash, 'hex');
  if (supplied.length !== stored.length || !crypto.timingSafeEqual(supplied, stored)) {
    return { success: false, message: 'Incorrect username or password.' };
  }
  db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
  return { success: true, user: { id: user.id, username: user.username, displayName: user.display_name, role: user.role, departmentAccess: normalizeDepartmentAccess(user.department_access,user.role) } };
}

function getSessionUser(userId){const user=db.prepare('SELECT id,username,display_name,role,department_access,active FROM users WHERE id=? AND active=1').get(Number(userId));if(!user)return null;return{id:user.id,username:user.username,displayName:user.display_name,role:user.role,departmentAccess:normalizeDepartmentAccess(user.department_access,user.role)};}

function getSessionUserByUsername(username){const user=db.prepare('SELECT id,username,display_name,role,department_access,active FROM users WHERE username=? AND active=1').get(String(username));if(!user)return null;return{id:user.id,username:user.username,displayName:user.display_name,role:user.role,departmentAccess:normalizeDepartmentAccess(user.department_access,user.role)};}

function listUsers(requesterId) {
  const requester = db.prepare("SELECT role FROM users WHERE id = ? AND active = 1").get(requesterId);
  if (!requester || requester.role !== 'Administrator') throw new Error('Administrator access required.');
  return db.prepare(`
    SELECT id, username, display_name AS displayName, role, department_access AS departmentAccess, active, last_login AS lastLogin, created_at AS createdAt
    FROM users ORDER BY active DESC, display_name COLLATE NOCASE
  `).all().map(user => ({...user,departmentAccess:normalizeDepartmentAccess(user.departmentAccess,user.role)}));
}

function listPostProductionUsers() {
  return db.prepare(`
    SELECT id, display_name AS displayName, role, department_access AS departmentAccess, active
    FROM users WHERE active = 1 ORDER BY display_name COLLATE NOCASE
  `).all().map(user => ({...user,departmentAccess:normalizeDepartmentAccess(user.departmentAccess,user.role)}))
    .filter(user => ['Post Production','Editor'].includes(user.role) || String(user.displayName || '').trim().toLowerCase() === 'anuj singh');
}

function createUser(requesterId, user, requesterRole) {
  if (!requesterRole) {
    const requester = db.prepare("SELECT role FROM users WHERE id = ? AND active = 1").get(requesterId);
    requesterRole = requester?.role;
  }
  if (requesterRole !== 'Administrator') throw new Error('Administrator access required.');
  const username = String(user?.username || '').trim();
  const displayName = String(user?.displayName || '').trim();
  const password = validatePassword(user?.password);
  const allowedRoles = ['Sales', 'Management', 'Accounts', 'Post Production', 'Editor', 'Sales Executive', 'Photographer', 'Cinematographer'];
  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) throw new Error('Username must be 3–30 letters, numbers, dots, dashes or underscores.');
  if (displayName.length < 2 || displayName.length > 80) throw new Error('Enter a valid full name.');
  if (!allowedRoles.includes(user?.role)) throw new Error('Select a valid role.');
  const salt = crypto.randomBytes(16).toString('hex');
  try {
    const access=normalizeDepartmentAccess(user?.departmentAccess,user.role);
    db.prepare(`INSERT INTO users (username, display_name, role, password_hash, salt, department_access) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(username, displayName, user.role, hashPassword(password, salt), salt, JSON.stringify(access));
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) throw new Error('That username is already in use.');
    throw error;
  }
  return listUsers(requesterId);
}

function setUserDepartmentAccess(requesterId,userId,access){
  const requester=db.prepare("SELECT role FROM users WHERE id=? AND active=1").get(requesterId);
  if(!requester||requester.role!=='Administrator')throw new Error('Administrator access required.');
  const user=db.prepare('SELECT role FROM users WHERE id=?').get(userId);if(!user)throw new Error('User account not found.');
  const normalized=normalizeDepartmentAccess(access,user.role);
  db.prepare('UPDATE users SET department_access=? WHERE id=?').run(JSON.stringify(normalized),userId);
  return listUsers(requesterId);
}

function setUserRole(requesterId,userId,role){
  const requester=db.prepare("SELECT role FROM users WHERE id=? AND active=1").get(requesterId);
  if(!requester||requester.role!=='Administrator')throw new Error('Administrator access required.');
  const allowedRoles=['Sales','Management','Accounts','Post Production','Editor','Sales Executive','Photographer','Cinematographer'];
  if(!allowedRoles.includes(role))throw new Error('Select a valid role.');
  const target=db.prepare('SELECT id FROM users WHERE id=?').get(userId);if(!target)throw new Error('User account not found.');
  const access=role==='Editor'?{sales:'none',operations:'none',accounts:'none',postProduction:'full'}:normalizeDepartmentAccess({},role);
  db.prepare('UPDATE users SET role=?,department_access=? WHERE id=?').run(role,JSON.stringify(access),userId);
  return listUsers(requesterId);
}

function setUserActive(requesterId, userId, active) {
  const requester = db.prepare("SELECT role FROM users WHERE id = ? AND active = 1").get(requesterId);
  if (!requester || requester.role !== 'Administrator') throw new Error('Administrator access required.');
  if (Number(requesterId) === Number(userId)) throw new Error('You cannot deactivate your own account.');
  const result = db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active ? 1 : 0, userId);
  if (!result.changes) throw new Error('User account not found.');
  return listUsers(requesterId);
}

function resetUserPassword(requesterId, userId, password) {
  const requester = db.prepare("SELECT role FROM users WHERE id = ? AND active = 1").get(requesterId);
  if (!requester || requester.role !== 'Administrator') throw new Error('Administrator access required.');
  const target = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  if (!target) throw new Error('User account not found.');
  password = validatePassword(password);
  const salt = crypto.randomBytes(16).toString('hex');
  const result = db.prepare('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?')
    .run(hashPassword(password, salt), salt, userId);
  if (!result.changes) throw new Error('User account not found.');
  return { success: true };
}

// Function to fetch all leads
function getLeads() {
  return db.prepare("SELECT * FROM leads ORDER BY id DESC").all();
}

function normalizeMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function duplicateLeadByMobile(mobile, excludeId = 0) {
  const normalized = normalizeMobile(mobile);
  if (normalized.length < 7) return null;
  return getLeads().find(lead => Number(lead.id) !== Number(excludeId) && normalizeMobile(lead.mobile) === normalized) || null;
}

function duplicateImportedLead(lead) {
  const name = String(lead?.name || '').trim().toLowerCase();
  const mobile = normalizeMobile(lead?.mobile);
  const eventDate = String(lead?.eventDate || '').trim();
  const eventType = String(lead?.eventType || '').trim().toLowerCase();
  return getLeads().find(existing =>
    String(existing.name || '').trim().toLowerCase() === name &&
    normalizeMobile(existing.mobile) === mobile &&
    String(existing.event_date || '').trim() === eventDate &&
    String(existing.event_type || '').trim().toLowerCase() === eventType
  ) || null;
}

function recordLeadActivity(leadId, type, description, performedBy = 'System') {
  db.prepare('INSERT INTO lead_activities (lead_id, activity_type, description, performed_by) VALUES (?, ?, ?, ?)')
    .run(Number(leadId), type, String(description || '').trim(), String(performedBy || 'System').trim());
}

function recordProductionActivityForBooking(bookingId, action, message, actor = 'System') {
  const jobs = db.prepare('SELECT id,booking_id FROM production_jobs WHERE booking_id=?').all(Number(bookingId));
  const insert = db.prepare('INSERT INTO production_activity_log (production_job_id,booking_id,action,message,actor) VALUES (?,?,?,?,?)');
  for (const job of jobs) insert.run(job.id, job.booking_id, String(action || 'Update'), String(message || ''), String(actor || 'System'));
}

function addLeadActivity(leadId, activity) {
  const lead = db.prepare('SELECT id FROM leads WHERE id = ?').get(Number(leadId));
  if (!lead) throw new Error('Lead not found.');
  const allowed = ['Call', 'WhatsApp', 'Meeting', 'Note'];
  if (!allowed.includes(activity?.type)) throw new Error('Select a valid activity type.');
  const description = String(activity?.description || '').trim();
  if (!description) throw new Error('Activity details are required.');
  recordLeadActivity(leadId, activity.type, description, activity.performedBy);
  return getWorkspaceData();
}

function saveSalesTarget(target) {
  const salesperson = String(target?.salesperson || '').trim();
  const month = String(target?.month || '').trim();
  if (!salesperson || !/^\d{4}-\d{2}$/.test(month)) throw new Error('Sales executive and target month are required.');
  const amount = Math.max(0, Number(target?.targetAmount) || 0);
  const bookings = Math.max(0, Number(target?.targetBookings) || 0);
  db.prepare(`INSERT INTO sales_targets (salesperson,target_month,target_amount,target_bookings) VALUES (?,?,?,?)
    ON CONFLICT(salesperson,target_month) DO UPDATE SET target_amount=excluded.target_amount,target_bookings=excluded.target_bookings,updated_at=CURRENT_TIMESTAMP`)
    .run(salesperson, month, amount, bookings);
  return getWorkspaceData();
}

function checkDuplicateMobile(mobile, excludeId) {
  const duplicate = duplicateLeadByMobile(mobile, excludeId);
  return duplicate ? { duplicate: true, lead: { id: duplicate.id, code: duplicate.lead_code, name: duplicate.name } } : { duplicate: false };
}

// Function to add a new lead
function addLead(lead) {
  const duplicate = duplicateLeadByMobile(lead?.mobile);
  if (duplicate) throw new Error(`Duplicate mobile number already belongs to ${duplicate.name} (${duplicate.lead_code}).`);
  if (lead?.status === 'Lost' && !lead?.lostReason) throw new Error('Select a reason when marking a lead as Lost.');
  const nextNumber = db.prepare("SELECT COALESCE(MAX(CAST(SUBSTR(lead_code, 2) AS INTEGER)), 0) + 1 AS value FROM leads").get().value;
  const leadCode = `L${String(nextNumber).padStart(3, '0')}`;
  
  const stmt = db.prepare(`
    INSERT INTO leads (lead_code, name, event_type, event_date, city, source, status, budget, assigned_to, mobile, priority, notes, client_name, client_mobile, couple_name, wedding_dates, total_closing, payment_mode, advance_received, received_by, payment_received_date, quotation_path, quotation_name, next_followup_at, lost_reason, referred_by, referral_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(leadCode, lead.name, lead.eventType, lead.eventDate, lead.city, lead.source, lead.status || 'New', lead.budget, lead.assignedTo, lead.mobile, lead.priority || 'Medium', lead.notes, lead.clientName, lead.clientMobile, lead.coupleName, lead.weddingDates, lead.totalClosing || null, lead.paymentMode, lead.advanceReceived || null, lead.receivedBy, lead.paymentReceivedDate, lead.quotationPath, lead.quotationName, lead.nextFollowupAt || null, lead.lostReason || null, lead.referredBy || null, lead.referralCode || null);
  const leadId = Number(result.lastInsertRowid);
  recordLeadActivity(leadId, 'Lead Created', `Lead created with status ${lead.status || 'New'}.`, lead.performedBy);
  if (lead.quotationPath) recordLeadActivity(leadId, 'Quotation', `Quotation attached: ${lead.quotationName || 'Attachment'}.`, lead.performedBy);
  if (lead.status === 'Confirmed') convertLeadTransaction(leadId, { quotedAmount: lead.totalClosing || lead.budget });
  return getLeads();
}

function importLeads(leads) {
  if (!Array.isArray(leads)) throw new Error('Invalid lead import data.');
  let imported = 0;
  let skipped = 0;
  let skippedDuplicates = 0;
  const allowedPriorities = ['High', 'Medium', 'Low'];
  const allowedStatuses = ['New', 'Follow-up', 'Confirmed', 'Lost'];
  let nextNumber = db.prepare("SELECT COALESCE(MAX(CAST(SUBSTR(lead_code, 2) AS INTEGER)), 0) + 1 AS value FROM leads").get().value;
  const insert = db.prepare(`
    INSERT INTO leads (lead_code, name, event_type, event_date, city, source, status, budget, assigned_to, mobile, priority, notes, couple_name, total_closing, next_followup_at, lost_reason, referred_by, referral_code, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  db.transaction(() => {
    for (const lead of leads) {
      const name = String(lead?.name || '').trim();
      if (!name) { skipped++; continue; }
      // Shared family phone numbers are common in wedding leads. Only skip an
      // exact re-import of the same client/event, not a different client who
      // happens to use the same number.
      if (duplicateImportedLead(lead)) { skipped++; skippedDuplicates++; continue; }
      const priority = allowedPriorities.includes(lead.priority) ? lead.priority : 'Medium';
      const status = allowedStatuses.includes(lead.status) ? lead.status : 'New';
      const leadCode = `L${String(nextNumber++).padStart(3, '0')}`;
      const createdAt = /^\d{4}-\d{2}-\d{2}$/.test(String(lead.createdAt || '')) ? `${lead.createdAt} 00:00:00` : new Date().toISOString().slice(0, 19).replace('T', ' ');
      const result = insert.run(leadCode, name, lead.eventType || 'Other', lead.eventDate || '', lead.city || '', lead.source || 'Excel Import', status, lead.budget || '', lead.assignedTo || '', lead.mobile || '', priority, lead.notes || '', lead.coupleName || '', lead.totalClosing || null, lead.nextFollowupAt || null, lead.lostReason || null, lead.referredBy || null, lead.referralCode || null, createdAt);
      recordLeadActivity(Number(result.lastInsertRowid), 'Lead Created', 'Lead imported from Excel.', lead.performedBy || 'Excel Import');
      if (status === 'Confirmed') convertLeadTransaction(Number(result.lastInsertRowid), { quotedAmount: lead.totalClosing || lead.budget });
      imported++;
    }
  })();
  return { imported, skipped, skippedDuplicates, workspace: getWorkspaceData() };
}

function updateLead(leadId, lead) {
  const id = Number(leadId);
  if (!id || !lead?.name?.trim()) throw new Error('A valid lead and customer name are required.');
  const previous = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  if (!previous) throw new Error('Lead not found.');
  const duplicate = duplicateLeadByMobile(lead.mobile, id);
  if (duplicate) throw new Error(`Duplicate mobile number already belongs to ${duplicate.name} (${duplicate.lead_code}).`);
  if (lead.status === 'Lost' && !lead.lostReason) throw new Error('Select a reason when marking a lead as Lost.');
  const result = db.prepare(`
    UPDATE leads
    SET name = ?, event_type = ?, event_date = ?, city = ?, source = ?, status = ?, budget = ?, assigned_to = ?, mobile = ?, priority = ?, notes = ?, client_name = ?, client_mobile = ?, couple_name = ?, wedding_dates = ?, total_closing = ?, payment_mode = ?, advance_received = ?, received_by = ?, payment_received_date = ?, quotation_path = ?, quotation_name = ?, next_followup_at = ?, lost_reason = ?, referred_by = ?, referral_code = ?
    WHERE id = ?
  `).run(lead.name.trim(), lead.eventType, lead.eventDate, lead.city, lead.source, lead.status, lead.budget, lead.assignedTo, lead.mobile, lead.priority || 'Medium', lead.notes, lead.clientName, lead.clientMobile, lead.coupleName, lead.weddingDates, lead.totalClosing || null, lead.paymentMode, lead.advanceReceived || null, lead.receivedBy, lead.paymentReceivedDate, lead.quotationPath, lead.quotationName, lead.nextFollowupAt || null, lead.lostReason || null, lead.referredBy || null, lead.referralCode || null, id);
  if (!result.changes) throw new Error('Lead not found.');
  if (previous.status !== lead.status) recordLeadActivity(id, 'Status Change', `Status changed from ${previous.status} to ${lead.status}.`, lead.performedBy);
  if ((previous.next_followup_at || '') !== (lead.nextFollowupAt || '')) recordLeadActivity(id, 'Follow-up', lead.nextFollowupAt ? `Next follow-up scheduled for ${lead.nextFollowupAt}.` : 'Follow-up schedule cleared.', lead.performedBy);
  if ((previous.quotation_path || '') !== (lead.quotationPath || '') && lead.quotationPath) recordLeadActivity(id, 'Quotation', `Quotation attached: ${lead.quotationName || 'Attachment'}.`, lead.performedBy);
  let booking = db.prepare('SELECT id, customer_id FROM bookings WHERE lead_id = ?').get(id);
  if (lead.status === 'Confirmed' && !booking) {
    convertLeadTransaction(id, { quotedAmount: lead.totalClosing || lead.budget });
    booking = db.prepare('SELECT id, customer_id FROM bookings WHERE lead_id = ?').get(id);
  }
  if (booking) {
    const amount = numericBudget(lead.totalClosing || lead.budget);
    db.prepare('UPDATE customers SET name=?, phone=?, city=?, source=? WHERE id=?').run(lead.name.trim(), lead.mobile || null, lead.city || '', lead.source || '', booking.customer_id);
    db.prepare('UPDATE bookings SET event_type=?, event_date=?, city=?, quoted_amount=? WHERE id=?').run(lead.eventType, lead.eventDate, lead.city || '', amount, booking.id);
    db.prepare('UPDATE calendar_events SET title=?,start_date=?,city=?,client_name=?,handled_by=?,couple_name=?,contact_no=?,event_type=?,notes=? WHERE booking_id=?')
      .run(`${lead.name.trim()} · ${lead.eventType}`, lead.eventDate, lead.city || '', lead.name.trim(), lead.assignedTo || '', lead.coupleName || '', lead.mobile || '', lead.eventType, lead.notes || '', booking.id);
    db.prepare('UPDATE production_jobs SET due_date=? WHERE booking_id=?').run(lead.eventDate, booking.id);
  }
  return getWorkspaceData();
}

function deleteLead(leadId) {
  const id = Number(leadId);
  if (!id) throw new Error('Invalid lead.');
  const connected = db.prepare('SELECT id FROM customers WHERE lead_id = ?').get(id)
    || db.prepare('SELECT id FROM bookings WHERE lead_id = ?').get(id);
  if (connected) throw new Error('Converted leads cannot be deleted because they are linked to customer and booking records.');
  db.prepare('DELETE FROM lead_activities WHERE lead_id = ?').run(id);
  const result = db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  if (!result.changes) throw new Error('Lead not found.');
  return getWorkspaceData();
}

function updateLeadAttachment(leadId, attachment, performedBy) {
  const result = db.prepare('UPDATE leads SET quotation_path = ?, quotation_name = ? WHERE id = ?')
    .run(attachment?.path || '', attachment?.name || '', Number(leadId));
  if (!result.changes) throw new Error('Lead not found.');
  recordLeadActivity(leadId, 'Quotation', `Quotation attached: ${attachment?.name || 'Attachment'}.`, performedBy);
  return getWorkspaceData();
}

function applySynchronizedBusinessReset() {
  const tables = ['lead_activities', 'sales_targets', 'payments', 'calendar_events', 'production_activity_log', 'production_jobs', 'bookings', 'customers', 'leads'];
  db.transaction(() => {
    for (const table of tables) db.prepare(`DELETE FROM ${table}`).run();
    const clearSequence = db.prepare('DELETE FROM sqlite_sequence WHERE name = ?');
    for (const table of tables) clearSequence.run(table);
  })();
  return getWorkspaceData();
}

function resetBusinessData(requesterId) {
  const requester = db.prepare("SELECT role FROM users WHERE id = ? AND active = 1").get(requesterId);
  if (!requester || requester.role !== 'Administrator') throw new Error('Administrator access required.');
  return applySynchronizedBusinessReset();
}

function numericBudget(value) {
  if (typeof value === 'number') return value;
  const digits = String(value || '').replace(/[^0-9.]/g, '');
  return Number(digits) || 0;
}

const convertLeadTransaction = db.transaction((leadId, options = {}) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
  if (!lead) throw new Error('Lead not found.');
  const existing = db.prepare('SELECT * FROM customers WHERE lead_id = ?').get(leadId);
  if (existing) throw new Error('This lead is already connected to a customer.');

  const customerNumber = db.prepare('SELECT COUNT(*) AS count FROM customers').get().count + 1;
  const customerCode = `C${String(customerNumber).padStart(4, '0')}`;
  const customerResult = db.prepare(`
    INSERT INTO customers (customer_code, lead_id, name, phone, email, city, source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(customerCode, lead.id, lead.name, options.phone || lead.mobile || null, options.email || null, lead.city, lead.source);
  const customerId = Number(customerResult.lastInsertRowid);

  const bookingNumber = db.prepare('SELECT COUNT(*) AS count FROM bookings').get().count + 1;
  const bookingCode = `B${String(bookingNumber).padStart(4, '0')}`;
  const amount = numericBudget(options.quotedAmount || lead.budget);
  const bookingResult = db.prepare(`
    INSERT INTO bookings (booking_code, customer_id, lead_id, event_type, event_date, city, package_name, quoted_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(bookingCode, customerId, lead.id, lead.event_type, lead.event_date, lead.city, options.packageName || 'Custom Package', amount);
  const bookingId = Number(bookingResult.lastInsertRowid);

  db.prepare(`INSERT INTO production_jobs (booking_id, customer_id, due_date) VALUES (?, ?, ?)`)
    .run(bookingId, customerId, lead.event_date);
  db.prepare(`
    INSERT INTO calendar_events (booking_id,customer_id,title,event_type,start_date,city,client_name,handled_by,couple_name,contact_no,notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).run(bookingId, customerId, `${lead.name} · ${lead.event_type}`, lead.event_type, lead.event_date, lead.city, lead.name, lead.assigned_to || '', lead.couple_name || '', lead.mobile || '', lead.notes || '');
  if (amount > 0) {
    const advanceReceived = Math.min(amount, numericBudget(lead.advance_received));
    const paidDate = lead.payment_received_date || null;
    const schedule = [
      { type: 'Advance', amount: Math.round(amount * 0.10), dueDate: paidDate, notes: '10% booking advance' },
      { type: 'First Shoot', amount: Math.round(amount * 0.40), dueDate: lead.event_date, notes: '40% due at first shoot' },
      { type: 'Wedding Day', amount: Math.round(amount * 0.40), dueDate: lead.event_date, notes: '40% due on wedding day' },
      { type: 'Final Delivery', amount: amount - Math.round(amount * 0.10) - Math.round(amount * 0.40) - Math.round(amount * 0.40), dueDate: null, notes: '10% due on final delivery' }
    ];
    const insertPayment = db.prepare(`INSERT INTO payments (booking_id, customer_id, amount, payment_type, status, payment_mode, received_by, notes, due_date, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    schedule.forEach((installment, index) => insertPayment.run(
      bookingId, customerId, index === 0 && advanceReceived > 0 ? advanceReceived : installment.amount,
      installment.type, index === 0 && advanceReceived > 0 ? 'Paid' : 'Pending',
      index === 0 ? (lead.payment_mode || null) : null, index === 0 ? (lead.received_by || null) : null,
      installment.notes, installment.dueDate, index === 0 && advanceReceived > 0 ? (paidDate || new Date().toISOString()) : null
    ));
  }
  db.prepare("UPDATE leads SET status = 'Confirmed' WHERE id = ?").run(lead.id);
  recordLeadActivity(lead.id, 'Status Change', `Status changed from ${lead.status} to Confirmed during conversion.`, options.performedBy);
  return { customerId, bookingId, customerCode, bookingCode };
});

function convertLeadToCustomer(leadId, options) {
  const converted = convertLeadTransaction(Number(leadId), options);
  return { success: true, converted, workspace: getWorkspaceData() };
}

function getWorkspaceData() {
  return {
    leads: getLeads(),
    customers: db.prepare(`SELECT c.*, b.id AS bookingId, b.booking_code AS bookingCode, b.event_type AS eventType, b.event_date AS eventDate, b.quoted_amount AS quotedAmount, b.status AS bookingStatus FROM customers c LEFT JOIN bookings b ON b.customer_id = c.id ORDER BY c.id DESC`).all(),
    bookings: db.prepare('SELECT * FROM bookings ORDER BY id DESC').all(),
    production: db.prepare(`SELECT p.*, c.name AS customerName, c.phone AS clientPhone, b.booking_code AS bookingCode, b.event_type AS eventType, b.event_date AS eventDate, b.quoted_amount AS quotedAmount, l.assigned_to AS salesperson, l.mobile AS leadMobile FROM production_jobs p JOIN customers c ON c.id=p.customer_id JOIN bookings b ON b.id=p.booking_id LEFT JOIN leads l ON l.id=b.lead_id ORDER BY p.id DESC`).all(),
    productionActivities: db.prepare(`SELECT a.*, p.event_segment AS eventSegment, b.booking_code AS bookingCode, c.name AS customerName FROM production_activity_log a JOIN production_jobs p ON p.id=a.production_job_id JOIN bookings b ON b.id=a.booking_id JOIN customers c ON c.id=p.customer_id ORDER BY datetime(a.created_at) DESC, a.id DESC`).all(),
    events: db.prepare(`SELECT e.*, c.name AS customerName, u.display_name AS assignedPhotographer, u.role AS assignedRole FROM calendar_events e LEFT JOIN customers c ON c.id=e.customer_id LEFT JOIN users u ON u.id=e.assigned_user_id ORDER BY e.start_date, e.start_time`).all(),
    payments: db.prepare(`SELECT p.*, b.booking_code, b.event_type, b.event_date, b.quoted_amount, c.name AS clientName, l.assigned_to AS salesperson, l.mobile AS leadMobile FROM payments p LEFT JOIN bookings b ON b.id = p.booking_id LEFT JOIN customers c ON c.id = p.customer_id LEFT JOIN leads l ON l.id = b.lead_id ORDER BY p.id DESC`).all(),
    activities: db.prepare('SELECT * FROM lead_activities ORDER BY datetime(created_at) DESC, id DESC').all(),
    salesTargets: db.prepare("SELECT * FROM sales_targets ORDER BY target_month DESC, salesperson COLLATE NOCASE").all(),
    salesExecutives: db.prepare("SELECT id, display_name AS displayName FROM users WHERE role IN ('Sales', 'Sales Executive') AND active = 1 ORDER BY display_name COLLATE NOCASE").all(),
    photographers: db.prepare("SELECT id, display_name AS displayName, role FROM users WHERE role IN ('Photographer', 'Cinematographer') AND active = 1 ORDER BY display_name COLLATE NOCASE").all(),
    photographerDetails: db.prepare('SELECT * FROM photographer_details ORDER BY name COLLATE NOCASE').all()
  };
}

function saveCalendarEvent(eventId, event) {
  const title = String(event?.title || `${event?.clientName || ''} · ${event?.eventType || 'Event'}`).trim();
  const dateStatus = event?.dateStatus === 'TBD Month' ? 'TBD Month' : 'Confirmed';
  const tbdMonth = dateStatus === 'TBD Month' ? String(event?.tbdMonth || '').trim() : '';
  const startDate = dateStatus === 'TBD Month' ? `${tbdMonth}-01` : String(event?.startDate || '').trim();
  const allowedStatuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || (dateStatus === 'TBD Month' && !/^\d{4}-\d{2}$/.test(tbdMonth))) throw new Error('Select a confirmed date or a valid TBD month.');
  if (!allowedStatuses.includes(event?.status)) throw new Error('Select a valid event status.');
  const photographerId = event?.assignedUserId ? Number(event.assignedUserId) : null;
  if (photographerId && !db.prepare("SELECT id FROM users WHERE id = ? AND active = 1 AND role IN ('Photographer','Cinematographer')").get(photographerId)) throw new Error('Select an active photographer or cinematographer.');
  const values = [title, event.eventType || 'Shoot', startDate, event.startTime || null, event.endTime || null, event.venue || event.city || '', event.status || 'Scheduled', photographerId, event.notes || '', event.clientName || '', event.handledBy || '', event.coupleName || '', event.contactNo || '', event.photo || '', event.video || '', event.candid || '', event.cinematic || '', event.drone || '', event.assistant || '', event.bts || '', Number(event.slotted) === 1 ? 1 : 0, dateStatus, tbdMonth || null];
  if (Number(eventId)) {
    const result = db.prepare('UPDATE calendar_events SET title=?,event_type=?,start_date=?,start_time=?,end_time=?,city=?,status=?,assigned_user_id=?,notes=?,client_name=?,handled_by=?,couple_name=?,contact_no=?,photo=?,video=?,candid=?,cinematic=?,drone=?,assistant=?,bts=?,slotted=?,date_status=?,tbd_month=? WHERE id=?').run(...values, Number(eventId));
    if (!result.changes) throw new Error('Event not found.');
  } else {
    db.prepare('INSERT INTO calendar_events (title,event_type,start_date,start_time,end_time,city,status,assigned_user_id,notes,client_name,handled_by,couple_name,contact_no,photo,video,candid,cinematic,drone,assistant,bts,slotted,date_status,tbd_month) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(...values);
  }
  return getWorkspaceData();
}

function deleteCalendarEvent(eventId) {
  const result = db.prepare('DELETE FROM calendar_events WHERE id = ?').run(Number(eventId));
  if (!result.changes) throw new Error('Event not found.');
  return getWorkspaceData();
}

function savePhotographerDetail(detailId, detail) {
  const name = String(detail?.name || '').trim(), mobile = String(detail?.mobile || '').trim();
  const allowedStatuses = ['In-House', 'Outside'];
  if (!name || !mobile) throw new Error('Photographer name and mobile number are required.');
  const allowedWork = ['Traditional Photo', 'Traditional Video', 'Candid', 'Cinematic', 'Drone'];
  const selectedWork = String(detail?.work || '').split('; ').filter(Boolean);
  if (!selectedWork.length || selectedWork.some(work => !allowedWork.includes(work))) throw new Error('Select one or more valid work types.');
  if (!allowedStatuses.includes(detail?.status)) throw new Error('Select a valid photographer status.');
  const values=[name,mobile,String(detail?.livingIn || '').trim(),selectedWork.join('; '),detail.status];
  if(Number(detailId)){const result=db.prepare('UPDATE photographer_details SET name=?,mobile=?,living_in=?,work=?,status=? WHERE id=?').run(...values,Number(detailId));if(!result.changes)throw new Error('Photographer not found.');}
  else db.prepare('INSERT INTO photographer_details (name,mobile,living_in,work,status) VALUES (?,?,?,?,?)').run(...values);
  return getWorkspaceData();
}

function deletePhotographerDetail(detailId){const result=db.prepare('DELETE FROM photographer_details WHERE id=?').run(Number(detailId));if(!result.changes)throw new Error('Photographer not found.');return getWorkspaceData();}

function localProductionDeliveryEligibility(job) {
  const account = db.prepare(`
    SELECT b.quoted_amount AS total,
      COALESCE(SUM(CASE WHEN p.status='Paid' AND p.payment_type<>'Refund' THEN p.amount ELSE 0 END),0) AS received,
      COALESCE(SUM(CASE WHEN p.status='Paid' AND p.payment_type='Refund' THEN p.amount ELSE 0 END),0) AS refunded
    FROM bookings b LEFT JOIN payments p ON p.booking_id=b.id
    WHERE b.id=? GROUP BY b.id
  `).get(job.booking_id) || { total: 0, received: 0, refunded: 0 };
  const total = Math.max(0, Number(account.total) || 0);
  const received = Math.max(0, (Number(account.received) || 0) - (Number(account.refunded) || 0));
  const balance = Math.max(0, total - received);
  const approved = job.client_feedback_status === 'Approved' && Boolean(job.client_approved_at);
  return { approved, balance };
}

function requireLocalProductionDelivery(job) {
  const eligibility = localProductionDeliveryEligibility(job);
  if (!eligibility.approved) throw new Error('Final delivery is locked until the client approves the gallery in the Client Portal.');
  if (eligibility.balance >= 0.01) throw new Error(`Final delivery is locked until Accounts records full payment. Balance ₹${eligibility.balance.toLocaleString('en-IN')} is pending.`);
}

function updateProductionStage(jobId, stage) {
  const allowed = ['Shoot Planning', 'Shoot Completed', 'Editing', 'Album Design', 'Client Approval', 'Ready for Delivery', 'Delivered'];
  if (!allowed.includes(stage)) throw new Error('Invalid production stage.');
  const existing = db.prepare('SELECT * FROM production_jobs WHERE id = ?').get(jobId);
  if (!existing) throw new Error('Production job not found.');
  if (stage === 'Delivered') requireLocalProductionDelivery(existing);
  const result = db.prepare("UPDATE production_jobs SET stage=?, delivery_status=CASE WHEN ?='Delivered' THEN 'Delivered & Closed' ELSE delivery_status END, delivered_at=CASE WHEN ?='Delivered' THEN COALESCE(delivered_at,CURRENT_TIMESTAMP) ELSE delivered_at END WHERE id=?").run(stage, stage, stage, jobId);
  if (!result.changes) throw new Error('Production job not found.');
  if (stage !== existing.stage) recordProductionActivityForBooking(existing.booking_id, stage === 'Delivered' ? 'Delivery Completed' : 'Stage Changed', stage === 'Delivered' ? 'Final delivery completed and project closed.' : `Production stage changed from ${existing.stage} to ${stage}.`, 'Post Production');
  return getWorkspaceData();
}

function updateProductionJob(jobId, data) {
  const id = Number(jobId);
  if (!id) throw new Error('Invalid production job ID.');
  const existing = db.prepare('SELECT * FROM production_jobs WHERE id = ?').get(id);
  if (!existing) throw new Error('Production job not found.');
  const allowedStages = ['Shoot Planning', 'Shoot Completed', 'Editing', 'Album Design', 'Client Approval', 'Ready for Delivery', 'Delivered'];
  const stage = data?.stage || existing.stage;
  if (!allowedStages.includes(stage)) throw new Error('Invalid production stage.');
  if (stage === 'Delivered') requireLocalProductionDelivery(existing);
  const rawStatus = data?.rawStatus !== undefined ? data.rawStatus : existing.raw_status;
  const editingStatus = data?.editingStatus !== undefined ? data.editingStatus : existing.editing_status;
  const albumStatus = data?.albumStatus !== undefined ? data.albumStatus : existing.album_status;
  const videoStatus = data?.videoStatus !== undefined ? data.videoStatus : existing.video_status;
  const deliveryStatus = stage === 'Delivered' ? 'Delivered & Closed' : (data?.deliveryStatus !== undefined ? data.deliveryStatus : existing.delivery_status);
  const editor = data?.editor !== undefined ? data.editor : existing.editor;
  const dueDate = data?.dueDate !== undefined ? data.dueDate : existing.due_date;
  const photoCount = data?.photoCount !== undefined ? Math.max(0, Number(data.photoCount) || 0) : existing.photo_count;
  const videoCount = data?.videoCount !== undefined ? Math.max(0, Number(data.videoCount) || 0) : existing.video_count;
  const albumCount = data?.albumCount !== undefined ? Math.max(0, Number(data.albumCount) || 0) : existing.album_count;
  const notes = data?.notes !== undefined ? data.notes : existing.notes;
  const deliveredAt = stage === 'Delivered' ? (existing.delivered_at || new Date().toISOString().slice(0, 19).replace('T', ' ')) : null;
  const clientApprovedAt = data?.clientApprovedAt !== undefined ? data.clientApprovedAt : existing.client_approved_at;
  db.prepare(
    'UPDATE production_jobs SET stage=?, raw_status=?, editing_status=?, album_status=?, video_status=?, delivery_status=?, editor=?, due_date=?, photo_count=?, video_count=?, album_count=?, notes=?, delivered_at=?, client_approved_at=? WHERE id=?'
  ).run(stage, rawStatus, editingStatus, albumStatus, videoStatus, deliveryStatus, editor, dueDate, photoCount, videoCount, albumCount, notes, deliveredAt, clientApprovedAt, id);
  recordProductionActivityForBooking(existing.booking_id, stage === 'Delivered' ? 'Delivery Completed' : stage !== existing.stage ? 'Stage Changed' : 'Workflow Updated', stage === 'Delivered' ? 'Final delivery completed and project closed.' : stage !== existing.stage ? `Production stage changed from ${existing.stage} to ${stage}.` : 'Production workflow or assignments updated.', 'Post Production');
  return getWorkspaceData();
}

async function backupDatabase(destination) {
  await db.backup(destination);
  return destination;
}

function validateDatabaseBackup(filePath) {
  const candidate = new Database(filePath, { readonly: true, fileMustExist: true });
  try {
    let tables;
    try {
      tables = candidate.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(row => row.name);
    } catch {
      throw new Error('The backup database is not a valid LenspireCRM workspace.');
    }
    for (const required of ['leads', 'users']) if (!tables.includes(required)) throw new Error('The backup database is not a valid LenspireCRM workspace.');
    const integrity = candidate.pragma('integrity_check', { simple: true });
    if (integrity !== 'ok') throw new Error('The backup database failed its integrity check.');
  } finally {
    candidate.close();
  }
}

function replaceDatabaseFromBackup(filePath) {
  validateDatabaseBackup(filePath);
  db.close();
  const rollbackPath = `${databasePath}.restore-rollback`;
  fs.rmSync(rollbackPath, { force: true });
  fs.renameSync(databasePath, rollbackPath);
  try {
    fs.copyFileSync(filePath, databasePath);
    fs.rmSync(rollbackPath, { force: true });
  } catch (error) {
    fs.rmSync(databasePath, { force: true });
    fs.renameSync(rollbackPath, databasePath);
    throw error;
  }
}


// --- Accounts / Payment CRUD ---
const ALLOWED_PAYMENT_TYPES = ['Advance', 'First Shoot', 'Wedding Day', 'Final Delivery', 'Balance', 'Full Payment', 'Refund'];
const ALLOWED_PAYMENT_MODES = ['UPI/Gpay', 'Bank Transfer', 'Cash', 'Cheque', 'Other'];
const ALLOWED_PAYMENT_STATUSES = ['Paid', 'Pending', 'Overdue'];

function addPayment(data) {
  const bookingId = Number(data?.bookingId);
  if (!bookingId) throw new Error('Select a booking to record this payment.');
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  if (!booking) throw new Error('Booking not found.');
  const customerId = booking.customer_id;
  const amount = Number(data?.amount);
  if (!amount || amount <= 0) throw new Error('Enter a valid payment amount.');
  const paymentType = data?.paymentType || 'Advance';
  if (!ALLOWED_PAYMENT_TYPES.includes(paymentType)) throw new Error('Invalid payment type.');
  const mode = data?.paymentMode || '';
  if (mode && !ALLOWED_PAYMENT_MODES.includes(mode)) throw new Error('Invalid payment mode.');
  const status = data?.status || 'Paid';
  if (!ALLOWED_PAYMENT_STATUSES.includes(status)) throw new Error('Invalid payment status.');
  const dueDate = data?.dueDate || null;
  const paidAt = status === 'Paid' ? (data?.paidAt || new Date().toISOString().slice(0,19).replace('T',' ')) : null;
  const result = db.prepare(
    'INSERT INTO payments (booking_id, customer_id, amount, payment_type, status, payment_mode, received_by, notes, due_date, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(bookingId, customerId, amount, paymentType, status, mode, data?.receivedBy || '', data?.notes || '', dueDate, paidAt);
  recordProductionActivityForBooking(bookingId, 'Payment Recorded', `${paymentType} payment ₹${amount.toLocaleString('en-IN')} recorded as ${status}.`, data?.receivedBy || 'Accounts');
  return getWorkspaceData();
}

function importPayments(rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid payment import data.');
  let imported = 0, skipped = 0, skippedNoBooking = 0, skippedDuplicates = 0;
  const bookingByCode = new Map(db.prepare('SELECT id, customer_id, booking_code FROM bookings').all().map(b => [String(b.booking_code || '').trim().toLowerCase(), b]));
  const insert = db.prepare(
    'INSERT INTO payments (booking_id, customer_id, amount, payment_type, status, payment_mode, received_by, notes, due_date, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const paymentKey = (row, bookingCode = '') => [String(bookingCode || row.bookingCode || '').trim().toLowerCase(), Number(row.amount || 0).toFixed(2), String(row.paymentType || row.payment_type || '').trim().toLowerCase(), String(row.status || '').trim().toLowerCase(), String(row.paidAt || row.paid_at || row.dueDate || row.due_date || '').slice(0, 10)].join('|');
  const existingKeys = new Set(db.prepare('SELECT p.*, b.booking_code FROM payments p JOIN bookings b ON b.id = p.booking_id').all().map(row => paymentKey(row, row.booking_code)));
  db.transaction(() => {
    for (const row of rows) {
      const bookingCode = String(row.bookingCode || '').trim();
      const amount = Number(row.amount);
      if (!bookingCode || !amount || amount <= 0) { skipped++; continue; }
      const booking = bookingByCode.get(bookingCode.toLowerCase());
      if (!booking) { skipped++; skippedNoBooking++; continue; }
      const paymentType = ALLOWED_PAYMENT_TYPES.includes(row.paymentType) ? row.paymentType : 'Advance';
      const status = ALLOWED_PAYMENT_STATUSES.includes(row.status) ? row.status : 'Paid';
      const mode = ALLOWED_PAYMENT_MODES.includes(row.paymentMode) ? row.paymentMode : '';
      const paidAt = status === 'Paid' ? (row.paidAt || new Date().toISOString().slice(0,19).replace('T',' ')) : null;
      const key = paymentKey({...row,paymentType,status,paidAt},bookingCode);
      if (existingKeys.has(key)) { skipped++; skippedDuplicates++; continue; }
      insert.run(booking.id, booking.customer_id, amount, paymentType, status, mode, row.receivedBy || '', row.notes || '', row.dueDate || null, paidAt);
      recordProductionActivityForBooking(booking.id, 'Payment Imported', `${paymentType} payment ₹${amount.toLocaleString('en-IN')} imported as ${status}.`, row.receivedBy || 'Accounts Import');
      existingKeys.add(key);
      imported++;
    }
  })();
  return { imported, skipped, skippedNoBooking, skippedDuplicates, workspace: getWorkspaceData() };
}

function updatePayment(paymentId, data) {
  const id = Number(paymentId);
  if (!id) throw new Error('Invalid payment ID.');
  const existing = db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
  if (!existing) throw new Error('Payment not found.');
  const amount = Number(data?.amount);
  if (!amount || amount <= 0) throw new Error('Enter a valid payment amount.');
  const paymentType = data?.paymentType || existing.payment_type;
  if (!ALLOWED_PAYMENT_TYPES.includes(paymentType)) throw new Error('Invalid payment type.');
  const mode = data?.paymentMode ?? existing.payment_mode;
  const status = data?.status || existing.status;
  if (!ALLOWED_PAYMENT_STATUSES.includes(status)) throw new Error('Invalid payment status.');
  const dueDate = data?.dueDate !== undefined ? data.dueDate : existing.due_date;
  const paidAt = status === 'Paid'
    ? (data?.paidAt || existing.paid_at || new Date().toISOString().slice(0,19).replace('T',' '))
    : null;
  const notes = data?.notes !== undefined ? data.notes : existing.notes;
  const receivedBy = data?.receivedBy !== undefined ? data.receivedBy : existing.received_by;
  db.prepare(
    'UPDATE payments SET amount=?, payment_type=?, status=?, payment_mode=?, received_by=?, notes=?, due_date=?, paid_at=? WHERE id=?'
  ).run(amount, paymentType, status, mode, receivedBy, notes, dueDate, paidAt, id);
  recordProductionActivityForBooking(existing.booking_id, 'Payment Updated', `${paymentType} payment updated to ₹${amount.toLocaleString('en-IN')} · ${status}.`, receivedBy || 'Accounts');
  return getWorkspaceData();
}

function getAccountsData() {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const payments = db.prepare(`
    SELECT p.*, b.booking_code, b.event_type, b.event_date, b.quoted_amount,
           c.name AS clientName, c.phone AS clientPhone, l.assigned_to AS salesperson, l.mobile AS leadMobile
    FROM payments p
    LEFT JOIN bookings b ON b.id = p.booking_id
    LEFT JOIN customers c ON c.id = p.customer_id
    LEFT JOIN leads l ON l.id = b.lead_id
    ORDER BY p.id DESC
  `).all();
  const bookings = db.prepare(`
    SELECT b.*, c.name AS clientName, c.phone AS clientPhone,
           l.assigned_to AS salesperson, l.mobile AS leadMobile,
           COALESCE(SUM(CASE WHEN p.status = 'Paid' AND p.payment_type != 'Refund' THEN p.amount ELSE 0 END), 0) AS totalPaid,
           COALESCE(SUM(CASE WHEN p.status = 'Paid' AND p.payment_type = 'Refund' THEN p.amount ELSE 0 END), 0) AS totalRefunded,
            MAX(0, COALESCE(b.quoted_amount, 0) - COALESCE(SUM(CASE WHEN p.status = 'Paid' AND p.payment_type != 'Refund' THEN p.amount ELSE 0 END), 0) + COALESCE(SUM(CASE WHEN p.status = 'Paid' AND p.payment_type = 'Refund' THEN p.amount ELSE 0 END), 0)) AS pendingAmount,
           COUNT(p.id) AS paymentCount,
           MIN(CASE WHEN p.status = 'Pending' THEN p.due_date END) AS nextDueDate
    FROM bookings b
    LEFT JOIN customers c ON c.id = b.customer_id
    LEFT JOIN payments p ON p.booking_id = b.id
    LEFT JOIN leads l ON l.id = b.lead_id
    GROUP BY b.id
    ORDER BY b.id DESC
  `).all();
  const salesTargets = db.prepare(`SELECT * FROM sales_targets ORDER BY target_month DESC, salesperson COLLATE NOCASE`).all();
  return { payments, bookings, salesTargets, asOf: new Date().toISOString(), todayKey };
}

function deletePayment(paymentId) {
  const existing = db.prepare('SELECT * FROM payments WHERE id=?').get(Number(paymentId));
  if (!existing) throw new Error('Payment not found.');
  const result = db.prepare('DELETE FROM payments WHERE id = ?').run(Number(paymentId));
  if (!result.changes) throw new Error('Payment not found.');
  recordProductionActivityForBooking(existing.booking_id, 'Payment Deleted', `${existing.payment_type} payment entry ₹${Number(existing.amount || 0).toLocaleString('en-IN')} was deleted.`, 'Accounts');
  return getWorkspaceData();
}

function getBookingPaymentsSummary() {
  return db.prepare(`
    SELECT b.id AS bookingId, b.booking_code AS bookingCode, b.event_type, b.event_date, b.quoted_amount,
           c.name AS clientName, c.phone AS clientPhone,
           COALESCE(SUM(CASE WHEN p.status='Paid' AND p.payment_type!='Refund' THEN p.amount ELSE 0 END), 0) AS totalPaid,
           COALESCE(SUM(CASE WHEN p.status='Paid' AND p.payment_type='Refund' THEN p.amount ELSE 0 END), 0) AS totalRefunded,
            MAX(0, COALESCE(b.quoted_amount, 0) - COALESCE(SUM(CASE WHEN p.status='Paid' AND p.payment_type!='Refund' THEN p.amount ELSE 0 END), 0) + COALESCE(SUM(CASE WHEN p.status='Paid' AND p.payment_type='Refund' THEN p.amount ELSE 0 END), 0)) AS pendingAmount,
           COUNT(p.id) AS paymentCount,
           MIN(CASE WHEN p.status='Pending' THEN p.due_date END) AS nextDueDate,
           MIN(CASE WHEN p.status='Overdue' THEN p.due_date END) AS overdueDate,
           l.assigned_to AS salesperson, l.mobile AS leadMobile
    FROM bookings b
    LEFT JOIN customers c ON c.id = b.customer_id
    LEFT JOIN payments p ON p.booking_id = b.id
    LEFT JOIN leads l ON l.id = b.lead_id
    GROUP BY b.id
    ORDER BY b.id DESC
  `).all();
}

module.exports = { getLeads, addLead, importLeads, importPayments, changeOwnPassword, updateLead, updateLeadAttachment, addLeadActivity, saveSalesTarget, checkDuplicateMobile, deleteLead, resetBusinessData, applySynchronizedBusinessReset, authenticateUser, getSessionUser, getSessionUserByUsername, listUsers, listPostProductionUsers, createUser, setUserActive, setUserDepartmentAccess, setUserRole, resetUserPassword, getWorkspaceData, convertLeadToCustomer, updateProductionStage, saveCalendarEvent, deleteCalendarEvent, savePhotographerDetail, deletePhotographerDetail, backupDatabase, validateDatabaseBackup, replaceDatabaseFromBackup, addPayment, updatePayment, deletePayment, getBookingPaymentsSummary, getAccountsData, updateProductionJob };
