# 🚀 PHASE 2 EXECUTION PLAN
## Payments, Email Notifications, Security Hardening

**Timeline:** Weeks 2-4 (40 hours)  
**Status:** Ready to implement  
**Priority:** CRITICAL

---

## 📋 PHASE 2 OVERVIEW

### Components to Build

| Component | Hours | Priority | Dependencies |
|-----------|-------|----------|--------------|
| Payment Service | 8 | ⭐⭐⭐⭐⭐ | Paystack account |
| Email Service | 8 | ⭐⭐⭐⭐⭐ | SendGrid account |
| Rate Limiting | 4 | ⭐⭐⭐⭐ | express-rate-limit |
| API Key System | 4 | ⭐⭐⭐⭐ | Database changes |
| CORS Hardening | 2 | ⭐⭐⭐⭐ | Config update |
| RBAC System | 6 | ⭐⭐⭐⭐ | Database changes |
| Logging & Monitoring | 4 | ⭐⭐⭐ | Sentry setup |
| Testing & Deployment | 4 | ⭐⭐⭐⭐ | All components |
| **TOTAL** | **40** | | |

---

## 📦 PRE-REQUISITES

### Accounts to Create
- [ ] Paystack Developer Account (https://dashboard.paystack.co)
- [ ] SendGrid Account (https://sendgrid.com)
- [ ] Sentry Account (https://sentry.io) - Optional for Phase 2

### Environment Variables Needed
```
# Payments
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_WEBHOOK_SECRET=wh_xxxxx

# Email
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@atlassanctum.com

# Security
JWT_SECRET=your-jwt-secret
API_KEY_ROTATION_DAYS=90

# Monitoring
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Dependencies to Install
```bash
# Backend
cd scaffold-mvp/backend
npm install axios @sendgrid/mail express-rate-limit cors bcrypt

# Frontend
cd ../../
npm install @stripe/react-stripe-js stripe
```

---

## 🏗️ IMPLEMENTATION STRUCTURE

### Backend File Structure
```
scaffold-mvp/backend/src/
├── services/
│   ├── paymentService.ts       (300+ lines)
│   ├── emailService.ts         (250+ lines)
│   ├── apiKeyService.ts        (150+ lines)
│   └── rbacService.ts          (200+ lines)
├── middleware/
│   ├── rateLimiter.ts          (80+ lines)
│   ├── apiKeyAuth.ts           (100+ lines)
│   ├── roleCheck.ts            (120+ lines)
│   └── errorHandler.ts         (80+ lines)
├── routes/
│   ├── payments.ts             (200+ lines)
│   ├── webhooks.ts             (150+ lines)
│   └── admin.ts                (200+ lines)
└── workers/
    └── emailWorker.ts          (150+ lines)
```

### Frontend File Structure
```
src/
├── components/
│   ├── PaymentForm.tsx         (300+ lines)
│   ├── PaymentStatus.tsx       (200+ lines)
│   ├── SubscriptionCard.tsx    (250+ lines)
│   └── AdminDashboard.tsx      (400+ lines)
├── pages/
│   ├── Checkout.tsx            (300+ lines)
│   ├── Payment.tsx             (250+ lines)
│   ├── Admin.tsx               (400+ lines)
│   └── Security.tsx            (300+ lines)
├── hooks/
│   ├── usePayment.ts           (150+ lines)
│   ├── useEmail.ts             (100+ lines)
│   └── useAdmin.ts             (150+ lines)
└── lib/
    └── payment.ts              (200+ lines)
```

---

## 🔴 WEEK 2: PAYMENTS + EMAIL

### DAY 1-2: Payment Processing (8 hours)

#### Step 1: Paystack Integration Service
**File:** `scaffold-mvp/backend/src/services/paymentService.ts`

```typescript
import axios from 'axios';

export class PaymentService {
  private paystackBaseURL = 'https://api.paystack.co';
  private paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  private paypalMode = process.env.PAYPAL_MODE || 'sandbox';

  // ===== PAYSTACK =====
  
  /**
   * Initialize Paystack transaction
   * Returns checkout URL for user
   */
  async initializePaystackTransaction(params: {
    email: string;
    amount: number; // in cents
    reference: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const response = await axios.post(
        `${this.paystackBaseURL}/transaction/initialize`,
        {
          email: params.email,
          amount: params.amount,
          reference: params.reference,
          metadata: params.metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack init error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  /**
   * Verify Paystack payment
   * Confirms payment was successful
   */
  async verifyPaystackPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.paystackBaseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack verify error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  /**
   * Webhook signature verification
   * Validates webhook authenticity
   */
  verifyWebhookSignature(
    body: string,
    signature: string,
    webhookSecret: string
  ): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(body)
      .digest('hex');
    return hash === signature;
  }

  // ===== PAYPAL (Phase 2B) =====
  async initializePayPalTransaction(params: {
    email: string;
    amount: number;
    description: string;
  }) {
    // PayPal implementation - similar structure
    // Get access token → Create order → Return order ID
  }

  async verifyPayPalPayment(orderId: string) {
    // Verify PayPal order status
  }
}
```

#### Step 2: Payment Routes
**File:** `scaffold-mvp/backend/src/routes/payments.ts`

```typescript
import express, { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const paymentService = new PaymentService();

/**
 * POST /api/v2/payments/initialize
 * Initialize a payment transaction
 */
router.post('/initialize', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'USD', description } = req.body;
    const userId = (req as any).userId;

    // Create transaction record in database
    const transaction = await db.transactions.create({
      userId,
      amount,
      currency,
      description,
      status: 'pending',
      reference: `ATL-${Date.now()}-${userId}`,
    });

    // Initialize Paystack payment
    const paystackResponse = await paymentService.initializePaystackTransaction({
      email: (req as any).userEmail,
      amount: amount * 100, // Convert to cents
      reference: transaction.reference,
      metadata: {
        userId,
        transactionId: transaction.id,
      },
    });

    res.json({
      success: true,
      data: {
        authorizationUrl: paystackResponse.data.authorization_url,
        reference: transaction.reference,
        transactionId: transaction.id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

/**
 * POST /api/v2/payments/verify
 * Verify a completed payment
 */
router.post('/verify', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { reference } = req.body;

    // Verify with Paystack
    const verification = await paymentService.verifyPaystackPayment(reference);

    if (verification.data.status === 'success') {
      // Update transaction in database
      await db.transactions.update(
        { reference },
        { status: 'completed', paidAt: new Date() }
      );

      // Update user's purchased items
      const transaction = await db.transactions.findOne({ reference });
      // Process user's purchase...

      res.json({ success: true, data: verification.data });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /api/v2/webhooks/paystack
 * Paystack webhook for payment notifications
 */
router.post('/webhooks/paystack', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = paymentService.verifyWebhookSignature(
      body,
      signature,
      process.env.PAYSTACK_WEBHOOK_SECRET || ''
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      // Handle successful payment
      const { reference, customer, amount } = event.data;
      await db.transactions.update(
        { reference },
        { status: 'completed', webhookProcessed: true }
      );
    }

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
```

#### Step 3: Database Migrations
```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reference VARCHAR(100) UNIQUE NOT NULL,
  payment_method VARCHAR(50), -- 'paystack', 'paypal'
  paid_at TIMESTAMP,
  webhook_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

### DAY 3-4: Email Service (8 hours)

#### Step 1: SendGrid Integration Service
**File:** `scaffold-mvp/backend/src/services/emailService.ts`

```typescript
import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(params: {
    email: string;
    name: string;
    verificationLink: string;
  }) {
    const msg = {
      to: params.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@atlassanctum.com',
      subject: '🌱 Welcome to Atlas Sanctum!',
      html: `
        <h2>Welcome ${params.name}!</h2>
        <p>Thank you for joining the regenerative revolution.</p>
        <p><a href="${params.verificationLink}">Verify your email</a></p>
        <p>Best regards,<br/>The Atlas Sanctum Team</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }

  /**
   * Send payment receipt email
   */
  async sendPaymentReceipt(params: {
    email: string;
    name: string;
    amount: number;
    currency: string;
    reference: string;
    items: Array<{ description: string; amount: number }>;
  }) {
    const itemsHtml = params.items
      .map(
        (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${params.currency} ${item.amount.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const msg = {
      to: params.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@atlassanctum.com',
      subject: '💚 Payment Receipt - Atlas Sanctum',
      html: `
        <h2>Payment Confirmation</h2>
        <p>Hello ${params.name},</p>
        <p>Thank you for your payment.</p>
        <table border="1">
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          ${itemsHtml}
        </table>
        <p><strong>Total: ${params.currency} ${params.amount.toFixed(2)}</strong></p>
        <p>Reference: ${params.reference}</p>
        <p>Best regards,<br/>The Atlas Sanctum Team</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(params: {
    email: string;
    name: string;
    resetLink: string;
  }) {
    const msg = {
      to: params.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@atlassanctum.com',
      subject: 'Reset Your Password - Atlas Sanctum',
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${params.name},</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${params.resetLink}">Reset Password</a></p>
        <p>This link expires in 24 hours.</p>
        <p>Best regards,<br/>The Atlas Sanctum Team</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }

  /**
   * Send project notification email
   */
  async sendProjectNotification(params: {
    email: string;
    projectName: string;
    message: string;
    actionUrl: string;
  }) {
    const msg = {
      to: params.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@atlassanctum.com',
      subject: `🌱 ${params.projectName} - Atlas Sanctum`,
      html: `
        <h2>${params.projectName}</h2>
        <p>${params.message}</p>
        <p><a href="${params.actionUrl}">View Project</a></p>
        <p>Best regards,<br/>The Atlas Sanctum Team</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }
}
```

#### Step 2: Email Queue System
**File:** `scaffold-mvp/backend/src/workers/emailWorker.ts`

```typescript
import { EmailService } from '../services/emailService';

export class EmailWorker {
  private emailService = new EmailService();
  private isRunning = false;

  /**
   * Start email worker to process queue
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Process email queue every 10 seconds
    setInterval(() => this.processQueue(), 10000);
    console.log('Email worker started');
  }

  /**
   * Process pending emails from queue
   */
  private async processQueue() {
    try {
      // Get pending emails from database
      const pendingEmails = await db.emailQueue.find(
        { status: 'pending' },
        { limit: 10 }
      );

      for (const email of pendingEmails) {
        try {
          const data = JSON.parse(email.data);

          // Send email based on type
          switch (email.type) {
            case 'welcome':
              await this.emailService.sendWelcomeEmail(data);
              break;
            case 'payment_receipt':
              await this.emailService.sendPaymentReceipt(data);
              break;
            case 'password_reset':
              await this.emailService.sendPasswordResetEmail(data);
              break;
            case 'project_notification':
              await this.emailService.sendProjectNotification(data);
              break;
          }

          // Mark as sent
          await db.emailQueue.update(
            { id: email.id },
            { status: 'sent', sentAt: new Date() }
          );
        } catch (error) {
          console.error('Email send failed:', error);
          // Increment retry count
          email.retryCount = (email.retryCount || 0) + 1;
          if (email.retryCount >= 3) {
            await db.emailQueue.update({ id: email.id }, { status: 'failed' });
          }
        }
      }
    } catch (error) {
      console.error('Email worker error:', error);
    }
  }

  /**
   * Queue an email to be sent
   */
  async queueEmail(type: string, data: any) {
    await db.emailQueue.create({
      type,
      data: JSON.stringify(data),
      status: 'pending',
      createdAt: new Date(),
    });
  }
}
```

#### Step 3: Database Migrations
```sql
-- Create email queue table
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);
```

---

### DAY 5: Integration Testing

```bash
# Test payment flow
curl -X POST http://localhost:3001/api/v2/payments/initialize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "USD",
    "description": "Test payment"
  }'

# Test email queue
curl -X POST http://localhost:3001/api/v2/admin/test-email \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"email": "test@example.com"}'

# Verify webhook (using test from Paystack dashboard)
```

---

## 🟡 WEEK 3: SECURITY HARDENING

### DAY 1-2: Rate Limiting + CORS (6 hours)

#### Rate Limiting Middleware
**File:** `scaffold-mvp/backend/src/middleware/rateLimiter.ts`

```typescript
import rateLimit from 'express-rate-limit';

// General rate limiter
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 minutes
  skip: (req) => req.method !== 'POST',
});

// Payment rate limiter
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
});

// Login specific
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return (req.body?.email || '') + ':' + req.ip;
  },
});
```

#### CORS Configuration
**File:** `scaffold-mvp/backend/src/config/cors.ts`

```typescript
import cors from 'cors';

const allowedOrigins = [
  'https://atlassanctum.com',
  'https://www.atlassanctum.com',
  'https://ab7875329353417ebe84bb00a9aad486-br-9c6f7fe7959f4656993e7a4d6.fly.dev',
  process.env.FRONTEND_URL,
].filter(Boolean);

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
};

export default cors(corsOptions);
```

### DAY 3-4: API Keys + RBAC (10 hours)

#### API Key Service
**File:** `scaffold-mvp/backend/src/services/apiKeyService.ts`

```typescript
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class ApiKeyService {
  /**
   * Generate a new API key for a user
   */
  async generateApiKey(userId: string, name: string, expiresIn: number = 90) {
    // Generate random key
    const key = crypto.randomBytes(32).toString('hex');
    const hashedKey = await bcrypt.hash(key, 10);

    // Store in database
    const apiKey = await db.apiKeys.create({
      userId,
      name,
      hashedKey,
      expiresAt: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastUsedAt: null,
    });

    // Return unhashed key (only shown once)
    return {
      id: apiKey.id,
      key: `atl_${key}`, // Prefix for identification
      createdAt: apiKey.createdAt,
    };
  }

  /**
   * Validate an API key
   */
  async validateApiKey(key: string): Promise<{ userId: string; scope: string[] } | null> {
    const keyWithoutPrefix = key.replace('atl_', '');

    // Get all API keys for comparison
    const apiKeys = await db.apiKeys.find({ expiresAt: { $gt: new Date() } });

    for (const storedKey of apiKeys) {
      const isValid = await bcrypt.compare(keyWithoutPrefix, storedKey.hashedKey);
      if (isValid) {
        // Update last used
        await db.apiKeys.update(
          { id: storedKey.id },
          { lastUsedAt: new Date() }
        );

        const user = await db.users.findOne({ id: storedKey.userId });
        return {
          userId: storedKey.userId,
          scope: user?.role === 'admin' ? ['*'] : ['read'],
        };
      }
    }

    return null;
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(keyId: string) {
    await db.apiKeys.update({ id: keyId }, { revokedAt: new Date() });
  }

  /**
   * List user's API keys
   */
  async listApiKeys(userId: string) {
    const keys = await db.apiKeys.find({ userId });
    // Don't return hashed keys
    return keys.map(({ hashedKey, ...key }) => key);
  }
}
```

#### RBAC Service
**File:** `scaffold-mvp/backend/src/services/rbacService.ts`

```typescript
interface Role {
  name: string;
  permissions: string[];
  description: string;
}

const ROLES: Record<string, Role> = {
  admin: {
    name: 'admin',
    permissions: ['*'], // All permissions
    description: 'Full access',
  },
  moderator: {
    name: 'moderator',
    permissions: [
      'view_users',
      'moderate_content',
      'view_reports',
      'manage_projects',
    ],
    description: 'Content moderation access',
  },
  user: {
    name: 'user',
    permissions: ['view_marketplace', 'create_project', 'view_own_portfolio'],
    description: 'Standard user access',
  },
  guest: {
    name: 'guest',
    permissions: ['view_marketplace', 'view_bioregions'],
    description: 'Read-only access',
  },
};

export class RBACService {
  /**
   * Check if user has permission
   */
  hasPermission(userRole: string, permission: string): boolean {
    const role = ROLES[userRole];
    if (!role) return false;

    if (role.permissions.includes('*')) return true;
    return role.permissions.includes(permission);
  }

  /**
   * Get user role
   */
  async getUserRole(userId: string): Promise<string> {
    const user = await db.users.findOne({ id: userId });
    return user?.role || 'guest';
  }

  /**
   * Check multiple permissions
   */
  hasAnyPermission(userRole: string, permissions: string[]): boolean {
    return permissions.some((perm) => this.hasPermission(userRole, perm));
  }

  /**
   * Get role details
   */
  getRoleDetails(roleName: string): Role | null {
    return ROLES[roleName] || null;
  }

  /**
   * List all roles
   */
  listRoles(): Role[] {
    return Object.values(ROLES);
  }
}
```

#### RBAC Middleware
**File:** `scaffold-mvp/backend/src/middleware/roleCheck.ts`

```typescript
import { RBACService } from '../services/rbacService';

const rbacService = new RBACService();

export const requirePermission = (permissions: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userRole = await rbacService.getUserRole(userId);
      const hasPermission = rbacService.hasAnyPermission(userRole, permissions);

      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

export const requireRole = (role: string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.userId;
      const userRole = await rbacService.getUserRole(userId);

      if (userRole !== role) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Role check failed' });
    }
  };
};
```

### DAY 5: Security Audit & Deployment

**Security Checklist:**
```
[ ] Rate limiting working (test with 100+ requests)
[ ] CORS properly restricting origins
[ ] API keys generating and validating
[ ] RBAC enforced on sensitive endpoints
[ ] Passwords using bcrypt (upgrade from SHA-256)
[ ] Environment variables not exposed
[ ] Secrets not in git
[ ] Database backups verified
[ ] Error messages not exposing sensitive info
[ ] Request logging configured
[ ] Monitoring alerts set up
```

---

## 📊 TESTING PROCEDURES

### Unit Tests
```typescript
// payment.test.ts
describe('PaymentService', () => {
  it('should initialize Paystack transaction', async () => {
    const response = await paymentService.initializePaystackTransaction({
      email: 'test@example.com',
      amount: 10000,
      reference: 'TEST-001',
    });
    expect(response.data.authorization_url).toBeDefined();
  });

  it('should verify payment', async () => {
    const verification = await paymentService.verifyPaystackPayment('TEST-001');
    expect(verification.data).toBeDefined();
  });
});
```

### Integration Tests
```bash
# Test complete payment flow
npm run test:integration -- --suite payments

# Test email queue
npm run test:integration -- --suite email

# Test security
npm run test:security
```

### Load Testing
```bash
# Test rate limiting
ab -n 200 -c 10 http://localhost:3001/api/v2/marketplace

# Should limit after 100 requests
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No sensitive data exposed
- [ ] Database migrations applied
- [ ] Backup completed
- [ ] Staging tested
- [ ] Team briefed

### Deployment
- [ ] Merge to main branch
- [ ] Tag version (v2.0.0)
- [ ] Deploy to staging first
- [ ] Smoke test all features
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Verify metrics

### Post-Deployment
- [ ] Check uptime
- [ ] Review error logs
- [ ] Confirm payments working
- [ ] Verify emails sending
- [ ] Test rate limiting
- [ ] Security audit
- [ ] Document any issues

---

## 📋 SUCCESS CRITERIA

### Week 2
- ✅ Payments working end-to-end
- ✅ 10+ test transactions completed
- ✅ Emails sending reliably (>99% delivery)
- ✅ No critical bugs

### Week 3
- ✅ Rate limiting active
- ✅ CORS properly configured
- ✅ API keys system working
- ✅ RBAC enforced
- ✅ Security audit passed
- ✅ All systems deployed

### Week 4
- ✅ Zero critical issues in production
- ✅ Payment revenue flowing
- ✅ Team confident in systems
- ✅ Phase 2 fully operational
- ✅ Phase 3 planning complete

---

**Status:** Ready for implementation  
**Next Step:** Begin Day 1 implementation  
**Estimated Completion:** 3 weeks  

