import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testTls() {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  console.log(`Config: Host=${smtpHost}, User=${smtpUser}`);

  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials missing in .env!');
    return;
  }

  // Test 1: Port 465 with SSL/TLS and TLS settings
  try {
    console.log('\n--- Test 1: Port 465 (secure: true) + rejectUnauthorized: false ---');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    });

    console.log('Verifying...');
    await transporter.verify();
    console.log('Verified successfully!');
  } catch (err) {
    console.error('Test 1 failed:', err);
  }

  // Test 2: Port 587 with STARTTLS and TLS settings
  try {
    console.log('\n--- Test 2: Port 587 (secure: false) + rejectUnauthorized: false ---');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    });

    console.log('Verifying...');
    await transporter.verify();
    console.log('Verified successfully!');
  } catch (err) {
    console.error('Test 2 failed:', err);
  }
}

testTls();
