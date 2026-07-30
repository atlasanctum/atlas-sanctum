/**
 * EthosDAO API Routes
 * CRUD endpoints for collective workspace management
 */

import { Router, Request, Response, NextFunction } from 'express';
import ethosDaoService from '../services/ethosDao';

const router = Router();

// Members Routes
router.get('/members', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const members = await ethosDaoService.getMembers(limit, offset);
    res.json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
});

router.get('/members/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const member = await ethosDaoService.getMemberById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
});

router.post('/members', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await ethosDaoService.createMember(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
});

router.put('/members/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const member = await ethosDaoService.updateMember(memberId, req.body);
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
});

router.delete('/members/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await ethosDaoService.deleteMember(memberId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Proposals Routes
router.get('/proposals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const proposals = await ethosDaoService.getProposals(status, limit);
    res.json({ success: true, data: proposals });
  } catch (error) {
    next(error);
  }
});

router.get('/proposals/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const proposal = await ethosDaoService.getProposalById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Proposal not found' });
    }
    res.json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
});

router.post('/proposals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposal = await ethosDaoService.createProposal(req.body);
    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
});

router.put('/proposals/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const proposal = await ethosDaoService.updateProposal(proposalId, req.body);
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Proposal not found' });
    }
    res.json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
});

router.post('/proposals/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { vote, userId } = req.body;
    if (!['yes', 'no'].includes(vote)) {
      return res.status(400).json({ success: false, error: 'Invalid vote' });
    }
    const proposal = await ethosDaoService.voteOnProposal(proposalId, vote, userId || 'anonymous');
    if (!proposal) {
      return res.status(404).json({ success: false, error: 'Proposal not found' });
    }
    res.json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
});

router.delete('/proposals/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await ethosDaoService.deleteProposal(proposalId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Proposal not found' });
    }
    res.json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Achievements Routes
router.get('/achievements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievements = await ethosDaoService.getAchievements();
    res.json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
});

router.post('/achievements', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const achievement = await ethosDaoService.createAchievement(req.body);
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
});

// Impact Metrics Routes
router.get('/impact-metrics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await ethosDaoService.getImpactMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
});

router.put('/impact-metrics/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metricId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { value, change } = req.body;
    const metric = await ethosDaoService.updateImpactMetric(metricId, value, change);
    if (!metric) {
      return res.status(404).json({ success: false, error: 'Metric not found' });
    }
    res.json({ success: true, data: metric });
  } catch (error) {
    next(error);
  }
});

// Collective Data (full overview)
router.get('/collective', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ethosDaoService.getCollectiveData();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
