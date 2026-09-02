import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function updateDb() {
  const c = await pool.connect();
  try {
    await c.query(`
      ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
      ALTER TABLE registrations ADD CONSTRAINT registrations_status_check 
        CHECK (status IN ('confirmed', 'pending_payment', 'cancelled', 'pending_review', 'approved', 'rejected'));

      -- Set ENGIE to pending_payment
      UPDATE registrations 
      SET status = 'pending_payment' 
      WHERE registration_no = 'EWA-EXH-204918';

      UPDATE payments 
      SET status = 'pending', paid_at = null 
      WHERE registration_id = (SELECT id FROM registrations WHERE registration_no = 'EWA-EXH-204918');

      -- Set ACWA to confirmed
      UPDATE registrations 
      SET status = 'confirmed' 
      WHERE registration_no = 'EWA-EXH-109281';

      -- Set abstracts to pending_review
      UPDATE registrations 
      SET status = 'pending_review' 
      WHERE registration_type = 'abstract';

      -- Set visitors to confirmed
      UPDATE registrations 
      SET status = 'confirmed' 
      WHERE registration_type = 'visitor';
    `);
    console.log('Database synced with combined statuses.');
  } catch (e) {
    console.error('Migration error:', e);
  } finally {
    c.release();
    await pool.end();
  }
}

updateDb();
