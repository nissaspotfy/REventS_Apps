import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import html_to_pdf from 'html-pdf-node';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

function getChromiumPath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
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
            console.log(`[Invoice] Found Chromium in PATH: ${fullPath}`);
            return fullPath;
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    console.error('[Invoice] Error scanning PATH:', err);
  }

  // 2. Try command -v as fallback
  try {
    const commandPath = execSync('command -v chromium || command -v chromium-browser', { shell: '/bin/sh', stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (commandPath) {
      console.log(`[Invoice] Found Chromium via command -v: ${commandPath}`);
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
        console.log(`[Invoice] Found Chromium in common paths: ${p}`);
        return p;
      } catch (e) {}
    }
  }

  console.warn('[Invoice] System Chromium not found, falling back to default.');
  return undefined;
}


export class TicketController {
  static async purchaseTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId; // Can be undefined for guests

      const { eventId, paymentMethod, fullName, email, audienceCategory, referralSource, quantity } = req.body;
      if (!eventId || !paymentMethod) {
        res.status(400).json({ error: 'eventId and paymentMethod are required.' });
        return;
      }

      const result = await TicketService.purchaseTicket(
        userId,
        eventId,
        paymentMethod,
        fullName,
        email,
        audienceCategory,
        referralSource,
        quantity ? parseInt(quantity, 10) : 1
      );
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getUserTickets(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const tickets = await TicketService.getUserTickets(userId);
      res.status(200).json(tickets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getOrganizerTickets(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const ownerId = user?.preferences?.joinedTeamOf || userId;

      const tickets = await TicketService.getOrganizerTickets(ownerId);
      res.status(200).json(tickets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async checkInTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const organizerId = user?.preferences?.joinedTeamOf || userId;

      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ticket ID.' });
        return;
      }

      const result = await TicketService.checkInTicket(id, organizerId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async checkInTicketByQr(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const organizerId = user?.preferences?.joinedTeamOf || userId;

      const { qrCode, eventId } = req.body;
      if (!qrCode || !eventId) {
        res.status(400).json({ error: 'qrCode and eventId are required.' });
        return;
      }

      const result = await TicketService.checkInTicketByQr(qrCode, parseInt(eventId, 10), organizerId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async checkDuplicateTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { eventId, email } = req.body;
      if (!eventId) {
        res.status(400).json({ error: 'eventId is required.' });
        return;
      }
      const hasTicket = await TicketService.checkDuplicateTicket(
        userId,
        parseInt(eventId, 10),
        email || ''
      );
      res.status(200).json({ hasTicket });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async downloadInvoice(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;

      // Try fetching actual ticket details from database
      const { Ticket } = await import('../models/Ticket');
      const { Event } = await import('../models/Event');

      // The transactionId is the qrCode with TXN- instead of TKT-
      const qrCode = (transactionId || '').replace('TXN-', 'TKT-');
      const ticket = await Ticket.findOne({
        where: { qrCode },
        include: [{ model: Event, as: 'event' }]
      });

      let eventTitle = 'Tech Summit 2024';
      let dateString = 'November 25, 2025';
      let amountString = 'IDR 250.000';
      let paymentStatus = 'PAID';
      let statusColor = '#10b981';
      let buyerName = 'John Smith';
      let buyerEmail = 'john@example.com';
      let qty = 1;

      if (ticket) {
        const ev = (ticket as any).event || {};
        eventTitle = ev.title || 'Unknown Event';
        dateString = ticket.purchaseDate 
          ? new Date(ticket.purchaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'November 25, 2025';
        amountString = ticket.price || ev.price || 'IDR 250.000';
        paymentStatus = (ticket.status as string) === 'cancelled' || (ticket.status as string) === 'refunded' ? 'REFUNDED' : 'PAID';
        statusColor = paymentStatus === 'REFUNDED' ? '#d97706' : '#10b981';
        buyerName = ticket.fullName || 'Guest';
        buyerEmail = ticket.email || '-';
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); font-size: 16px; line-height: 24px; color: #555; background: #fff; padding: 30px; border-radius: 12px; }
            .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #6366f1; }
            .title { font-size: 24px; color: #1e3a8a; font-weight: bold; margin: 0; }
            .details-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
            .details-table td { padding: 8px 0; vertical-align: top; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px; text-align: left; font-weight: bold; color: #475569; }
            .items-table td { border-bottom: 1px solid #e2e8f0; padding: 12px; color: #334155; }
            .total-row td { font-weight: bold; font-size: 18px; color: #111827; border-top: 2px solid #e2e8f0; padding-top: 15px; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; line-height: 18px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="invoice-header">
              <div class="logo">REventS</div>
              <div class="title">INVOICE</div>
            </div>
            
            <table class="details-table">
              <tr>
                <td>
                  <strong>REventS Tickets Ltd.</strong><br>
                  SCBD District, Tower 2A<br>
                  Jakarta, Indonesia
                </td>
                <td style="text-align: right;">
                  <strong>Invoice No:</strong> ${transactionId || 'TXN-192837'}<br>
                  <strong>Date:</strong> ${dateString}<br>
                  <strong>Payment Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${paymentStatus}</span>
                </td>
              </tr>
            </table>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Event Description</th>
                  <th style="text-align: center; width: 10%;">Qty</th>
                  <th style="text-align: right; width: 25%;">Unit Price</th>
                  <th style="text-align: right; width: 25%;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${eventTitle} (Standard Ticket)</td>
                  <td style="text-align: center;">${qty}</td>
                  <td style="text-align: right;">${amountString}</td>
                  <td style="text-align: right;">${amountString}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2"></td>
                  <td style="text-align: right;">Total Paid:</td>
                  <td style="text-align: right; color: #6366f1;">${amountString}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="footer">
              Thank you for choosing REventS! We look forward to seeing you at the event.<br>
              Need help? Contact support@revents.com
            </div>
          </div>
        </body>
        </html>
      `;

      const options = { 
        format: 'A4',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        executablePath: getChromiumPath()
      };
      const file = { content: htmlContent };
      
      // Set a 15-second timeout for PDF generation
      const pdfPromise = html_to_pdf.generatePdf(file, options);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Invoice PDF generation timed out')), 15000)
      );
      
      const pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]) as Buffer;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice_${transactionId}.pdf`);
      res.send(pdfBuffer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
