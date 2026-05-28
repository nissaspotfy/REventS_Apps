import 'dotenv/config';
import nodemailer from 'nodemailer';
import dns from 'dns';

async function testFast() {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  console.log(`Config: Host=${smtpHost}, User=${smtpUser}`);

  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials missing in .env!');
    return;
  }

  let resolvedHost = smtpHost;
  try {
    console.log('Resolving host using dns.lookup...');
    resolvedHost = await new Promise<string>((resolve, reject) => {
      dns.lookup(smtpHost, (err, address) => {
        if (err) reject(err);
        else resolve(address);
      });
    });
    console.log(`Successfully resolved ${smtpHost} to ${resolvedHost}`);
  } catch (dnsErr) {
    console.error('DNS lookup failed:', dnsErr);
  }

  try {
    console.log('Creating transporter with IP address...');
    const transporter = nodemailer.createTransport({
      host: resolvedHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        servername: smtpHost,
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    });

    console.log('Verifying connection...');
    const startTime = Date.now();
    await transporter.verify();
    console.log(`Verification successful! Took ${Date.now() - startTime}ms`);
  } catch (err) {
    console.error('Verification failed:', err);
  }
}

testFast();
