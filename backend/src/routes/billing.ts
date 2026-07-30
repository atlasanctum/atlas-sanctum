/**
 * Billing Routes
 * 
 * HTTP endpoints for billing, subscriptions, invoices, and payments.
 */

import { Router } from 'express';
import { billingService } from '../services/billing';
import { invoiceService } from '../services/invoice';
import { paymentService } from '../services/payment';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

/**
 * @route   GET /api/billing/plans
 * @desc    Get all billing plans
 * @access  Public
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = await billingService.getBillingPlans();
    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error('Error fetching billing plans:', error);
    res.status(500).json({
      error: 'Failed to fetch billing plans',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/plans/:id
 * @desc    Get billing plan by ID
 * @access  Public
 */
router.get('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await billingService.getBillingPlan(id);
    if (!plan) {
      return res.status(404).json({
        error: 'Plan not found',
        code: 'NOT_FOUND',
      });
    }
    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('Error fetching billing plan:', error);
    res.status(500).json({
      error: 'Failed to fetch billing plan',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   POST /api/billing/subscriptions
 * @desc    Create a new subscription
 * @access  Private
 */
router.post('/subscriptions', authenticate, async (req: any, res) => {
  try {
    const { planId, paymentMethodId } = req.body;

    if (!planId || !paymentMethodId) {
      return res.status(400).json({
        error: 'Plan ID and payment method ID are required',
        code: 'MISSING_FIELDS',
      });
    }

    const subscription = await billingService.createSubscription(
      req.user.id,
      req.user.tenantId || req.user.organizationId,
      planId,
      paymentMethodId
    );

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      code: 'CREATION_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/subscriptions
 * @desc    Get current user's subscription
 * @access  Private
 */
router.get('/subscriptions', authenticate, async (req: any, res) => {
  try {
    const subscription = await billingService.getUserSubscription(req.user.id);
    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/subscriptions/organization/:organizationId
 * @desc    Get organization's subscription
 * @access  Private (requires organization admin)
 */
router.get(
  '/subscriptions/organization/:organizationId',
  authenticate,
  requirePermission('billing:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const subscription = await billingService.getOrganizationSubscription(organizationId);
      res.json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      console.error('Error fetching organization subscription:', error);
      res.status(500).json({
        error: 'Failed to fetch organization subscription',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   PUT /api/billing/subscriptions/:id
 * @desc    Update subscription (change plan)
 * @access  Private
 */
router.put('/subscriptions/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        error: 'Plan ID is required',
        code: 'MISSING_PLAN_ID',
      });
    }

    const subscription = await billingService.updateSubscription(id, planId);
    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      error: 'Failed to update subscription',
      code: 'UPDATE_FAILED',
    });
  }
});

/**
 * @route   POST /api/billing/subscriptions/:id/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/subscriptions/:id/cancel', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { cancelAtPeriodEnd } = req.body;

    const subscription = await billingService.cancelSubscription(id, cancelAtPeriodEnd);
    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      code: 'CANCEL_FAILED',
    });
  }
});

/**
 * @route   POST /api/billing/subscriptions/:id/resume
 * @desc    Resume canceled subscription
 * @access  Private
 */
router.post('/subscriptions/:id/resume', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const subscription = await billingService.resumeSubscription(id);
    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    res.status(500).json({
      error: 'Failed to resume subscription',
      code: 'RESUME_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/usage
 * @desc    Get usage summary for current user
 * @access  Private
 */
router.get('/usage', authenticate, async (req: any, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const usage = await billingService.getUsageSummary(
      req.user.tenantId || req.user.organizationId,
      start,
      end
    );

    res.json({
      success: true,
      data: usage,
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({
      error: 'Failed to fetch usage',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/usage/organization/:organizationId
 * @desc    Get usage summary for organization
 * @access  Private (requires organization admin)
 */
router.get(
  '/usage/organization/:organizationId',
  authenticate,
  requirePermission('billing:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const usage = await billingService.getUsageSummary(organizationId, start, end);
      res.json({
        success: true,
        data: usage,
      });
    } catch (error) {
      console.error('Error fetching organization usage:', error);
      res.status(500).json({
        error: 'Failed to fetch organization usage',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/billing/summary
 * @desc    Get billing summary
 * @access  Private
 */
router.get('/summary', authenticate, async (req: any, res) => {
  try {
    const summary = await billingService.getBillingSummary(
      req.user.tenantId || req.user.organizationId
    );
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching billing summary:', error);
    res.status(500).json({
      error: 'Failed to fetch billing summary',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/alerts
 * @desc    Get billing alerts
 * @access  Private
 */
router.get('/alerts', authenticate, async (req: any, res) => {
  try {
    const alerts = await billingService.getAlerts(req.user.id);
    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      error: 'Failed to fetch alerts',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   PUT /api/billing/alerts/:id/read
 * @desc    Mark alert as read
 * @access  Private
 */
router.put('/alerts/:id/read', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    await billingService.markAlertAsRead(id);
    res.json({
      success: true,
      message: 'Alert marked as read',
    });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({
      error: 'Failed to mark alert as read',
      code: 'UPDATE_FAILED',
    });
  }
});

/**
 * @route   POST /api/billing/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public
 */
router.post('/webhook', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify webhook signature
    const stripe = require('stripe');
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    await billingService.handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      code: 'WEBHOOK_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/invoices
 * @desc    Get invoices for current user
 * @access  Private
 */
router.get('/invoices', authenticate, async (req: any, res) => {
  try {
    const invoices = await invoiceService.getOrganizationInvoices(
      req.user.tenantId || req.user.organizationId
    );
    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      error: 'Failed to fetch invoices',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/invoices/:id
 * @desc    Get invoice by ID
 * @access  Private
 */
router.get('/invoices/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoice(id);
    if (!invoice) {
      return res.status(404).json({
        error: 'Invoice not found',
        code: 'NOT_FOUND',
      });
    }
    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      error: 'Failed to fetch invoice',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/invoices/:id/items
 * @desc    Get invoice items
 * @access  Private
 */
router.get('/invoices/:id/items', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const items = await invoiceService.getInvoiceItems(id);
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching invoice items:', error);
    res.status(500).json({
      error: 'Failed to fetch invoice items',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/invoices/:id/pdf
 * @desc    Download invoice PDF
 * @access  Private
 */
router.get('/invoices/:id/pdf', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const pdf = await invoiceService.downloadInvoicePDF(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    res.status(500).json({
      error: 'Failed to download invoice PDF',
      code: 'DOWNLOAD_FAILED',
    });
  }
});

/**
 * @route   POST /api/billing/invoices/:id/send
 * @desc    Send invoice email
 * @access  Private
 */
router.post('/invoices/:id/send', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    await invoiceService.sendInvoiceEmail(id);
    res.json({
      success: true,
      message: 'Invoice email sent successfully',
    });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({
      error: 'Failed to send invoice email',
      code: 'SEND_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/invoices/statistics
 * @desc    Get invoice statistics
 * @access  Private
 */
router.get('/invoices/statistics', authenticate, async (req: any, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const stats = await invoiceService.getInvoiceStatistics(
      req.user.tenantId || req.user.organizationId,
      start.toISOString(),
      end.toISOString()
    );
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching invoice statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch invoice statistics',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/invoices/settings
 * @desc    Get invoice settings
 * @access  Private
 */
router.get('/invoices/settings', authenticate, async (req: any, res) => {
  try {
    const settings = await invoiceService.getInvoiceSettings(
      req.user.tenantId || req.user.organizationId
    );
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching invoice settings:', error);
    res.status(500).json({
      error: 'Failed to fetch invoice settings',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   PUT /api/billing/invoices/settings
 * @desc    Update invoice settings
 * @access  Private
 */
router.put('/invoices/settings', authenticate, async (req: any, res) => {
  try {
    const updates = req.body;
    await invoiceService.updateInvoiceSettings(
      req.user.tenantId || req.user.organizationId,
      updates
    );
    res.json({
      success: true,
      message: 'Invoice settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice settings:', error);
    res.status(500).json({
      error: 'Failed to update invoice settings',
      code: 'UPDATE_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/payments
 * @desc    Get payments for current user
 * @access  Private
 */
router.get('/payments', authenticate, async (req: any, res) => {
  try {
    const payments = await paymentService.getUserPayments(req.user.id);
    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      error: 'Failed to fetch payments',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/payments/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPayment(id);
    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
        code: 'NOT_FOUND',
      });
    }
    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      error: 'Failed to fetch payment',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/payments/statistics
 * @desc    Get payment statistics
 * @access  Private
 */
router.get('/payments/statistics', authenticate, async (req: any, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const stats = await paymentService.getPaymentStatistics(
      req.user.tenantId || req.user.organizationId,
      start,
      end
    );
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch payment statistics',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/billing/payment-methods
 * @desc    Get payment methods for current user
 * @access  Private
 */
router.get('/payment-methods', authenticate, async (req: any, res) => {
  try {
    const methods = await paymentService.getUserPaymentMethods(req.user.id);
    res.json({
      success: true,
      data: methods,
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      error: 'Failed to fetch payment methods',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   POST /api/billing/payment-methods
 * @desc    Add new payment method
 * @access  Private
 */
router.post('/payment-methods', authenticate, async (req: any, res) => {
  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({
        error: 'Payment method ID is required',
        code: 'MISSING_PAYMENT_METHOD_ID',
      });
    }

    const method = await paymentService.createPaymentMethod(
      req.user.id,
      req.user.tenantId || req.user.organizationId,
      paymentMethodId
    );
    res.status(201).json({
      success: true,
      data: method,
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({
      error: 'Failed to create payment method',
      code: 'CREATION_FAILED',
    });
  }
});

/**
 * @route   PUT /api/billing/payment-methods/:id/default
 * @desc    Set default payment method
 * @access  Private
 */
router.put('/payment-methods/:id/default', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    await paymentService.setDefaultPaymentMethod(req.user.id, id);
    res.json({
      success: true,
      message: 'Default payment method updated',
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({
      error: 'Failed to set default payment method',
      code: 'UPDATE_FAILED',
    });
  }
});

/**
 * @route   DELETE /api/billing/payment-methods/:id
 * @desc    Delete payment method
 * @access  Private
 */
router.delete('/payment-methods/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    await paymentService.deletePaymentMethod(req.user.id, id);
    res.json({
      success: true,
      message: 'Payment method deleted',
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({
      error: 'Failed to delete payment method',
      code: 'DELETE_FAILED',
    });
  }
});

export default router;
