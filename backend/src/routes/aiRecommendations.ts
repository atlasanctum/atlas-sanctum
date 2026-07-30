/**
 * AI Recommendations API Routes
 */

import { Router, Request, Response } from 'express';
import aiRecommendationsService from '../services/aiRecommendations';

const router = Router();

/**
 * GET /api/ai/carbon-prediction/:projectId
 * Get carbon sequestration prediction for a project
 */
router.get('/carbon-prediction/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { period } = req.query;
    
    const prediction = await aiRecommendationsService.predictCarbonSequestration(
      projectId,
      (Array.isArray(period) ? period[0] : period) as 'month' | 'quarter' | 'year' | '5year' | '10year' || 'year'
    );
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error generating carbon prediction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate carbon prediction'
    });
  }
});

/**
 * GET /api/ai/recommendations/:userId
 * Get personalized project recommendations for a user
 */
router.get('/recommendations/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    const limitStr = Array.isArray(limit) ? limit[0] : limit;
    const recommendations = await aiRecommendationsService.getPersonalizedRecommendations(
      userId,
      limitStr ? parseInt(limitStr) : 5
    );
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

/**
 * GET /api/ai/insights
 * Get smart insights for the platform
 */
router.get('/insights', async (req: Request, res: Response) => {
  try {
    const insights = await aiRecommendationsService.generateSmartInsights();
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
});

/**
 * POST /api/ai/analyze-behavior/:userId
 * Analyze user behavior and build profile
 */
router.post('/analyze-behavior/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const profile = await aiRecommendationsService.analyzeUserBehavior(userId);
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error analyzing user behavior:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze user behavior'
    });
  }
});

export default router;
