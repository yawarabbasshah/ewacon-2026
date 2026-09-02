import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import pg from 'pg';
import { sendVerificationEmail, sendBadgeEmail, sendPasswordEmail, sendBroadcastEmail } from './services/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '25mb' }));
app.use(morgan('combined'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 150 }));

const q = async (text, params = []) => {
  const c = await pool.connect();
  try {
    return (await c.query(text, params)).rows;
  } finally {
    c.release();
  }
};

const auth = (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    req.user = jwt.verify(h.replace('Bearer ', ''), process.env.JWT_SECRET || 'change-this-to-a-long-random-secret');
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Activity Logger with Field Diffs and Entity Association
const logActivity = async ({
  adminId,
  action,
  entityType,
  entityId,
  entityName,
  registrationNo,
  details = {}
}) => {
  try {
    await q(
      `INSERT INTO activity_logs(admin_id, action, entity_type, entity_id, entity_name, registration_no, details) 
       VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        adminId || null,
        action,
        entityType,
        entityId || null,
        entityName || details.entity_name || null,
        registrationNo || details.registration_no || null,
        JSON.stringify(details)
      ]
    );
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
};

// Helper: Badge Email Delivery & Tracking
const sendBadgeToAttendee = async (regId, actorId, isResend = false) => {
  const regRows = await q(
    `SELECT r.*, sp.name AS package_name, b.booth_no 
     FROM registrations r 
     LEFT JOIN sponsorship_packages sp ON sp.id = r.package_id 
     LEFT JOIN booth_assignments ba ON ba.registration_id = r.id 
     LEFT JOIN booths b ON b.id = ba.booth_id 
     WHERE r.id = $1`,
    [regId]
  );
  if (!regRows[0]) return { success: false, error: 'Registration not found' };

  const reg = regRows[0];

  // Prevent accidental duplicate sending if already sent and not an explicit resend
  if (reg.badge_delivery_status === 'delivered' && !isResend) {
    return { success: true, alreadySent: true, email: reg.email };
  }

  // Generate QR Code data for pass
  const qrData = await QRCode.toDataURL(JSON.stringify({
    ref: reg.registration_no,
    name: reg.full_name || reg.author_name,
    org: reg.organization || reg.affiliation,
    type: reg.registration_type,
    event: 'EWACON 2026'
  }));

  // Update badge delivery status
  await q(
    `UPDATE registrations SET 
      badge_sent_at = now(), 
      badge_delivery_status = 'delivered', 
      updated_at = now() 
     WHERE id = $1`,
    [regId]
  );

  // Fetch actor details
  let actorName = 'System';
  if (actorId) {
    const adminRows = await q('SELECT full_name, email FROM admins WHERE id = $1', [actorId]);
    if (adminRows[0]) actorName = adminRows[0].full_name;
  }

  // Record in detailed activity history
  await logActivity({
    adminId: actorId || null,
    action: isResend ? 'badge.resent' : 'badge.delivered',
    entityType: 'badge',
    entityId: reg.id,
    entityName: reg.full_name || reg.author_name,
    registrationNo: reg.registration_no,
    details: {
      action_title: isResend ? 'Badge Resent to Attendee' : 'Badge Delivered to Attendee',
      recipient_name: reg.full_name || reg.author_name,
      recipient_email: reg.email,
      registration_no: reg.registration_no,
      category: reg.registration_type,
      sent_by: actorName,
      delivered_at: new Date().toISOString()
    }
  });

  // Dispatch badge pass to attendee via SMTP
  sendBadgeEmail({
    toEmail: reg.email,
    name: reg.full_name || reg.author_name,
    regNo: reg.registration_no,
    category: reg.registration_type,
    organization: reg.organization || reg.affiliation,
    qrDataUrl: qrData
  }).catch((err) => console.error('Badge email dispatch error:', err.message));

  return { success: true, email: reg.email, qr: qrData };
};

// Health Check
app.get('/api/health', (_, res) => res.json({ ok: true, event: 'EWACON 2026' }));

// Public: Get packages
app.get('/api/public/packages', async (_, res) => {
  try {
    const rows = await q('SELECT id, name, price, currency, description, benefits FROM sponsorship_packages ORDER BY price DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: Get available booths
app.get('/api/public/booths', async (_, res) => {
  try {
    const rows = await q(`
      SELECT b.*, ba.registration_id, r.organization 
      FROM booths b 
      LEFT JOIN booth_assignments ba ON ba.booth_id = b.id 
      LEFT JOIN registrations r ON r.id = ba.registration_id 
      ORDER BY b.booth_no ASC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- AUTHENTICATION ---

// Standard Email / Password Sign In
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const rows = await q('SELECT * FROM admins WHERE email = $1 AND active = true', [email]);
    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const admin = rows[0];
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, fullName: admin.full_name },
      process.env.JWT_SECRET || 'change-this-to-a-long-random-secret',
      { expiresIn: '12h' }
    );

    await logActivity({
      adminId: admin.id,
      action: 'auth.login',
      entityType: 'user',
      entityId: admin.id,
      entityName: admin.full_name,
      details: {
        action_title: 'User Signed In',
        method: 'Password Authentication',
        email: admin.email,
        role: admin.role
      }
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

// Google Sign-In ("Continue with Google")
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google Sign-In' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if account with matching verified email already exists
    let admin = (await q('SELECT * FROM admins WHERE LOWER(email) = $1', [cleanEmail]))[0];

    if (!admin) {
      // Create internal account using Google identity
      const defaultRole = cleanEmail.includes('research') ? 'research_manager' : 'event_manager';
      const randomPassword = Math.random().toString(36).slice(-10);
      const hash = await bcrypt.hash(randomPassword, 10);
      const newAdminRows = await q(
        `INSERT INTO admins(full_name, email, password_hash, role, active) 
         VALUES($1, $2, $3, $4, true) RETURNING id, full_name, email, role, active`,
        [name || cleanEmail.split('@')[0], cleanEmail, hash, defaultRole]
      );
      admin = newAdminRows[0];

      await logActivity({
        adminId: admin.id,
        action: 'user.created_google',
        entityType: 'user',
        entityId: admin.id,
        entityName: admin.full_name,
        details: {
          action_title: 'Account Created via Google',
          email: cleanEmail,
          role: defaultRole
        }
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, fullName: admin.full_name },
      process.env.JWT_SECRET || 'change-this-to-a-long-random-secret',
      { expiresIn: '12h' }
    );

    await logActivity({
      adminId: admin.id,
      action: 'auth.google_login',
      entityType: 'user',
      entityId: admin.id,
      entityName: admin.full_name,
      details: {
        action_title: 'Signed in with Google',
        method: 'Google OAuth',
        email: cleanEmail,
        role: admin.role
      }
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (e) {
    console.error('Google Sign-In error:', e);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Admin Profile Verification
app.get('/api/admin/me', auth, async (req, res) => {
  try {
    const rows = await q('SELECT id, full_name, email, role, created_at FROM admins WHERE id = $1 AND active = true', [req.user.id]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- EMAIL VERIFICATION CODE FLOW ---

// Send Verification Code
app.post('/api/auth/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });

    const cleanEmail = email.toLowerCase().trim();

    // Check rate limit: 45 seconds cooldown
    const recent = await q(
      `SELECT created_at FROM email_verifications 
       WHERE email = $1 AND created_at > now() - interval '45 seconds'`,
      [cleanEmail]
    );
    if (recent.length > 0) {
      return res.status(429).json({ error: 'Please wait a moment before requesting another verification code.' });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in database with 15-minute expiration
    await q(
      `INSERT INTO email_verifications(email, code, expires_at) 
       VALUES($1, $2, now() + interval '15 minutes')`,
      [cleanEmail, code]
    );

    await logActivity({
      action: 'email.code_sent',
      entityType: 'verification',
      details: {
        action_title: 'Verification Code Sent',
        email: cleanEmail,
        expires_in: '15 minutes'
      }
    });

    // Dispatch verification code via SMTP (sabbas@ewa.edu.sa)
    const emailResult = await sendVerificationEmail(cleanEmail, code);

    res.json({
      ok: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`,
      devMode: emailResult?.devMode || false,
      devCode: emailResult?.devMode ? code : undefined
    });

  } catch (e) {
    console.error('Send verification error:', e);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify Code
app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    // Find active, unverified code for this email
    const rows = await q(
      `SELECT * FROM email_verifications 
       WHERE email = $1 AND verified = false 
       ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail]
    );

    if (!rows[0]) {
      return res.status(400).json({ error: 'No active verification code found. Please request a new code.' });
    }

    const rec = rows[0];

    // Check if expired
    if (new Date() > new Date(rec.expires_at)) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Check code match
    if (rec.code !== cleanCode) {
      await q('UPDATE email_verifications SET attempts = attempts + 1 WHERE id = $1', [rec.id]);
      return res.status(400).json({ error: 'Incorrect verification code. Please check your email and try again.' });
    }

    // Mark verified
    await q('UPDATE email_verifications SET verified = true WHERE id = $1', [rec.id]);
    await q('UPDATE registrations SET email_verified = true WHERE LOWER(email) = $1', [cleanEmail]);

    await logActivity({
      action: 'email.verified',
      entityType: 'verification',
      details: {
        action_title: 'Email Address Verified',
        email: cleanEmail
      }
    });

    res.json({ ok: true, verified: true, message: 'Email address verified successfully.' });
  } catch (e) {
    console.error('Verify code error:', e);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// --- REGISTRATION MANAGEMENT & SUBMISSION ---

// Public Registration
app.post('/api/registrations', async (req, res) => {
  try {
    const {
      registrationType = 'visitor',
      fullName,
      organization,
      jobTitle,
      email,
      phone,
      country,
      packageId,
      billingContact,
      notes,
      boothId,
      abstractTitle,
      abstractText,
      authorName,
      affiliation,
      address,
      attachmentName,
      attachmentData
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }
    if (!['visitor', 'exhibitor', 'abstract'].includes(registrationType)) {
      return res.status(400).json({ error: 'Invalid registration category' });
    }

    const prefix = registrationType === 'exhibitor' ? 'EWA-EXH-' : registrationType === 'abstract' ? 'EWA-ABS-' : 'EWA-VIS-';
    const no = prefix + Math.floor(100000 + Math.random() * 900000);

    const initialStatus =
      registrationType === 'exhibitor'
        ? 'pending_payment'
        : registrationType === 'abstract'
        ? 'pending_review'
        : 'confirmed';

    const rows = await q(
      `INSERT INTO registrations(
        registration_no, registration_type, full_name, organization, job_title, email, phone, country,
        package_id, billing_contact, notes, abstract_title, abstract_text, author_name, affiliation,
        address, attachment_name, attachment_data, status, email_verified
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19, true) RETURNING *`,
      [
        no, registrationType, fullName, organization, jobTitle, email, phone, country,
        packageId || null, billingContact, notes, abstractTitle || null, abstractText || null,
        authorName || null, affiliation || null, address || null, attachmentName || null, attachmentData || null,
        initialStatus
      ]
    );

    const r = rows[0];

    // If Exhibitor, create pending payment record
    if (registrationType === 'exhibitor') {
      let price = 0;
      if (packageId) {
        const pkgRows = await q('SELECT price FROM sponsorship_packages WHERE id = $1', [packageId]);
        price = pkgRows[0] ? pkgRows[0].price : 0;
      }
      await q(
        'INSERT INTO payments(registration_id, amount, status, method) VALUES($1, $2, $3, $4)',
        [r.id, price, 'pending', 'bank_transfer']
      );

      if (boothId) {
        const bRows = await q('SELECT id FROM booths WHERE id::text = $1 OR booth_no = $1', [boothId]);
        if (bRows[0]) {
          await q(
            'INSERT INTO booth_assignments(booth_id, registration_id) VALUES($1, $2) ON CONFLICT DO NOTHING',
            [bRows[0].id, r.id]
          );
          await q("UPDATE booths SET status = 'reserved' WHERE id = $1", [bRows[0].id]);
        }
      }
    }

    // If visitor is confirmed immediately, send badge
    if (registrationType === 'visitor') {
      sendBadgeToAttendee(r.id, null, false).catch(() => {});
    }

    await logActivity({
      action: 'registration.created',
      entityType: 'registration',
      entityId: r.id,
      entityName: fullName,
      registrationNo: no,
      details: {
        action_title: 'New Registration Submitted',
        registration_no: no,
        category: registrationType,
        participant_name: fullName,
        email: email,
        organization: organization,
        status: initialStatus
      }
    });

    const qr = await QRCode.toDataURL(JSON.stringify({
      registrationId: r.id,
      registrationNo: no,
      type: registrationType,
      name: fullName,
      org: organization
    }));

    res.status(201).json({ registration: r, qr });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ error: 'Failed to process registration. Please try again.' });
  }
});

// Admin Dashboard KPIs
app.get('/api/admin/dashboard', auth, async (req, res) => {
  try {
    const role = req.user.role;
    const [totalReg, exhibitors, visitors, abstracts, paidPayments, totalRevenue, booths] = await Promise.all([
      q('SELECT count(*)::int n FROM registrations'),
      q("SELECT count(*)::int n FROM registrations WHERE registration_type = 'exhibitor'"),
      q("SELECT count(*)::int n FROM registrations WHERE registration_type = 'visitor'"),
      q("SELECT count(*)::int n FROM registrations WHERE registration_type = 'abstract'"),
      q("SELECT count(*)::int n FROM payments WHERE status = 'paid'"),
      q("SELECT COALESCE(sum(amount), 0)::numeric revenue FROM payments WHERE status = 'paid'"),
      q("SELECT count(*) FILTER(WHERE status = 'occupied') occupied, count(*) FILTER(WHERE status = 'reserved') reserved, count(*) FILTER(WHERE status = 'available') available, count(*) total FROM booths")
    ]);

    res.json({
      role,
      registrations: totalReg[0].n,
      exhibitors: exhibitors[0].n,
      visitors: visitors[0].n,
      abstracts: abstracts[0].n,
      paidPayments: paidPayments[0].n,
      revenue: Number(totalRevenue[0].revenue),
      booths: booths[0]
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin Registrations & Abstracts List (Role-restricted)
app.get('/api/admin/registrations', auth, async (req, res) => {
  try {
    const role = req.user.role;
    const search = (req.query.search || '').trim();
    let type = (req.query.type || '').trim();
    const status = (req.query.status || '').trim();

    let query = `
      SELECT 
        r.*, 
        sp.name AS package_name, 
        sp.price AS package_price, 
        p.id AS payment_id,
        p.status AS payment_status, 
        p.method AS payment_method,
        p.gateway_reference,
        p.paid_at AS payment_date,
        p.amount AS payment_amount,
        b.booth_no,
        b.id AS booth_db_id
      FROM registrations r
      LEFT JOIN sponsorship_packages sp ON sp.id = r.package_id
      LEFT JOIN payments p ON p.registration_id = r.id
      LEFT JOIN booth_assignments ba ON ba.registration_id = r.id
      LEFT JOIN booths b ON b.id = ba.booth_id
      WHERE 1=1
    `;
    const params = [];

    if (role === 'research_manager') {
      params.push('abstract');
      query += ` AND r.registration_type = $${params.length}`;
    } else if (role === 'event_manager') {
      params.push('abstract');
      query += ` AND r.registration_type != $${params.length}`;
    } else if (type && type !== 'all') {
      params.push(type);
      query += ` AND r.registration_type = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (r.full_name ILIKE $${params.length} OR r.email ILIKE $${params.length} OR r.registration_no ILIKE $${params.length} OR r.organization ILIKE $${params.length} OR r.abstract_title ILIKE $${params.length} OR r.author_name ILIKE $${params.length})`;
    }

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    }

    query += ' ORDER BY r.created_at DESC';

    const rows = await q(query, params);
    res.json(rows);
  } catch (e) {
    console.error('Fetch registrations error:', e);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Admin Add Complete Offline Registration
app.post('/api/admin/registrations', auth, async (req, res) => {
  try {
    const role = req.user.role;
    const {
      registrationType = 'visitor',
      fullName,
      email,
      organization,
      jobTitle,
      phone,
      country = 'Saudi Arabia',
      address,
      packageId,
      boothNo,
      notes,
      billingContact,
      paymentMethod = 'Bank Transfer',
      paymentRef,
      status,
      abstractTitle,
      abstractText,
      authorName,
      affiliation,
      attachmentName,
      attachmentData
    } = req.body;

    if (role === 'research_manager' && registrationType !== 'abstract') {
      return res.status(403).json({ error: 'Research directors can only add research abstracts.' });
    }
    if (role === 'event_manager' && registrationType === 'abstract') {
      return res.status(403).json({ error: 'Event operations can only add visitors and exhibitors.' });
    }

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    let finalStatus = status;
    if (!finalStatus) {
      finalStatus =
        registrationType === 'exhibitor'
          ? 'pending_payment'
          : registrationType === 'abstract'
          ? 'pending_review'
          : 'confirmed';
    }

    const prefix = registrationType === 'exhibitor' ? 'EWA-EXH-' : registrationType === 'abstract' ? 'EWA-ABS-' : 'EWA-VIS-';
    const no = prefix + Math.floor(100000 + Math.random() * 900000);

    const rows = await q(
      `INSERT INTO registrations(
        registration_no, registration_type, full_name, organization, job_title, email, phone, country,
        package_id, billing_contact, notes, abstract_title, abstract_text, author_name, affiliation, address,
        attachment_name, attachment_data, status, email_verified
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19, true) RETURNING *`,
      [
        no, registrationType, fullName, organization, jobTitle, email, phone, country,
        packageId || null, billingContact || null, notes || null,
        abstractTitle || null, abstractText || null, authorName || null, affiliation || null, address || null,
        attachmentName || null, attachmentData || null,
        finalStatus
      ]
    );
    const r = rows[0];

    // If exhibitor, record payment details
    if (registrationType === 'exhibitor') {
      let price = 0;
      if (packageId) {
        const pkgRows = await q('SELECT price FROM sponsorship_packages WHERE id = $1', [packageId]);
        price = pkgRows[0] ? pkgRows[0].price : 0;
      }
      const payStatus = finalStatus === 'confirmed' ? 'paid' : 'pending';
      const ref = paymentRef || 'OFFLINE-' + Date.now().toString().slice(-4);

      await q(
        `INSERT INTO payments(registration_id, amount, status, method, gateway_reference, paid_at) 
         VALUES($1, $2, $3, $4, $5, CASE WHEN $3 = 'paid' THEN now() ELSE null END)`,
        [r.id, price, payStatus, paymentMethod, ref]
      );

      if (boothNo) {
        const bRows = await q('SELECT id FROM booths WHERE booth_no = $1', [boothNo]);
        if (bRows[0]) {
          await q('INSERT INTO booth_assignments(booth_id, registration_id) VALUES($1, $2)', [bRows[0].id, r.id]);
          await q("UPDATE booths SET status = 'reserved' WHERE id = $1", [bRows[0].id]);
        }
      }
    }

    // If confirmed, trigger badge
    if (finalStatus === 'confirmed') {
      sendBadgeToAttendee(r.id, req.user.id, false).catch(() => {});
    }

    await logActivity({
      adminId: req.user.id,
      action: 'registration.created_offline',
      entityType: 'registration',
      entityId: r.id,
      entityName: fullName,
      registrationNo: no,
      details: {
        action_title: 'Offline Entry Added',
        registration_no: no,
        category: registrationType,
        participant_name: fullName,
        email: email,
        organization: organization,
        status: finalStatus
      }
    });

    res.status(201).json(r);
  } catch (e) {
    console.error('Error adding offline registration:', e);
    res.status(500).json({ error: 'Failed to create offline record' });
  }
});

// Admin Update Registration / Abstract Details
app.put('/api/admin/registrations/:id', auth, async (req, res) => {
  try {
    const {
      full_name,
      email,
      organization,
      job_title,
      phone,
      country,
      address,
      registration_type,
      status,
      notes,
      booth_no,
      package_id,
      abstract_title,
      abstract_text,
      author_name,
      affiliation,
      billing_contact
    } = req.body;

    // Fetch existing record for diff tracking
    const old = (await q('SELECT * FROM registrations WHERE id = $1', [req.params.id]))[0];
    if (!old) return res.status(404).json({ error: 'Record not found' });

    const r = await q(
      `UPDATE registrations SET 
        full_name = $1, email = $2, organization = $3, job_title = $4, phone = $5, 
        country = $6, address = $7, registration_type = $8, status = $9, notes = $10, package_id = $11,
        abstract_title = $12, abstract_text = $13, author_name = $14, affiliation = $15, billing_contact = $16,
        updated_at = now()
      WHERE id = $17 RETURNING *`,
      [
        full_name, email, organization, job_title, phone, country, address || null, registration_type, status, notes || null,
        package_id || null, abstract_title || null, abstract_text || null, author_name || null, affiliation || null, billing_contact || null,
        req.params.id
      ]
    );

    // Build field-by-field diff
    const changes = [];
    if (old.full_name !== full_name) changes.push({ field: 'Full Name', from: old.full_name, to: full_name });
    if (old.email !== email) changes.push({ field: 'Email', from: old.email, to: email });
    if (old.organization !== organization) changes.push({ field: 'Organization', from: old.organization || '—', to: organization || '—' });
    if (old.status !== status) changes.push({ field: 'Status', from: old.status, to: status });
    if (old.job_title !== job_title) changes.push({ field: 'Job Title', from: old.job_title || '—', to: job_title || '—' });

    // Handle booth assignment if exhibitor
    if (registration_type === 'exhibitor') {
      const oldAssignment = await q('DELETE FROM booth_assignments WHERE registration_id = $1 RETURNING booth_id', [req.params.id]);
      if (oldAssignment[0]) {
        await q("UPDATE booths SET status = 'available' WHERE id = $1", [oldAssignment[0].booth_id]);
      }

      if (booth_no && status !== 'cancelled') {
        const b = await q('SELECT id FROM booths WHERE booth_no = $1', [booth_no]);
        if (b[0]) {
          await q('INSERT INTO booth_assignments(booth_id, registration_id) VALUES($1, $2) ON CONFLICT (registration_id) DO UPDATE SET booth_id = $1', [b[0].id, req.params.id]);
          await q("UPDATE booths SET status = 'reserved' WHERE id = $1", [b[0].id]);
        }
      }
    }

    await logActivity({
      adminId: req.user.id,
      action: 'registration.updated',
      entityType: 'registration',
      entityId: r[0].id,
      entityName: r[0].full_name || r[0].author_name,
      registrationNo: r[0].registration_no,
      details: {
        action_title: 'Record Updated',
        registration_no: r[0].registration_no,
        changes
      }
    });

    res.json(r[0]);
  } catch (e) {
    console.error('Error updating registration:', e);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// --- PAYMENT CONFIRMATION FLOW (Fixes 500 error & Enforces required payment details) ---
app.post('/api/admin/registrations/:id/confirm-payment', auth, async (req, res) => {
  try {
    const {
      payment_method,
      payment_reference,
      payment_date,
      payment_amount,
      status = 'confirmed'
    } = req.body;

    // Requirement: A payment should not be marked as Confirmed without the required payment information
    if (!payment_method || !payment_method.trim()) {
      return res.status(400).json({ error: 'Payment method is required to confirm payment.' });
    }
    if (!payment_reference || !payment_reference.trim()) {
      return res.status(400).json({ error: 'Payment reference or transaction number is required to confirm payment.' });
    }
    if (!payment_date) {
      return res.status(400).json({ error: 'Payment date is required.' });
    }

    // Fetch existing registration
    const regRows = await q(
      `SELECT r.*, sp.name AS package_name, sp.price AS package_price 
       FROM registrations r 
       LEFT JOIN sponsorship_packages sp ON sp.id = r.package_id 
       WHERE r.id = $1`,
      [req.params.id]
    );
    if (!regRows[0]) return res.status(404).json({ error: 'Registration record not found' });
    const reg = regRows[0];

    // Fetch existing payment row if any
    const payRows = await q('SELECT * FROM payments WHERE registration_id = $1', [reg.id]);
    const oldPayment = payRows[0] || null;

    const previousStatus = reg.status;
    const finalAmount = Number(payment_amount || (oldPayment ? oldPayment.amount : reg.package_price) || 0);

    // Save payment details with explicit typed parameters
    let updatedPayment;
    if (oldPayment) {
      const pRes = await q(
        `UPDATE payments SET 
          status = 'paid', 
          method = $1, 
          gateway_reference = $2, 
          paid_at = $3, 
          amount = $4 
         WHERE registration_id = $5 RETURNING *`,
        [payment_method.trim(), payment_reference.trim(), new Date(payment_date), finalAmount, reg.id]
      );
      updatedPayment = pRes[0];
    } else {
      const pRes = await q(
        `INSERT INTO payments(registration_id, amount, status, method, gateway_reference, paid_at) 
         VALUES($1, $2, 'paid', $3, $4, $5) RETURNING *`,
        [reg.id, finalAmount, payment_method.trim(), payment_reference.trim(), new Date(payment_date)]
      );
      updatedPayment = pRes[0];
    }

    // Update registration status to confirmed
    const updatedRegRows = await q(
      'UPDATE registrations SET status = $1, updated_at = now() WHERE id = $2 RETURNING *',
      [status, reg.id]
    );
    const updatedReg = updatedRegRows[0];

    // Build individual diff records
    const changes = [
      { field: 'Status', from: previousStatus, to: status },
      { field: 'Payment Method', from: oldPayment?.method || '—', to: payment_method },
      { field: 'Reference Number', from: oldPayment?.gateway_reference || '—', to: payment_reference },
      { field: 'Payment Date', from: oldPayment?.paid_at ? new Date(oldPayment.paid_at).toLocaleDateString() : '—', to: new Date(payment_date).toLocaleDateString() },
      { field: 'Payment Amount', from: oldPayment?.amount ? `SAR ${Number(oldPayment.amount).toLocaleString()}` : '—', to: `SAR ${finalAmount.toLocaleString()}` }
    ];

    // Log detailed history
    await logActivity({
      adminId: req.user.id,
      action: 'payment.confirmed',
      entityType: 'payment',
      entityId: updatedPayment.id,
      entityName: reg.full_name,
      registrationNo: reg.registration_no,
      details: {
        action_title: 'Payment Confirmed',
        registration_no: reg.registration_no,
        entity_name: reg.full_name,
        payment_method: payment_method,
        payment_reference: payment_reference,
        payment_amount: finalAmount,
        payment_date: payment_date,
        changes
      }
    });

    // Automatically send official attendee badge upon confirmation
    sendBadgeToAttendee(reg.id, req.user.id, false).catch((err) => {
      console.error('Auto badge delivery error:', err);
    });

    res.json({
      success: true,
      registration: updatedReg,
      payment: updatedPayment,
      message: `Payment confirmed successfully for ${reg.registration_no}.`
    });
  } catch (e) {
    console.error('Payment confirmation error:', e);
    res.status(500).json({ error: 'Failed to confirm payment: ' + e.message });
  }
});

// Admin Quick Status Update Endpoint (Fixed typing bug)
app.patch('/api/admin/registrations/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'pending_payment', 'cancelled', 'pending_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const regRows = await q('SELECT * FROM registrations WHERE id = $1', [req.params.id]);
    if (!regRows[0]) return res.status(404).json({ error: 'Record not found' });
    const reg = regRows[0];
    const oldStatus = reg.status;

    // If an exhibitor is being marked confirmed, enforce payment details requirement!
    if (reg.registration_type === 'exhibitor' && status === 'confirmed') {
      const payRows = await q('SELECT * FROM payments WHERE registration_id = $1', [reg.id]);
      const pay = payRows[0];
      if (!pay || pay.status !== 'paid' || !pay.gateway_reference) {
        return res.status(400).json({
          error: 'Payment details (Method and Reference Number) are required to mark an exhibitor as Confirmed.',
          requiresPaymentForm: true
        });
      }
    }

    const r = await q('UPDATE registrations SET status = $1, updated_at = now() WHERE id = $2 RETURNING *', [status, req.params.id]);

    // If exhibitor cancelled or pending, sync payment status cleanly
    if (reg.registration_type === 'exhibitor') {
      const payStatus = status === 'confirmed' ? 'paid' : status === 'pending_payment' ? 'pending' : status === 'cancelled' ? 'refunded' : 'failed';
      await q(
        `UPDATE payments SET status = $1 WHERE registration_id = $2`,
        [payStatus, req.params.id]
      );
    }

    // If status changed to confirmed, trigger badge delivery
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      sendBadgeToAttendee(reg.id, req.user.id, false).catch(() => {});
    }

    const changes = [{ field: 'Status', from: oldStatus, to: status }];

    await logActivity({
      adminId: req.user.id,
      action: 'status.changed',
      entityType: 'registration',
      entityId: r[0].id,
      entityName: r[0].full_name || r[0].author_name,
      registrationNo: r[0].registration_no,
      details: {
        action_title: 'Status Updated',
        registration_no: r[0].registration_no,
        changes
      }
    });

    res.json(r[0]);
  } catch (e) {
    console.error('Error updating status:', e);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Admin Badge Delivery & Resend
app.post('/api/admin/registrations/:id/send-badge', auth, async (req, res) => {
  try {
    const result = await sendBadgeToAttendee(req.params.id, req.user.id, true);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to send badge' });
    }
    res.json({
      success: true,
      message: `Conference badge sent successfully to ${result.email}.`
    });
  } catch (e) {
    console.error('Error sending badge:', e);
    res.status(500).json({ error: 'Failed to send badge' });
  }
});

// Admin Delete / Cancel Registration
app.delete('/api/admin/registrations/:id', auth, async (req, res) => {
  try {
    const old = await q('DELETE FROM booth_assignments WHERE registration_id = $1 RETURNING booth_id', [req.params.id]);
    if (old[0]) {
      await q("UPDATE booths SET status = 'available' WHERE id = $1", [old[0].booth_id]);
    }

    const r = await q('DELETE FROM registrations WHERE id = $1 RETURNING *', [req.params.id]);
    if (!r[0]) return res.status(404).json({ error: 'Record not found' });

    await logActivity({
      adminId: req.user.id,
      action: 'registration.deleted',
      entityType: 'registration',
      entityId: r[0].id,
      entityName: r[0].full_name || r[0].author_name,
      registrationNo: r[0].registration_no,
      details: {
        action_title: 'Record Deleted',
        registration_no: r[0].registration_no
      }
    });

    res.json({ success: true, deleted: r[0] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// --- SUPERADMIN USER MANAGEMENT ---
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
  }
  next();
};

app.get('/api/admin/users', auth, requireSuperAdmin, async (_, res) => {
  try {
    const rows = await q('SELECT id, full_name, email, role, active, created_at FROM admins ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/users', auth, requireSuperAdmin, async (req, res) => {
  try {
    const { fullName, email, password, role = 'event_manager' } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }
    if (!['superadmin', 'event_manager', 'research_manager', 'finance'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    const hash = await bcrypt.hash(password, 10);
    const rows = await q(
      'INSERT INTO admins(full_name, email, password_hash, role, active) VALUES($1, $2, $3, $4, true) RETURNING id, full_name, email, role, active, created_at',
      [fullName, email.toLowerCase().trim(), hash, role]
    );

    await logActivity({
      adminId: req.user.id,
      action: 'user.created',
      entityType: 'user',
      entityId: rows[0].id,
      entityName: fullName,
      details: {
        action_title: 'User Account Created',
        email: email,
        role: role
      }
    });

    // Send credentials to user's email via SMTP
    sendPasswordEmail({
      toEmail: email.toLowerCase().trim(),
      name: fullName,
      password,
      role,
      isNewAccount: true
    }).catch((err) => console.error('Error emailing user credentials:', err.message));

    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'An account with this email already exists' });
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

app.delete('/api/admin/users/:id', auth, requireSuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }
    const rows = await q('DELETE FROM admins WHERE id = $1 RETURNING id, full_name, email, role', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });

    await logActivity({
      adminId: req.user.id,
      action: 'user.deleted',
      entityType: 'user',
      entityId: req.params.id,
      entityName: rows[0].full_name,
      details: {
        action_title: 'User Account Deleted',
        email: rows[0].email
      }
    });

    res.json({ success: true, deleted: rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.post('/api/admin/users/:id/reset-password', auth, requireSuperAdmin, async (req, res) => {
  try {
    const { newPassword, sendToEmail } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    const r = await q('UPDATE admins SET password_hash = $1 WHERE id = $2 RETURNING id, full_name, email, role', [hash, req.params.id]);
    if (!r[0]) return res.status(404).json({ error: 'User not found' });

    await logActivity({
      adminId: req.user.id,
      action: 'user.password_reset',
      entityType: 'user',
      entityId: req.params.id,
      entityName: r[0].full_name,
      details: {
        action_title: 'Password Reset',
        email: r[0].email,
        delivered_to: sendToEmail || r[0].email
      }
    });

    const destinationEmail = (sendToEmail && sendToEmail.trim()) || r[0].email;

    // Send new password to user's email via SMTP
    sendPasswordEmail({
      toEmail: destinationEmail,
      name: r[0].full_name,
      password: newPassword,
      role: r[0].role,
      isNewAccount: false
    }).catch((err) => console.error('Error emailing reset password:', err.message));

    res.json({
      success: true,
      sentTo: destinationEmail,
      fullName: r[0].full_name,
      message: `Password reset successfully and sent to ${destinationEmail}`
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Admin Broadcast / Group Email Dispatcher
app.post('/api/admin/broadcast-email', auth, async (req, res) => {
  try {
    const { recipientIds = [], targetGroup = 'selected', subject, message } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Email subject is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Email message content is required.' });
    }

    let queryText = '';
    let queryParams = [];

    if (targetGroup === 'selected') {
      if (!recipientIds || recipientIds.length === 0) {
        return res.status(400).json({ error: 'Please select at least one recipient.' });
      }
      queryText = 'SELECT id, full_name, author_name, email, registration_no, registration_type FROM registrations WHERE id = ANY($1)';
      queryParams = [recipientIds];
    } else if (targetGroup === 'all') {
      queryText = 'SELECT id, full_name, author_name, email, registration_no, registration_type FROM registrations';
    } else if (targetGroup === 'visitors') {
      queryText = "SELECT id, full_name, author_name, email, registration_no, registration_type FROM registrations WHERE registration_type = 'visitor'";
    } else if (targetGroup === 'exhibitors') {
      queryText = "SELECT id, full_name, author_name, email, registration_no, registration_type FROM registrations WHERE registration_type = 'exhibitor'";
    } else if (targetGroup === 'abstracts') {
      queryText = "SELECT id, full_name, author_name, email, registration_no, registration_type FROM registrations WHERE registration_type = 'abstract'";
    } else {
      queryText = 'SELECT id, full_name, author_name, email, registration_no, registration_type FROM registrations WHERE id = ANY($1)';
      queryParams = [recipientIds];
    }

    const regRows = await q(queryText, queryParams);
    const emails = regRows.map((r) => r.email).filter(Boolean);

    if (emails.length === 0) {
      return res.status(400).json({ error: 'No valid recipient email addresses found.' });
    }

    // Send emails via SMTP
    const result = await sendBroadcastEmail({
      toEmails: emails,
      subject: subject.trim(),
      message: message.trim(),
      senderName: req.user?.fullName || 'EWACON 2026 Admin'
    });

    // Log in audit activity history
    await logActivity({
      adminId: req.user.id,
      action: 'broadcast.sent',
      entityType: 'broadcast',
      details: {
        action_title: 'Broadcast Email Dispatched',
        subject: subject.trim(),
        recipients_count: result.sentCount || emails.length,
        target_group: targetGroup,
        sample_recipients: emails.slice(0, 5)
      }
    });

    res.json({
      success: true,
      sentCount: result.sentCount || emails.length,
      totalCount: emails.length,
      message: `Broadcast email successfully sent to ${result.sentCount || emails.length} recipients.`
    });
  } catch (e) {
    console.error('Broadcast email error:', e);
    res.status(500).json({ error: 'Failed to dispatch broadcast email: ' + e.message });
  }
});



// Admin Detailed Activity Audit Logs
app.get('/api/admin/activity', auth, async (req, res) => {
  try {
    const rows = await q(`
      SELECT 
        l.*, 
        a.full_name AS admin_name, 
        a.email AS admin_email, 
        a.role AS admin_role
      FROM activity_logs l 
      LEFT JOIN admins a ON a.id = l.admin_id 
      ORDER BY l.created_at DESC 
      LIMIT 300
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// Serve static frontend bundle from Express
app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EWACON API running on port ${PORT}`));


