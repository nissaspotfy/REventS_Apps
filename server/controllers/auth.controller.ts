import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const getFrontendUrl = (req?: Request): string => {
  let url = process.env.GOOGLE_FRONTEND_REDIRECT || process.env.APP_URL || 'http://localhost:3000';
  if (!url || url === 'null' || url === 'undefined') {
    url = 'http://localhost:3000';
  }
  if (req) {
    const host = req.get('host');
    if (host) {
      const hostname = host.split(':')[0];
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        url = `http://${hostname}:3000`;
      }
    }
  }
  return url;
};

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password, fullName, role, preferences } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const result = await AuthService.register({
        email,
        password,
        fullName: fullName || email.split('@')[0],
        role: role || 'audience',
        preferences: preferences || {
          categories: [],
          budget: 'Free',
          frequency: 'Weekend',
          ageGroup: 'All Ages'
        },
        profilePicUrl: null
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async googleCallback(req: Request, res: Response) {
    try {
      const result = req.user as any;
      const redirectUrl = getFrontendUrl(req);
      if (!result || !result.token) {
        return res.redirect(`${redirectUrl}?auth_error=google_failed`);
      }
      return res.redirect(`${redirectUrl}?token=${result.token}`);
    } catch (err: any) {
      const redirectUrl = getFrontendUrl(req);
      return res.redirect(`${redirectUrl}?auth_error=${encodeURIComponent(err.message)}`);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: 'Email is required.' });
        return;
      }
      await AuthService.forgotPassword(email);
      res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        res.status(400).json({ error: 'Token and new password are required.' });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters.' });
        return;
      }
      const result = await AuthService.resetPassword(token, newPassword);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const profile = await AuthService.getProfile(userId);
      res.status(200).json(profile);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { fullName, profilePicUrl, preferences } = req.body;
      const updated = await AuthService.updateProfile(userId, { fullName, profilePicUrl, preferences });
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
