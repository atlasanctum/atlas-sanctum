/**
 * Webhook Routes — E3
 * POST   /api/webhooks              create
 * GET    /api/webhooks              list
 * GET    /api/webhooks/:id          get
 * PUT    /api/webhooks/:id          update
 * DELETE /api/webhooks/:id          delete
 * POST   /api/webhooks/:id/rotate   rotate secret
 * GET    /api/webhooks/:id/deliveries  delivery log
 * POST   /api/webhooks/:id/test     send test event
 */

import { Router, Request, Response } from 'express';
import { webhookService, WebhookEventType } from '../services/webhooks';
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

const orgId = (req: Request): string =>
  (req as any).user?.organizationId ?? (req as any).user?.userId;

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, url, events, maxRetries, timeoutMs } = req.body;
    if (!name || !url || !Array.isArray(events) || events.length === 0)
      return res.status(400).json({ error: 'name, url, and events are required' });

    const { webhook, secret } = await webhookService.create(
      orgId(req), (req as any).user.userId, name, url, events as WebhookEventType[],
      { maxRetries, timeoutMs }
    );
    res.status(201).json({ success: true, data: webhook, secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// List
router.get('/', async (req: Request, res: Response) => {
  try {
    const hooks = await webhookService.list(orgId(req));
    res.json({ success: true, data: hooks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const hook = await webhookService.getById(req.params.id, orgId(req));
    if (!hook) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: hook });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const hook = await webhookService.update(req.params.id, orgId(req), req.body);
    res.json({ success: true, data: hook });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await webhookService.delete(req.params.id, orgId(req));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Rotate secret
router.post('/:id/rotate', async (req: Request, res: Response) => {
  try {
    const secret = await webhookService.rotateSecret(req.params.id, orgId(req));
    res.json({ success: true, secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delivery log
router.get('/:id/deliveries', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const deliveries = await webhookService.getDeliveries(req.params.id, limit);
    res.json({ success: true, data: deliveries });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test delivery
router.post('/:id/test', async (req: Request, res: Response) => {
  try {
    const hook = await webhookService.getById(req.params.id, orgId(req));
    if (!hook) return res.status(404).json({ error: 'Not found' });
    await webhookService.dispatch('user.created', {
      test: true,
      message: 'This is a test delivery from Atlas Sanctum',
      timestamp: new Date().toISOString(),
    });
    res.json({ success: true, message: 'Test event dispatched' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
