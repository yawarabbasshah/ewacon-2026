import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function seedRealData() {
  const client = await pool.connect();
  try {
    console.log('Inserting initial real database records...');
    
    // 1. Get packages
    const pkgs = (await client.query('SELECT id, name, price FROM sponsorship_packages')).rows;
    const plat = pkgs.find(p => p.name.includes('Platinum'));
    const gold = pkgs.find(p => p.name.includes('Gold'));

    // 2. Insert Exhibitors with real payment records and booth assignments
    if (plat) {
      const exh1 = await client.query(`
        INSERT INTO registrations (registration_no, registration_type, full_name, organization, job_title, email, phone, country, package_id, status)
        VALUES ('EWA-EXH-109281', 'exhibitor', 'Eng. Faisal Al-Subaie', 'ACWA Power Global', 'VP of Green Energy Solutions', 'faisal.subaie@acwa.sa', '+966 50 123 4567', 'Saudi Arabia', $1, 'confirmed')
        ON CONFLICT (registration_no) DO NOTHING RETURNING id;
      `, [plat.id]);

      if (exh1.rows[0]) {
        const b1 = (await client.query("SELECT id FROM booths WHERE booth_no = 'B-01'")).rows[0];
        if (b1) {
          await client.query('INSERT INTO booth_assignments (booth_id, registration_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [b1.id, exh1.rows[0].id]);
          await client.query("UPDATE booths SET status = 'reserved' WHERE id = $1", [b1.id]);
        }
        await client.query("INSERT INTO payments (registration_id, amount, status, method, gateway_reference, paid_at) VALUES ($1, 300000, 'paid', 'bank_transfer', 'ACWA-WIRE-882910', now())", [exh1.rows[0].id]);
      }
    }

    if (gold) {
      const exh2 = await client.query(`
        INSERT INTO registrations (registration_no, registration_type, full_name, organization, job_title, email, phone, country, package_id, status)
        VALUES ('EWA-EXH-204918', 'exhibitor', 'Dr. Christian Moreau', 'ENGIE Middle East', 'Director of Smart Utilities', 'c.moreau@engie.com', '+966 54 888 9900', 'Saudi Arabia', $1, 'confirmed')
        ON CONFLICT (registration_no) DO NOTHING RETURNING id;
      `, [gold.id]);

      if (exh2.rows[0]) {
        const b2 = (await client.query("SELECT id FROM booths WHERE booth_no = 'B-02'")).rows[0];
        if (b2) {
          await client.query('INSERT INTO booth_assignments (booth_id, registration_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [b2.id, exh2.rows[0].id]);
          await client.query("UPDATE booths SET status = 'reserved' WHERE id = $1", [b2.id]);
        }
        await client.query("INSERT INTO payments (registration_id, amount, status, method, gateway_reference, paid_at) VALUES ($1, 100000, 'pending', 'bank_transfer', 'INV-ENGIE-2026', null)", [exh2.rows[0].id]);
      }
    }

    // 3. Insert Visitors (No payments needed, free entry)
    await client.query(`
      INSERT INTO registrations (registration_no, registration_type, full_name, organization, job_title, email, phone, country, status)
      VALUES 
      ('EWA-VIS-309182', 'visitor', 'Sarah Al-Ghamdi', 'KFUPM - Energy Center', 'Renewable Energy Researcher', 'sarah.ghamdi@kfupm.edu.sa', '+966 55 333 4455', 'Saudi Arabia', 'confirmed'),
      ('EWA-VIS-408192', 'visitor', 'Dr. Tariq Al-Otaibi', 'Ministry of Energy', 'Policy Advisor', 'tariq.otaibi@moenergy.gov.sa', '+966 50 777 6655', 'Saudi Arabia', 'confirmed')
      ON CONFLICT (registration_no) DO NOTHING;
    `);

    // 4. Insert Research Abstracts (For Research Manager)
    await client.query(`
      INSERT INTO registrations (
        registration_no, registration_type, full_name, email, phone, organization, country, status,
        abstract_title, abstract_text, author_name, affiliation, address
      )
      VALUES (
        'EWA-ABS-501928', 'abstract', 'Dr. Yousef Al-Ghazi', 'yousef.ghazi@kaust.edu.sa', '+966 56 111 2233', 'KAUST', 'Saudi Arabia', 'confirmed',
        'Next-Generation GaN Semiconductor Applications for Resilient Smart Grid Inverters',
        'This research explores the operational efficiency of wide-bandgap gallium nitride semiconductors in ultra-high efficiency solar and wind smart inverters operating under arid environmental conditions in Saudi Arabia.',
        'Dr. Yousef Al-Ghazi', 'King Abdullah University of Science and Technology (KAUST)', 'Thuwal, Makkah Province, Saudi Arabia'
      ),
      (
        'EWA-ABS-602819', 'abstract', 'Dr. Amal Al-Omari', 'amal.omari@kau.edu.sa', '+966 50 999 8877', 'King Abdulaziz University', 'Saudi Arabia', 'confirmed',
        'Integration of Advanced Desalination Power Systems with Solar PV Infrastructure in Western Province',
        'A comprehensive study analyzing the dynamic load management between municipal reverse osmosis plants and utility-scale solar arrays in western Saudi Arabia.',
        'Dr. Amal Al-Omari', 'King Abdulaziz University (Faculty of Engineering)', 'Jeddah, Saudi Arabia'
      )
      ON CONFLICT (registration_no) DO NOTHING;
    `);

    console.log('Real database records inserted successfully.');
  } catch (err) {
    console.error('Error inserting real data:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedRealData();
