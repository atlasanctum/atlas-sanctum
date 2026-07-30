/**
 * SSO (Single Sign-On) Routes
 * 
 * Provides endpoints for SSO authentication with SAML 2.0, Azure AD, and Okta.
 */

import express from 'express';
import passport from 'passport';
import { ssoService } from '../services/sso';
import { auditService } from '../services/audit';
import { AuditActions, AuditResources } from '../services/audit';

const router = express.Router();

/**
 * Get available SSO providers
 */
router.get('/providers', async (req, res) => {
  try {
    const providers = ssoService.getAvailableProviders();
    res.json({ providers });
  } catch (error) {
    console.error('Error getting SSO providers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get SSO configuration for a provider
 */
router.get('/config/:provider', async (req, res) => {
  try {
    const { provider } = req.params;

    const validation = ssoService.validateConfig(provider);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid configuration',
        errors: validation.errors,
      });
    }

    let config: any = {};

    switch (provider) {
      case 'saml':
        config = {
          metadataUrl: '/api/sso/metadata/saml',
        };
        break;
      case 'azure-ad':
        config = ssoService.getAzureADConfig();
        break;
      case 'okta':
        config = ssoService.getOktaConfig();
        break;
      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }

    res.json({ provider, config });
  } catch (error) {
    console.error('Error getting SSO config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Initiate SAML login
 */
router.get('/login/saml', passport.authenticate('saml', {
  failureRedirect: '/login?error=saml_failed',
}));

/**
 * SAML callback
 */
router.post('/callback/saml', passport.authenticate('saml', {
  failureRedirect: '/login?error=saml_failed',
}), async (req, res) => {
  try {
    const user = req.user as any;

    // Log successful SSO login
    await auditService.log({
      userId: user.id,
      action: AuditActions.USER_LOGIN,
      resource: AuditResources.USER,
      resourceId: user.id,
      status: 'success',
      details: {
        method: 'saml',
        provider: 'saml',
        email: user.email,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error processing SAML callback:', error);
    res.redirect('/login?error=callback_failed');
  }
});

/**
 * Get SAML metadata (for SP-initiated login)
 */
router.get('/metadata/saml', (req, res) => {
  try {
    const metadata = ssoService.getSAMLMetadata();
    res.set('Content-Type', 'application/xml');
    res.send(metadata);
  } catch (error) {
    console.error('Error generating SAML metadata:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Initiate Azure AD login
 */
router.get('/login/azure', passport.authenticate('azure-ad', {
  failureRedirect: '/login?error=azure_failed',
}));

/**
 * Azure AD callback
 */
router.get('/callback/azure', passport.authenticate('azure-ad', {
  failureRedirect: '/login?error=azure_failed',
}), async (req, res) => {
  try {
    const user = req.user as any;

    // Log successful SSO login
    await auditService.log({
      userId: user.id,
      action: AuditActions.USER_LOGIN,
      resource: AuditResources.USER,
      resourceId: user.id,
      status: 'success',
      details: {
        method: 'sso',
        provider: 'azure-ad',
        email: user.email,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error processing Azure AD callback:', error);
    res.redirect('/login?error=callback_failed');
  }
});

/**
 * Initiate Okta login
 */
router.get('/login/okta', passport.authenticate('okta', {
  failureRedirect: '/login?error=okta_failed',
}));

/**
 * Okta callback
 */
router.get('/callback/okta', passport.authenticate('okta', {
  failureRedirect: '/login?error=okta_failed',
}), async (req, res) => {
  try {
    const user = req.user as any;

    // Log successful SSO login
    await auditService.log({
      userId: user.id,
      action: AuditActions.USER_LOGIN,
      resource: AuditResources.USER,
      resourceId: user.id,
      status: 'success',
      details: {
        method: 'sso',
        provider: 'okta',
        email: user.email,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error processing Okta callback:', error);
    res.redirect('/login?error=callback_failed');
  }
});

/**
 * SAML logout
 */
router.get('/logout/saml', (req, res) => {
  passport.authenticate('saml', {
    failureRedirect: '/login',
  })(req, res, () => {
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res.redirect('/login?error=logout_failed');
      }
      res.redirect('/login');
    });
  });
});

/**
 * Link SSO account to organization
 */
router.post('/link', async (req, res) => {
  try {
    const { userId, organizationId, ssoProvider, ssoProviderId } = req.body;

    if (!userId || !organizationId || !ssoProvider || !ssoProviderId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    await ssoService.linkToOrganization(userId, organizationId, ssoProvider, ssoProviderId);

    // Log SSO linking
    await auditService.log({
      userId: req.user?.id,
      action: AuditActions.USER_LOGIN,
      resource: AuditResources.USER,
      resourceId: userId,
      status: 'success',
      details: {
        action: 'link_sso',
        ssoProvider,
        organizationId,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error linking SSO account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Unlink SSO account from organization
 */
router.post('/unlink', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId',
      });
    }

    await ssoService.unlinkFromOrganization(userId);

    // Log SSO unlinking
    await auditService.log({
      userId: req.user?.id,
      action: AuditActions.USER_LOGIN,
      resource: AuditResources.USER,
      resourceId: userId,
      status: 'success',
      details: {
        action: 'unlink_sso',
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error unlinking SSO account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get SSO users for organization
 */
router.get('/users/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const users = await ssoService.getSSOUsersForOrganization(organizationId);

    res.json({ users });
  } catch (error) {
    console.error('Error getting SSO users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get SSO statistics for organization
 */
router.get('/statistics/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const stats = await ssoService.getSSOStatistics(organizationId);

    res.json({ stats });
  } catch (error) {
    console.error('Error getting SSO statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
