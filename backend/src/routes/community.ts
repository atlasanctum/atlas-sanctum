import express from 'express';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';

const router = express.Router();

// Get community segments
router.get('/segments', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cs.*,
        COALESCE(cs.price_range, 'Free / Subsidized') as price_range,
        COALESCE(cs.pricing_mechanism, 'Free / Grant-backed') as pricing_mechanism,
        COALESCE(cs.value_justification, 'Prevents capture and mission drift') as value_justification
      FROM community_segments cs
      WHERE cs.is_active = true
      ORDER BY cs.display_order ASC
    `);
    
    res.json({
      success: true,
      segments: result.rows,
    });
  } catch (error: any) {
    console.error('Get community segments error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community segments',
    });
  }
});

// Get community programs
router.get('/programs', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cp.*,
        COALESCE(cp.participants, '0') as participants,
        COALESCE(cp.description, 'Community engagement program') as description
      FROM community_programs cp
      WHERE cp.is_active = true
      ORDER BY cp.display_order ASC
    `);
    
    res.json({
      success: true,
      programs: result.rows,
    });
  } catch (error: any) {
    console.error('Get community programs error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community programs',
    });
  }
});

// Get testimonials from community members
router.get('/testimonials', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        ct.*,
        COALESCE(ct.impact, '') as impact
      FROM community_testimonials ct
      WHERE ct.is_active = true
      ORDER BY ct.display_order ASC
    `);
    
    res.json({
      success: true,
      testimonials: result.rows,
    });
  } catch (error: any) {
    console.error('Get community testimonials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community testimonials',
    });
  }
});

// Get community resources
router.get('/resources', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cr.*,
        COALESCE(cr.format, 'PDF') as format,
        COALESCE(cr.duration, 'Varies') as duration
      FROM community_resources cr
      WHERE cr.is_active = true
      ORDER BY cr.display_order ASC
    `);
    
    res.json({
      success: true,
      resources: result.rows,
    });
  } catch (error: any) {
    console.error('Get community resources error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community resources',
    });
  }
});

// Get community events
router.get('/events', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        ce.*,
        COALESCE(ce.event_type, 'Community gathering') as event_type,
        COALESCE(ce.location, 'Online') as location,
        COALESCE(ce.max_attendees, 100) as max_attendees
      FROM community_events ce
      WHERE ce.is_active = true AND ce.event_date >= CURRENT_DATE
      ORDER BY ce.event_date ASC
    `);
    
    res.json({
      success: true,
      events: result.rows,
    });
  } catch (error: any) {
    console.error('Get community events error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community events',
    });
  }
});

// Get community governance information
router.get('/governance', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cg.*,
        COALESCE(cg.structure, 'Decentralized autonomous organization (DAO)') as structure,
        COALESCE(cg.voting_system, 'One-member-one-vote') as voting_system
      FROM community_governance cg
      WHERE cg.is_active = true
      ORDER BY cg.display_order ASC
    `);
    
    res.json({
      success: true,
      governance: result.rows,
    });
  } catch (error: any) {
    console.error('Get community governance error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community governance',
    });
  }
});

// Get community impact statistics
router.get('/statistics', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM community_statistics 
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
    console.error('Get community statistics error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch community statistics',
    });
  }
});

// Join a community program (requires authentication)
router.post('/programs/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required',
      });
    }
    
    const payload = verifyAccessToken(token);
    
    // Check if user is already joined
    const existingRegistration = await query(`
      SELECT * FROM program_registrations 
      WHERE program_id = $1 AND user_id = $2
    `, [id, payload.userId]);
    
    if (existingRegistration.rows.length > 0) {
      return res.json({
        success: true,
        message: 'You are already registered for this program',
        isRegistered: true,
      });
    }
    
    // Register user for the program
    const result = await query(`
      INSERT INTO program_registrations (program_id, user_id, registration_date)
      VALUES ($1, $2, NOW())
      RETURNING *
    `, [id, payload.userId]);
    
    res.json({
      success: true,
      message: 'Successfully joined the program',
      registration: result.rows[0],
      isRegistered: true,
    });
  } catch (error: any) {
    console.error('Join community program error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to join community program',
    });
  }
});

export default router;
