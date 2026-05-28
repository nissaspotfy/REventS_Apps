import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'revent-secret-key-2026';

function hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}

function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// ---------- Email helper (nodemailer / mock fallback) ----------
export async function sendEmail(to: string, subject: string, html: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const from = process.env.SMTP_FROM || 'REventS <noreply@revents.com>';

  if (smtpHost && smtpUser && smtpPass) {
    const nodemailer = await import('nodemailer');
    const dns = await import('dns');

    // Pre-resolve host using system DNS lookup to prevent slow c-ares IPv6 query hangs
    let resolvedHost = smtpHost;
    try {
      resolvedHost = await new Promise<string>((resolve, reject) => {
        dns.lookup(smtpHost, (err, address) => {
          if (err) reject(err);
          else resolve(address);
        });
      });
      console.log(`Pre-resolved SMTP host ${smtpHost} to ${resolvedHost} for Auth Email.`);
    } catch (dnsErr) {
      console.error(`System DNS lookup failed for ${smtpHost}, using original host. Error:`, dnsErr);
    }

    const transporter = nodemailer.createTransport({
      host: resolvedHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        servername: smtpHost,
        rejectUnauthorized: false
      }
    });
    await transporter.sendMail({ from, to, subject, html });
  } else {
    // Fallback: log to mock-emails.log
    const fs = await import('fs');
    const path = await import('path');
    const logPath = path.join(process.cwd(), 'server', 'mock-emails.log');
    const entry = `\n--- ${new Date().toISOString()} ---\nTO: ${to}\nSUBJECT: ${subject}\n${html}\n`;
    fs.appendFileSync(logPath, entry, 'utf8');
    console.log(`[MockEmail] Email logged to mock-emails.log for: ${to}`);
  }
}

async function checkAndApplyPendingTeamInvitation(user: User) {
  try {
    const emailLower = user.email.toLowerCase();
    const organizers = await User.findAll();
    let joinedTeamOf: number | undefined = undefined;
    for (const org of organizers) {
      const orgPrefs = (org.preferences || {}) as any;
      const teamMembers = orgPrefs.teamMembers || [];
      if (teamMembers.some((m: any) => m.email.toLowerCase() === emailLower)) {
        joinedTeamOf = org.id;
        break;
      }
    }
    if (joinedTeamOf) {
      user.role = 'organizer';
      user.preferences = {
        categories: [],
        budget: '',
        frequency: '',
        ageGroup: '',
        ...(user.preferences || {}),
        joinedTeamOf
      } as any;
      user.changed('preferences', true);
      await user.save();
    }
  } catch (err) {
    console.error('Failed to check/apply pending team invitation:', err);
  }
}

export class AuthService {
  static async register(userData: Omit<any, 'id'>) {
    const emailLower = userData.email.toLowerCase();
    const existing = await User.findOne({ where: { email: emailLower } });
    if (existing) {
      throw new Error('Email is already registered.');
    }

    const passwordHash = userData.password ? hashPassword(userData.password) : undefined;

    const newUser = await User.create({
      ...userData,
      email: emailLower,
      password: passwordHash,
    });

    await checkAndApplyPendingTeamInvitation(newUser);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    
    const userJson = newUser.toJSON();
    const { password, ...userWithoutPassword } = userJson;
    return { user: userWithoutPassword, token };
  }

  static async login(email: string, passwordRaw: string) {
    const emailLower = email.toLowerCase();
    const user = await User.findOne({ where: { email: emailLower } });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const hashed = hashPassword(passwordRaw);
    if (user.password !== hashed) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userJson = user.toJSON();
    const { password, ...userWithoutPassword } = userJson;
    return { user: userWithoutPassword, token };
  }

  static async loginOrRegisterWithGoogle(profile: {
    googleId: string;
    email: string;
    fullName: string;
    profilePicUrl: string | null;
  }) {
    const emailLower = profile.email.toLowerCase();

    // Try find by googleId first
    let user = await User.findOne({ where: { googleId: profile.googleId } });

    // Then by email
    if (!user && emailLower) {
      user = await User.findOne({ where: { email: emailLower } });
      if (user) {
        // Link googleId to existing account
        user.googleId = profile.googleId;
        if (!user.profilePicUrl && profile.profilePicUrl) {
          user.profilePicUrl = profile.profilePicUrl;
        }
        await user.save();
      }
    }

    // Create new user
    if (!user) {
      user = await User.create({
        email: emailLower,
        password: undefined,
        fullName: profile.fullName,
        role: 'audience',
        googleId: profile.googleId,
        profilePicUrl: profile.profilePicUrl,
        preferences: {
          categories: [],
          budget: 'Free',
          frequency: 'Weekend',
          ageGroup: 'All Ages',
        },
      });
      await checkAndApplyPendingTeamInvitation(user);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userJson = user.toJSON();
    const { password, ...userWithoutPassword } = userJson;
    return { user: userWithoutPassword, token };
  }

  static async forgotPassword(email: string) {
    const emailLower = email.toLowerCase();
    const user = await User.findOne({ where: { email: emailLower } });

    // Always respond "success" to avoid email enumeration
    if (!user) return;

    const resetToken = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expires;
    await user.save();

    const frontendUrl = process.env.GOOGLE_FRONTEND_REDIRECT || process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}?reset_token=${resetToken}`;

    await sendEmail(
      emailLower,
      'Reset Password - REventS',
      `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f8f9fa; border-radius: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 8px;">Reset Your Password</h2>
        <p style="color: #374151;">Hello <strong>${user.fullName}</strong>,</p>
        <p style="color: #374151;">We received a request to reset your REventS account password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" 
             style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">REventS &mdash; Integrated Event Management Platform</p>
      </div>
      `
    );
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error('Reset token is invalid or has expired.');
    }

    user.password = hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return { message: 'Password reset successful.' };
  }

  static async getProfile(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const userJson = user.toJSON();
    const { password, ...userWithoutPassword } = userJson;
    return userWithoutPassword;
  }

  static async updateProfile(userId: number, updates: Partial<Pick<any, 'fullName' | 'profilePicUrl' | 'preferences'>>) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    
    if (updates.fullName !== undefined) user.fullName = updates.fullName;
    if (updates.profilePicUrl !== undefined) user.profilePicUrl = updates.profilePicUrl;
    if (updates.preferences !== undefined) {
      user.preferences = {
        ...user.preferences,
        ...updates.preferences
      };
    }

    await user.save();

    const userJson = user.toJSON();
    const { password, ...userWithoutPassword } = userJson;
    return userWithoutPassword;
  }
}
