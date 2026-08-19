/**
 * Workspace Routes — E9 Enterprise Collaboration
 */

import { Router, Request, Response } from 'express';
import { workspaceService } from '../services/workspaces';
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

// ── Workspaces ────────────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, visibility } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const ws = await workspaceService.create(oid(req), uid(req), name, description ?? '', visibility);
    res.status(201).json({ success: true, data: ws });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const list = await workspaceService.list(oid(req), uid(req));
    res.json({ success: true, data: list });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const ws = await workspaceService.getById(req.params.id);
    if (!ws) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: ws });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const ws = await workspaceService.update(req.params.id, req.body);
    res.json({ success: true, data: ws });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await workspaceService.delete(req.params.id);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ── Members ───────────────────────────────────────────────────────────────────

router.get('/:id/members', async (req: Request, res: Response) => {
  try {
    const members = await workspaceService.listMembers(req.params.id);
    res.json({ success: true, data: members });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const member = await workspaceService.addMember(req.params.id, userId, role);
    res.status(201).json({ success: true, data: member });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id/members/:userId', async (req: Request, res: Response) => {
  try {
    await workspaceService.removeMember(req.params.id, req.params.userId);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ── Activity ──────────────────────────────────────────────────────────────────

router.get('/:id/activity', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const feed = await workspaceService.getActivity(req.params.id, limit);
    res.json({ success: true, data: feed });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ── Approvals ─────────────────────────────────────────────────────────────────

router.get('/:id/approvals', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as any;
    const approvals = await workspaceService.listApprovals(req.params.id, status);
    res.json({ success: true, data: approvals });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/approvals', async (req: Request, res: Response) => {
  try {
    const { title, description, resourceType, resourceId } = req.body;
    if (!title || !resourceType || !resourceId)
      return res.status(400).json({ error: 'title, resourceType, resourceId required' });
    const approval = await workspaceService.createApproval(
      req.params.id, uid(req), title, description ?? '', resourceType, resourceId
    );
    res.status(201).json({ success: true, data: approval });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/approvals/:approvalId/review', async (req: Request, res: Response) => {
  try {
    const { decision, note } = req.body;
    if (!['approved', 'rejected'].includes(decision))
      return res.status(400).json({ error: 'decision must be approved or rejected' });
    const approval = await workspaceService.reviewApproval(
      req.params.approvalId, uid(req), decision, note
    );
    res.json({ success: true, data: approval });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
