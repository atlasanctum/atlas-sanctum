import express, { Request, Response } from 'express';
import passport from '../config/passport';
import { query } from '../db';
import {
  hashPassword,
  verifyPassword,
  generateSecureAccessToken,
  generateSecureRefreshToken,
  createRefreshToken,
  revokeRefreshToken,
  findRefreshToken,
  createEmailVerificationToken,
  verifyEmailToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
  createUserSession,
  verifySecureRefreshToken,
  enforceConcurrentSessionLimit,
  invalidateAllUserSessions,
  setupMFA,
  enableMFA,
  disableMFA,
  verifyMFAForLogin,
  generateBackupCodes,
  hashBackupCodes,
  generateDeviceFingerprint,
  getCurrentTokenVersion,
  detectSuspiciousLogin,
  LoginContext,
  getSecurityDashboardData
} from '../utils/auth';
import { emailService } from '../services/email';
import { authenticate, authorize, requireMFA, requireEmailVerification, checkLoginAttempts, resetLoginAttempts, AuthenticatedRequest } from '../middleware/auth';
import { validateWithZod } from '../middleware/validation';
import { 
  userCreateSchema, 
  loginSchema, 
  userUpdateSchema, 
  producerOnboardingSchema, 
  investorOnboardingSchema, 
  institutionOnboardingSchema, 
  researcherOnboardingSchema 
} from '../validation/schemas';
import { logSecurityEvent } from '../utils/logger';

const router = express.Router();

// Sign Up
router.post('/signup', validateWithZod(userCreateSchema), async (req: Request, res: Response) => {
  const { email, phoneNumber, password, displayName, role = 'producer' } = req.body;

  try {
    // Validate that either email or phone number is provided
    if (!email && !phoneNumber) {
      return res.status(400).json({ message: 'Either email or phone number is required' });
    }

    // Check if user with this email or phone already exists
    if (email) {
      const existingEmailUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      if (existingEmailUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (phoneNumber) {
      const existingPhoneUser = await query('SELECT id FROM users WHERE phone_number = $1', [phoneNumber]);
      if (existingPhoneUser.rows.length > 0) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    const result = await query(
      `INSERT INTO users (email, phone_number, display_name, password_hash, role, email_verified, phone_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, phone_number, display_name, role, email_verified, phone_verified`,
      [email?.toLowerCase(), phoneNumber, displayName || (email?.split('@')[0] || 'User'), hashedPassword, role, !!email, !!phoneNumber]
    );

    const user = result.rows[0];

    // Log successful registration
    logSecurityEvent('user_registration', user.id, {
      email: user.email,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    // Create email verification token
    const verificationToken = await createEmailVerificationToken(user.id);

    // Send welcome and verification email if email is provided
    if (user.email) {
      try {
        const safeDisplayName = user.display_name || 'User';
        await emailService.sendWelcomeEmail(user.email, safeDisplayName);
        await emailService.sendEmailVerification(user.email, verificationToken);
      } catch (emailError) {
        console.error('Failed to send welcome/verification email:', emailError);
        // Don't fail registration if email fails
      }
    }

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phone_number,
        displayName: user.display_name,
        role: user.role,
        emailVerified: user.email_verified
      },
      message: 'Account created successfully. Please check your email to verify your account.'
    });
  } catch (err: any) {
    if (err.code === '23505') { // Unique violation
      logSecurityEvent('registration_failed', null, {
        reason: 'email_exists',
        email: email?.toLowerCase(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'low');
      return res.status(409).json({ code: 'email_exists', message: 'Email already registered' });
    }
    console.error('Signup error:', err);
    logSecurityEvent('registration_failed', null, {
      reason: 'server_error',
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Failed to create account' });
  }
});

// Login
router.post('/login', validateWithZod(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check login attempts
  if (!checkLoginAttempts(email.toLowerCase())) {
    logSecurityEvent('login_failed', null, {
      reason: 'rate_limited',
      email: email.toLowerCase(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    return res.status(429).json({
      code: 'too_many_attempts',
      message: 'Too many failed login attempts. Please try again later.'
    });
  }

  try {
    const result = await query(
      'SELECT id, email, display_name, password_hash, role, tenant_id, email_verified, mfa_enabled, login_attempts, locked_until, account_locked FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rowCount === 0) {
      logSecurityEvent('login_failed', null, {
        reason: 'user_not_found',
        email: email.toLowerCase(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'low');
      return res.status(401).json({ code: 'invalid_credentials', message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check if account is locked
    if (user.account_locked || (user.locked_until && new Date(user.locked_until) > new Date())) {
      logSecurityEvent('login_failed', user.id, {
        reason: 'account_locked',
        email: user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'high');
      return res.status(423).json({
        code: 'account_locked',
        message: 'Account is locked'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      // Increment login attempts
      const newAttempts = (user.login_attempts || 0) + 1;
      let updateQuery = 'UPDATE users SET login_attempts = $1 WHERE id = $2';
      let updateParams = [newAttempts, user.id];

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        updateQuery = 'UPDATE users SET login_attempts = $1, locked_until = $2 WHERE id = $3';
        updateParams = [newAttempts, lockUntil, user.id];
      }

      await query(updateQuery, updateParams);

      logSecurityEvent('login_failed', user.id, {
        reason: 'invalid_password',
        attemptCount: newAttempts,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'medium');

      return res.status(401).json({ code: 'invalid_credentials', message: 'Invalid email or password' });
    }

    // Reset login attempts on successful login
    resetLoginAttempts(email.toLowerCase());
    await query('UPDATE users SET login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1', [user.id]);

    // Check for suspicious login activity
    const loginDeviceFingerprint = generateDeviceFingerprint(req);
    const loginContext: LoginContext = {
      ip: req.ip || '',
      userAgent: req.get('User-Agent') || '',
      deviceFingerprint: loginDeviceFingerprint,
      timestamp: new Date()
    };

    const suspiciousCheck = await detectSuspiciousLogin(user.id, loginContext);

    if (suspiciousCheck.isSuspicious) {
      logSecurityEvent('suspicious_login', user.id, {
        reasons: suspiciousCheck.reasons,
        riskLevel: suspiciousCheck.riskLevel,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        deviceFingerprint: loginDeviceFingerprint
      }, suspiciousCheck.riskLevel);

      // For high risk, you could require additional verification or send alerts
      // For now, just log it
    }

    // Enforce concurrent session limits
    await enforceConcurrentSessionLimit(user.id);

    // Get current token version and device fingerprint
    const currentVersion = await getCurrentTokenVersion(user.id);
    const deviceFingerprint = generateDeviceFingerprint(req);

    // Create tokens
    const accessToken = generateSecureAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    const refreshTokenData = await createRefreshToken(user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      deviceFingerprint
    });

    const refreshToken = generateSecureRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    // Create user session
    await createUserSession(
      user.id,
      accessToken,
      refreshTokenData.id,
      { ip: req.ip, userAgent: req.get('User-Agent') },
      req.ip,
      req.get('User-Agent') || undefined
    );

    // Log successful login
    logSecurityEvent('login_success', user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: user.email
    }, 'low');

    // Send login notification (async, don't wait)
    try {
      emailService.sendLoginNotification(user.email, user.display_name || user.email, req.ip || 'unknown')
        .catch(err => console.error('Failed to send login notification:', err));
    } catch (err) {
      // Ignore email errors
    }

    // Refresh token goes in httpOnly cookie — never exposed to JS
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v2/auth'
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        tenantId: user.tenant_id,
        emailVerified: user.email_verified,
        mfaEnabled: user.mfa_enabled
      },
      tokens: {
        accessToken,
        expiresIn: 15 * 60
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    logSecurityEvent('login_error', null, {
      error: err.message,
      email: email.toLowerCase(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Login failed' });
  }
});

// Refresh Token — reads from httpOnly cookie, falls back to body for backwards compat
router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(422).json({ code: 'invalid', message: 'Refresh token required' });
  }

  try {
    const deviceFingerprint = generateDeviceFingerprint(req);
    const payload = verifySecureRefreshToken(refreshToken, deviceFingerprint);
    const refreshTokenData = await findRefreshToken(payload.userId);

    if (!refreshTokenData || refreshTokenData.revoked) {
      return res.status(401).json({ code: 'invalid_token', message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = generateSecureAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      version: payload.version
    }, deviceFingerprint);

    const newRefreshToken = generateSecureRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      version: payload.version
    }, deviceFingerprint);

    // Revoke old refresh token and create new one (rotation)
    await revokeRefreshToken(refreshTokenData.token);
    await createRefreshToken(payload.userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      deviceFingerprint
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v2/auth'
    });

    res.json({
      tokens: {
        accessToken: newAccessToken,
        expiresIn: 15 * 60
      }
    });
  } catch (err) {
    res.status(401).json({ code: 'invalid_token', message: 'Invalid refresh token' });
  }
});

// Logout — clears httpOnly cookie and revokes refresh token
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
  const userId = req.user!.id;

  try {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    await invalidateAllUserSessions(userId);

    res.clearCookie('refresh_token', { path: '/api/v2/auth' });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ code: 'server_error', message: 'Logout failed' });
  }
});

// Get Current User
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    tenantId: user.tenantId,
    emailVerified: user.emailVerified,
    mfaEnabled: user.mfaEnabled,
    lastLogin: user.lastLogin
  });
});

// Update Profile
router.put('/profile', authenticate, validateWithZod(userUpdateSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { displayName, bio, avatar, preferences } = req.body;
  const userId = req.user!.id;

  try {
    const result = await query(
      `UPDATE users
       SET display_name = $1, bio = $2, avatar = $3, preferences = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, email, display_name, bio, avatar, preferences`,
      [displayName, bio, avatar, preferences, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found', message: 'User not found' });
    }

    // Log profile update
    logSecurityEvent('profile_updated', userId, {
      fields: Object.keys(req.body),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Profile update error:', err);
    logSecurityEvent('profile_update_failed', userId, {
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');
    res.status(500).json({ code: 'server_error', message: 'Failed to update profile' });
  }
});

// Update Email Preferences
router.put('/email-preferences', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { marketing, transactional, notifications } = req.body;
  const userId = req.user!.id;

  // Validate input
  if (typeof marketing !== 'boolean' || typeof transactional !== 'boolean' || typeof notifications !== 'boolean') {
    return res.status(422).json({ code: 'invalid', message: 'All email preferences must be boolean values' });
  }

  try {
    // Get current preferences
    const userResult = await query('SELECT preferences FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ code: 'not_found', message: 'User not found' });
    }

    const currentPrefs = userResult.rows[0].preferences || {};
    const updatedPrefs = {
      ...currentPrefs,
      email: {
        marketing,
        transactional,
        notifications
      }
    };

    // Update preferences
    await query('UPDATE users SET preferences = $1 WHERE id = $2', [updatedPrefs, userId]);

    res.json({
      message: 'Email preferences updated successfully',
      preferences: updatedPrefs
    });
  } catch (err: any) {
    console.error('Email preferences update error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to update email preferences' });
  }
});

// Get Email Preferences
router.get('/email-preferences', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const result = await query('SELECT preferences FROM users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found', message: 'User not found' });
    }

    const preferences = result.rows[0].preferences || {};
    const emailPrefs = preferences.email || {
      marketing: true,
      transactional: true,
      notifications: true
    };

    res.json({
      preferences: emailPrefs
    });
  } catch (err: any) {
    console.error('Email preferences fetch error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to fetch email preferences' });
  }
});

// Email Verification
router.post('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(422).json({ code: 'invalid', message: 'Verification token required' });
  }

  try {
    const userId = await verifyEmailToken(token);
    if (!userId) {
      return res.status(400).json({ code: 'invalid_token', message: 'Invalid or expired verification token' });
    }

    await query('UPDATE users SET email_verified = true WHERE id = $1', [userId]);

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ code: 'server_error', message: 'Email verification failed' });
  }
});

// Resend Email Verification
router.post('/resend-verification', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  if (user.emailVerified) {
    return res.status(400).json({ code: 'already_verified', message: 'Email already verified' });
  }

  try {
    if (!user.email) {
      return res.status(400).json({ code: 'email_required', message: 'Email is required for verification' });
    }
    
    const verificationToken = await createEmailVerificationToken(user.id);
    const safeDisplayName = user.displayName || 'User';
    await emailService.sendEmailVerification(user.email, verificationToken);

    res.json({ message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ code: 'server_error', message: 'Failed to send verification email' });
  }
});

// Password Reset Request
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ code: 'invalid', message: 'Email required' });
  }

  try {
    const result = await query('SELECT id, display_name FROM users WHERE email = $1', [email.toLowerCase()]);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      const resetToken = await createPasswordResetToken(user.id);
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return success to prevent email enumeration
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ code: 'server_error', message: 'Failed to process request' });
  }
});

// Password Reset
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(422).json({ code: 'invalid', message: 'Token and new password required' });
  }

  if (newPassword.length < 8) {
    return res.status(422).json({ code: 'invalid', message: 'Password must be at least 8 characters long' });
  }

  try {
    const userId = await verifyPasswordResetToken(token);
    if (!userId) {
      return res.status(400).json({ code: 'invalid_token', message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

    // Revoke all refresh tokens for security
    await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ code: 'server_error', message: 'Password reset failed' });
  }
});

// Change Password
router.put('/change-password', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  if (!currentPassword || !newPassword) {
    return res.status(422).json({ code: 'invalid', message: 'Current password and new password required' });
  }

  if (newPassword.length < 8) {
    return res.status(422).json({ code: 'invalid', message: 'New password must be at least 8 characters long' });
  }

  try {
    // Get current user
    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ code: 'not_found', message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      logSecurityEvent('password_change_failed', userId, {
        reason: 'invalid_current_password',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'medium');
      return res.status(401).json({ code: 'invalid_credentials', message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hashedNewPassword, userId]);

    // Revoke all refresh tokens for security
    await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);

    // Log successful password change
    logSecurityEvent('password_changed', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({ message: 'Password changed successfully' });
  } catch (err: any) {
    console.error('Password change error:', err);
    logSecurityEvent('password_change_failed', userId, {
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Failed to change password' });
  }
});

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/auth?error=oauth_failed` }),
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    // Get current token version and device fingerprint
    const currentVersion = await getCurrentTokenVersion(user.id);
    const deviceFingerprint = generateDeviceFingerprint(req);

    // Generate tokens for OAuth user
    const accessToken = generateSecureAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    const refreshTokenData = await createRefreshToken(user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      provider: 'google',
      deviceFingerprint
    });

    const refreshToken = generateSecureRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    // Set refresh token as httpOnly cookie; return access token in response body via fragment
    // Using fragment (#) prevents tokens from reaching server logs
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api'
    });
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/callback`);
    redirectUrl.hash = `access_token=${encodeURIComponent(accessToken)}`;
    res.redirect(redirectUrl.toString());
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/auth?error=oauth_failed` }),
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    const currentVersion = await getCurrentTokenVersion(user.id);
    const deviceFingerprint = generateDeviceFingerprint(req);

    const accessToken = generateSecureAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    await createRefreshToken(user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      provider: 'github',
      deviceFingerprint
    });

    const refreshToken = generateSecureRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api'
    });
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/callback`);
    redirectUrl.hash = `access_token=${encodeURIComponent(accessToken)}`;
    res.redirect(redirectUrl.toString());
  }
);

router.get('/microsoft', passport.authenticate('microsoft'));

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: `${process.env.FRONTEND_URL}/auth?error=oauth_failed` }),
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    const currentVersion = await getCurrentTokenVersion(user.id);
    const deviceFingerprint = generateDeviceFingerprint(req);

    const accessToken = generateSecureAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    await createRefreshToken(user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      provider: 'microsoft',
      deviceFingerprint
    });

    const refreshToken = generateSecureRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id,
      version: currentVersion
    }, deviceFingerprint);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api'
    });
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/callback`);
    redirectUrl.hash = `access_token=${encodeURIComponent(accessToken)}`;
    res.redirect(redirectUrl.toString());
  }
);

// MFA Setup
router.post('/mfa/setup', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const result = await query('SELECT mfa_enabled FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found', message: 'User not found' });
    }

    if (result.rows[0].mfa_enabled) {
      return res.status(400).json({ code: 'mfa_already_enabled', message: 'MFA is already enabled' });
    }

    const { secret, otpauthUrl, backupCodes } = await setupMFA(userId);

    logSecurityEvent('mfa_setup_initiated', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({
      secret,
      otpauthUrl,
      backupCodes,
      message: 'MFA setup initiated. Use the QR code to configure your authenticator app.'
    });
  } catch (err) {
    console.error('MFA setup error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to setup MFA' });
  }
});

// MFA Enable
router.post('/mfa/enable', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { token } = req.body;
  const userId = req.user!.id;

  if (!token) {
    return res.status(422).json({ code: 'invalid', message: 'MFA token required' });
  }

  try {
    const isValid = await enableMFA(userId, token);

    if (!isValid) {
      logSecurityEvent('mfa_enable_failed', userId, {
        reason: 'invalid_token',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'medium');
      return res.status(400).json({ code: 'invalid_token', message: 'Invalid MFA token' });
    }

    logSecurityEvent('mfa_enabled', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({ message: 'MFA enabled successfully' });
  } catch (err) {
    console.error('MFA enable error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to enable MFA' });
  }
});

// MFA Disable
router.post('/mfa/disable', authenticate, requireMFA, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    await disableMFA(userId);

    logSecurityEvent('mfa_disabled', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');

    res.json({ message: 'MFA disabled successfully' });
  } catch (err) {
    console.error('MFA disable error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to disable MFA' });
  }
});

// MFA Status
router.get('/mfa/status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const result = await query('SELECT mfa_enabled FROM users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found', message: 'User not found' });
    }

    res.json({
      mfaEnabled: result.rows[0].mfa_enabled || false
    });
  } catch (err) {
    console.error('MFA status error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to get MFA status' });
  }
});

// Regenerate Backup Codes
router.post('/mfa/backup-codes', authenticate, requireMFA, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = await hashBackupCodes(backupCodes);

    await query('UPDATE users SET mfa_backup_codes = $1 WHERE id = $2', [hashedBackupCodes, userId]);

    logSecurityEvent('backup_codes_regenerated', userId, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');

    res.json({
      backupCodes,
      message: 'Backup codes regenerated. Save these codes securely.'
    });
  } catch (err) {
    console.error('Backup codes regeneration error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to regenerate backup codes' });
  }
});

// Security Dashboard (Admin only)
router.get('/security-dashboard', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dashboardData = await getSecurityDashboardData();
    res.json(dashboardData);
  } catch (err) {
    console.error('Security dashboard error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to fetch security dashboard data' });
  }
});

// Force logout all sessions for a user (Admin only)
router.post('/force-logout/:userId', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    // Increment token version to invalidate all existing tokens
    await query('UPDATE users SET token_version = COALESCE(token_version, 1) + 1 WHERE id = $1', [userId]);

    logSecurityEvent('force_logout', req.user!.id, {
      targetUserId: userId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'high');

    res.json({ message: 'User has been forcibly logged out from all sessions' });
  } catch (err) {
    console.error('Force logout error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to force logout' });
  }
});

// Get user sessions (Admin only)
router.get('/user-sessions/:userId', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await query(`
      SELECT
        us.id,
        us.session_token,
        us.ip_address,
        us.user_agent,
        us.created_at,
        us.last_activity,
        us.expires_at,
        rt.device_info
      FROM user_sessions us
      LEFT JOIN refresh_tokens rt ON us.refresh_token_id = rt.id
      WHERE us.user_id = $1 AND us.expires_at > NOW()
      ORDER BY us.last_activity DESC
    `, [userId]);

    res.json({
      sessions: result.rows.map(session => ({
        id: session.id,
        ipAddress: session.ip_address,
        userAgent: session.user_agent,
        createdAt: session.created_at,
        lastActivity: session.last_activity,
        expiresAt: session.expires_at,
        deviceInfo: session.device_info
      }))
    });
  } catch (err) {
    console.error('User sessions fetch error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to fetch user sessions' });
  }
});

// Role-based onboarding routes
router.post('/onboarding/producer', authenticate, validateWithZod(producerOnboardingSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { locationType, location, verificationPhoto } = req.body;
    const userId = req.user!.id;

    // Update user profile with producer-specific information
    await query(
      `UPDATE users 
       SET profile_data = COALESCE(profile_data, '{}'::jsonb) || $1::jsonb 
       WHERE id = $2`,
      [
        JSON.stringify({
          producer: {
            locationType,
            location,
            verificationPhoto,
            onboardingCompleted: true
          }
        }),
        userId
      ]
    );

    logSecurityEvent('onboarding_completed', userId, {
      role: 'producer',
      locationType,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({ 
      message: 'Producer onboarding completed successfully',
      user: {
        id: userId,
        role: 'producer',
        onboardingCompleted: true
      }
    });
  } catch (err: any) {
    console.error('Producer onboarding error:', err);
    logSecurityEvent('onboarding_failed', req.user!.id, {
      role: 'producer',
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Failed to complete onboarding' });
  }
});

router.post('/onboarding/investor', authenticate, validateWithZod(investorOnboardingSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { investmentIntent, riskProfile, investmentAmount } = req.body;
    const userId = req.user!.id;

    // Update user profile with investor-specific information
    await query(
      `UPDATE users 
       SET profile_data = COALESCE(profile_data, '{}'::jsonb) || $1::jsonb 
       WHERE id = $2`,
      [
        JSON.stringify({
          investor: {
            investmentIntent,
            riskProfile,
            investmentAmount,
            onboardingCompleted: true
          }
        }),
        userId
      ]
    );

    logSecurityEvent('onboarding_completed', userId, {
      role: 'investor',
      investmentIntent,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({ 
      message: 'Investor onboarding completed successfully',
      user: {
        id: userId,
        role: 'investor',
        onboardingCompleted: true
      }
    });
  } catch (err: any) {
    console.error('Investor onboarding error:', err);
    logSecurityEvent('onboarding_failed', req.user!.id, {
      role: 'investor',
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Failed to complete onboarding' });
  }
});

router.post('/onboarding/institution', authenticate, validateWithZod(institutionOnboardingSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { institutionType, jurisdiction, governanceMode, officialEmail } = req.body;
    const userId = req.user!.id;

    // Update user profile with institution-specific information
    await query(
      `UPDATE users 
       SET profile_data = COALESCE(profile_data, '{}'::jsonb) || $1::jsonb 
       WHERE id = $2`,
      [
        JSON.stringify({
          institution: {
            institutionType,
            jurisdiction,
            governanceMode,
            officialEmail,
            onboardingCompleted: true
          }
        }),
        userId
      ]
    );

    logSecurityEvent('onboarding_completed', userId, {
      role: 'institution',
      institutionType,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({ 
      message: 'Institution onboarding completed successfully',
      user: {
        id: userId,
        role: 'institution',
        onboardingCompleted: true
      }
    });
  } catch (err: any) {
    console.error('Institution onboarding error:', err);
    logSecurityEvent('onboarding_failed', req.user!.id, {
      role: 'institution',
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Failed to complete onboarding' });
  }
});

router.post('/onboarding/researcher', authenticate, validateWithZod(researcherOnboardingSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { researchPurpose, accessLevel, fieldOfStudy, institution } = req.body;
    const userId = req.user!.id;

    // Update user profile with researcher-specific information
    await query(
      `UPDATE users 
       SET profile_data = COALESCE(profile_data, '{}'::jsonb) || $1::jsonb 
       WHERE id = $2`,
      [
        JSON.stringify({
          researcher: {
            researchPurpose,
            accessLevel,
            fieldOfStudy,
            institution,
            onboardingCompleted: true
          }
        }),
        userId
      ]
    );

    logSecurityEvent('onboarding_completed', userId, {
      role: 'researcher',
      researchPurpose,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'low');

    res.json({ 
      message: 'Researcher onboarding completed successfully',
      user: {
        id: userId,
        role: 'researcher',
        onboardingCompleted: true
      }
    });
  } catch (err: any) {
    console.error('Researcher onboarding error:', err);
    logSecurityEvent('onboarding_failed', req.user!.id, {
      role: 'researcher',
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');
    res.status(500).json({ code: 'server_error', message: 'Failed to complete onboarding' });
  }
});

// Get onboarding status
router.get('/onboarding/status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await query(
      'SELECT profile_data, role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'user_not_found', message: 'User not found' });
    }

    const user = result.rows[0];
    const profileData = user.profile_data || {};

    // Check if onboarding is completed for the specific role
    let onboardingCompleted = false;
    if (user.role in profileData && profileData[user.role]?.onboardingCompleted) {
      onboardingCompleted = true;
    }

    res.json({
      role: user.role,
      onboardingCompleted,
      profileData: profileData[user.role] || {},
      requiresOnboarding: !onboardingCompleted
    });
  } catch (err: any) {
    console.error('Get onboarding status error:', err);
    res.status(500).json({ code: 'server_error', message: 'Failed to get onboarding status' });
  }
});

export default router;
