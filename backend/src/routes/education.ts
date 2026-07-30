import express from 'express';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';

const router = express.Router();

// Get education segments
router.get('/segments', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        es.*,
        COALESCE(es.price_range, 'Grant-dependent') as price_range,
        COALESCE(es.pricing_mechanism, 'Grants, sponsorships, endowments') as pricing_mechanism,
        COALESCE(es.value_justification, 'Builds legitimacy and narrative trust') as value_justification
      FROM education_segments es
      WHERE es.is_active = true
      ORDER BY es.display_order ASC
    `);
    
    res.json({
      success: true,
      segments: result.rows,
    });
  } catch (error: any) {
    console.error('Get education segments error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch education segments',
    });
  }
});

// Get education programs
router.get('/programs', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        ep.*,
        COALESCE(ep.participants, '0') as participants,
        COALESCE(ep.description, 'Educational program') as description
      FROM education_programs ep
      WHERE ep.is_active = true
      ORDER BY ep.display_order ASC
    `);
    
    res.json({
      success: true,
      programs: result.rows,
    });
  } catch (error: any) {
    console.error('Get education programs error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch education programs',
    });
  }
});

// Get educational resources
router.get('/resources', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        er.*,
        COALESCE(er.format, 'PDF') as format,
        COALESCE(er.duration, 'Varies') as duration,
        COALESCE(er.language, 'English') as language,
        COALESCE(er.difficulty_level, 'Beginner') as difficulty_level
      FROM educational_resources er
      WHERE er.is_active = true
      ORDER BY er.display_order ASC
    `);
    
    res.json({
      success: true,
      resources: result.rows,
    });
  } catch (error: any) {
    console.error('Get educational resources error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch educational resources',
    });
  }
});

// Get courses
router.get('/courses', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.*,
        COALESCE(c.duration, 'Varies') as duration,
        COALESCE(c.level, 'Beginner') as level,
        COALESCE(c.language, 'English') as language,
        COALESCE(c.enrollment_count, 0) as enrollment_count
      FROM courses c
      WHERE c.is_active = true
      ORDER BY c.display_order ASC
    `);
    
    res.json({
      success: true,
      courses: result.rows,
    });
  } catch (error: any) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch courses',
    });
  }
});

// Get cultural preservation information
router.get('/cultural-preservation', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cp.*,
        COALESCE(cp.traditional_knowledge, 'Indigenous practices and cultural heritage') as traditional_knowledge,
        COALESCE(cp.oral_traditions, 'Stories and cultural narratives') as oral_traditions,
        COALESCE(cp.art_and_visual_design, 'Traditional art forms') as art_and_visual_design
      FROM cultural_preservation cp
      WHERE cp.is_active = true
      ORDER BY cp.display_order ASC
    `);
    
    res.json({
      success: true,
      culturalPreservation: result.rows,
    });
  } catch (error: any) {
    console.error('Get cultural preservation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch cultural preservation information',
    });
  }
});

// Get cultural metaphors
router.get('/cultural-metaphors', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cm.*,
        COALESCE(cm.region, 'Global') as region,
        COALESCE(cm.cultural_context, 'Indigenous and local knowledge systems') as cultural_context
      FROM cultural_metaphors cm
      WHERE cm.is_active = true
      ORDER BY cm.display_order ASC
    `);
    
    res.json({
      success: true,
      culturalMetaphors: result.rows,
    });
  } catch (error: any) {
    console.error('Get cultural metaphors error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch cultural metaphors',
    });
  }
});

// Get education statistics
router.get('/statistics', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM education_statistics 
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
    console.error('Get education statistics error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch education statistics',
    });
  }
});

// Enroll in a course (requires authentication)
router.post('/courses/:id/enroll', async (req, res) => {
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
    
    // Check if user is already enrolled
    const existingEnrollment = await query(`
      SELECT * FROM course_enrollments 
      WHERE course_id = $1 AND user_id = $2
    `, [id, payload.userId]);
    
    if (existingEnrollment.rows.length > 0) {
      return res.json({
        success: true,
        message: 'You are already enrolled in this course',
        isEnrolled: true,
      });
    }
    
    // Enroll user in the course
    const result = await query(`
      INSERT INTO course_enrollments (course_id, user_id, enrollment_date)
      VALUES ($1, $2, NOW())
      RETURNING *
    `, [id, payload.userId]);
    
    // Update course enrollment count
    await query(`
      UPDATE courses 
      SET enrollment_count = enrollment_count + 1
      WHERE id = $1
    `, [id]);
    
    res.json({
      success: true,
      message: 'Successfully enrolled in the course',
      enrollment: result.rows[0],
      isEnrolled: true,
    });
  } catch (error: any) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to enroll in course',
    });
  }
});

// Download educational resource (requires authentication)
router.get('/resources/:id/download', async (req, res) => {
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
    
    // Get resource information
    const result = await query(`
      SELECT * FROM educational_resources 
      WHERE id = $1 AND is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    
    const resource = result.rows[0];
    
    // Increment download count
    await query(`
      UPDATE educational_resources 
      SET download_count = download_count + 1
      WHERE id = $1
    `, [id]);
    
    // Here you would typically send the actual file
    // For now, we'll just return a download link
    res.json({
      success: true,
      resource,
      downloadUrl: `/api/education/resources/${id}/download`,
    });
  } catch (error: any) {
    console.error('Download educational resource error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to download educational resource',
    });
  }
});

export default router;
