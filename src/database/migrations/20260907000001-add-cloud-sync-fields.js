const { createMigration } = require('./runner');

module.exports = createMigration(
    '20260907000001-add-cloud-sync-fields',
    function up(db) {
        db.exec(`
            ALTER TABLE leads ADD COLUMN cloud_id TEXT;
            ALTER TABLE leads ADD COLUMN sync_status TEXT DEFAULT 'local';
            ALTER TABLE leads ADD COLUMN last_synced_at DATETIME;

            ALTER TABLE customers ADD COLUMN cloud_id TEXT;
            ALTER TABLE customers ADD COLUMN sync_status TEXT DEFAULT 'local';
            ALTER TABLE customers ADD COLUMN last_synced_at DATETIME;

            ALTER TABLE bookings ADD COLUMN cloud_id TEXT;
            ALTER TABLE bookings ADD COLUMN sync_status TEXT DEFAULT 'local';
            ALTER TABLE bookings ADD COLUMN last_synced_at DATETIME;

            ALTER TABLE production_jobs ADD COLUMN cloud_id TEXT;
            ALTER TABLE production_jobs ADD COLUMN sync_status TEXT DEFAULT 'local';
            ALTER TABLE production_jobs ADD COLUMN last_synced_at DATETIME;

            ALTER TABLE calendar_events ADD COLUMN cloud_id TEXT;
            ALTER TABLE calendar_events ADD COLUMN sync_status TEXT DEFAULT 'local';
            ALTER TABLE calendar_events ADD COLUMN last_synced_at DATETIME;

            ALTER TABLE payments ADD COLUMN cloud_id TEXT;
            ALTER TABLE payments ADD COLUMN sync_status TEXT DEFAULT 'local';
            ALTER TABLE payments ADD COLUMN last_synced_at DATETIME;

            CREATE INDEX IF NOT EXISTS idx_leads_cloud_id ON leads(cloud_id);
            CREATE INDEX IF NOT EXISTS idx_leads_sync_status ON leads(sync_status);
            
            CREATE INDEX IF NOT EXISTS idx_customers_cloud_id ON customers(cloud_id);
            CREATE INDEX IF NOT EXISTS idx_customers_sync_status ON customers(sync_status);
            
            CREATE INDEX IF NOT EXISTS idx_bookings_cloud_id ON bookings(cloud_id);
            CREATE INDEX IF NOT EXISTS idx_bookings_sync_status ON bookings(sync_status);
            
            CREATE INDEX IF NOT EXISTS idx_production_cloud_id ON production_jobs(cloud_id);
            CREATE INDEX IF NOT EXISTS idx_production_sync_status ON production_jobs(sync_status);
            
            CREATE INDEX IF NOT EXISTS idx_events_cloud_id ON calendar_events(cloud_id);
            CREATE INDEX IF NOT EXISTS idx_events_sync_status ON calendar_events(sync_status);
            
            CREATE INDEX IF NOT EXISTS idx_payments_cloud_id ON payments(cloud_id);
            CREATE INDEX IF NOT EXISTS idx_payments_sync_status ON payments(sync_status);
        `);
    },
    function down(db) {
        db.exec(`
            CREATE TABLE leads_backup AS SELECT 
                id, lead_code, name, mobile, event_type, event_date, city, source, 
                status, priority, budget, assigned_to, notes, next_followup_at, 
                lost_reason, client_name, client_mobile, couple_name, wedding_dates,
                total_closing, payment_mode, advance_received, received_by,
                payment_received_date, referred_by, referral_code, created_at, updated_at
            FROM leads;
            
            DROP TABLE leads;
            ALTER TABLE leads_backup RENAME TO leads;
            
            CREATE TABLE customers_backup AS SELECT 
                id, customer_code, lead_id, name, mobile, event_type, event_date,
                city, status, total_bookings, total_revenue, notes, created_at, updated_at
            FROM customers;
            
            DROP TABLE customers;
            ALTER TABLE customers_backup RENAME TO customers;
            
            CREATE TABLE bookings_backup AS SELECT 
                id, booking_code, lead_id, customer_id, event_type, event_date, city,
                venue, status, package_name, total_amount, advance_amount, balance_amount,
                notes, created_at, updated_at
            FROM bookings;
            
            DROP TABLE bookings;
            ALTER TABLE bookings_backup RENAME TO bookings;
            
            CREATE TABLE production_jobs_backup AS SELECT 
                id, booking_id, customer_id, stage, raw_status, editing_status,
                album_status, video_status, delivery_status, event_segment, source_event_id,
                editor_id, due_date, client_approval_status, client_approved_at, approval_notes,
                delivery_method, photo_delivery_status, video_delivery_status, album_delivery_status,
                delivered_at, notes, created_at, updated_at
            FROM production_jobs;
            
            DROP TABLE production_jobs;
            ALTER TABLE production_jobs_backup RENAME TO production_jobs;
            
            CREATE TABLE calendar_events_backup AS SELECT *
            FROM calendar_events;
            
            DROP TABLE calendar_events;
            ALTER TABLE calendar_events_backup RENAME TO calendar_events;
            
            CREATE TABLE payments_backup AS SELECT 
                id, booking_id, customer_id, amount, payment_type, status, payment_mode,
                received_by, notes, due_date, paid_at, created_at, updated_at
            FROM payments;
            
            DROP TABLE payments;
            ALTER TABLE payments_backup RENAME TO payments;
        `);
    }
);
