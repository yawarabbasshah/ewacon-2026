import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Altering database tables...');
    await client.query(`
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS abstract_title text;
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS abstract_text text;
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS author_name varchar(150);
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS affiliation varchar(200);
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS address text;
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS attachment_name varchar(255);
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS attachment_data text;
      
      -- Update registrations type constraint if needed
      ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_registration_type_check;
      ALTER TABLE registrations ADD CONSTRAINT registrations_registration_type_check CHECK (registration_type IN ('visitor', 'exhibitor', 'abstract', 'sponsor'));
      
      -- Update admin role constraint
      ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_role_check;
      ALTER TABLE admins ADD CONSTRAINT admins_role_check CHECK (role IN ('superadmin', 'event_manager', 'research_manager', 'finance', 'admin', 'viewer'));
    `);
    console.log('Columns and constraints updated successfully.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
