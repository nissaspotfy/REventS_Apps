import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { sendEmail } from '../services/auth.service';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-it';

router.post('/invite', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    const invitedEmail = email.toLowerCase().trim();
    const organizerId = req.user?.userId;
    const organizerName = req.user ? (await User.findByPk(organizerId))?.fullName : 'An Organizer';

    // Generate token valid for 7 days
    const token = jwt.sign(
      { organizerId, organizerName, email: invitedEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const host = req.get('host');
    const protocol = req.protocol || 'http';
    const backendUrl = host ? `${protocol}://${host}` : (process.env.BACKEND_URL || 'http://localhost:5000');
    const acceptUrl = `${backendUrl}/api/team/accept?token=${token}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f8f9fa; border-radius: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 8px;">Team Collaboration Request</h2>
        <p style="color: #374151;">Hello,</p>
        <p style="color: #374151;">You have been invited by <strong>${organizerName}</strong> to join their Event Organizer team on REventS.</p>
        <p style="color: #374151;">Click the button below to accept this invitation and join the team:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${acceptUrl}" 
             style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you do not wish to join this team, simply ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">REventS &mdash; Integrated Event Management Platform</p>
      </div>
    `;

    await sendEmail(invitedEmail, `Invitation to join ${organizerName}'s team on REventS`, emailHtml);
    res.status(200).json({ message: 'Invitation email sent successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/accept', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).send('Invalid or missing invitation token.');
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { organizerId, email } = decoded;

    const organizer = await User.findByPk(organizerId);
    if (!organizer) {
      res.status(404).send('Organizer profile not found.');
      return;
    }

    const currentPrefs = (organizer.preferences || {}) as any;
    const teamMembers = currentPrefs.teamMembers || [];

    if (!teamMembers.some((m: any) => m.email.toLowerCase() === email.toLowerCase())) {
      organizer.preferences = {
        ...currentPrefs,
        teamMembers: [
          ...teamMembers,
          { id: Date.now(), name: email.split('@')[0], role: 'Member', email: email.toLowerCase() }
        ]
      } as any;
      organizer.changed('preferences', true);
      await organizer.save();
    }

    // Link the invited user if they are already registered in the DB
    const invitedUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (invitedUser) {
      invitedUser.role = 'organizer';
      invitedUser.preferences = {
        categories: [],
        budget: '',
        frequency: '',
        ageGroup: '',
        ...(invitedUser.preferences || {}),
        joinedTeamOf: organizer.id
      } as any;
      invitedUser.changed('preferences', true);
      await invitedUser.save();
    }

    // Resolve Frontend Redirect URL safely
    let frontendUrl = process.env.GOOGLE_FRONTEND_REDIRECT || process.env.APP_URL || 'http://localhost:3000';
    if (!frontendUrl || frontendUrl === 'null' || frontendUrl === 'undefined') {
      frontendUrl = 'http://localhost:3000';
    }

    // Dynamic support for local network testing (mobile device access)
    const host = req.get('host');
    if (host) {
      const hostname = host.split(':')[0];
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        frontendUrl = `http://${hostname}:3000`;
      }
    }

    res.redirect(`${frontendUrl}?team_accepted=true`);
  } catch (err: any) {
    res.status(400).send(`Invitation link is invalid or expired: ${err.message}`);
  }
});

export default router;
