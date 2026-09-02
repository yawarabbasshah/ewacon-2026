import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Running database migrations...');
    const schemaSql = fs.readFileSync(path.resolve('../database/schema.sql'), 'utf-8');
    await client.query(schemaSql);

    console.log('Seeding superadmin and management users...');
    const superPassword = await bcrypt.hash('Admin@Ewacon2026', 10);
    const researchPassword = await bcrypt.hash('Research@2026', 10);
    const eventPassword = await bcrypt.hash('Event@2026', 10);

    // Insert superadmin
    await client.query(`
      INSERT INTO admins (full_name, email, password_hash, role, active)
      VALUES ($1, $2, $3, 'superadmin', true)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, role = 'superadmin', active = true
    `, ['Super Admin', 'admin@ewacon.sa', superPassword]);

    // Insert Research Manager (Abstracts only)
    await client.query(`
      INSERT INTO admins (full_name, email, password_hash, role, active)
      VALUES ($1, $2, $3, 'research_manager', true)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, role = 'research_manager', active = true
    `, ['Research Director', 'research@ewacon.sa', researchPassword]);

    // Insert Event Manager (Visitors & Exhibitors management)
    await client.query(`
      INSERT INTO admins (full_name, email, password_hash, role, active)
      VALUES ($1, $2, $3, 'event_manager', true)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, role = 'event_manager', active = true
    `, ['Event Operations Manager', 'event@ewacon.sa', eventPassword]);

    console.log('Database seeded successfully with Super Admin: admin@ewacon.sa / Admin@Ewacon2026');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
