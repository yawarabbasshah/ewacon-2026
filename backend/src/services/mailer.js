import nodemailer from 'nodemailer';
import 'dotenv/config';

// SMTP Configuration (Auto-detects Gmail or Microsoft 365 / custom SMTP)
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || 'ewainnovationvr1@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  if (!pass) {
    return null;
  }

  // Auto-detect Gmail
  const isGmail = host.includes('gmail') || user.includes('@gmail.com');

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: pass.replace(/\s+/g, '') // Strip spaces if user pasted 16-char Google App Password
      }
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const getSenderAddress = () => {
  return process.env.SMTP_FROM || `EWACON 2026 <${process.env.SMTP_USER || 'ewainnovationvr1@gmail.com'}>`;
};


/**
 * Send 6-digit Email Verification Code
 */
export const sendVerificationEmail = async (toEmail, code) => {
  const transporter = getTransporter();

  // If no password configured yet, log clearly to console for instant developer testing
  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[SMTP DEV MODE - NO PASSWORD CONFIGURED]`);
    console.log(`Verification code for ${toEmail}: >>> ${code} <<<`);
    console.log(`To send real emails, set SMTP_PASS in backend/.env`);
    console.log(`======================================================\n`);
    return {
      success: true,
      devMode: true,
      message: 'Code generated (SMTP password not yet configured in .env)'
    };
  }

  const mailOptions = {
    from: getSenderAddress(),
    to: toEmail,
    subject: `EWACON 2026 | رمز التحقق من البريد الإلكتروني - Verification Code: ${code}`,
    text: `Your EWACON 2026 verification code is: ${code}. This code will expire in 15 minutes.`,
    html: `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #071B2A;">
        <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #071B2A 0%, #126A6B 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">
              EWACON 2026
            </div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">رمز تأكيد البريد الإلكتروني</h1>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.85;">المؤتمر والمعرض الدولي للبيئة والمياه والطاقة النظيفة</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px; text-align: center;">
            <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px;">
              مرحباً بك،<br>
              يرجى استخدام رمز التحقق التالي لإتمام تسجيلك في مؤتمر <strong>EWACON 2026</strong>. الرمز صالح لمدة <strong>15 دقيقة</strong>:
            </p>

            <!-- OTP Box -->
            <div style="background: #F0FDFA; border: 2px dashed #0D9488; border-radius: 10px; padding: 18px 24px; margin: 0 auto 24px; display: inline-block;">
              <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0F766E;">
                ${code}
              </span>
            </div>

            <div dir="ltr" style="font-size: 14px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 20px; margin-top: 10px; text-align: center;">
              <p style="margin: 0 0 6px;">Your verification code for EWACON 2026 registration:</p>
              <strong style="font-size: 20px; color: #0F766E; letter-spacing: 4px;">${code}</strong>
              <p style="margin: 8px 0 0; font-size: 12px; color: #94A3B8;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94A3B8;">
            <p style="margin: 0 0 4px;">EWACON 2026 &copy; جميع الحقوق محفوظة</p>
            <p style="margin: 0;">مرسل بواسطة منصة التسجيل الرسمية (<a href="mailto:${process.env.SMTP_USER || 'sabbas@ewa.edu.sa'}" style="color: #0D9488; text-decoration: none;">${process.env.SMTP_USER || 'sabbas@ewa.edu.sa'}</a>)</p>
          </div>

        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Verification email sent to ${toEmail}: MessageId=${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send Attendee Badge & QR Pass Email
 */
export const sendBadgeEmail = async ({ toEmail, name, regNo, category, organization, qrDataUrl }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[SMTP DEV MODE] Badge email simulated for ${toEmail} (${regNo})`);
    return { success: true, devMode: true };
  }

  // Convert QR data URL to buffer for inline CID attachment
  let attachments = [];
  if (qrDataUrl && qrDataUrl.startsWith('data:image')) {
    const base64Data = qrDataUrl.replace(/^data:image\/\w+;base64,/, '');
    attachments.push({
      filename: `ewacon-badge-${regNo}.png`,
      content: Buffer.from(base64Data, 'base64'),
      cid: 'ewacon_badge_qr'
    });
  }

  const categoryTitle = category === 'visitor' ? 'حضور المؤتمر / Visitor' : category === 'exhibitor' ? 'عارض / Exhibitor' : 'باحث / Researcher';

  const mailOptions = {
    from: getSenderAddress(),
    to: toEmail,
    subject: `EWACON 2026 | بطاقة الحضور المعتمدة - Confirmed Badge: ${regNo}`,
    text: `Dear ${name},\nYour registration for EWACON 2026 is confirmed.\nRegistration No: ${regNo}\nCategory: ${category}\n\nPlease present your QR pass at the entrance.`,
    html: `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #071B2A;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.07); border: 1px solid #E2E8F0;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #071B2A 0%, #126A6B 100%); padding: 36px 28px; text-align: center; color: #ffffff;">
            <div style="display: inline-block; background: rgba(255,255,255,0.18); padding: 5px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px;">
              EWACON 2026 CONFIRMED BADGE
            </div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">بطاقة دخول المؤتمر الرسمية</h1>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">المؤتمر والمعرض الدولي للبيئة والمياه والطاقة النظيفة</p>
          </div>

          <!-- Attendee Information Card -->
          <div style="padding: 32px 28px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 20px; color: #071B2A;">${name}</h2>
              <p style="margin: 4px 0 0; color: #0D9488; font-weight: 700; font-size: 15px;">${organization || 'مشارك مستقل'}</p>
              <div style="display: inline-block; background: #E2ECEF; color: #071B2A; padding: 3px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-top: 8px;">
                ${categoryTitle}
              </div>
            </div>

            <!-- QR Code Section -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="margin: 0 0 14px; font-size: 13px; color: #64748B;">رمز الدخول السريع (يرجى إبرازه عند مدخل المؤتمر):</p>
              ${attachments.length > 0 ? `<img src="cid:ewacon_badge_qr" alt="QR Code Pass" style="width: 170px; height: 170px; border-radius: 8px; border: 1px solid #CBD5E1; padding: 8px; background: #fff;" />` : ''}
              <div style="margin-top: 12px; font-family: monospace; font-size: 16px; font-weight: 800; color: #071B2A; letter-spacing: 1px;">
                ${regNo}
              </div>
            </div>

            <!-- Conference Info -->
            <div style="font-size: 13px; color: #475569; background: #F0FDFA; padding: 16px; border-radius: 8px; border-inline-start: 4px solid #0D9488;">
              <strong>تفاصيل الفعالية | Event Details:</strong><br>
              • التاريخ / Date: 22 ديسمبر 2026 (22 December 2026)<br>
              • الموقع / Venue: أكاديمية الطاقة والمياه (إيوا - رابغ) · مركز أعمال أكوا (EWA Rabigh · ACWA Business Center)<br>
              • يُرجى إبراز هذا الرمز الرقمي عند الحضور لاستلام الشارة الرسمية.
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94A3B8;">
            <p style="margin: 0 0 4px;">EWACON 2026 &copy; جميع الحقوق محفوظة</p>
            <p style="margin: 0;">لأي استفسارات، تواصل معنا عبر: <a href="mailto:${process.env.SMTP_USER || 'sabbas@ewa.edu.sa'}" style="color: #0D9488; text-decoration: none;">${process.env.SMTP_USER || 'sabbas@ewa.edu.sa'}</a></p>
          </div>

        </div>
      </div>
    `,
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Badge email sent to ${toEmail}: MessageId=${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send badge to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send User Account Credentials / Password Reset Email
 */
export const sendPasswordEmail = async ({ toEmail, name, password, role, isNewAccount = false }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[SMTP DEV MODE - NO PASSWORD CONFIGURED]`);
    console.log(`Password for ${toEmail}: >>> ${password} <<<`);
    console.log(`======================================================\n`);
    return { success: true, devMode: true };
  }

  const roleTitle = role === 'superadmin' ? 'مدير النظام الرئيسي / Super Administrator' : role === 'research_manager' ? 'مدير الأبحاث / Research Director' : role === 'event_manager' ? 'مدير العمليات والفعالية / Event Operations' : 'مشرف / Staff Admin';

  const subject = isNewAccount 
    ? `EWACON 2026 | بيانات حساب الإشراف - Account Credentials`
    : `EWACON 2026 | كلمة المرور الجديدة - Password Reset`;

  const mailOptions = {
    from: getSenderAddress(),
    to: toEmail,
    subject,
    text: `Hello ${name},\nYour EWACON 2026 portal password is: ${password}\nEmail: ${toEmail}\nRole: ${role}\nPortal URL: http://localhost:5173/admin`,
    html: `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #071B2A;">
        <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <div style="background: linear-gradient(135deg, #071B2A 0%, #126A6B 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">
              EWACON 2026 PORTAL
            </div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">${isNewAccount ? 'بيانات حساب الإشراف' : 'تحديث كلمة المرور'}</h1>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.85;">المؤتمر والمعرض الدولي للبيئة والمياه والطاقة النظيفة</p>
          </div>

          <div style="padding: 32px 28px;">
            <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 20px;">
              مرحباً <strong>${name}</strong>،<br>
              ${isNewAccount ? 'تم إنشاء حساب إشرافي لك في بوابة إدارة مؤتمر EWACON 2026.' : 'تم تحديث كلمة المرور الخاصة بحسابك في بوابة الإشراف بنجاح.'}
            </p>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px; font-size: 14px;">
              <div style="margin-bottom: 8px;"><strong>البريد الإلكتروني:</strong> <span dir="ltr">${toEmail}</span></div>
              <div style="margin-bottom: 8px;"><strong>الدور الإداري:</strong> ${roleTitle}</div>
              <div>
                <strong>كلمة المرور:</strong> 
                <span dir="ltr" style="font-family: monospace; font-size: 16px; font-weight: 800; color: #0D9488; background: #fff; border: 1px solid #CBD5E1; padding: 2px 8px; border-radius: 4px; margin-inline-start: 6px;">
                  ${password}
                </span>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="http://localhost:5173/admin" style="display: inline-block; background: #0D9488; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">
                تسجيل الدخول إلى البوابة الإدارية
              </a>
            </div>

            <div dir="ltr" style="font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 16px;">
              For security, please change your password after logging in. If you did not request this, please notify the Super Administrator immediately.
            </div>
          </div>

          <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94A3B8;">
            EWACON 2026 &copy; جميع الحقوق محفوظة
          </div>

        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Password email sent to ${toEmail}: MessageId=${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send password email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send Group / Broadcast Announcement Email
 */
export const sendBroadcastEmail = async ({ toEmails, subject, message, senderName = 'EWACON 2026 Organizing Committee' }) => {
  const transporter = getTransporter();

  if (!toEmails || toEmails.length === 0) {
    return { success: false, error: 'No recipient emails specified.' };
  }

  // Deduplicate and clean emails
  const cleanEmails = Array.from(new Set(toEmails.map((e) => e?.toLowerCase().trim()).filter(Boolean)));

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[SMTP DEV MODE] Broadcast email simulated for ${cleanEmails.length} recipients:`);
    console.log(`Subject: ${subject}`);
    console.log(`Recipients: ${cleanEmails.join(', ')}`);
    console.log(`======================================================\n`);
    return { success: true, devMode: true, sentCount: cleanEmails.length };
  }

  // Format HTML message with paragraphs
  const formattedHtmlMessage = message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 12px; line-height: 1.6;">${p}</p>`)
    .join('');

  let sentCount = 0;
  let errors = [];

  for (const recipient of cleanEmails) {
    const mailOptions = {
      from: getSenderAddress(),
      to: recipient,
      subject: subject || 'EWACON 2026 | Conference Update',
      text: message,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #071B2A;">
          <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
            
            <div style="background: linear-gradient(135deg, #071B2A 0%, #126A6B 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
              <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px;">
                EWACON 2026 ANNOUNCEMENT
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800;">${subject}</h1>
              <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.85;">المؤتمر والمعرض الدولي للبيئة والمياه والطاقة النظيفة</p>
            </div>

            <div style="padding: 32px 28px; font-size: 15px; color: #334155;">
              ${formattedHtmlMessage}

              <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #F1F5F9; font-size: 13px; color: #64748B;">
                <strong>الجهة المنظمة / Organizing Body:</strong><br>
                أكاديمية الطاقة والمياه (EWA) · اللجنة التنظيمية لمؤتمر EWACON 2026
              </div>
            </div>

            <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94A3B8;">
              EWACON 2026 &copy; جميع الحقوق محفوظة · مرسل إلى ${recipient}
            </div>

          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      sentCount++;
      console.log(`[SMTP BROADCAST] Sent to ${recipient} (${sentCount}/${cleanEmails.length})`);
    } catch (err) {
      console.error(`[SMTP BROADCAST ERROR] Failed for ${recipient}:`, err.message);
      errors.push({ email: recipient, error: err.message });
    }
  }

  return {
    success: sentCount > 0,
    sentCount,
    total: cleanEmails.length,
    errors: errors.length > 0 ? errors : undefined
  };
};


