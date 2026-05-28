import { Ticket } from '../models/Ticket';
import { Event } from '../models/Event';
import { User } from '../models/User';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import html_to_pdf from 'html-pdf-node';
import dns from 'dns';

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
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0; padding: 0; background-color: #fff; color: #333;
        }
        .ticket-wrapper {
          padding: 20px;
        }
        .ticket-container {
          position: relative; width: 100%; max-width: 800px; margin: 0 auto;
          border: 2px solid #ddd;
          overflow: hidden;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><text x="10" y="70" font-family="Arial" font-size="24" fill="%23f1f5f9" transform="rotate(-45 75 75)" font-weight="bold">REventS</text></svg>');
        }
        .banner {
          width: 100%; height: 200px; object-fit: cover;
          border-bottom: 4px solid #6366f1;
        }
        .content-wrapper {
          display: flex; padding: 30px;
        }
        .left-col {
          flex: 0 0 35%; padding-right: 20px; border-right: 2px dashed #ddd;
        }
        .right-col {
          flex: 0 0 65%; padding-left: 30px;
        }
        .ticket-header { color: #1e3a8a; margin: 0 0 10px 0; font-size: 16px; font-weight: bold; }
        .qr-box img { width: 100%; max-width: 180px; height: auto; border: 4px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .event-title { font-size: 20px; font-weight: bold; color: #111827; margin: 20px 0 5px 0; }
        .ticket-type { font-size: 18px; font-weight: bold; color: #6366f1; margin: 0 0 15px 0; }
        .info-block { margin-bottom: 15px; }
        .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 2px; }
        .info-value { font-size: 14px; font-weight: bold; color: #1f2937; }
        .blue-text { color: #2563eb; font-weight: bold; font-family: monospace; font-size: 16px; }
        .footer-section {
          border-top: 2px solid #ddd; padding: 20px 30px; background: rgba(255,255,255,0.8);
        }
        .footer-title { font-size: 14px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
        .footer-table { width: 100%; font-size: 12px; }
        .footer-table td { padding: 4px 0; }
        .label-cell { color: #6b7280; width: 30%; }
        .value-cell { color: #111827; font-weight: bold; }
      </style>
    `;

    const fallbackBannerUrl = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000';
    const bannerUrl = event.image && event.image.startsWith('http') ? event.image : fallbackBannerUrl;
    const eventTypeLabel = event.type?.toLowerCase() === 'online' ? 'ONLINE' : 'ONSITE';

    // Generate PDF Buffers and Send SMTP Emails asynchronously in the background (one email per ticket)
    (async () => {
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
        const ticketMarkup = `
          <div class="ticket-wrapper">
            <div class="ticket-container">
              <img src="${bannerUrl}" class="banner" />
              <div class="content-wrapper">
                <div class="left-col">
                  <p class="ticket-header">Ticket ${idx + 1} of ${tickets.length}</p>
                  <div class="qr-box">
                    <img src="${tQrCodeUrl}" />
                  </div>
                  <div class="event-title">${event.title}</div>
                  <div class="ticket-type">[${eventTypeLabel}] ${event.ticketType || 'Standard'}</div>
                  
                  <div class="info-block">
                    <div class="info-label">Valid for / Berlaku pada</div>
                    <div class="info-value">${event.date}</div>
                  </div>
                  <div class="info-block">
                    <div class="info-label">Price / Harga</div>
                    <div class="info-value">${event.price}</div>
                  </div>
                </div>
                
                <div class="right-col">
                  <p style="font-size: 12px; color: #4b5563; margin-top: 0;">Scan this QR Code on the venue or open the streaming link below to join the event.</p>
                  
                  <div class="info-block">
                    <div class="info-label">Ticket No. / No. Tiket</div>
                    <div class="info-value blue-text">${tCode}</div>
                  </div>
                  
                  <div class="info-block">
                    <div class="info-label">Name / Nama</div>
                    <div class="info-value">${fullName || 'Guest'}</div>
                  </div>
                  
                  <div class="info-block">
                    <div class="info-label">Category / Kategori</div>
                    <div class="info-value">${audienceCategory || 'General'}</div>
                  </div>
                  
                  ${event.type === 'online' ? `
                  <div class="info-block">
                    <div class="info-label">Akses Tautan / Online Link</div>
                    <div class="info-value"><a href="${event.onlineLink || '#'}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${event.onlineLink || 'TBA'}</a></div>
                  </div>
                  ` : ''}
                  
                  <div class="info-block" style="margin-top: 30px;">
                    <div class="info-label">Order No. / No. Pesanan</div>
                    <div class="info-value" style="font-family: monospace;">ORD-${Math.floor(10000000 + Math.random() * 90000000)}</div>
                  </div>
                </div>
              </div>
              
              <div class="footer-section">
                <div class="footer-title">Order Information / Informasi Pesanan</div>
                <table class="footer-table">
                  <tr>
                    <td class="label-cell">Experience Name</td>
                    <td class="value-cell">${event.title}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">Ticket Type</td>
                    <td class="value-cell">[${eventTypeLabel}] ${event.ticketType || 'Standard'}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">Location</td>
                    <td class="value-cell">${event.location}</td>
                  </tr>
                </table>
                
                <div class="footer-title" style="margin-top: 15px;">Buyer Contact / Kontak Pembeli</div>
                <table class="footer-table">
                  <tr>
                    <td class="label-cell">Name</td>
                    <td class="value-cell">${fullName || 'Guest'}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">Email</td>
                    <td class="value-cell">${email || '-'}</td>
                  </tr>
                </table>
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

        // Generate PDF Buffer for this specific ticket
        let pdfBuffer: Buffer | null = null;
        try {
          const options = { 
            format: 'A4',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
          };
          const file = { content: htmlPdfContent };
          
          // Set a 15-second timeout for PDF generation to prevent hanging SMTP delivery
          const pdfPromise = html_to_pdf.generatePdf(file, options);
          const timeoutPromise = new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timed out')), 15000)
          );
          
          pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]) as Buffer;
        } catch (pdfErr) {
          console.error(`Failed to generate PDF for ticket ${tCode}:`, pdfErr);
        }

        // Send SMTP Email for this specific ticket
        if (transporter) {
          try {
            console.log(`Attempting to send ticket email ${idx + 1}/${tickets.length} to ${email} (async)...`);
            const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30);
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
          console.log(`SMTP is not configured. Simulated sending email ${idx + 1}/${tickets.length} to ${email}.`);
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
