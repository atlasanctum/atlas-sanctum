import express from 'express';
import { PaymentService, SupportedPaymentMethod } from '../services/payment';
import { query } from '../db';
import { emailService } from '../services/email';
import { authenticate } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();

// Initialize payment — requires authenticated user
router.post('/initialize', authenticate, async (req: any, res) => {
  try {
    const { listingId, quantity, buyerId, email, amount, paymentMethod = 'paystack', currency = 'USD' } = req.body;

    if (!listingId || !quantity || !buyerId || !email || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: listingId, quantity, buyerId, email, amount'
      });
    }

    // Create order first
    const orderResult = await PaymentService.createOrder(listingId, buyerId, quantity, amount);
    if (!orderResult.success) {
      return res.status(500).json(orderResult);
    }

    // Generate unique reference
    const reference = `${paymentMethod}_${orderResult.order.id}_${Date.now()}`;

    // Initialize payment with selected method
    const paymentResult = await PaymentService.initializePayment({
      amount: amount,
      email: email,
      reference: reference,
      metadata: {
        orderId: orderResult.order.id,
        listingId: listingId,
        quantity: quantity,
        buyerId: buyerId,
        currency: currency,
      },
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      paymentMethod: paymentMethod as SupportedPaymentMethod,
      currency: currency,
    });

    if (!paymentResult.success) {
      return res.status(500).json(paymentResult);
    }

    // Update order with payment reference and method
    await PaymentService.updateOrderStatus(orderResult.order.id, 'pending', reference, paymentMethod);

    res.json({
      success: true,
      order: orderResult.order,
      payment: paymentResult.data,
      paymentMethod: paymentResult.paymentMethod,
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment initialization failed'
    });
  }
});

// Verify payment — requires authenticated user
router.get('/verify/:reference', authenticate, async (req: any, res) => {
  try {
    const { reference } = req.params;
    const { paymentMethod = 'paystack' } = req.query;

    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Payment reference is required'
      });
    }

    // Verify with selected payment method
    const verificationResult = await PaymentService.verifyPayment(reference, paymentMethod as SupportedPaymentMethod);
    if (!verificationResult.success) {
      return res.status(500).json(verificationResult);
    }

    const paymentData = verificationResult.data;

    // Get order from metadata
    const orderId = paymentData.metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID not found in payment metadata'
      });
    }

    // Update order status based on payment status
    const status = paymentData.status === 'success' ? 'completed' : 'failed';
    const updateResult = await PaymentService.updateOrderStatus(orderId, status, reference, paymentMethod as SupportedPaymentMethod);

    if (!updateResult.success) {
      return res.status(500).json(updateResult);
    }

    res.json({
      success: true,
      payment: paymentData,
      order: updateResult.order,
      paymentMethod: verificationResult.paymentMethod,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed'
    });
  }
});

// Webhook handler for Paystack — public endpoint, signature-verified
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return res.status(500).send('Webhook secret not configured');
    }
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const orderId = event.data.metadata?.orderId;

      if (orderId) {
        const updateResult = await PaymentService.updateOrderStatus(orderId, 'completed', reference);

        // Send payment confirmation email
        if (updateResult.success && updateResult.order) {
          try {
            // Get buyer details
            const buyerResult = await query('SELECT email, display_name FROM users WHERE id = $1', [updateResult.order.buyer_id]);
            if (buyerResult.rowCount > 0) {
              const buyer = buyerResult.rows[0];
              await emailService.sendPaymentConfirmation(
                buyer.email,
                buyer.display_name || buyer.email,
                {
                  amount: updateResult.order.price_amount,
                  reference: reference,
                  description: `Order #${orderId}`
                }
              );
            }
          } catch (emailError) {
            console.error('Failed to send payment confirmation email:', emailError);
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Webhook processing failed'
    });
  }
});

// Get payment status — requires authenticated user
router.get('/status/:orderId', authenticate, async (req: any, res) => {
  try {
    const { orderId } = req.params;

    const orderResult = await PaymentService.getOrderById(orderId);
    if (!orderResult.success) {
      return res.status(500).json(orderResult);
    }

    if (!orderResult.order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: orderResult.order,
    });
  } catch (error: any) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment status check failed'
    });
  }
});

export default router;