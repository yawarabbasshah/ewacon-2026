import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const c = await pool.connect();
  try {
    console.log('Running migration v3...');

    // 1. Email verifications table
    await c.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL,
        code varchar(10) NOT NULL,
        expires_at timestamptz NOT NULL,
        attempts int DEFAULT 0,
        verified boolean DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_email_verif_email ON email_verifications(email);
    `);

    // 2. Add columns to registrations
    await c.query(`
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS badge_sent_at timestamptz;
      ALTER TABLE registrations ADD COLUMN IF NOT EXISTS badge_delivery_status varchar(30) DEFAULT 'pending';
      
      -- Existing confirmed records can be marked email_verified
      UPDATE registrations SET email_verified = true WHERE status = 'confirmed';
    `);

    // 3. Ensure payments constraints and columns
    await c.query(`
      ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
      ALTER TABLE payments ADD CONSTRAINT payments_status_check 
        CHECK (status IN ('pending', 'paid', 'failed', 'refunded'));
    `);

    // 4. Ensure activity_logs columns
    await c.query(`
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS entity_name varchar(255);
      ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS registration_no varchar(50);
    `);

    console.log('Migration v3 completed successfully.');
  } catch (err) {
    console.error('Migration v3 failed:', err);
  } finally {
    c.release();
    await pool.end();
  }
}

migrate();
