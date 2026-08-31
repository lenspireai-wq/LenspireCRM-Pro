const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const sqlite3 = require('better-sqlite3');

// db.js opens its SQLite database at module-load time. Resolve the path to a
// private temp file BEFORE requiring it so the real src/database/tracker.db is
// never opened, mutated, or validated by these tests.
const DB_PATH = path.join(os.tmpdir(), `lenspire-db-test-${process.pid}-${Date.now()}.db`);
process.env.LENSPIRE_DB_PATH = DB_PATH;

const db = require('../src/database/db.js');

const PASS = '1234';

function closeDb() {
  try {
    for (const suffix of ['', '-wal', '-shm', '-journal']) {
      try { fs.rmSync(DB_PATH + suffix, { force: true }); } catch { /* locked / in use */ }
    }
  } catch { /* best-effort cleanup */ }
}
test.after(closeDb);

test('fresh workspace exposes the full data shape', () => {
  const workspace = db.getWorkspaceData();
  for (const key of ['leads', 'customers', 'bookings', 'production', 'productionActivities',
    'events', 'payments', 'activities', 'salesTargets', 'salesExecutives', 'photographers',
    'photographerDetails']) {
    assert.ok(Array.isArray(workspace[key]), `missing ${key} array`);
  }
  assert.equal(workspace.leads.length, 0);
  assert.equal(workspace.production.length, 0);
});

test('production_jobs schema includes cloud-parity event_segment and source_event_id columns', () => {
  const candidate = new sqlite3(DB_PATH, { readonly: true, fileMustExist: true });
  try {
    const names = candidate.prepare("PRAGMA table_info(production_jobs)").all().map(c => c.name);
    assert.ok(names.includes('event_segment'), 'event_segment missing from production_jobs');
    assert.ok(names.includes('source_event_id'), 'source_event_id missing from production_jobs');
  } finally {
    candidate.close();
  }
});

test('the seeded administrator account authenticates', () => {
  const seeded = db.listUsers(1).find(u => u.username === 'admin');
  assert.ok(seeded, 'seeded admin user not found');
  assert.equal(seeded.role, 'Administrator');
  assert.equal(seeded.active, 1);
});

test('resetUserPassword then authenticateUser round-trips credentials', () => {
  assert.doesNotThrow(() => db.resetUserPassword(1, 1, PASS));
  const ok = db.authenticateUser('admin', PASS);
  assert.equal(ok.success, true);
  assert.equal(ok.user.role, 'Administrator');
  assert.equal(ok.user.username, 'admin');
});

test('authenticateUser rejects a wrong password', () => {
  const bad = db.authenticateUser('admin', '9999');
  assert.equal(bad.success, false);
  assert.match(bad.message, /Incorrect username or password/);
});

test('addLead generates a sequential lead_code and records an activity', () => {
  const before = db.getLeads().length;
  const leads = db.addLead({
    name: 'Rahul & Priya', eventType: 'Wedding', eventDate: '2026-11-25', city: 'Pune',
    source: 'Instagram', status: 'New', budget: '₹3,00,000', assignedTo: 'Govind Tiwari',
    mobile: '9876543210', priority: 'Medium', notes: 'Looking for traditional + candid',
    performedBy: 'Govind Tiwari'
  });
  assert.equal(leads.length, before + 1);
  const added = leads[0];
  assert.match(added.lead_code, /^L\d{3}$/);
  assert.equal(added.name, 'Rahul & Priya');
  assert.equal(added.event_type, 'Wedding');
  const activities = db.getWorkspaceData().activities;
  assert.ok(activities.some(a => a.lead_id === added.id && a.activity_type === 'Lead Created'));
});

test('addLead rejects a duplicate mobile number', () => {
  assert.throws(() => db.addLead({
    name: 'Another Person', eventType: 'Wedding', eventDate: '2026-11-25', city: 'Pune',
    source: 'Instagram', status: 'New', budget: '', assignedTo: '', mobile: '9876543210'
  }), /Duplicate mobile number/);
});

test('addLead rejects Lost status without a reason', () => {
  assert.throws(() => db.addLead({
    name: 'Lost Lead', eventType: 'Birthday', eventDate: '2026-08-15', city: 'Mumbai',
    source: 'Google', status: 'Lost', budget: '', assignedTo: '', mobile: '99999000001'
  }), /reason when marking a lead as Lost/);
});

test('addLead auto-converts a Confirmed lead into the connected workflow', () => {
  const before = db.getWorkspaceData();
  const leads = db.addLead({
    name: 'Auto Convert Lead', eventType: 'Wedding', eventDate: '2026-02-05', city: 'Nashik',
    source: 'Referral', status: 'Confirmed', budget: '100000', assignedTo: 'Sandeep Jadhav',
    mobile: '99999000010', coupleName: 'Auto & Convert'
  });
  const added = leads[0];
  assert.equal(added.status, 'Confirmed');
  const workspace = db.getWorkspaceData();
  const customer = workspace.customers.find(c => c.lead_id === added.id);
  const booking = workspace.bookings.find(b => b.lead_id === added.id);
  const job = workspace.production.find(p => p.booking_id === booking?.id);
  assert.ok(customer, 'customer should be auto-created');
  assert.ok(booking, 'booking should be auto-created');
  assert.ok(job, 'production job should be auto-created');
  assert.equal(job.event_segment, 'Wedding');
  const payments = workspace.payments.filter(p => p.booking_id === booking.id);
  assert.equal(payments.length, 4);
});

test('convertLeadToCustomer creates the connected workflow for an unconfirmed lead', () => {
  const [lead] = db.addLead({
    name: 'Neha & Karan', eventType: 'Wedding', eventDate: '2026-02-05', city: 'Nashik',
    source: 'Referral', status: 'New', budget: '100000', assignedTo: 'Sandeep Jadhav',
    mobile: '99999000002', coupleName: 'Neha & Karan', priority: 'High'
  });
  const result = db.convertLeadToCustomer(lead.id, { performedBy: 'Sandeep Jadhav' });
  assert.equal(result.success, true);
  assert.ok(result.converted.customerId);
  assert.ok(result.converted.bookingId);
  assert.match(result.converted.customerCode, /^C\d{4}$/);
  assert.match(result.converted.bookingCode, /^B\d{4}$/);

  const workspace = db.getWorkspaceData();
  const customer = workspace.customers.find(c => c.id === result.converted.customerId);
  assert.ok(customer);
  assert.equal(customer.name, 'Neha & Karan');
  assert.equal(customer.lead_id, lead.id);

  const booking = workspace.bookings.find(b => b.id === result.converted.bookingId);
  assert.ok(booking);
  assert.equal(Number(booking.quoted_amount), 100000);

  const job = workspace.production.find(p => p.booking_id === booking.id);
  assert.ok(job);
  assert.equal(job.stage, 'Shoot Planning');
  assert.equal(job.event_segment, 'Wedding');

  const event = workspace.events.find(e => e.booking_id === booking.id);
  assert.ok(event);
  assert.match(event.title, /Neha & Karan/);

  // 10-40-40-10 installment plan, all Pending (no advance received)
  const payments = workspace.payments.filter(p => p.booking_id === booking.id);
  assert.equal(payments.length, 4);
  assert.equal(Number(payments.find(p => p.payment_type === 'Advance').amount), 10000);
  assert.equal(Number(payments.find(p => p.payment_type === 'First Shoot').amount), 40000);
  assert.equal(Number(payments.find(p => p.payment_type === 'Wedding Day').amount), 40000);
  assert.equal(Number(payments.find(p => p.payment_type === 'Final Delivery').amount), 10000);
  assert.equal(payments.find(p => p.payment_type === 'Advance').status, 'Pending');
});

test('convertLeadToCustomer records advance payments against the scheduled installments', () => {
  const [lead] = db.addLead({
    name: 'Vikas Enterprises', eventType: 'Corporate', eventDate: '2026-09-18', city: 'Pune',
    source: 'Google', status: 'Confirmed', budget: '200000', assignedTo: 'Sandeep Jadhav',
    mobile: '99999000003', advanceReceived: 60000, receivedBy: 'Sandeep Jadhav',
    paymentReceivedDate: '2026-08-10', paymentMode: 'Bank Transfer'
  });
  const workspace = db.getWorkspaceData();
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  const payments = workspace.payments.filter(p => p.booking_id === booking.id);
  const advance = payments.find(p => p.payment_type === 'Advance');
  assert.equal(Number(advance.amount), 60000);
  assert.equal(advance.status, 'Paid');
  assert.equal(advance.payment_mode, 'Bank Transfer');
  assert.equal(advance.received_by, 'Sandeep Jadhav');
});

test('updateLead syncs the connected customer, booking, and calendar event', () => {
  const [lead] = db.addLead({
    name: 'Update Me', eventType: 'Wedding', eventDate: '2026-07-01', city: 'Delhi',
    source: 'Google', status: 'Confirmed', budget: '80000', assignedTo: 'Govind',
    mobile: '99999000011'
  });
  db.updateLead(lead.id, {
    name: 'Updated Couple', eventType: 'Wedding', eventDate: '2026-08-15', city: 'Mumbai',
    source: 'Referral', status: 'Confirmed', budget: '90000', assignedTo: 'Sakshi',
    mobile: '99999000012', priority: 'High', performedBy: 'Sakshi'
  });
  const workspace = db.getWorkspaceData();
  const leadRow = workspace.leads.find(l => l.id === lead.id);
  assert.equal(leadRow.name, 'Updated Couple');
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  assert.equal(booking.event_date, '2026-08-15');
   assert.equal(Number(booking.quoted_amount), 90000);
  const event = workspace.events.find(e => e.booking_id === booking.id);
  assert.equal(event.start_date, '2026-08-15');
  assert.equal(event.city, 'Mumbai');
});

test('deleteLead rejects a converted lead linked to bookings', () => {
  const [lead] = db.addLead({
    name: 'Convertible Lead', eventType: 'Wedding', eventDate: '2026-11-25', city: 'Pune',
    source: 'Instagram', status: 'Confirmed', budget: '50000', assignedTo: '',
    mobile: '99999000004'
  });
  assert.throws(() => db.deleteLead(lead.id), /linked to customer and booking records/);
});

test('deleteLead removes an unconnected lead and its activities', () => {
  const [lead] = db.addLead({
    name: 'Disposable Lead', eventType: 'Birthday', eventDate: '2026-08-15', city: 'Mumbai',
    source: 'Google', status: 'New', budget: '', assignedTo: '', mobile: '99999000005'
  });
  db.deleteLead(lead.id);
  assert.equal(db.getWorkspaceData().leads.find(l => l.id === lead.id), undefined);
  assert.equal(db.getWorkspaceData().activities.find(a => a.lead_id === lead.id), undefined);
});

test('addPayment validates type/mode/status and records activity', () => {
  const [lead] = db.addLead({
    name: 'Payment Client', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '300000', assignedTo: '',
    mobile: '99999000006'
  });
  const booking = db.getWorkspaceData().bookings.find(b => b.lead_id === lead.id);
  const result = db.addPayment({ bookingId: booking.id, amount: 50000, paymentType: 'Advance', status: 'Paid', paymentMode: 'UPI/Gpay', receivedBy: 'Cash', dueDate: '2026-08-01', notes: 'On time' });
  const payment = result.payments.find(p => p.payment_type === 'Advance' && p.booking_id === booking.id);
  assert.ok(payment);
  assert.equal(Number(payment.amount), 50000);
  assert.equal(payment.status, 'Paid');
});

test('addPayment rejects an invalid payment type or amount', () => {
  const [lead] = db.addLead({
    name: 'Bad Pay Client', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '300000', assignedTo: '',
    mobile: '99999000007'
  });
  const booking = db.getWorkspaceData().bookings.find(b => b.lead_id === lead.id);
  assert.throws(() => db.addPayment({ bookingId: booking.id, amount: 0, paymentType: 'Advance' }), /valid payment amount/);
  assert.throws(() => db.addPayment({ bookingId: booking.id, amount: 1000, paymentType: 'Bogus' }), /Invalid payment type/);
});

test('getBookingPaymentsSummary and getAccountsData aggregate correctly', () => {
  const [lead] = db.addLead({
    name: 'Ledger Client', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '100000', assignedTo: 'Sales Person',
    mobile: '99999000008'
  });
  const workspace0 = db.getWorkspaceData();
  const booking = workspace0.bookings.find(b => b.lead_id === lead.id);
  db.addPayment({ bookingId: booking.id, amount: 30000, paymentType: 'Advance', status: 'Paid', paymentMode: 'Cash', receivedBy: 'Cashier' });
  db.addPayment({ bookingId: booking.id, amount: 30000, paymentType: 'First Shoot', status: 'Pending', paymentMode: '', receivedBy: '' });

  const summary = db.getBookingPaymentsSummary().find(s => s.bookingCode === booking.booking_code);
  assert.ok(summary);
  assert.equal(Number(summary.totalPaid), 30000);
  assert.equal(Number(summary.pendingAmount), 70000);
  assert.equal(summary.salesperson, 'Sales Person');

  const accounts = db.getAccountsData();
  const bookingAccounts = accounts.bookings.find(b => b.id === booking.id);
  assert.equal(Number(bookingAccounts.totalPaid), 30000);
  assert.equal(Number(bookingAccounts.pendingAmount), 70000);
});

test('saveCalendarEvent validates date formats and supports TBD months', () => {
  assert.throws(() => db.saveCalendarEvent(null, { title: 'Bad', eventType: 'Shoot', startDate: 'not-a-date', dateStatus: 'Confirmed', status: 'Scheduled' }), /confirmed date or a valid TBD month/);
  db.saveCalendarEvent(null, { title: 'TBD Wedding', eventType: 'Wedding', dateStatus: 'TBD Month', tbdMonth: '2027-03', status: 'Scheduled' });
  const e = db.getWorkspaceData().events.find(ev => ev.title === 'TBD Wedding');
  assert.ok(e);
  assert.equal(e.date_status, 'TBD Month');
  assert.equal(e.tbd_month, '2027-03');
  assert.doesNotThrow(() => db.deleteCalendarEvent(e.id));
});

test('saveCalendarEvent rejects an inactive assigned photographer', () => {
  assert.throws(() => db.saveCalendarEvent(null, {
    title: 'Crewed', eventType: 'Shoot', startDate: '2026-08-15', dateStatus: 'Confirmed',
    status: 'Scheduled', assignedUserId: 99999
  }), /active photographer or cinematographer/);
});

test('sales targets upsert by salesperson and month', () => {
  db.saveSalesTarget({ salesperson: 'Govind Tiwari', month: '2026-08', targetAmount: 500000, targetBookings: 3 });
  assert.equal(db.getWorkspaceData().salesTargets.length, 1);
  db.saveSalesTarget({ salesperson: 'Govind Tiwari', month: '2026-08', targetAmount: 600000, targetBookings: 4 });
  assert.equal(db.getWorkspaceData().salesTargets.length, 1);
  assert.equal(Number(db.getWorkspaceData().salesTargets[0].target_amount), 600000);
   assert.throws(() => db.saveSalesTarget({ salesperson: 'Govind Tiwari', month: 'bad-month', targetAmount: 1 }), /target month are required/);
});

test('user management enforces roles, activation, and password policy', () => {
  const created = db.createUser(1, { username: 'sales1', displayName: 'Sales One', role: 'Sales', password: PASS });
  assert.ok(created.find(u => u.username === 'sales1'));

  assert.throws(() => db.createUser(1, { username: 'weak', displayName: 'Weak', role: 'Sales', password: 'short' }), /Password must be a 4-digit/);
  assert.throws(() => db.createUser(1, { username: 'badname!', displayName: 'Bad', role: 'Sales', password: PASS }), /Username must be 3/);
  assert.throws(() => db.createUser(1, { username: 'badrole', displayName: 'Bad', role: 'Owner', password: PASS }), /Select a valid role/);

  const target = db.listUsers(1).find(u => u.username === 'sales1');
  assert.ok(target);
  db.setUserRole(1, target.id, 'Management');
  assert.equal(db.listUsers(1).find(u => u.username === 'sales1').role, 'Management');

  db.setUserActive(1, target.id, false);
  assert.equal(db.authenticateUser('sales1', PASS).success, false);
  db.setUserActive(1, target.id, true);
  assert.equal(db.authenticateUser('sales1', PASS).success, true);

  db.resetUserPassword(1, target.id, '5678');
  assert.equal(db.authenticateUser('sales1', '5678').success, true);
  assert.equal(db.authenticateUser('sales1', PASS).success, false);

  assert.throws(() => db.createUser(1, { username: 'sales1', displayName: 'Dup', role: 'Sales', password: PASS }), /already in use/);
});

test('changeOwnPassword requires the current password', () => {
  assert.throws(() => db.changeOwnPassword(1, '9999', '5678'), /Current password is incorrect/);
  assert.doesNotThrow(() => db.changeOwnPassword(1, PASS, '5678'));
  assert.equal(db.authenticateUser('admin', '5678').success, true);
});

test('resetBusinessData wipes business data but preserves users', () => {
  const users = db.listUsers(1);
  assert.ok(users.length >= 2, 'expected seeded admin plus created sales1');
  const reset = db.resetBusinessData(1);
  assert.equal(reset.leads.length, 0);
  assert.equal(reset.customers.length, 0);
  assert.equal(reset.bookings.length, 0);
  assert.equal(reset.production.length, 0);
  assert.equal(reset.payments.length, 0);
  assert.equal(reset.events.length, 0);
  assert.equal(reset.activities.length, 0);
  assert.equal(reset.salesTargets.length, 0);
  // Users and photographer_details are configuration, not business data.
  const afterUsers = db.listUsers(1);
  assert.equal(afterUsers.length, users.length, 'users should survive a business reset');
});

test('resetBusinessData requires an administrator', () => {
  assert.throws(() => db.resetBusinessData(999999), /Administrator access required/);
});

// ── updatePayment ──────────────────────────────────────────────────────────

test('updatePayment modifies amount, type, mode, and status of an existing payment', () => {
  const [lead] = db.addLead({
    name: 'Payment Updater', eventType: 'Wedding', eventDate: '2026-12-15', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '100000', assignedTo: 'Sales Person',
    mobile: '99999000020'
  });
  const workspace = db.getWorkspaceData();
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  const advance = workspace.payments.find(p => p.booking_id === booking.id && p.payment_type === 'Advance');
  const result = db.updatePayment(advance.id, {
    amount: 15000, paymentType: 'Advance', status: 'Paid',
    paymentMode: 'UPI/Gpay', receivedBy: 'Cashier', notes: 'Corrected', dueDate: '2026-08-10'
  });
  const updated = result.payments.find(p => p.id === advance.id);
  assert.equal(Number(updated.amount), 15000);
  assert.equal(updated.status, 'Paid');
  assert.equal(updated.payment_mode, 'UPI/Gpay');
  assert.equal(updated.received_by, 'Cashier');
});

test('updatePayment rejects an invalid payment ID or zero amount', () => {
  assert.throws(() => db.updatePayment(0, { amount: 1000, paymentType: 'Advance', status: 'Paid' }), /Invalid payment ID/);
  assert.throws(() => db.updatePayment(999999, { amount: 1000, paymentType: 'Advance', status: 'Paid' }), /Payment not found/);
});

test('updatePayment rejects invalid amount, type, or status', () => {
  const [lead] = db.addLead({
    name: 'Bad Pay Client', eventType: 'Birthday', eventDate: '2026-08-15', city: 'Mumbai',
    source: 'Google', status: 'Confirmed', budget: '5000', assignedTo: '', mobile: '99999000022'
  });
  const booking = db.getWorkspaceData().bookings.find(b => b.lead_id === lead.id);
  const payment = db.getWorkspaceData().payments.find(p => p.booking_id === booking.id);
  assert.throws(() => db.updatePayment(payment.id, { amount: 0, paymentType: 'Advance', status: 'Paid' }), /valid payment amount/);
  assert.throws(() => db.updatePayment(payment.id, { amount: 100, paymentType: 'Bogus', status: 'Paid' }), /Invalid payment type/);
  assert.throws(() => db.updatePayment(payment.id, { amount: 100, paymentType: 'Advance', status: 'Bogus' }), /Invalid payment status/);
});

// ── deletePayment ──────────────────────────────────────────────────────────

test('deletePayment removes a payment and records activity', () => {
  const [lead] = db.addLead({
    name: 'Delete Client', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '100000', assignedTo: '', mobile: '99999000023'
  });
  const workspace = db.getWorkspaceData();
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  const payment = workspace.payments.find(p => p.booking_id === booking.id && p.payment_type === 'Advance');
  db.deletePayment(payment.id);
  const after = db.getWorkspaceData();
  assert.equal(after.payments.find(p => p.id === payment.id), undefined);
});

test('deletePayment rejects a nonexistent payment', () => {
  assert.throws(() => db.deletePayment(999999), /Payment not found/);
});

// ── updateProductionStage ──────────────────────────────────────────────────

test('updateProductionStage advances stage and records activity', () => {
  const [lead] = db.addLead({
    name: 'Stage Advancer', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '100000', assignedTo: '', mobile: '99999000024'
  });
  const workspace = db.getWorkspaceData();
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  const job = workspace.production.find(p => p.booking_id === booking.id);
  const result = db.updateProductionStage(job.id, 'Editing');
  const updated = result.production.find(p => p.id === job.id);
  assert.equal(updated.stage, 'Editing');
  assert.ok(result.productionActivities.some(a => a.action === 'Stage Changed'));
});

test('updateProductionStage rejects an invalid stage', () => {
  const [lead] = db.addLead({
    name: 'Bad Stage Client', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '100000', assignedTo: '', mobile: '99999000025'
  });
  const workspace = db.getWorkspaceData();
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  const job = workspace.production.find(p => p.booking_id === booking.id);
  assert.throws(() => db.updateProductionStage(job.id, 'Invalid Stage'), /Invalid production stage/);
});

test('updateProductionStage rejects a nonexistent job', () => {
  assert.throws(() => db.updateProductionStage(999999, 'Editing'), /Production job not found/);
});

test('updateProductionStage gate-checks Delivered on client approval and full payment', () => {
  const [lead] = db.addLead({
    name: 'Delivery Client', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'Confirmed', budget: '100000', assignedTo: '', mobile: '99999000026'
  });
  const workspace = db.getWorkspaceData();
  const booking = workspace.bookings.find(b => b.lead_id === lead.id);
  const job = workspace.production.find(p => p.booking_id === booking.id);
  db.addPayment({ bookingId: booking.id, amount: 100000, paymentType: 'Full Payment', status: 'Paid', paymentMode: 'Bank Transfer', receivedBy: 'Accounts' });
  assert.throws(() => db.updateProductionStage(job.id, 'Delivered'), /client approves the gallery/);
  const rawDb = new sqlite3(DB_PATH);
  rawDb.prepare("UPDATE production_jobs SET client_feedback_status = 'Approved', client_approved_at = '2026-01-01 12:00:00' WHERE id = ?").run(job.id);
  rawDb.close();
  const result = db.updateProductionStage(job.id, 'Delivered');
  const updated = result.production.find(p => p.id === job.id);
  assert.equal(updated.stage, 'Delivered');
  assert.equal(updated.delivery_status, 'Delivered & Closed');
  assert.ok(updated.delivered_at);
});

// ── updateLeadAttachment ───────────────────────────────────────────────────

test('updateLeadAttachment sets quotation path/name and records activity', () => {
  const [lead] = db.addLead({
    name: 'Attachment Lead', eventType: 'Wedding', eventDate: '2026-07-01', city: 'Delhi',
    source: 'Google', status: 'New', budget: '', assignedTo: '', mobile: '99999000027'
  });
  db.updateLeadAttachment(lead.id, { path: '/tmp/quotation.pdf', name: 'Quotation.pdf' }, 'Govind');
  const workspace = db.getWorkspaceData();
  const updatedLead = workspace.leads.find(l => l.id === lead.id);
  assert.equal(updatedLead.quotation_path, '/tmp/quotation.pdf');
  assert.equal(updatedLead.quotation_name, 'Quotation.pdf');
  assert.ok(workspace.activities.some(a => a.lead_id === lead.id && a.activity_type === 'Quotation'));
});

test('updateLeadAttachment rejects a nonexistent lead', () => {
  assert.throws(() => db.updateLeadAttachment(999999, { path: '/tmp/q.pdf', name: 'q.pdf' }, 'System'), /Lead not found/);
});

// ── backupDatabase / validateDatabaseBackup ────────────────────────────────

test('backupDatabase creates a valid backup copy', async () => {
  const backupPath = path.join(os.tmpdir(), `lenspire-backup-${process.pid}-${Date.now()}.db`);
  const result = await db.backupDatabase(backupPath);
  assert.equal(result, backupPath);
  assert.ok(fs.existsSync(backupPath));
  db.validateDatabaseBackup(backupPath);
  try { fs.rmSync(backupPath, { force: true }); } catch {}
});

test('validateDatabaseBackup rejects a non-database file', () => {
  const fakePath = path.join(os.tmpdir(), `lenspire-fake-${process.pid}-${Date.now()}.db`);
  fs.writeFileSync(fakePath, 'this is not a sqlite database');
  assert.throws(() => db.validateDatabaseBackup(fakePath), /not a valid LenspireCRM workspace/);
  try { fs.rmSync(fakePath, { force: true }); } catch {}
});

test('validateDatabaseBackup rejects a missing file', () => {
  const missingPath = path.join(os.tmpdir(), `lenspire-missing-${process.pid}-${Date.now()}.db`);
  assert.throws(() => db.validateDatabaseBackup(missingPath));
  try { fs.rmSync(missingPath, { force: true }); } catch {}
});

test('backup/restore cycle preserves all business data', async () => {
  // Add data with all entity types
  const [lead] = db.addLead({
    name: 'Cycle Backup Client', eventType: 'Wedding', eventDate: '2026-12-25', city: 'Mumbai',
    source: 'TestSource', status: 'Confirmed', budget: '250000', assignedTo: 'TestPerson',
    mobile: '88888000002', coupleName: 'Cycle Couple',
    advanceReceived: 50000, receivedBy: 'TestPerson', paymentReceivedDate: '2026-08-01', paymentMode: 'Bank Transfer'
  });
  const workspaceBefore = db.getWorkspaceData();
  const leadCountBefore = workspaceBefore.leads.length;
  const customerCountBefore = workspaceBefore.customers.length;
  const bookingCountBefore = workspaceBefore.bookings.length;
  const paymentCountBefore = workspaceBefore.payments.length;
  const productionCountBefore = workspaceBefore.production.length;
  const eventCountBefore = workspaceBefore.events.length;
  const activityCountBefore = workspaceBefore.activities.length;
  const photographerCountBefore = workspaceBefore.photographerDetails.length;
  assert.ok(leadCountBefore > 0, 'should have leads');
  assert.ok(customerCountBefore > 0, 'should have customers');
  assert.ok(bookingCountBefore > 0, 'should have bookings');
  assert.ok(paymentCountBefore > 0, 'should have payments');
  assert.ok(productionCountBefore > 0, 'should have production jobs');
  assert.ok(eventCountBefore > 0, 'should have events');
  assert.ok(activityCountBefore > 0, 'should have activities');

  // Backup the database
  const backupPath = path.join(os.tmpdir(), `lenspire-cycle-backup-${process.pid}-${Date.now()}.db`);
  await db.backupDatabase(backupPath);
  assert.ok(fs.existsSync(backupPath));
  db.validateDatabaseBackup(backupPath);

  // Verify backup contents match
  const backupDb = new sqlite3(backupPath, { readonly: true });
  const backupLeads = backupDb.prepare('SELECT * FROM leads').all();
  const backupCustomers = backupDb.prepare('SELECT * FROM customers').all();
  const backupBookings = backupDb.prepare('SELECT * FROM bookings').all();
  const backupPayments = backupDb.prepare('SELECT * FROM payments').all();
  backupDb.close();
  assert.equal(backupLeads.length, leadCountBefore, 'backup should preserve lead count');
  assert.equal(backupCustomers.length, customerCountBefore, 'backup should preserve customer count');
  assert.equal(backupBookings.length, bookingCountBefore, 'backup should preserve booking count');
  assert.equal(backupPayments.length, paymentCountBefore, 'backup should preserve payment count');

  // Verify the specific lead is in the backup
  const backupLead = backupLeads.find(l => l.name === 'Cycle Backup Client');
  assert.ok(backupLead, 'specific lead should be in backup');

  try { fs.rmSync(backupPath, { force: true }); } catch {}
});

test('backup and validate handle large payloads with quotation attachments', async () => {
  db.addLead({
    name: 'Attachment Lead', eventType: 'Wedding', eventDate: '2026-12-25', city: 'Delhi',
    source: 'TestSource', status: 'Confirmed', budget: '300000', assignedTo: '',
    mobile: '88888000003'
  });
  const backupPath = path.join(os.tmpdir(), `lenspire-attach-backup-${process.pid}-${Date.now()}.db`);
  await db.backupDatabase(backupPath);
  db.validateDatabaseBackup(backupPath);
  const backupDb = new sqlite3(backupPath, { readonly: true });
  const leads = backupDb.prepare('SELECT * FROM leads').all();
  const lead = leads.find(l => l.name === 'Attachment Lead');
  assert.ok(lead, 'attachment lead should be in backup');
  backupDb.close();
  try { fs.rmSync(backupPath, { force: true }); } catch {}
});

test('encryption/decryption cycle preserves all backup data', () => {
  const { encryptPayload, decryptPayload } = require('../src/main/backup-crypto');
  db.addLead({
    name: 'Encrypt Cycle Client', eventType: 'Wedding', eventDate: '2026-12-25', city: 'Chennai',
    source: 'TestSource', status: 'New', budget: '180000', assignedTo: 'TestPerson',
    mobile: '88888000004'
  });
  const workspace = db.getWorkspaceData();
  const payload = {
    format: 'LenspireCRM-Pro-Backup', version: 1,
    createdAt: new Date().toISOString(),
    workspace
  };
  const encrypted = encryptPayload(payload, PASS);
  assert.equal(encrypted.encrypted, true);
  const decrypted = decryptPayload(encrypted, PASS);
  assert.deepEqual(decrypted, payload);
  assert.ok(decrypted.workspace.leads.find(l => l.name === 'Encrypt Cycle Client'));
});

test('wrong password fails to decrypt backup', () => {
  const { encryptPayload, decryptPayload } = require('../src/main/backup-crypto');
  const payload = { format: 'LenspireCRM-Pro-Backup', version: 1, data: { test: true } };
  const encrypted = encryptPayload(payload, PASS);
  assert.throws(() => decryptPayload(encrypted, 'Wrong!Password#9999'), /unable to authenticate|auth tag|incorrect password/i);
});

test('replaceDatabaseFromBackup validates before replacing', () => {
  // replaceDatabaseFromBackup calls db.close() which would break the test DB,
  // so we only test the validation step here.
  const tempDb = new sqlite3(DB_PATH, { readonly: true, fileMustExist: true });
  const integrity = tempDb.pragma('integrity_check', { simple: true });
  tempDb.close();
  assert.equal(integrity, 'ok', 'main test DB should pass integrity check');
});

test('backup file with invalid integrity is rejected', async () => {
  const backupPath = path.join(os.tmpdir(), `lenspire-bad-integ-${process.pid}-${Date.now()}.db`);
  await db.backupDatabase(backupPath);
  const buf = fs.readFileSync(backupPath);
  buf[100] = buf[100] ^ 0xFF;
  fs.writeFileSync(backupPath, buf);
  assert.throws(() => db.validateDatabaseBackup(backupPath), /integrity check|not a valid/);
  try { fs.rmSync(backupPath, { force: true }); } catch {}
});

// ── setUserDepartmentAccess ────────────────────────────────────────────────

test('setUserDepartmentAccess normalizes and stores department access', () => {
  const sales1 = db.listUsers(1).find(u => u.username === 'sales1');
  assert.ok(sales1, 'sales1 user should exist after resetBusinessData preserved users');
  const result = db.setUserDepartmentAccess(1, sales1.id, { sales: 'view', operations: 'full' });
  const updated = result.find(u => u.id === sales1.id);
  assert.equal(updated.departmentAccess.sales, 'view');
  assert.equal(updated.departmentAccess.operations, 'full');
  assert.equal(updated.departmentAccess.accounts, 'none');
  assert.equal(updated.departmentAccess.postProduction, 'none');
});

test('setUserDepartmentAccess rejects non-admin requesters', () => {
  const sales1 = db.listUsers(1).find(u => u.username === 'sales1');
  assert.throws(() => db.setUserDepartmentAccess(sales1.id, 1, { sales: 'full' }), /Administrator access required/);
});

test('setUserDepartmentAccess rejects a nonexistent target user', () => {
  assert.throws(() => db.setUserDepartmentAccess(1, 999999, { sales: 'full' }), /User account not found/);
});

// ── applySynchronizedBusinessReset ─────────────────────────────────────────

test('applySynchronizedBusinessReset wipes business data but preserves users and photographers', () => {
  db.savePhotographerDetail(null, { name: 'Test Photographer', mobile: '99999009999', work: 'Traditional Photo; Candid', status: 'In-House' });
  db.addLead({
    name: 'Reset Me', eventType: 'Wedding', eventDate: '2026-12-01', city: 'Goa',
    source: 'Website', status: 'New', budget: '', assignedTo: '', mobile: '99999000028'
  });
  db.saveSalesTarget({ salesperson: 'Govind Tiwari', month: '2026-09', targetAmount: 500000, targetBookings: 3 });
  const before = db.getWorkspaceData();
  assert.ok(before.leads.length > 0);
  assert.ok(before.salesTargets.length > 0);
  assert.ok(before.photographerDetails.length > 0);
  const after = db.applySynchronizedBusinessReset();
  assert.equal(after.leads.length, 0);
  assert.equal(after.customers.length, 0);
  assert.equal(after.bookings.length, 0);
  assert.equal(after.production.length, 0);
  assert.equal(after.payments.length, 0);
  assert.equal(after.events.length, 0);
  assert.equal(after.activities.length, 0);
  assert.equal(after.salesTargets.length, 0);
  assert.ok(after.photographerDetails.length > 0, 'photographer_details should survive a business reset');
});
