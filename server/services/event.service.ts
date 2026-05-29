import { Op } from 'sequelize';
import { Event } from '../models/Event';
import { Ticket } from '../models/Ticket';
import html_to_pdf from 'html-pdf-node';
import dns from 'dns';
import { execSync } from 'child_process';

function getChromiumPath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  try {
    const path = execSync('which chromium || which chromium-browser', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (path) {
      console.log(`[Events] Found system Chromium at: ${path}`);
      return path;
    }
  } catch (e) {
    // Ignore and fallback
  }
  return undefined;
}

import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

export class EventService {
  static async getEvents(filters: { category?: string; search?: string; location?: string }) {
    const where: any = {};

    if (filters.category && filters.category !== 'All') {
      where.category = filters.category;
    }

    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    if (filters.location) {
      where.location = { [Op.like]: `%${filters.location}%` };
    }

    return await Event.findAll({ where });
  }

  static async getEventById(id: number) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Event not found.');
    }
    
    // Increment views whenever viewed
    event.views += 1;
    await event.save();
    
    return event;
  }

  static async createEvent(organizerId: number, eventData: Omit<any, 'id' | 'organizerId' | 'ticketsSold' | 'revenue' | 'views' | 'checkins' | 'month' | 'day'>) {
    // Validate title uniqueness (case-insensitive and trimmed)
    const existing = await Event.findOne({ where: { title: eventData.title.trim() } });
    if (existing) {
      throw new Error('An event with this title already exists.');
    }

    // Parse month and day from date string if possible
    let month = 'JUN';
    let day = '15';
    try {
      const d = new Date(eventData.date);
      if (!isNaN(d.getTime())) {
        day = d.getDate().toString();
        month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      } else {
        // Try parsing string "Saturday, June 15" or similar
        const parts = eventData.date.split(' ');
        if (parts.length >= 3) {
          const m = parts[1].substring(0, 3).toUpperCase();
          const dy = parts[2].replace(/\D/g, '');
          if (m && dy) {
            month = m;
            day = dy;
          }
        }
      }
    } catch (e) {
      // Fallback
    }

    const newEvent = await Event.create({
      organizerId,
      ...eventData,
      title: eventData.title.trim(),
      month,
      day,
      ticketsSold: 0,
      revenue: 0,
      views: 1,
      checkins: 0
    });

    return newEvent;
  }

  static async updateEvent(id: number, organizerId: number, updates: Partial<Omit<any, 'id' | 'organizerId' | 'ticketsSold' | 'revenue' | 'views' | 'checkins'>>) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized to update this event.');
    }

    // Validate title uniqueness (case-insensitive and trimmed)
    if (updates.title && updates.title.trim().toLowerCase() !== event.title.trim().toLowerCase()) {
      const existing = await Event.findOne({ where: { title: updates.title.trim(), id: { [Op.ne]: id } } });
      if (existing) {
        throw new Error('An event with this title already exists.');
      }
    }

    // Apply updates
    Object.assign(event, updates);
    
    // Re-calculate month/day if date changed
    if (updates.date) {
      try {
        const d = new Date(updates.date);
        if (!isNaN(d.getTime())) {
          event.day = d.getDate().toString();
          event.month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        }
      } catch (e) {}
    }

    await event.save();
    return event;
  }

  static async deleteEvent(id: number, organizerId: number) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized to delete this event.');
    }

    await event.destroy();
    return { success: true };
  }

  static async distributeCertificates(eventId: number, organizerId: number, hostUrl: string) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error('Event not found.');
    }
    if (event.organizerId !== organizerId) {
      throw new Error('Unauthorized to distribute certificates for this event.');
    }
    if (!event.provideCertificate) {
      throw new Error('Certificates are not enabled for this event.');
    }
    if (!event.certificateTemplateUrl) {
      throw new Error('Please upload a certificate template first.');
    }

    // Find all checked-in tickets for this event
    const checkedInTickets = await Ticket.findAll({
      where: {
        eventId,
        checkedIn: true
      }
    });

    if (checkedInTickets.length === 0) {
      throw new Error('No checked-in attendees found to distribute certificates to.');
    }

    // Update event to released
    event.certificateReleased = true;
    await event.save();

    // Trigger background generation and sending
    (async () => {
      const resendApiKey = process.env.RESEND_API_KEY;
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASSWORD;
      const smtpFrom = process.env.SMTP_FROM || 'REventS Certificates <noreply@revents.com>';

      let transporter: any = null;
      if (smtpHost && smtpUser && smtpPass) {
        try {
          let resolvedHost = smtpHost;
          try {
            resolvedHost = await new Promise<string>((resolve, reject) => {
              dns.lookup(smtpHost, { family: 4 }, (err, address) => {
                if (err) resolve(smtpHost); // fallback
                else resolve(address);
              });
            });
            console.log(`[Certificates] Pre-resolved SMTP host ${smtpHost} to IPv4 ${resolvedHost}`);
          } catch (dnsErr) {
            console.error(`[Certificates] System DNS lookup failed for ${smtpHost}`, dnsErr);
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

          await transporter.verify();
          console.log('[Certificates] SMTP connection verified successfully.');
        } catch (transporterErr) {
          console.error('[Certificates] Failed to configure SMTP transporter:', transporterErr);
          transporter = null;
        }
      }

      const templateBg = event.certificateTemplateUrl!.startsWith('http')
        ? event.certificateTemplateUrl!
        : `${hostUrl}${event.certificateTemplateUrl}`;

      for (let idx = 0; idx < checkedInTickets.length; idx++) {
        const ticket = checkedInTickets[idx];
        const email = ticket.email;
        const fullName = ticket.fullName || 'Attendee';

        // Write mock email log first
        const mockLogContent = `
========================================================================
MOCK EMAIL DELIVERED (Certificate ${idx + 1} of ${checkedInTickets.length})
Date: ${new Date().toISOString()}
To: ${email || 'Guest'}
Subject: E-Certificate for "${event.title}"
------------------------------------------------------------------------
Dear ${fullName},

Congratulations on attending "${event.title}"!
Your e-certificate has been successfully generated and is attached to this email.

Best regards,
REventS Team
========================================================================
`;

        try {
          const logPath = path.join(process.cwd(), 'server/mock-emails.log');
          fs.appendFileSync(logPath, mockLogContent + '\n');
        } catch (logErr) {
          console.error('[Certificates] Failed to write mock email to log file:', logErr);
        }

        // Generate PDF
        let pdfBuffer: Buffer | null = null;
        try {
          const htmlPdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&display=swap" rel="stylesheet">
              <style>
                @page {
                  size: A4 landscape;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  width: 297mm;
                  height: 210mm;
                  font-family: 'Outfit', sans-serif;
                  box-sizing: border-box;
                  background-color: #f3f4f6;
                }
                .cert-container {
                  position: relative;
                  width: 297mm;
                  height: 210mm;
                  background-image: url('${templateBg}');
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  box-sizing: border-box;
                }
                .attendee-name {
                  font-size: 42px;
                  font-weight: 800;
                  color: #1e1b4b;
                  margin-top: 15px;
                  padding: 0 50px;
                  max-width: 80%;
                  word-wrap: break-word;
                  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }
              </style>
            </head>
            <body>
              <div class="cert-container">
                <div class="attendee-name">${fullName}</div>
              </div>
            </body>
            </html>
          `;

          const options = { 
            format: 'A4', 
            landscape: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            executablePath: getChromiumPath()
          };
          const file = { content: htmlPdfContent };
          
          // Set a 15-second timeout for PDF generation to prevent hanging SMTP delivery
          const pdfPromise = html_to_pdf.generatePdf(file, options);
          const timeoutPromise = new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timed out')), 15000)
          );
          
          pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]) as Buffer;
        } catch (pdfErr) {
          console.error(`[Certificates] Failed to generate PDF for ticket ${ticket.id}:`, pdfErr);
        }

        const sanitizedTitle = event.title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30);

        // Send Email via Resend HTTPS API (Port 443) or SMTP
        if (resendApiKey && email) {
          try {
            console.log(`[Certificates] Attempting to send certificate email ${idx + 1}/${checkedInTickets.length} to ${email} via Resend HTTPS API...`);
            const attachmentsPayload = pdfBuffer ? [
              {
                filename: `Certificate-${sanitizedTitle}.pdf`,
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
                subject: `E-Certificate for "${event.title}"`,
                text: `Dear ${fullName},\n\nCongratulations on attending "${event.title}"!\nYour e-certificate has been successfully generated and is attached to this email.\n\nBest regards,\nREventS Team`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #6366f1; text-align: center;">Congratulations!</h2>
                    <p>Dear <strong>${fullName}</strong>,</p>
                    <p>Thank you for attending <strong>"${event.title}"</strong>. Your e-certificate has been generated and is attached to this email.</p>
                    <p>You can also download your certificate directly from your REventS tickets page.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="text-align: center; color: #6b7280; font-size: 12px;">Sent by REventS Team</p>
                  </div>
                `,
                attachments: attachmentsPayload
              })
            });

            if (response.ok) {
              console.log(`[Certificates] Email ${idx + 1}/${checkedInTickets.length} successfully sent to ${email} via Resend API.`);
            } else {
              const errData = await response.json();
              console.error(`[Certificates] Resend API returned error for email ${idx + 1}/${checkedInTickets.length}:`, errData);
            }
          } catch (resendErr) {
            console.error(`[Certificates] Failed to send email ${idx + 1}/${checkedInTickets.length} via Resend API:`, resendErr);
          }
        } else if (transporter && email) {
          try {
            console.log(`[Certificates] Sending certificate email ${idx + 1}/${checkedInTickets.length} to ${email} (async)...`);
            await transporter.sendMail({
              from: smtpFrom,
              to: email,
              subject: `E-Certificate for "${event.title}"`,
              text: `Dear ${fullName},\n\nCongratulations on attending "${event.title}"!\nYour e-certificate has been successfully generated and is attached to this email.\n\nBest regards,\nREventS Team`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                  <h2 style="color: #6366f1; text-align: center;">Congratulations!</h2>
                  <p>Dear <strong>${fullName}</strong>,</p>
                  <p>Thank you for attending <strong>"${event.title}"</strong>. Your e-certificate has been generated and is attached to this email.</p>
                  <p>You can also download your certificate directly from your REventS tickets page.</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="text-align: center; color: #6b7280; font-size: 12px;">Sent by REventS Team</p>
                </div>
              `,
              attachments: pdfBuffer ? [
                {
                  filename: `Certificate-${sanitizedTitle}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf'
                }
              ] : []
            });
            console.log(`[Certificates] Email ${idx + 1}/${checkedInTickets.length} successfully sent to ${email} via SMTP.`);
          } catch (smtpErr) {
            console.error(`[Certificates] Failed to send email ${idx + 1}/${checkedInTickets.length} to ${email}:`, smtpErr);
          }
        } else {
          console.log(`[Certificates] No email provider configured (SMTP and Resend API keys are empty). Simulated sending certificate to ${email}.`);
        }
      }
    })().catch(err => {
      console.error('[Certificates] Asynchronous certificate distribution failed:', err);
    });

    return { success: true, count: checkedInTickets.length };
  }
}
