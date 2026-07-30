import express, { Request, Response } from 'express';
import { query, pool } from '../db';
import { emailService } from '../services/email';
import { SocketEmitter } from '../utils/socket';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get RIU Market Data
router.get('/riums/market', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT 
        COUNT(*) as total_rius,
        AVG(price) as avg_price,
        MAX(price) as max_price,
        MIN(price) as min_price,
        SUM(quantity_traded) as total_traded_volume
       FROM riums WHERE status = 'active'`
    );

    const stats = result.rows[0] || {};
    
    res.json({
      totalRIUs: stats.total_rius || 0,
      currentPrice: stats.avg_price ? parseFloat(stats.avg_price) : 0,
      highPrice: stats.max_price ? parseFloat(stats.max_price) : 0,
      lowPrice: stats.min_price ? parseFloat(stats.min_price) : 0,
      tradingVolume: stats.total_traded_volume || 0,
      circulationM: 24.5,
      ytdChange: 19.9
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get RIU Listings
router.get('/riums/listings', async (req: Request, res: Response) => {
  const { page = 1, size = 20, sortBy = 'price', order = 'DESC' } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);
  const allowedSortBy = ['price', 'quantity', 'created_at'];
  const sortField = allowedSortBy.includes(sortBy) ? sortBy : 'price';
  
  try {
    const result = await query(
      `SELECT id, seller_id, quantity, price, impact_score, confidence_interval, status, created_at
       FROM riums 
       WHERE status = 'active'
       ORDER BY ${sortField} ${order === 'ASC' ? 'ASC' : 'DESC'}
       LIMIT $1 OFFSET $2`,
      [Number(size), offset]
    );

    const countResult = await query('SELECT COUNT(*) as total FROM riums WHERE status = \'active\'');
    const total = parseInt(countResult.rows[0].total);

    res.json({
      items: result.rows,
      pagination: {
        page: Number(page),
        size: Number(size),
        total,
        totalPages: Math.ceil(total / Number(size))
      }
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Create RIU Listing
router.post('/riums', authenticate, async (req: Request, res: Response) => {
  const sellerId = (req as any).user.id;
  const { projectId, quantity, price, impactScore, confidenceInterval } = req.body;

  if (!quantity || price === undefined) {
    return res.status(422).json({ code: 'invalid', message: 'quantity and price required' });
  }

  try {
    const result = await query(
      `INSERT INTO riums (seller_id, project_id, quantity, price, impact_score, confidence_interval, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING *`,
      [sellerId, projectId || null, quantity, price, impactScore || 0, confidenceInterval || 0.95]
    );

    const newListing = result.rows[0];

    // Emit real-time marketplace activity
    SocketEmitter.emitMarketplaceActivity({
      type: 'listing_created',
      listingId: newListing.id,
      userId: sellerId,
      data: {
        quantity: newListing.quantity,
        price: newListing.price,
        impactScore: newListing.impact_score
      }
    });

    // Notify seller of successful listing
    SocketEmitter.emitNotification(sellerId, {
      id: `listing-${newListing.id}`,
      type: 'marketplace',
      title: 'RIU Listing Created',
      message: `Your RIU listing for ${quantity} units at $${price} each has been created successfully.`,
      data: { listingId: newListing.id }
    });

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Purchase RIUs
router.post('/riums/:id/purchase', authenticate, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const buyerId = (req as any).user.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(422).json({ code: 'invalid', message: 'quantity required and must be positive' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the row to prevent concurrent double-spend
    const riuResult = await client.query('SELECT * FROM riums WHERE id = $1 FOR UPDATE', [id]);
    if (riuResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ code: 'not_found' });
    }

    const riu = riuResult.rows[0];
    if (riu.quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(422).json({ code: 'insufficient_quantity', message: 'Not enough RIUs available' });
    }

    const totalPrice = quantity * riu.price;

    // Create transaction
    const txResult = await client.query(
      `INSERT INTO transactions (seller_id, buyer_id, rium_id, quantity, amount, tx_type, status)
       VALUES ($1, $2, $3, $4, $5, 'purchase', 'completed')
       RETURNING *`,
      [riu.seller_id, buyerId, id, quantity, totalPrice]
    );

    // Update RIU quantity atomically
    await client.query(
      'UPDATE riums SET quantity = quantity - $1 WHERE id = $2',
      [quantity, id]
    );

    await client.query('COMMIT');

    // Emit real-time marketplace activity for purchase
    SocketEmitter.emitMarketplaceActivity({
      type: 'purchase',
      listingId: id,
      userId: buyerId,
      data: { sellerId: riu.seller_id, quantity, amount: totalPrice, transactionId: txResult.rows[0].id }
    });

    SocketEmitter.emitNotification(buyerId, {
      id: `purchase-${txResult.rows[0].id}`,
      type: 'marketplace',
      title: 'RIU Purchase Successful',
      message: `You have successfully purchased ${quantity} RIUs for $${totalPrice}.`,
      data: { transactionId: txResult.rows[0].id, listingId: id }
    });

    SocketEmitter.emitNotification(riu.seller_id, {
      id: `sale-${txResult.rows[0].id}`,
      type: 'marketplace',
      title: 'RIU Sale Completed',
      message: `${quantity} of your RIUs have been sold for $${totalPrice}.`,
      data: { transactionId: txResult.rows[0].id, listingId: id }
    });

    try {
      const buyerResult = await query('SELECT email FROM users WHERE id = $1', [buyerId]);
      if (buyerResult.rowCount > 0) {
        await emailService.sendMarketplacePurchaseNotification(buyerResult.rows[0].email, quantity, totalPrice);
      }
    } catch (emailError) {
      console.error('Failed to send purchase confirmation email:', emailError);
    }

    try {
      const sellerResult = await query('SELECT email FROM users WHERE id = $1', [riu.seller_id]);
      if (sellerResult.rowCount > 0) {
        await emailService.sendMarketplaceSaleNotification(sellerResult.rows[0].email, quantity, totalPrice);
      }
    } catch (emailError) {
      console.error('Failed to send sale notification email:', emailError);
    }

    res.status(201).json({
      transaction: txResult.rows[0],
      message: `Successfully purchased ${quantity} RIUs`
    });
  } catch (err: any) {
    await client.query('ROLLBACK').catch(() => {});
    res.status(500).json({ code: 'server_error', message: err.message });
  } finally {
    client.release();
  }
});

// Get RIU Bonds
router.get('/bonds', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, bond_type, term_years, annual_coupon, amount_available, min_purchase, status
       FROM bonds
       WHERE status = 'available'
       ORDER BY annual_coupon DESC`
    );

    res.json({
      items: result.rows,
      bonds: [
        {
          type: '5-Year',
          coupon: 3.8,
          term: 5,
          available: 50000000,
          minPurchase: 1000
        },
        {
          type: '10-Year',
          coupon: 5.2,
          term: 10,
          available: 30000000,
          minPurchase: 5000
        },
        {
          type: 'Perpetual',
          coupon: 6.5,
          term: 0,
          available: 20000000,
          minPurchase: 25000
        },
        {
          type: 'Green Impact',
          coupon: 4.5,
          term: 7,
          available: 15000000,
          minPurchase: 10000
        }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Purchase Bond
router.post('/bonds/:id/purchase', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  const buyerId = (req as any).user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(422).json({ code: 'invalid', message: 'amount required and must be positive' });
  }

  try {
    const bondResult = await query('SELECT * FROM bonds WHERE id = $1 AND status = $2', [id, 'available']);
    if (bondResult.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    const bond = bondResult.rows[0];

    // Derive maturity interval from the bond's actual term_years; 0 = perpetual (100 years)
    const termYears = bond.term_years > 0 ? bond.term_years : 100;
    const txResult = await query(
      `INSERT INTO bond_purchases (bond_id, buyer_id, amount, purchase_date, maturity_date, status)
       VALUES ($1, $2, $3, NOW(), NOW() + ($4 || ' years')::INTERVAL, 'active')
       RETURNING *`,
      [id, buyerId, amount, termYears]
    );

    res.status(201).json({
      purchase: txResult.rows[0],
      message: `Successfully purchased $${amount} of bond`
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Trading Volume
router.get('/trading-volume', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
         DATE_TRUNC('month', created_at) AS month_date,
         COUNT(*) AS volume,
         COALESCE(SUM(amount), 0) AS value
       FROM transactions
       WHERE created_at >= NOW() - INTERVAL '12 months'
         AND status = 'completed'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month_date ASC`
    );

    res.json({ data: result.rows.map(r => ({ month: r.month, volume: parseInt(r.volume), value: parseFloat(r.value) })) });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Transaction History — scoped to the authenticated user
router.get('/transactions', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { page = 1, size = 20 } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);

  try {
    const result = await query(
      `SELECT * FROM transactions
       WHERE seller_id = $1 OR buyer_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, Number(size), offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM transactions WHERE seller_id = $1 OR buyer_id = $1',
      [userId]
    );

    res.json({
      items: result.rows,
      pagination: { page: Number(page), size: Number(size), total: parseInt(countResult.rows[0].total) }
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
