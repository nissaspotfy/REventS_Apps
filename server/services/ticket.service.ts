import { Ticket } from '../models/Ticket';
import { Event } from '../models/Event';
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import html_to_pdf from 'html-pdf-node';
import dns from 'dns';
import { execSync } from 'child_process';

function getChromiumPath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // Windows Chrome/Edge paths
  if (process.platform === 'win32') {
    const winPaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ];
    for (const p of winPaths) {
      if (fs.existsSync(p)) {
        console.log(`[Tickets] Found Windows Chrome/Edge path: ${p}`);
        return p;
      }
    }
  }

  // 1. Manual scan of PATH directories (zero shell/which dependencies)
  try {
    const pathEnv = process.env.PATH || '';
    const paths = pathEnv.split(path.delimiter);
    const binNames = ['chromium', 'chromium-browser', 'chrome', 'google-chrome'];
    for (const p of paths) {
      for (const bin of binNames) {
        const fullPath = path.join(p, bin);
        if (fs.existsSync(fullPath)) {
          try {
            fs.accessSync(fullPath, fs.constants.X_OK);
            console.log(`[Tickets] Found Chromium in PATH: ${fullPath}`);
            return fullPath;
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    console.error('[Tickets] Error scanning PATH:', err);
  }

  // 2. Try command -v as fallback
  try {
    const commandPath = execSync('command -v chromium || command -v chromium-browser', { shell: '/bin/sh', stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (commandPath) {
      console.log(`[Tickets] Found Chromium via command -v: ${commandPath}`);
      return commandPath;
    }
  } catch (e) {}

  // 3. Scan common paths
  const commonPaths = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/chrome',
    '/usr/bin/google-chrome',
    '/app/.nix-profile/bin/chromium',
    '/nix/var/nix/profiles/default/bin/chromium',
    '/run/current-system/sw/bin/chromium'
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      try {
        fs.accessSync(p, fs.constants.X_OK);
        console.log(`[Tickets] Found Chromium in common paths: ${p}`);
        return p;
      } catch (e) {}
    }
  }

  console.warn('[Tickets] System Chromium not found, falling back to default.');
  return undefined;
}


export class TicketService {
  static async purchaseTicket(
    userId: number | undefined,
    eventId: number,
    paymentMethod: string,
    fullName: string,
    email: string,
    audienceCategory: string,
    referralSource: string,
    quantity: number = 1
  ) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error('Event not found.');
    }

    // Check organizer restriction
    if (event.organizerId === userId) {
      throw new Error('Organizers are not allowed to buy tickets for their own events.');
    }

    // Generate unique tickets based on quantity
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const qrCode = `TKT-${userId || 'guest'}-${eventId}-${Math.floor(100000 + Math.random() * 900000)}-${i + 1}`;
      const newTicket = await Ticket.create({
        userId,
        eventId,
        purchaseDate: new Date().toISOString(),
        status: 'active',
        paymentMethod,
        price: event.price,
        qrCode,
        fullName: fullName || '',
        email: email || '',
        audienceCategory: audienceCategory || '',
        referralSource: referralSource || ''
      });
      tickets.push(newTicket);
    }

    const firstTicket = tickets[0];

    // Update event metrics
    event.ticketsSold += quantity;
    
    // Parse numeric price from "IDR 250.000" or similar
    const cleanPriceStr = event.price.toLowerCase() === 'free' ? '0' : event.price.replace(/\D/g, '');
    const numericPrice = parseInt(cleanPriceStr, 10) || 0;
    event.revenue += (numericPrice * quantity);

    await event.save();

    // CSS Styles for PDF Ticket
    const pdfStylesMarkup = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;850;900&display=swap');
        body {
          font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0; padding: 0; background-color: #fff; color: #333;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .ticket-wrapper {
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }
        .ticket-container {
          background-color: #ffffff; 
          border: 1px solid #e2e8f0; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.08); 
          width: 800px; 
          display: table; 
          border-collapse: collapse; 
        }
        .img-cell {
          display: table-cell; 
          width: 200px; 
          vertical-align: middle; 
          background-color: #0f172a; 
          position: relative; 
          overflow: hidden;
        }
        .img-cell img {
          width: 200px; 
          height: 260px; 
          object-fit: cover; 
          display: block;
        }
        .category-badge {
          position: absolute; 
          top: 15px; 
          left: 15px; 
          background-color: #4f46e5; 
          color: #ffffff; 
          font-weight: 800; 
          font-size: 10px; 
          padding: 4px 10px; 
          border-radius: 6px; 
          text-transform: uppercase; 
          letter-spacing: 1px;
        }
        .details-cell {
          display: table-cell; 
          vertical-align: top; 
          padding: 25px 30px; 
          border-right: 2px dashed #e2e8f0; 
          background-color: #ffffff;
        }
        .details-header {
          margin-bottom: 12px;
        }
        .pass-badge {
          background-color: #e0e7ff; 
          color: #4338ca; 
          font-weight: bold; 
          font-size: 10px; 
          padding: 3px 8px; 
          border-radius: 4px; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
          display: inline-block;
        }
        .pass-count {
          color: #94a3b8; 
          font-weight: bold; 
          font-size: 10px; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
          float: right; 
          display: inline-block;
        }
        .event-title {
          margin: 0 0 15px 0; 
          font-size: 20px; 
          font-weight: 900; 
          color: #0f172a; 
          text-transform: uppercase; 
          letter-spacing: -0.5px; 
          line-height: 1.2;
        }
        .details-table {
          width: 100%; 
          border-collapse: collapse; 
          font-size: 11px;
        }
        .details-table td {
          padding-bottom: 12px; 
          width: 50%; 
          vertical-align: top;
        }
        .info-label {
          display: block; 
          color: #94a3b8; 
          font-weight: bold; 
          font-size: 9px; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
        }
        .info-value {
          font-weight: 800; 
          color: #334155; 
          display: block; 
          margin-top: 2px;
        }
        .info-value.valid {
          color: #10b981;
        }
        .info-value.code {
          color: #4f46e5;
          font-family: monospace;
        }
        .qr-cell {
          display: table-cell; 
          width: 180px; 
          vertical-align: middle; 
          padding: 25px; 
          text-align: center; 
          background-color: #fafafa;
        }
        .qr-border {
          background-color: #ffffff; 
          border: 1px solid #e2e8f0; 
          padding: 8px; 
          border-radius: 12px; 
          display: inline-block; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.04); 
          margin-bottom: 10px;
        }
        .qr-border img {
          width: 110px; 
          height: 110px; 
          display: block;
        }
        .passcode-label {
          display: block; 
          color: #94a3b8; 
          font-weight: bold; 
          font-size: 8px; 
          text-transform: uppercase; 
          letter-spacing: 1px;
        }
        .passcode-value {
          display: inline-block; 
          margin-top: 4px; 
          padding: 3px 8px; 
          background-color: #ffffff; 
          border: 1px solid #e2e8f0; 
          border-radius: 4px; 
          font-size: 9px; 
          font-family: monospace; 
          font-weight: bold; 
          color: #475569;
        }
      </style>
    `;

    const fallbackBannerUrl = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000';
    const bannerUrl = event.image && event.image.startsWith('http') ? event.image : fallbackBannerUrl;
    const eventTypeLabel = event.type?.toLowerCase() === 'online' ? 'ONLINE' : 'ONSITE';

    // Generate PDF Buffers and Send SMTP Emails asynchronously in the background (one email per ticket)
    (async () => {
      const resendApiKey = process.env.RESEND_API_KEY;
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASSWORD;
      const smtpFrom = process.env.SMTP_FROM || 'REventS Tickets <noreply@revents.com>';

      let transporter: any = null;
      if (smtpHost && smtpUser && smtpPass) {
        try {
          // Pre-resolve host using system DNS lookup to prevent slow c-ares IPv6 query hangs and force IPv4
          let resolvedHost = smtpHost;
          try {
            resolvedHost = await new Promise<string>((resolve, reject) => {
              dns.lookup(smtpHost, { family: 4 }, (err, address) => {
                if (err) reject(err);
                else resolve(address);
              });
            });
            console.log(`Pre-resolved SMTP host ${smtpHost} to IPv4 ${resolvedHost}`);
          } catch (dnsErr) {
            console.error(`System DNS lookup failed for ${smtpHost}, using original host. Error:`, dnsErr);
          }

          transporter = nodemailer.createTransport({
            host: resolvedHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            tls: {
              servername: smtpHost,
              rejectUnauthorized: false
            }
          });

          console.log('Verifying SMTP connection...');
          await transporter.verify();
          console.log('SMTP connection verified successfully.');
        } catch (transporterErr) {
          console.error('Failed to configure or verify SMTP transporter. Falling back to mock email logs only. Error:', transporterErr);
          transporter = null;
        }
      }

      for (let idx = 0; idx < tickets.length; idx++) {
        const t = tickets[idx];
        const tCode = t.qrCode;
        const tQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tCode)}`;

        // 1. Construct mock email content for this specific ticket
        const mockEmailContentForTicket = `
========================================================================
MOCK EMAIL DELIVERED (Email ${idx + 1} of ${tickets.length})
Date: ${new Date().toISOString()}
To: ${email || 'Guest'}
Subject: Your Ticket Confirmation [${idx + 1}/${tickets.length}] for "${event.title}"
------------------------------------------------------------------------
Dear ${fullName || 'Guest'},

Thank you for registering for "${event.title}".
Your ticket has been successfully processed and confirmed.

Event Details:
- Event: ${event.title}
- Date: ${event.date}
- Location: ${event.location}${event.type === 'online' ? `\n- Zoom / Access Link: ${event.onlineLink || 'TBA'}` : ''}
- Ticket Price: ${event.price} (Payment: ${paymentMethod.toUpperCase()})

Ticket Details:
- Ticket Code: ${tCode}
- Name: ${fullName || 'Guest'}
- Email: ${email || '-'}
- Audience Category: ${audienceCategory || 'General Public'}
- Referral Source: ${referralSource || '-'}

A PDF ticket has been generated and is attached to this email.
Please show the QR code on the day of the event for check-in.

Best regards,
REventS Team
========================================================================
`;

        // Write to mock-emails.log
        try {
          const logPath = path.join(process.cwd(), 'server/mock-emails.log');
          fs.appendFileSync(logPath, mockEmailContentForTicket + '\n');
        } catch (logErr) {
          console.error('Failed to write mock email to log file:', logErr);
        }

        // 2. HTML email content for this specific ticket
        const htmlEmailContentForTicket = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #6366f1; text-align: center;">REventS Ticket Confirmation</h2>
            <p>Dear <strong>${fullName || 'Guest'}</strong>,</p>
            <p>Thank you for registering for <strong>"${event.title}"</strong>. Your ticket has been successfully processed and confirmed. [Ticket ${idx + 1} of ${tickets.length}]</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <h3 style="color: #374151;">Event Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Event:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${event.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Date:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${event.date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Location:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${event.location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Ticket Price:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${event.price} (Payment: ${paymentMethod.toUpperCase()})</td>
              </tr>
            </table>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

            <h3 style="color: #374151;">Ticket Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Ticket Code:</strong></td>
                <td style="padding: 6px 0; color: #1f2937; font-family: monospace; font-weight: bold; color: #6366f1;">${tCode}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Name:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${fullName || 'Guest'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Email:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${email || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Category:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;">${audienceCategory || 'General Public'}</td>
              </tr>
              ${event.type === 'online' ? `
              <tr>
                <td style="padding: 6px 0; color: #4b5563;"><strong>Zoom / Access Link:</strong></td>
                <td style="padding: 6px 0; color: #1f2937;"><a href="${event.onlineLink || '#'}" style="color: #6366f1; font-weight: bold; text-decoration: none;">${event.onlineLink || 'TBA'}</a></td>
              </tr>
              ` : ''}
            </table>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center;">
              Please show this QR code on the day of the event for check-in.
            </p>
            <p style="font-size: 14px; color: #6b7280; text-align: center; font-weight: bold;">
              REventS Team
            </p>
          </div>
        `;

        // 3. Construct ticket PDF HTML markup for this specific ticket
        const isFreeEvent = event.price.toLowerCase() === 'free' || event.price.replace(/[^0-9]/g, '') === '0';
        const ticketMarkup = `
          <div class="ticket-wrapper">
            <div class="ticket-container">
              <div style="display: table-row;">
                <!-- Left Cell: Cover Image -->
                <div class="img-cell">
                  <img src="${bannerUrl}" />
                  <div class="category-badge">${event.category}</div>
                </div>
                
                <!-- Middle Cell: Details -->
                <div class="details-cell">
                  <div class="details-header">
                    <span class="pass-badge">REventS Pass</span>
                    <span class="pass-count">PASS ${idx + 1} OF ${tickets.length}</span>
                    <div style="clear: both;"></div>
                  </div>
                  
                  <h3 class="event-title">${event.title}</h3>
                  
                  <table class="details-table">
                    <tbody>
                      <tr>
                        <td>
                          <span class="info-label">TANGGAL & WAKTU</span>
                          <span class="info-value">${event.date}</span>
                        </td>
                        <td>
                          <span class="info-label">PEMBELI / ATTENDEE</span>
                          <span class="info-value">${fullName || 'Guest'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="info-label">BERLAKU PADA</span>
                          <span class="info-value valid">Berlaku pada ${event.date.split(',').pop()?.trim() || event.date}</span>
                        </td>
                        <td>
                          <span class="info-label">CATEGORY</span>
                          <span class="info-value">${audienceCategory || 'General Public'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 0;">
                          <span class="info-label">PRICE</span>
                          <span class="info-value">${isFreeEvent ? 'Free' : event.price}</span>
                        </td>
                        <td style="padding-bottom: 0;">
                          <span class="info-label">TICKET ID</span>
                          <span class="info-value code">${tCode}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Right Cell: QR Code -->
                <div class="qr-cell">
                  <div class="qr-border">
                    <img src="${tQrCodeUrl}" />
                  </div>
                  <div>
                    <span class="passcode-label">PASS CODE</span>
                    <span class="passcode-value">${tCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        const htmlPdfContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            ${pdfStylesMarkup}
          </head>
          <body>
            ${ticketMarkup}
          </body>
          </html>
        `;

        // Generate PDF Buffer for this specific ticket using Puppeteer directly
        let pdfBuffer: Buffer | null = null;
        try {
          const puppeteerModule = await import('puppeteer');
          const puppeteer = puppeteerModule.default || puppeteerModule;
          const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            executablePath: getChromiumPath()
          });
          try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1122, height: 794 });
            
            try {
              await page.setContent(htmlPdfContent, { waitUntil: 'load', timeout: 10000 });
            } catch (loadErr) {
              console.warn(`[Tickets] Puppeteer setContent load timeout for ticket ${tCode}, proceeding anyway:`, loadErr);
            }
            
            // Set 15-second timeout on pdf rendering
            const renderPromise = page.pdf({
              format: 'a4',
              landscape: true,
              printBackground: true
            });
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('PDF generation timed out')), 15000)
            );
            pdfBuffer = await Promise.race([renderPromise, timeoutPromise]) as Buffer;
          } finally {
            await browser.close();
          }
        } catch (pdfErr) {
          console.error(`Failed to generate PDF for ticket ${tCode} via Puppeteer:`, pdfErr);
        }

        const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30);

        // Send Email via Resend HTTPS API (Port 443) or SMTP
        if (resendApiKey) {
          try {
            console.log(`Attempting to send ticket email ${idx + 1}/${tickets.length} to ${email} via Resend HTTPS API...`);
            const attachmentsPayload = pdfBuffer ? [
              {
                filename: `Ticket-${sanitizedTitle}-${idx + 1}.pdf`,
                content: pdfBuffer.toString('base64')
              }
            ] : [];

            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: smtpFrom || 'REventS <onboarding@resend.dev>',
                to: email,
                subject: `Your Ticket Confirmation [${idx + 1}/${tickets.length}] for "${event.title}"`,
                text: mockEmailContentForTicket.replace(/={72}/g, '').trim(),
                html: htmlEmailContentForTicket,
                attachments: attachmentsPayload
              })
            });

            if (response.ok) {
              console.log(`Email ${idx + 1}/${tickets.length} successfully sent to ${email} via Resend API.`);
            } else {
              const errData = await response.json();
              console.error(`Resend API returned error for email ${idx + 1}/${tickets.length}:`, errData);
            }
          } catch (resendErr) {
            console.error(`Failed to send email ${idx + 1}/${tickets.length} via Resend API:`, resendErr);
          }
        } else if (transporter) {
          try {
            console.log(`Attempting to send ticket email ${idx + 1}/${tickets.length} to ${email} via SMTP (async)...`);
            await transporter.sendMail({
              from: smtpFrom,
              to: email,
              subject: `Your Ticket Confirmation [${idx + 1}/${tickets.length}] for "${event.title}"`,
              text: mockEmailContentForTicket.replace(/={72}/g, '').trim(),
              html: htmlEmailContentForTicket,
              attachments: pdfBuffer ? [
                {
                  filename: `Ticket-${sanitizedTitle}-${idx + 1}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf'
                }
              ] : []
            });
            console.log(`Email ${idx + 1}/${tickets.length} successfully sent to ${email} via SMTP.`);
          } catch (smtpErr) {
            console.error(`Failed to send email ${idx + 1}/${tickets.length} via SMTP:`, smtpErr);
          }
        } else {
          console.log(`No email provider configured (SMTP and Resend API keys are empty). Simulated sending email ${idx + 1}/${tickets.length} to ${email}.`);
        }
      }
    })().catch(err => {
      console.error('Asynchronous ticket post-processing failed:', err);
    });

    return {
      ticket: firstTicket,
      tickets,
      ticketCount: tickets.length,
      event
    };
  }

  static async getUserTickets(userId: number) {
    return await Ticket.findAll({
      where: { userId },
      include: [
        {
          model: Event,
          as: 'event'
        }
      ]
    });
  }

  static async getOrganizerTickets(organizerId: number) {
    const events = await Event.findAll({ where: { organizerId } });
    const eventIds = events.map(e => e.id);

    if (eventIds.length === 0) {
      return [];
    }

    return await Ticket.findAll({
      where: { eventId: eventIds },
      include: [
        {
          model: Event,
          as: 'event'
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'fullName', 'profilePicUrl']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  static async checkInTicket(ticketId: number, organizerId: number) {
    const ticket = await Ticket.findByPk(ticketId, {
      include: [
        {
          model: Event,
          as: 'event'
        }
      ]
    });

    if (!ticket) {
      throw new Error('Ticket not found.');
    }

    const event = (ticket as any).event;
    if (!event) {
      throw new Error('Associated event not found for this ticket.');
    }

    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized to check in guest for this event.');
    }

    if (ticket.checkedIn) {
      throw new Error('Ticket has already been checked in.');
    }

    ticket.checkedIn = true;
    await ticket.save();

    event.checkins += 1;
    await event.save();

    return { ticket, event };
  }

  static async checkInTicketByQr(qrCode: string, eventId: number, organizerId: number) {
    const ticket = await Ticket.findOne({
      where: { qrCode },
      include: [
        {
          model: Event,
          as: 'event'
        }
      ]
    });

    if (!ticket) {
      throw new Error('Ticket not found.');
    }

    if (ticket.eventId !== eventId) {
      throw new Error('This ticket is for a different event.');
    }

    const event = (ticket as any).event;
    if (!event) {
      throw new Error('Associated event not found for this ticket.');
    }

    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized to check in guest for this event.');
    }

    if (ticket.checkedIn) {
      throw new Error('Ticket has already been checked in.');
    }

    ticket.checkedIn = true;
    await ticket.save();

    event.checkins += 1;
    await event.save();

    return { ticket, event };
  }

  static async checkDuplicateTicket(userId: number | undefined, eventId: number, email: string) {
    const activeTickets = await Ticket.findAll({
      where: {
        eventId,
        status: 'active'
      }
    });

    if (userId) {
      const hasUserTicket = activeTickets.some(t => t.userId === userId);
      if (hasUserTicket) return true;
    }

    if (email && email.trim()) {
      const targetEmail = email.trim().toLowerCase();
      const hasEmailTicket = activeTickets.some(t => t.email && t.email.trim().toLowerCase() === targetEmail);
      if (hasEmailTicket) return true;
    }

    return false;
  }
}
