import express from 'express';
import { query } from '../db';
import { PaymentService } from '../services/payment';

const router = express.Router();

router.get('/listings', async (req, res) => {
  try {
    const result = await query('SELECT l.*, a.title as asset_title FROM listings l LEFT JOIN assets a ON a.id = l.asset_id WHERE l.status=$1', ['active']);
    res.json({ listings: result.rows });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

router.post('/listings', async (req, res) => {
  const { assetId, sellerId, priceAmount, currency } = req.body;
  if (!assetId || !priceAmount) return res.status(422).json({ code: 'invalid' });
  try {
    const result = await query('INSERT INTO listings (asset_id, seller_id, price_amount, currency) VALUES ($1,$2,$3,$4) RETURNING *', [assetId, sellerId || null, priceAmount, currency || 'USD']);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

router.post('/:id/purchase', async (req, res) => {
  const listingId = req.params.id;
  const { buyerId, quantity, amount, email } = req.body;

  if (!buyerId || !quantity || !amount || !email) {
    return res.status(400).json({
      code: 'invalid_request',
      message: 'Missing required fields: buyerId, quantity, amount, email'
    });
  }

  try {
    // Create order with payment details
    const orderResult = await PaymentService.createOrder(listingId, buyerId, quantity, amount);
    if (!orderResult.success) {
      return res.status(500).json({
        code: 'order_creation_failed',
        message: orderResult.error
      });
    }

    // Generate unique reference
    const reference = `atlas_${orderResult.order.id}_${Date.now()}`;

    // Initialize payment with Paystack
    const paymentResult = await PaymentService.initializePayment({
      amount: amount,
      email: email,
      reference: reference,
      metadata: {
        orderId: orderResult.order.id,
        listingId: listingId,
        quantity: quantity,
        buyerId: buyerId,
      },
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
    });

    if (!paymentResult.success) {
      return res.status(500).json({
        code: 'payment_init_failed',
        message: paymentResult.error
      });
    }

    // Update order with payment reference
    await PaymentService.updateOrderStatus(orderResult.order.id, 'pending', reference);

    res.status(201).json({
      order: orderResult.order,
      payment: paymentResult.data,
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
