import 'dotenv/config';
import pg from 'pg';

async function testVerification() {
  const email = 'test.attendee@ewa.edu.sa';
  console.log('1. Sending verification code...');
  const res1 = await fetch('http://localhost:5000/api/auth/send-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  console.log('Result 1:', await res1.json());

  // Check code in db
  const p = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const c = await p.connect();
  const rows = (await c.query('SELECT code, expires_at FROM email_verifications WHERE email = $1 ORDER BY created_at DESC LIMIT 1', [email])).rows;
  console.log('Stored code:', rows[0]);

  console.log('\n2. Testing incorrect code verification...');
  const resBad = await fetch('http://localhost:5000/api/auth/verify-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: '000000' })
  });
  console.log('Bad code response:', await resBad.json());

  console.log('\n3. Testing correct code verification...');
  const resGood = await fetch('http://localhost:5000/api/auth/verify-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: rows[0].code })
  });
  console.log('Good code response:', await resGood.json());

  c.release();
  await p.end();
}

testVerification();
