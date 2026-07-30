import express from 'express';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';

const router = express.Router();

// Get DeFi products
router.get('/products', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        dp.*,
        COALESCE(dp.price_range, 'Low per unit, high volume') as price_range,
        COALESCE(dp.pricing_mechanism, 'Protocol, custody & usage fees') as pricing_mechanism,
        COALESCE(dp.value_justification, 'Enables new financial instruments safely') as value_justification
      FROM defi_products dp
      WHERE dp.is_active = true
      ORDER BY dp.display_order ASC
    `);
    
    res.json({
      success: true,
      products: result.rows,
    });
  } catch (error: any) {
    console.error('Get DeFi products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch DeFi products',
    });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        dp.*,
        COALESCE(dp.price_range, 'Low per unit, high volume') as price_range,
        COALESCE(dp.pricing_mechanism, 'Protocol, custody & usage fees') as pricing_mechanism,
        COALESCE(dp.value_justification, 'Enables new financial instruments safely') as value_justification
      FROM defi_products dp
      WHERE dp.id = $1 AND dp.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }
    
    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error('Get DeFi product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch DeFi product',
    });
  }
});

// Get DeFi segments
router.get('/segments', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM defi_segments 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `);
    
    res.json({
      success: true,
      segments: result.rows,
    });
  } catch (error: any) {
    console.error('Get DeFi segments error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch DeFi segments',
    });
  }
});

// Get technical infrastructure information
router.get('/technical-infrastructure', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM defi_technical_infrastructure 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `);
    
    res.json({
      success: true,
      infrastructure: result.rows,
    });
  } catch (error: any) {
    console.error('Get DeFi technical infrastructure error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch DeFi technical infrastructure',
    });
  }
});

// Get blockchain network information
router.get('/blockchain-networks', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        bn.*,
        COALESCE(bn.average_block_time, '12 seconds') as average_block_time,
        COALESCE(bn.transaction_fee, 'Variable') as transaction_fee
      FROM blockchain_networks bn
      WHERE bn.is_active = true
      ORDER BY bn.display_order ASC
    `);
    
    res.json({
      success: true,
      networks: result.rows,
    });
  } catch (error: any) {
    console.error('Get blockchain networks error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch blockchain networks',
    });
  }
});

// Get smart contract information (requires authentication for private contracts)
router.get('/smart-contracts', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const payload = verifyAccessToken(token);
      
      const result = await query(`
        SELECT 
          sc.*,
          COALESCE(sc.verified, false) as verified
        FROM smart_contracts sc
        WHERE sc.is_active = true
        AND (sc.visibility = 'public' OR (sc.visibility = 'private' AND created_by = $1))
        ORDER BY sc.display_order ASC
      `, [payload.userId]);
      
      res.json({
        success: true,
        contracts: result.rows,
      });
    } else {
      const result = await query(`
        SELECT 
          sc.*,
          COALESCE(sc.verified, false) as verified
        FROM smart_contracts sc
        WHERE sc.is_active = true AND sc.visibility = 'public'
        ORDER BY sc.display_order ASC
      `);
      
      res.json({
        success: true,
        contracts: result.rows,
      });
    }
  } catch (error: any) {
    console.error('Get smart contracts error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch smart contracts',
    });
  }
});

// Get oracle data feeds
router.get('/oracle-feeds', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        of.*,
        COALESCE(of.update_frequency, 'Real-time') as update_frequency,
        COALESCE(of.data_sources, 'Multiple verified sources') as data_sources
      FROM oracle_feeds of
      WHERE of.is_active = true
      ORDER BY of.display_order ASC
    `);
    
    res.json({
      success: true,
      oracleFeeds: result.rows,
    });
  } catch (error: any) {
    console.error('Get oracle feeds error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch oracle feeds',
    });
  }
});

// Get DeFi statistics
router.get('/statistics', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM defi_statistics 
      WHERE id = 1
    `);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Statistics not found',
      });
    }
    
    res.json({
      success: true,
      statistics: result.rows[0],
    });
  } catch (error: any) {
    console.error('Get DeFi statistics error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch DeFi statistics',
    });
  }
});

export default router;
