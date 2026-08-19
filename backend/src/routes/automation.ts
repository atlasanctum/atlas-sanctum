/**
 * Automation Routes — E10 Workflow Automation
 */

import { Router, Request, Response } from 'express';
import { automationService } from '../services/automation';
import { verifyAccessToken } from '../utils/auth';

const router = Router();

const auth = (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    (req as any).user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(auth);

const uid = (req: Request) => (req as any).user.userId as string;
const oid = (req: Request) => ((req as any).user.organizationId ?? uid(req)) as string;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, trigger, actions } = req.body;
    if (!name || !trigger || !Array.isArray(actions))
      return res.status(400).json({ error: 'name, trigger, and actions are required' });
    const automation = await automationService.create(oid(req), uid(req), name, description ?? '', trigger, actions);
    res.status(201).json({ success: true, data: automation });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const list = await automationService.list(oid(req));
    res.json({ success: true, data: list });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const automation = await automationService.getById(req.params.id, oid(req));
    if (!automation) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: automation });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const automation = await automationService.update(req.params.id, oid(req), req.body);
    res.json({ success: true, data: automation });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await automationService.delete(req.params.id, oid(req));
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Manual trigger
router.post('/:id/run', async (req: Request, res: Response) => {
  try {
    const execution = await automationService.execute(req.params.id, req.body ?? {});
    res.json({ success: true, data: execution });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Execution history
router.get('/:id/executions', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const executions = await automationService.getExecutions(req.params.id, limit);
    res.json({ success: true, data: executions });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
