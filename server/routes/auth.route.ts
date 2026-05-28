import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// --- Standard Auth ---
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, AuthController.updateProfile);

// --- Forgot / Reset Password ---
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// --- Google OAuth2 ---
const googleClientId = process.env.GOOGLE_CLIENT_ID;
if (googleClientId) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/?auth_error=google_failed' }),
    AuthController.googleCallback
  );
} else {
  // Graceful fallback when Google is not configured
  router.get('/google', (_req, res) => {
    const frontendUrl = process.env.GOOGLE_FRONTEND_REDIRECT || process.env.APP_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}?auth_error=google_not_configured`);
  });
}

export default router;
