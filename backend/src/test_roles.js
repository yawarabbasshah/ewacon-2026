import 'dotenv/config';

async function testRoleSegregation() {
  console.log('--- Testing Research Director ---');
  let res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'research@ewacon.sa', password: 'Research@2026' })
  });
  let data = await res.json();
  let token = data.token;
  console.log('Research Director login:', data.admin?.role);

  let regRes = await fetch('http://localhost:5000/api/admin/registrations', {
    headers: { Authorization: 'Bearer ' + token }
  });
  let rows = await regRes.json();
  console.log('Records visible to Research Director:', rows.length);
  console.log('Types visible:', [...new Set(rows.map(r => r.registration_type))]);

  console.log('\n--- Testing Event Operations ---');
  res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'event@ewacon.sa', password: 'Event@2026' })
  });
  data = await res.json();
  token = data.token;
  console.log('Event Operations login:', data.admin?.role);

  regRes = await fetch('http://localhost:5000/api/admin/registrations', {
    headers: { Authorization: 'Bearer ' + token }
  });
  rows = await regRes.json();
  console.log('Records visible to Event Operations:', rows.length);
  console.log('Types visible:', [...new Set(rows.map(r => r.registration_type))]);
}

testRoleSegregation();
