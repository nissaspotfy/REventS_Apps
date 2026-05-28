import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testSmtp() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || 'REventS Tickets <noreply@revents.com>';

  console.log(`Config: Host=${smtpHost}, Port=${smtpPort}, User=${smtpUser}`);

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('SMTP credentials missing in .env!');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      logger: true,
      debug: true
    });

    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: 'anissaagungg@gmail.com',
      subject: 'REventS SMTP Test',
      text: 'This is a test email from REventS diagnostic script.'
    });

    console.log('Email sent successfully! MessageId:', info.messageId);
  } catch (err) {
    console.error('SMTP Test failed with error:', err);
  }
}

testSmtp();
