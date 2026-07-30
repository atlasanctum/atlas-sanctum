/**
 * Authentication Routes
 * 
 * RESTful API endpoints for authentication including login, logout,
 * token refresh, and session management.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { jwtService } from '../auth/jwt';
import { sessionService } from '../auth/session';
import { createHybridAuth, requireAuth } from '../middleware/auth';
import { requireRole } from '../rbac';
import { createSuccessResponse, createErrorResponse, generateRequestId } from '../types';
import { logger } from '../utils/logger';
import redisClient from '../redisClient';

const router = Router();

// ============================================================================
// Request Types
// ============================================================================

interface LoginRequest {
  email: string;
  password: string;
  mfaToken?: string;
  deviceFingerprint?: string;
}

interface RefreshRequest {
  refreshToken: string;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

// ============================================================================
// Health Check (No Auth)
// ============================================================================

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// POST /api/auth/login
// ============================================================================

router.post('/login', async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const { email, password, mfaToken, deviceFingerprint } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Email and password are required')
      );
    }

    // TODO: Implement actual user lookup and password verification
    // This is a placeholder implementation
    const user = await getUserByEmail(email);
    
    if (!user) {
      logger.warn('[auth] Login failed - user not found', { email, requestId });
      return res.status(401).json(
        createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password')
      );
    }

    // Verify password (placeholder)
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      logger.warn('[auth] Login failed - invalid password', { email, requestId });
      return res.status(401).json(
        createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password')
      );
    }

    // Check MFA if enabled
    if (user.mfaEnabled && !mfaToken) {
      return res.status(200).json({
        success: true,
        data: { requiresMfa: true },
        meta: { requestId, timestamp: new Date().toISOString() }
      });
    }

    // Verify MFA token
    if (user.mfaEnabled && mfaToken) {
      const mfaValid = await verifyMfaToken(user.mfaSecret, mfaToken);
      if (!mfaValid) {
        logger.warn('[auth] Login failed - invalid MFA token', { email, requestId });
        return res.status(401).json(
          createErrorResponse('INVALID_MFA', 'Invalid MFA token')
        );
      }
    }

    // Get device fingerprint
    const fp = deviceFingerprint || req.headers['x-device-fingerprint'] as string;

    // Create session
    const sessionResult = await sessionService.createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      permissions: getRoleCapabilities(user.role),
      deviceFingerprint: fp,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    // Generate JWT tokens
    const tokens = jwtService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      sessionId: sessionResult.session.id,
      deviceFingerprint: fp
    });

    // Store session info for token refresh
    await redisClient.setex(
      `session:${sessionResult.session.id}`,
      86400,
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        organizationId: user.organizationId,
        deviceFingerprint: fp
      })
    );

    logger.info('[auth] Login successful', { userId: user.id, requestId });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          tenantId: user.tenantId
        },
        session: {
          id: sessionResult.session.id,
          expiresAt: sessionResult.session.expiresAt
        },
        tokens
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('[auth] Login error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred during login')
    );
  }
});

// ============================================================================
// POST /api/auth/logout
// ============================================================================

router.post('/logout', requireAuth, async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const user = req.user!;
    
    // Delete session
    if (req.authMethod === 'session' && user.sessionId) {
      await sessionService.deleteSession(user.sessionId);
    }

    // Store token in blacklist (for immediate invalidation)
    if (user.exp) {
      const ttl = user.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redisClient.setex(`token_blacklist:${user.sessionId}`, ttl, '1');
      }
    }

    logger.info('[auth] Logout successful', { userId: user.sub, requestId });

    // Clear session cookie
    const cookieOptions = sessionService.getClearCookieOptions();
    res.clearCookie(cookieOptions.name, cookieOptions.options);

    res.json({
      success: true,
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Logout error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred during logout')
    );
  }
});

// ============================================================================
// POST /api/auth/refresh
// ============================================================================

router.post('/refresh', async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const { refreshToken } = req.body as RefreshRequest;

    if (!refreshToken) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Refresh token is required')
      );
    }

    // Verify refresh token and get session info
    const refreshResult = await jwtService.refreshTokens(
      refreshToken,
      async (sessionId: string) => {
        const sessionData = await sessionService.getSessionData(sessionId);
        if (!sessionData) return null;
        
        return {
          userId: sessionData.userId,
          email: sessionData.email,
          role: sessionData.role,
          tenantId: sessionData.tenantId,
          organizationId: sessionData.organizationId,
          deviceFingerprint: sessionData.deviceFingerprint
        };
      }
    );

    if (!refreshResult) {
      return res.status(401).json(
        createErrorResponse('INVALID_TOKEN', 'Invalid or expired refresh token')
      );
    }

    logger.info('[auth] Token refresh successful', { requestId });

    res.json({
      success: true,
      data: {
        tokens: refreshResult
      },
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Token refresh error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred during token refresh')
    );
  }
});

// ============================================================================
// GET /api/auth/me
// ============================================================================

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const user = req.user!;
    
    // Get full user profile
    const profile = await getUserById(user.sub);
    
    if (!profile) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'User not found')
      );
    }

    res.json({
      success: true,
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName,
          role: profile.role,
          tenantId: profile.tenantId,
          organizationId: profile.organizationId,
          emailVerified: profile.emailVerified,
          mfaEnabled: profile.mfaEnabled,
          lastLogin: profile.lastLogin,
          createdAt: profile.createdAt
        }
      },
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Get profile error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred while fetching profile')
    );
  }
});

// ============================================================================
// POST /api/auth/password/reset
// ============================================================================

router.post('/password/reset', async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const { email } = req.body as PasswordResetRequest;

    if (!email) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Email is required')
      );
    }

    // TODO: Generate reset token and send email
    logger.info('[auth] Password reset requested', { email, requestId });

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Password reset error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred')
    );
  }
});

// ============================================================================
// POST /api/auth/password/reset/confirm
// ============================================================================

router.post('/password/reset/confirm', async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const { token, password } = req.body as PasswordResetConfirmRequest;

    if (!token || !password) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Token and new password are required')
      );
    }

    // TODO: Verify reset token and update password
    logger.info('[auth] Password reset confirmed', { requestId });

    res.json({
      success: true,
      message: 'Password has been reset successfully',
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Password reset confirm error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred')
    );
  }
});

// ============================================================================
// GET /api/auth/sessions
// ============================================================================

router.get('/sessions', requireAuth, async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const user = req.user!;
    const sessions = await sessionService.getUserSessions(user.sub);

    res.json({
      success: true,
      data: {
        sessions: sessions.map(s => ({
          id: s.id,
          deviceFingerprint: s.deviceFingerprint?.substring(0, 8) + '...',
          expiresAt: s.expiresAt,
          current: s.id === user.sessionId
        }))
      },
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Get sessions error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred')
    );
  }
});

// ============================================================================
// DELETE /api/auth/sessions/:id
// ============================================================================

router.delete('/sessions/:id', requireAuth, async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const user = req.user!;
    const sessionId = req.params.id;

    // Can't delete current session (use logout instead)
    if (sessionId === user.sessionId) {
      return res.status(400).json(
        createErrorResponse('INVALID_OPERATION', 'Use logout to end your current session')
      );
    }

    // Verify session belongs to user
    const session = await sessionService.getSession(sessionId);
    if (!session || session.userId !== user.sub) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Session not found')
      );
    }

    await sessionService.deleteSession(sessionId);

    logger.info('[auth] Session deleted', { userId: user.sub, sessionId, requestId });

    res.json({
      success: true,
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Delete session error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred')
    );
  }
});

// ============================================================================
// DELETE /api/auth/sessions
// ============================================================================

router.delete('/sessions', requireAuth, async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  
  try {
    const user = req.user!;
    const count = await sessionService.deleteUserSessions(user.sub);

    logger.info('[auth] All sessions deleted', { userId: user.sub, count, requestId });

    // Clear session cookie
    const cookieOptions = sessionService.getClearCookieOptions();
    res.clearCookie(cookieOptions.name, cookieOptions.options);

    res.json({
      success: true,
      data: { deletedSessions: count },
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error('[auth] Delete all sessions error', { error, requestId });
    res.status(500).json(
      createErrorResponse('INTERNAL_ERROR', 'An error occurred')
    );
  }
});

// ============================================================================
// Helper Functions (Placeholders)
// ============================================================================

async function getUserByEmail(email: string): Promise<any | null> {
  // TODO: Implement actual database lookup
  return null;
}

async function getUserById(id: string): Promise<any | null> {
  // TODO: Implement actual database lookup
  return null;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // TODO: Implement actual password verification
  return password === hash;
}

async function verifyMfaToken(secret: string, token: string): Promise<boolean> {
  // TODO: Implement actual MFA verification
  return true;
}

function getRoleCapabilities(role: string): string[] {
  const { ROLE_CAPABILITIES } = require('../types');
  return ROLE_CAPABILITIES[role] || ['own:profile:read', 'own:profile:write'];
}

export default router;
