import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function updateSchema() {
  const client = await pool.connect();
  try {
    console.log('Updating PostgreSQL constraints and statuses...');
    await client.query(`
      ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
      ALTER TABLE registrations ADD CONSTRAINT registrations_status_check 
        CHECK (status IN ('confirmed', 'pending_payment', 'pending', 'cancelled'));
      
      -- Update any existing exhibitor with pending payment
      UPDATE registrations 
      SET status = 'pending_payment' 
      WHERE registration_type = 'exhibitor' 
        AND id IN (SELECT registration_id FROM payments WHERE status = 'pending');
        
      UPDATE registrations 
      SET status = 'confirmed' 
      WHERE registration_type = 'visitor' OR id IN (SELECT registration_id FROM payments WHERE status = 'paid');
    `);
    console.log('Schema updated successfully.');
  } catch (err) {
    console.error('Update schema error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

updateSchema();
