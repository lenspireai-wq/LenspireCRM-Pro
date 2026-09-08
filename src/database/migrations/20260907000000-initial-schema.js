const { createMigration } = require('../runner');

module.exports = createMigration(
    '20260907000000-initial-schema',
    function up(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_code TEXT UNIQUE,
                name TEXT NOT NULL,
                mobile TEXT,
                event_type TEXT NOT NULL,
                event_date DATE,
                city TEXT,
                source TEXT,
                status TEXT DEFAULT 'New',
                priority TEXT DEFAULT 'Medium',
                budget DECIMAL(14, 2),
                assigned_to TEXT,
                notes TEXT,
                next_followup_at DATETIME,
                lost_reason TEXT,
                client_name TEXT,
                client_mobile TEXT,
                couple_name TEXT,
                wedding_dates TEXT DEFAULT '[]',
                total_closing DECIMAL(14, 2),
                payment_mode TEXT,
                advance_received DECIMAL(14, 2),
                received_by TEXT,
                payment_received_date DATE,
                referred_by TEXT,
                referral_code TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
            CREATE INDEX IF NOT EXISTS idx_leads_event_date ON leads(event_date);
            CREATE INDEX IF NOT EXISTS idx_leads_mobile ON leads(mobile);

            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_code TEXT UNIQUE,
                lead_id INTEGER REFERENCES leads(id),
                name TEXT NOT NULL,
                mobile TEXT NOT NULL,
                event_type TEXT,
                event_date DATE,
                city TEXT,
                status TEXT DEFAULT 'Active',
                total_bookings INTEGER DEFAULT 0,
                total_revenue DECIMAL(14, 2) DEFAULT 0,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_customers_lead ON customers(lead_id);
            CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);

            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_code TEXT UNIQUE,
                lead_id INTEGER REFERENCES leads(id),
                customer_id INTEGER REFERENCES customers(id),
                event_type TEXT NOT NULL,
                event_date DATE,
                city TEXT,
                venue TEXT,
                status TEXT DEFAULT 'Confirmed',
                package_name TEXT,
                total_amount DECIMAL(14, 2),
                advance_amount DECIMAL(14, 2),
                balance_amount DECIMAL(14, 2),
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_bookings_lead ON bookings(lead_id);
            CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
            CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
            CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);

            CREATE TABLE IF NOT EXISTS production_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id INTEGER REFERENCES bookings(id),
                customer_id INTEGER REFERENCES customers(id),
                stage TEXT DEFAULT 'Shoot Planning',
                raw_status TEXT DEFAULT 'Pending',
                editing_status TEXT DEFAULT 'Not Started',
                album_status TEXT DEFAULT 'Not Started',
                video_status TEXT DEFAULT 'Not Started',
                delivery_status TEXT DEFAULT 'Pending',
                event_segment TEXT,
                source_event_id INTEGER,
                editor_id INTEGER,
                due_date DATE,
                client_approval_status TEXT DEFAULT 'Pending',
                client_approved_at DATETIME,
                approval_notes TEXT,
                delivery_method TEXT,
                photo_delivery_status TEXT DEFAULT 'Pending',
                video_delivery_status TEXT DEFAULT 'Pending',
                album_delivery_status TEXT DEFAULT 'Pending',
                delivered_at DATETIME,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_production_booking ON production_jobs(booking_id);
            CREATE INDEX IF NOT EXISTS idx_production_status ON production_jobs(delivery_status);

            CREATE TABLE IF NOT EXISTS calendar_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id INTEGER REFERENCES bookings(id),
                customer_id INTEGER REFERENCES customers(id),
                title TEXT NOT NULL,
                event_type TEXT DEFAULT 'Shoot',
                start_date DATE,
                start_time TIME,
                end_time TIME,
                city TEXT,
                status TEXT DEFAULT 'Scheduled',
                assigned_user_id INTEGER,
                notes TEXT,
                slotted BOOLEAN DEFAULT 0,
                client_name TEXT,
                handled_by TEXT,
                couple_name TEXT,
                contact_no TEXT,
                photo TEXT,
                video TEXT,
                candid TEXT,
                cinematic TEXT,
                drone TEXT,
                assistant TEXT,
                bts TEXT,
                date_status TEXT DEFAULT 'Confirmed',
                tbd_month TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_events_date ON calendar_events(start_date);
            CREATE INDEX IF NOT EXISTS idx_events_status ON calendar_events(status);
            CREATE INDEX IF NOT EXISTS idx_events_booking ON calendar_events(booking_id);

            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id INTEGER REFERENCES bookings(id),
                customer_id INTEGER REFERENCES customers(id),
                amount DECIMAL(14, 2) NOT NULL,
                payment_type TEXT DEFAULT 'Advance',
                status TEXT DEFAULT 'Pending',
                payment_mode TEXT,
                received_by TEXT,
                notes TEXT,
                due_date DATE,
                paid_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
            CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
            CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

            CREATE TABLE IF NOT EXISTS sales_targets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                executive_id INTEGER,
                month INTEGER NOT NULL,
                year INTEGER NOT NULL,
                target_amount DECIMAL(14, 2) NOT NULL,
                achieved_amount DECIMAL(14, 2) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(executive_id, month, year)
            );

            CREATE TABLE IF NOT EXISTS sales_executives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                mobile TEXT,
                email TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS photographers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                mobile TEXT,
                email TEXT,
                specialization TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS photographer_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                photographer_id INTEGER REFERENCES photographers(id),
                event_id INTEGER REFERENCES calendar_events(id),
                role TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS production_activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id INTEGER REFERENCES production_jobs(id),
                action TEXT NOT NULL,
                old_value TEXT,
                new_value TEXT,
                performed_by TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_production_activities_job ON production_activities(job_id);

            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entity_type TEXT NOT NULL,
                entity_id INTEGER NOT NULL,
                action TEXT NOT NULL,
                description TEXT,
                performed_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity_type, entity_id);
        `);
    },
    function down(db) {
        db.exec(`
            DROP TABLE IF EXISTS activities;
            DROP TABLE IF EXISTS production_activities;
            DROP TABLE IF EXISTS photographer_details;
            DROP TABLE IF EXISTS photographers;
            DROP TABLE IF EXISTS sales_executives;
            DROP TABLE IF EXISTS sales_targets;
            DROP TABLE IF EXISTS payments;
            DROP TABLE IF EXISTS calendar_events;
            DROP TABLE IF EXISTS production_jobs;
            DROP TABLE IF EXISTS bookings;
            DROP TABLE IF EXISTS customers;
            DROP TABLE IF EXISTS leads;
        `);
    }
);
