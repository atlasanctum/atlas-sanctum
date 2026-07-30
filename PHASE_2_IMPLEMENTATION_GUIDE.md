# 📈 Phase 2: Implementation Guide
## Payments, Emails & Security

**Timeline:** Weeks 2-4 (32-40 hours)  
**Objective:** Add critical Phase 2 features to reach full MVP capability  
**Impact:** Enables real transactions, automated communication, production security

---

## 🎯 Phase 2 Overview

| Feature | Complexity | Time | Priority | Status |
|---------|-----------|------|----------|--------|
| Payments (Paystack) | Medium | 6 hours | HIGH | ⚠️ Partial |
| Payments (PayPal) | Medium | 6 hours | HIGH | ⚠️ Partial |
| Email Notifications | Medium | 8 hours | HIGH | ⚠️ Partial |
| Rate Limiting | Low | 4 hours | HIGH | ❌ TODO |
| CORS Hardening | Low | 2 hours | MEDIUM | ⚠️ Partial |
| API Key Management | Low | 4 hours | MEDIUM | ❌ TODO |
| Error Logging | Low | 4 hours | MEDIUM | ⚠️ Partial |
| User Roles/Permissions | Medium | 6 hours | HIGH | ❌ TODO |
| **TOTAL** | | **40 hours** | | |

---

## 1️⃣ PAYMENT PROCESSING (6-8 Hours)

### Current State
- ✅ Webhook handlers scaffolded in `supabase/functions/`
- ✅ Database schema ready
- ❌ API keys not configured
- ❌ Integration logic incomplete
- ❌ Transaction verification missing

### Implementation Plan

#### Step 1: Set Up Payment Provider Account

**Paystack:**
```bash
1. Go to https://dashboard.paystack.co/signup
2. Create account and verify email
3. Navigate to Settings > API Keys & Webhooks
4. Copy Public Key and Secret Key
5. Add to .env:
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   PAYSTACK_WEBHOOK_SECRET=wh_xxxxx (from webhook settings)
```

**PayPal:**
```bash
1. Go to https://developer.paypal.com/
2. Create business account
3. Navigate to Apps & Credentials
4. Create an App under Sandbox first
5. Copy Client ID and Secret
6. Add to .env:
   PAYPAL_CLIENT_ID=xxxxx
   PAYPAL_CLIENT_SECRET=xxxxx
   PAYPAL_MODE=sandbox (or live)
```

#### Step 2: Create Payment Service

**File: `scaffold-mvp/backend/src/services/paymentService.ts`**

```typescript
import axios from 'axios';

export class PaymentService {
  // Paystack Configuration
  private paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  private paystackBaseURL = 'https://api.paystack.co';

  // PayPal Configuration
  private paypalClientId = process.env.PAYPAL_CLIENT_ID;
  private paypalSecret = process.env.PAYPAL_CLIENT_SECRET;
  private paypalMode = process.env.PAYPAL_MODE || 'sandbox';
  private paypalBaseURL = `https://api-m.${this.paypalMode}.paypal.com`;

  // ==================== PAYSTACK METHODS ====================

  /**
   * Initialize Paystack Transaction
   * Usage: User clicks "Pay with Paystack" → generates checkout link
   */
  async initializePaystackTransaction(params: {
    email: string;
    amount: number; // in cents (e.g., 5000 = $50.00)
    reference: string; // unique transaction ID
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
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
      };
    } catch (error: any) {
      console.error('Paystack initialization error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed',
      };
    }
  }

  /**
   * Verify Paystack Transaction
   * Called after user completes payment
   */
  async verifyPaystackTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.paystackBaseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        }
      );

      const transaction = response.data.data;
      return {
        success: transaction.status === 'success',
        transactionId: transaction.reference,
        amount: transaction.amount / 100, // Convert to dollars
        amountPaid: transaction.amount_paid / 100,
        status: transaction.status,
        paidAt: transaction.paid_at,
        metadata: transaction.metadata,
      };
    } catch (error: any) {
      console.error('Paystack verification error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // ==================== PAYPAL METHODS ====================

  /**
   * Get PayPal Access Token
   * Required for all PayPal API calls
   */
  private async getPayPalAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(
        `${this.paypalClientId}:${this.paypalSecret}`
      ).toString('base64');

      const response = await axios.post(
        `${this.paypalBaseURL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('PayPal token error:', error.response?.data);
      throw error;
    }
  }

  /**
   * Create PayPal Order
   * Step 1: Create order on PayPal
   */
  async createPayPalOrder(params: {
    amount: number; // in dollars
    currency: string; // e.g., "USD"
    description: string;
    returnUrl: string;
    cancelUrl: string;
  }) {
    try {
      const accessToken = await this.getPayPalAccessToken();

      const response = await axios.post(
        `${this.paypalBaseURL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: params.currency,
                value: params.amount.toString(),
              },
              description: params.description,
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                return_url: params.returnUrl,
                cancel_url: params.cancelUrl,
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        approvalLink: response.data.links.find(
          (link: any) => link.rel === 'approve'
        )?.href,
      };
    } catch (error: any) {
      console.error('PayPal order creation error:', error.response?.data);
      return { success: false, error: error.message };
    }
  }

  /**
   * Capture PayPal Order
   * Step 2: Capture (complete) the order after user approves
   */
  async capturePayPalOrder(orderId: string) {
    try {
      const accessToken = await this.getPayPalAccessToken();

      const response = await axios.post(
        `${this.paypalBaseURL}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const capture = response.data.purchase_units[0].payments.captures[0];
      return {
        success: capture.status === 'COMPLETED',
        transactionId: capture.id,
        status: capture.status,
        amount: parseFloat(response.data.purchase_units[0].amount.value),
        paidAt: capture.create_time,
      };
    } catch (error: any) {
      console.error('PayPal capture error:', error.response?.data);
      return { success: false, error: error.message };
    }
  }

  // ==================== WEBHOOK VERIFICATION ====================

  /**
   * Verify Paystack Webhook Signature
   * Call this in webhook handler to verify request is from Paystack
   */
  verifyPaystackWebhook(
    body: any,
    signature: string
  ): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(JSON.stringify(body))
      .digest('hex');

    return hash === signature;
  }
}

export const paymentService = new PaymentService();
```

#### Step 3: Create Payment Routes

**File: `scaffold-mvp/backend/src/routes/payments.ts`**

```typescript
import { Router, Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ==================== PAYSTACK ROUTES ====================

/**
 * POST /api/v2/payments/paystack/initialize
 * Initialize Paystack payment
 */
router.post(
  '/paystack/initialize',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { amount, riumQuantity } = req.body;
      const userId = (req as any).userId;

      if (!amount || !riumQuantity) {
        return res.status(400).json({
          error: 'amount and riumQuantity required',
        });
      }

      // Generate unique reference
      const reference = `RIU-${userId}-${Date.now()}`;

      // Initialize with Paystack
      const result = await paymentService.initializePaystackTransaction({
        email: (req as any).userEmail,
        amount: Math.round(amount * 100), // Convert to cents
        reference,
        metadata: {
          userId,
          riumQuantity,
          timestamp: new Date().toISOString(),
        },
      });

      if (result.success) {
        // Store pending transaction in database
        await query(
          `INSERT INTO transactions (
            user_id, status, payment_method, amount, reference, metadata, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [
            userId,
            'pending_payment',
            'paystack',
            amount,
            reference,
            JSON.stringify({ riumQuantity }),
          ]
        );

        res.json({ success: true, authorizationUrl: result.authorizationUrl });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/v2/payments/paystack/verify
 * Verify Paystack payment (called after user returns from Paystack)
 */
router.post(
  '/paystack/verify',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { reference } = req.body;
      const userId = (req as any).userId;

      if (!reference) {
        return res.status(400).json({ error: 'reference required' });
      }

      // Verify with Paystack
      const result = await paymentService.verifyPaystackTransaction(reference);

      if (result.success) {
        // Update transaction status
        await query(
          `UPDATE transactions SET status = $1, completed_at = NOW() WHERE reference = $2`,
          ['completed', reference]
        );

        // Get transaction details to know what was purchased
        const txResult = await query(
          `SELECT metadata FROM transactions WHERE reference = $1`,
          [reference]
        );

        const metadata = txResult.rows[0]?.metadata || {};

        // Add RIUs to user's account
        await query(
          `UPDATE users SET rium_balance = rium_balance + $1 WHERE id = $2`,
          [metadata.riumQuantity || 0, userId]
        );

        res.json({
          success: true,
          message: 'Payment verified and RIUs credited',
          riumsAdded: metadata.riumQuantity,
        });
      } else {
        // Update to failed
        await query(
          `UPDATE transactions SET status = $1 WHERE reference = $2`,
          ['failed', reference]
        );

        res.status(400).json({ error: result.error });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ==================== PAYPAL ROUTES ====================

/**
 * POST /api/v2/payments/paypal/create-order
 * Create PayPal order
 */
router.post(
  '/paypal/create-order',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { amount, riumQuantity } = req.body;
      const userId = (req as any).userId;

      if (!amount || !riumQuantity) {
        return res.status(400).json({
          error: 'amount and riumQuantity required',
        });
      }

      const result = await paymentService.createPayPalOrder({
        amount,
        currency: 'USD',
        description: `Purchase ${riumQuantity} RIUs`,
        returnUrl: `${process.env.FRONTEND_URL}/marketplace?success=true`,
        cancelUrl: `${process.env.FRONTEND_URL}/marketplace?cancelled=true`,
      });

      if (result.success) {
        // Store pending transaction
        await query(
          `INSERT INTO transactions (
            user_id, status, payment_method, amount, reference, metadata, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [
            userId,
            'pending_payment',
            'paypal',
            amount,
            result.orderId,
            JSON.stringify({ riumQuantity }),
          ]
        );

        res.json({
          success: true,
          orderId: result.orderId,
          approvalLink: result.approvalLink,
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * POST /api/v2/payments/paypal/capture-order
 * Capture PayPal order (after user approves)
 */
router.post(
  '/paypal/capture-order',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      const userId = (req as any).userId;

      if (!orderId) {
        return res.status(400).json({ error: 'orderId required' });
      }

      const result = await paymentService.capturePayPalOrder(orderId);

      if (result.success) {
        // Update transaction
        await query(
          `UPDATE transactions SET status = $1, completed_at = NOW() WHERE reference = $2`,
          ['completed', orderId]
        );

        // Get transaction details
        const txResult = await query(
          `SELECT metadata FROM transactions WHERE reference = $1`,
          [orderId]
        );

        const metadata = txResult.rows[0]?.metadata || {};

        // Add RIUs to user
        await query(
          `UPDATE users SET rium_balance = rium_balance + $1 WHERE id = $2`,
          [metadata.riumQuantity || 0, userId]
        );

        res.json({
          success: true,
          message: 'Payment captured and RIUs credited',
          riumsAdded: metadata.riumQuantity,
        });
      } else {
        await query(
          `UPDATE transactions SET status = $1 WHERE reference = $2`,
          ['failed', orderId]
        );

        res.status(400).json({ error: result.error });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ==================== WEBHOOK ROUTES ====================

/**
 * POST /api/v2/payments/paystack/webhook
 * Paystack webhook endpoint (configured in Paystack dashboard)
 */
router.post('/paystack/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;

    // Verify signature
    if (!paymentService.verifyPaystackWebhook(req.body, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    const data = req.body.data;

    if (event === 'charge.success') {
      // Update transaction
      await query(
        `UPDATE transactions SET status = $1 WHERE reference = $2`,
        ['completed', data.reference]
      );

      console.log('Paystack webhook: Payment successful', data.reference);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

#### Step 4: Integrate Payment Routes

**Update `scaffold-mvp/backend/src/index.ts`:**

```typescript
import paymentRoutes from './routes/payments';

// ... other imports ...

app.use('/api/v2/payments', paymentRoutes);
```

#### Step 5: Update Frontend Hook

**File: `src/lib/api/hooks.ts` - Add:**

```typescript
// Payment Hooks
export const useInitializePaystackPayment = () => {
  return useMutation({
    mutationFn: (data: { amount: number; riumQuantity: number }) =>
      apiService.payments.initializePaystack(data),
  });
};

export const useVerifyPaystackPayment = () => {
  return useMutation({
    mutationFn: (reference: string) =>
      apiService.payments.verifyPaystack(reference),
  });
};

export const useCreatePayPalOrder = () => {
  return useMutation({
    mutationFn: (data: { amount: number; riumQuantity: number }) =>
      apiService.payments.createPayPalOrder(data),
  });
};

export const useCapturePayPalOrder = () => {
  return useMutation({
    mutationFn: (orderId: string) =>
      apiService.payments.capturePayPalOrder(orderId),
  });
};
```

---

## 2️⃣ EMAIL NOTIFICATIONS (8 Hours)

### Current State
- ⚠️ Supabase functions scaffolded
- ❌ SMTP not configured
- ❌ Email templates not created
- ❌ Trigger logic incomplete

### Implementation Plan

#### Step 1: Set Up Email Service (SendGrid or AWS SES)

**Using SendGrid (Recommended):**
```bash
1. Go to https://sendgrid.com/
2. Create free account (12,500 emails/month free)
3. Create API key in Settings > API Keys
4. Add to .env:
   SENDGRID_API_KEY=SG.xxxxx
   SENDGRID_FROM_EMAIL=noreply@atlas-genesis.com
```

**Or AWS SES:**
```bash
1. Go to https://console.aws.amazon.com/ses/
2. Verify email address or domain
3. Create SMTP credentials
4. Add to .env:
   AWS_SES_REGION=us-east-1
   AWS_SES_USER=xxxxx
   AWS_SES_PASSWORD=xxxxx
```

#### Step 2: Create Email Service

**File: `scaffold-mvp/backend/src/services/emailService.ts`**

```typescript
import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  private templates = {
    welcome: {
      subject: 'Welcome to Atlas Genesis',
      template: 'welcome',
    },
    paymentConfirmation: {
      subject: 'Payment Confirmation - RIU Purchase',
      template: 'payment-confirmation',
    },
    riumPurchase: {
      subject: 'RIU Purchase Confirmed',
      template: 'rium-purchase',
    },
    projectApproved: {
      subject: 'Your Project Has Been Approved',
      template: 'project-approved',
    },
    governanceVote: {
      subject: 'New Governance Proposal - Vote Now',
      template: 'governance-vote',
    },
  };

  /**
   * Send Welcome Email
   */
  async sendWelcomeEmail(email: string, displayName: string) {
    return this.sendEmail(email, this.templates.welcome.subject, {
      displayName,
      activationLink: `${process.env.FRONTEND_URL}/verify-email`,
    });
  }

  /**
   * Send Payment Confirmation
   */
  async sendPaymentConfirmation(email: string, data: {
    amount: number;
    riumQuantity: number;
    transactionId: string;
    timestamp: string;
  }) {
    return this.sendEmail(email, this.templates.paymentConfirmation.subject, data);
  }

  /**
   * Send RIU Purchase Notification
   */
  async sendRIUPurchaseEmail(email: string, data: {
    riumQuantity: number;
    totalCost: number;
    newBalance: number;
  }) {
    return this.sendEmail(email, this.templates.riumPurchase.subject, data);
  }

  /**
   * Send Project Approval Notification
   */
  async sendProjectApprovedEmail(email: string, data: {
    projectName: string;
    projectId: string;
    approvalDate: string;
  }) {
    return this.sendEmail(email, this.templates.projectApproved.subject, data);
  }

  /**
   * Send Governance Voting Notification
   */
  async sendGovernanceVoteEmail(email: string, data: {
    proposalTitle: string;
    proposalId: string;
    votingDeadline: string;
    voteLink: string;
  }) {
    return this.sendEmail(email, this.templates.governanceVote.subject, data);
  }

  /**
   * Core send email method
   */
  private async sendEmail(email: string, subject: string, data: any) {
    try {
      const html = this.generateHtmlTemplate(subject, data);

      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@atlas-genesis.com',
        subject,
        html,
      });

      console.log(`Email sent to ${email}: ${subject}`);
      return { success: true };
    } catch (error: any) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate HTML template (simplified)
   * In production, use actual template files or SendGrid dynamic templates
   */
  private generateHtmlTemplate(subject: string, data: any): string {
    const baseStyle = `
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    `;

    switch (subject) {
      case this.templates.welcome.subject:
        return `
          <div style="${baseStyle}">
            <h1>Welcome to Atlas Genesis</h1>
            <p>Hi ${data.displayName},</p>
            <p>Thank you for joining our regenerative carbon credit community!</p>
            <p><a href="${data.activationLink}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Your Email</a></p>
            <p>Best regards,<br/>The Atlas Genesis Team</p>
          </div>
        `;

      case this.templates.paymentConfirmation.subject:
        return `
          <div style="${baseStyle}">
            <h1>Payment Confirmation</h1>
            <p>Your payment of $${data.amount} has been received.</p>
            <p>Transaction ID: ${data.transactionId}</p>
            <p>RIUs Purchased: ${data.riumQuantity}</p>
            <p>Timestamp: ${data.timestamp}</p>
            <p><a href="${process.env.FRONTEND_URL}/marketplace">View Your RIUs</a></p>
          </div>
        `;

      case this.templates.riumPurchase.subject:
        return `
          <div style="${baseStyle}">
            <h1>RIU Purchase Confirmed</h1>
            <p>You have successfully purchased ${data.riumQuantity} RIUs!</p>
            <p>New Balance: ${data.newBalance} RIUs</p>
            <p><a href="${process.env.FRONTEND_URL}/marketplace">View Your Portfolio</a></p>
          </div>
        `;

      case this.templates.projectApproved.subject:
        return `
          <div style="${baseStyle}">
            <h1>Project Approved</h1>
            <p>Your project "${data.projectName}" has been approved!</p>
            <p>Approved on: ${data.approvalDate}</p>
            <p><a href="${process.env.FRONTEND_URL}/projects/${data.projectId}">View Project</a></p>
          </div>
        `;

      case this.templates.governanceVote.subject:
        return `
          <div style="${baseStyle}">
            <h1>New Governance Proposal</h1>
            <p>A new proposal has been submitted: "${data.proposalTitle}"</p>
            <p>Voting Deadline: ${data.votingDeadline}</p>
            <p><a href="${data.voteLink}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vote Now</a></p>
          </div>
        `;

      default:
        return `<p>${subject}</p><p>${JSON.stringify(data)}</p>`;
    }
  }
}

export const emailService = new EmailService();
```

#### Step 3: Update Database Triggers

**File: `supabase/migrations/phase2_email_triggers.sql`**

```sql
-- Create email notifications table
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    data JSONB,
    sent_at TIMESTAMP,
    failed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger: Send welcome email on user signup
CREATE OR REPLACE FUNCTION trigger_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO email_notifications (user_id, notification_type, subject)
    VALUES (NEW.id, 'welcome', 'Welcome to Atlas Genesis');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_signup
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_welcome_email();

-- Trigger: Send notification on transaction completion
CREATE OR REPLACE FUNCTION trigger_payment_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO email_notifications (user_id, notification_type, subject, data)
        VALUES (
            NEW.user_id,
            'payment_confirmation',
            'Payment Confirmation',
            jsonb_build_object(
                'amount', NEW.amount,
                'transactionId', NEW.id,
                'timestamp', NEW.completed_at
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_transaction_completion
AFTER UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_payment_confirmation();

-- Trigger: Send notification on project approval
CREATE OR REPLACE FUNCTION trigger_project_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO email_notifications (user_id, notification_type, subject, data)
        VALUES (
            NEW.creator_id,
            'project_approved',
            'Your Project Has Been Approved',
            jsonb_build_object(
                'projectName', NEW.name,
                'projectId', NEW.id,
                'approvalDate', NOW()
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_approval
AFTER UPDATE ON carbon_projects
FOR EACH ROW
EXECUTE FUNCTION trigger_project_approval();
```

#### Step 4: Create Email Queue Worker

**File: `scaffold-mvp/backend/src/workers/emailWorker.ts`**

```typescript
import { emailService } from '../services/emailService';
import { query } from '../db';

/**
 * Email Queue Worker
 * Process pending email notifications and send them
 * Run this periodically (every 5 minutes) or via job queue
 */
export async function processEmailQueue() {
  try {
    // Get pending notifications
    const result = await query(
      `SELECT en.*, u.email 
       FROM email_notifications en
       JOIN users u ON u.id = en.user_id
       WHERE en.sent_at IS NULL AND en.failed_at IS NULL
       LIMIT 50`
    );

    for (const notification of result.rows) {
      try {
        // Send email based on type
        switch (notification.notification_type) {
          case 'welcome':
            await emailService.sendWelcomeEmail(
              notification.email,
              notification.data?.displayName || 'User'
            );
            break;

          case 'payment_confirmation':
            await emailService.sendPaymentConfirmation(
              notification.email,
              notification.data
            );
            break;

          case 'project_approved':
            await emailService.sendProjectApprovedEmail(
              notification.email,
              notification.data
            );
            break;

          // Add more types as needed
        }

        // Mark as sent
        await query(
          `UPDATE email_notifications SET sent_at = NOW() WHERE id = $1`,
          [notification.id]
        );

        console.log(`Email sent: ${notification.notification_type}`);
      } catch (error: any) {
        // Mark as failed
        await query(
          `UPDATE email_notifications SET failed_at = NOW(), error_message = $1 WHERE id = $2`,
          [error.message, notification.id]
        );

        console.error(
          `Email failed for ${notification.id}: ${error.message}`
        );
      }
    }
  } catch (error) {
    console.error('Email queue processing error:', error);
  }
}

// Run email worker every 5 minutes
setInterval(processEmailQueue, 5 * 60 * 1000);
```

---

## 3️⃣ SECURITY HARDENING (16 Hours)

### Current State
- ✅ Basic JWT auth implemented
- ⚠️ CORS partially configured
- ❌ Rate limiting not implemented
- ❌ API key system not implemented
- ❌ User roles/permissions incomplete

### Implementation Plan

#### Step 1: Rate Limiting Middleware

**File: `scaffold-mvp/backend/src/middleware/rateLimiter.ts`**

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts
  skipSuccessfulRequests: true, // Don't count successful logins
  message: 'Too many login attempts, please try again later',
});

// Payment endpoint limiter
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 payment attempts per hour
  message: 'Too many payment attempts, please try again later',
});

// Create store for distributed rate limiting (optional)
// For production, use Redis: https://github.com/wyattjoh/express-rate-limit-redis
```

#### Step 2: CORS Configuration

**Update `scaffold-mvp/backend/src/index.ts`:**

```typescript
import cors from 'cors';

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      'http://localhost:8080', // Development
      'http://localhost:3000',
      'https://atlas-genesis.com', // Production
      'https://www.atlas-genesis.com',
    ];

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
};

app.use(cors(corsOptions));
app.use(apiLimiter); // Apply rate limiter to all API routes
```

#### Step 3: API Key Management

**File: `scaffold-mvp/backend/src/services/apiKeyService.ts`**

```typescript
import crypto from 'crypto';
import { query } from '../db';

export class APIKeyService {
  /**
   * Generate new API key for user
   */
  async generateAPIKey(userId: string, name: string, permissions: string[] = ['read']) {
    const keyPrefix = 'atlas_';
    const randomPart = crypto.randomBytes(32).toString('hex');
    const fullKey = `${keyPrefix}${randomPart}`;

    // Hash the key for storage (don't store full key in DB)
    const hashedKey = crypto
      .createHash('sha256')
      .update(fullKey)
      .digest('hex');

    const result = await query(
      `INSERT INTO api_keys (
        user_id, name, hashed_key, permissions, created_at
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, created_at`,
      [userId, name, hashedKey, JSON.stringify(permissions)]
    );

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      key: fullKey, // Only returned once when created
      createdAt: result.rows[0].created_at,
    };
  }

  /**
   * Validate API key
   */
  async validateAPIKey(key: string): Promise<{ valid: boolean; userId?: string; permissions?: string[] }> {
    try {
      const hashedKey = crypto
        .createHash('sha256')
        .update(key)
        .digest('hex');

      const result = await query(
        `SELECT user_id, permissions FROM api_keys WHERE hashed_key = $1 AND revoked_at IS NULL`,
        [hashedKey]
      );

      if (result.rows.length === 0) {
        return { valid: false };
      }

      return {
        valid: true,
        userId: result.rows[0].user_id,
        permissions: JSON.parse(result.rows[0].permissions),
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Revoke API key
   */
  async revokeAPIKey(keyId: string, userId: string) {
    const result = await query(
      `UPDATE api_keys SET revoked_at = NOW() WHERE id = $1 AND user_id = $2`,
      [keyId, userId]
    );

    return result.rowCount > 0;
  }

  /**
   * List user's API keys (without showing full key)
   */
  async listAPIKeys(userId: string) {
    const result = await query(
      `SELECT id, name, created_at, revoked_at, permissions FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  }
}

export const apiKeyService = new APIKeyService();
```

#### Step 4: API Key Middleware

**File: `scaffold-mvp/backend/src/middleware/apiKeyAuth.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../services/apiKeyService';

export async function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization || '';
    const apiKey = authHeader.replace('Bearer ', '');

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const validation = await apiKeyService.validateAPIKey(apiKey);

    if (!validation.valid) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Attach user info to request
    (req as any).userId = validation.userId;
    (req as any).apiPermissions = validation.permissions;

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Step 5: User Roles & Permissions

**File: `scaffold-mvp/backend/src/middleware/roleCheck.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

// Define role-based permissions
const rolePermissions = {
  admin: ['read', 'write', 'approve', 'reject', 'manage_users', 'view_reports'],
  moderator: ['read', 'write', 'approve', 'reject'],
  user: ['read', 'write'],
  viewer: ['read'],
};

export async function checkRole(requiredRole: string | string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Get user role from database
      const result = await query(
        `SELECT role FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userRole = result.rows[0].role;
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: requiredRoles,
          current: userRole,
        });
      }

      (req as any).userRole = userRole;
      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

export function checkPermission(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: requiredPermission,
      });
    }

    next();
  };
}
```

#### Step 6: Update Backend with Security Middleware

**Update `scaffold-mvp/backend/src/index.ts`:**

```typescript
import { apiLimiter, authLimiter, paymentLimiter } from './middleware/rateLimiter';
import { apiKeyMiddleware } from './middleware/apiKeyAuth';

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/v2/auth/login', authLimiter);
app.use('/api/v2/auth/signup', authLimiter);
app.use('/api/v2/payments/', paymentLimiter);

// Auth routes (less strict)
app.post('/api/v2/auth/login', authLimiter, authRoutes);
app.post('/api/v2/auth/signup', authLimiter, authRoutes);

// Protected routes (require auth)
app.use('/api/v2/marketplace/', authMiddleware);
app.use('/api/v2/projects/', authMiddleware);
app.use('/api/v2/measurements/', authMiddleware);

// Admin routes (require admin role)
app.use('/api/v2/admin/', authMiddleware, checkRole('admin'));
```

#### Step 7: Security Configuration

**File: `.env` additions:**

```bash
# Security
JWT_SECRET=your-very-long-random-secret-key-at-least-32-characters
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://atlas-genesis.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Password Policy
MIN_PASSWORD_LENGTH=8
REQUIRE_UPPERCASE=true
REQUIRE_NUMBERS=true
REQUIRE_SPECIAL_CHARS=false

# API Security
API_KEY_ROTATION_DAYS=90
SESSION_TIMEOUT_MINUTES=60
```

---

## 🚀 Deployment Checklist for Phase 2

- [ ] Install payment SDKs: `npm install axios @paypal/checkout-server-sdk`
- [ ] Install email service: `npm install @sendgrid/mail`
- [ ] Install rate limiting: `npm install express-rate-limit`
- [ ] Configure payment APIs (Paystack & PayPal)
- [ ] Configure email service (SendGrid)
- [ ] Add all new environment variables
- [ ] Run database migrations
- [ ] Test payment flows end-to-end
- [ ] Test email sending
- [ ] Test rate limiting
- [ ] Deploy to staging
- [ ] Integration testing
- [ ] Deploy to production

---

## ⏱️ Phase 2 Timeline

| Task | Duration | Status |
|------|----------|--------|
| Payment Integration | 12 hours | 🚀 Start Week 2 |
| Email System | 8 hours | 🚀 Start Day 2 |
| Security Hardening | 16 hours | 🚀 Start Day 3 |
| Testing & QA | 4 hours | 🚀 Day 5 |
| **TOTAL** | **40 hours** | |

**Estimated Completion:** 5 working days (1 week)

---

## 📊 Phase 2 Impact

| Metric | Before | After |
|--------|--------|-------|
| **User Functions** | 8 | 12+ |
| **API Endpoints** | 40 | 48+ |
| **Security Score** | 60% | 85% |
| **Automation** | Manual | Automated |
| **Payment Support** | None | 2 providers |
| **Email Notifications** | None | 5+ templates |

---

**Next:** Phase 3 Roadmap in [PHASE_3_ROADMAP.md](PHASE_3_ROADMAP.md)
