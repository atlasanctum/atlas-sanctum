import express from 'express';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';

const router = express.Router();

// Get regenerative finance products
router.get('/products', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        rfp.*,
        COALESCE(rfp.price_range, 'Outcome-dependent') as price_range,
        COALESCE(rfp.pricing_mechanism, 'Pay-for-success / results-based payments') as pricing_mechanism,
        COALESCE(rfp.value_justification, 'Capital only pays when reality improves') as value_justification
      FROM regenerative_finance_products rfp
      WHERE rfp.is_active = true
      ORDER BY rfp.display_order ASC
    `);
    
    res.json({
      success: true,
      products: result.rows,
    });
  } catch (error: any) {
    console.error('Get regenerative finance products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch regenerative finance products',
    });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        rfp.*,
        COALESCE(rfp.price_range, 'Outcome-dependent') as price_range,
        COALESCE(rfp.pricing_mechanism, 'Pay-for-success / results-based payments') as pricing_mechanism,
        COALESCE(rfp.value_justification, 'Capital only pays when reality improves') as value_justification
      FROM regenerative_finance_products rfp
      WHERE rfp.id = $1 AND rfp.is_active = true
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
    console.error('Get regenerative finance product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch regenerative finance product',
    });
  }
});

// Get case studies
router.get('/case-studies', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM regenerative_finance_case_studies 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `);
    
    res.json({
      success: true,
      caseStudies: result.rows,
    });
  } catch (error: any) {
    console.error('Get regenerative finance case studies error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch regenerative finance case studies',
    });
  }
});

// Get customer testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM regenerative_finance_testimonials 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `);
    
    res.json({
      success: true,
      testimonials: result.rows,
    });
  } catch (error: any) {
    console.error('Get regenerative finance testimonials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch regenerative finance testimonials',
    });
  }
});

// Get financial reports (requires authentication)
router.get('/financial-reports', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required',
      });
    }
    
    const payload = verifyAccessToken(token);
    
    const result = await query(`
      SELECT * FROM financial_reports 
      WHERE is_active = true 
      AND (visibility = 'public' OR (visibility = 'private' AND created_by = $1))
      ORDER BY created_at DESC
    `, [payload.userId]);
    
    res.json({
      success: true,
      reports: result.rows,
    });
  } catch (error: any) {
    console.error('Get financial reports error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch financial reports',
    });
  }
});

export default router;
