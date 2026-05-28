import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testGmail() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  console.log(`Testing Gmail SMTP with User=${smtpUser}`);

  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials missing in .env!');
    return;
  }

  try {
    console.log('Creating transporter using port 465 (direct SSL/TLS)...');
    const transporterSSL = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      logger: true,
      debug: true
    });

    console.log('Verifying port 465 transporter...');
    await transporterSSL.verify();
    console.log('Port 465 transporter verified successfully!');
    return;
  } catch (sslErr) {
    console.error('Port 465 verification failed:', sslErr);
  }

  try {
    console.log('\nCreating transporter using service: "gmail"...');
    const transporterService = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      logger: true,
      debug: true
    });

    console.log('Verifying service: "gmail" transporter...');
    await transporterService.verify();
    console.log('Service: "gmail" transporter verified successfully!');
  } catch (serviceErr) {
    console.error('Service: "gmail" verification failed:', serviceErr);
  }
}

testGmail();
