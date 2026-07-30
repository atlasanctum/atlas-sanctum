/**
 * Atlas Sanctum — Integration Gateway Middleware
 * API gateway layer: zero-trust auth, rate limiting, distributed tracing,
 * cost metering, schema validation, AI policy enforcement, audit logging.
 */

import { Request, Response, NextFunction } from 'express';
import { EventBus } from '../services/eventBus';
import { ObservabilityConnector } from '../connectors/ObservabilityConnector';

// ── Distributed trace context ────────────────────────────────────────────────

export function traceMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const traceId = (req.headers['x-trace-id'] as string) ?? crypto.randomUUID();
  const spanId = crypto.randomUUID().slice(0, 16);
  (req as any).traceId = traceId;
  (req as any).spanId = spanId;
  _res.setHeader('x-trace-id', traceId);
  _res.setHeader('x-span-id', spanId);
  next();
}

// ── Request metering & observability ────────────────────────────────────────

export function meteringMiddleware(obs?: ObservabilityConnector) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    const path = req.route?.path ?? req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const tags = {
        method: req.method,
        path,
        status: String(res.statusCode),
        service: 'atlas-sanctum-api',
      };

      obs?.recordMetric({ name: 'api.request.duration_ms', value: duration, tags });
      obs?.recordMetric({ name: 'api.request.count', value: 1, tags });

      if (res.statusCode >= 500) {
        obs?.sendLog({
          level: 'error',
          message: `${req.method} ${path} → ${res.statusCode} (${duration}ms)`,
          service: 'atlas-sanctum-api',
          traceId: (req as any).traceId,
          tags,
        });
      }
    });

    next();
  };
}

// ── Zero-trust: validate JWT + org scope ────────────────────────────────────

export function zeroTrustMiddleware(allowedRoles?: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: 'ZERO_TRUST: No authenticated identity' });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      res.status(403).json({ error: `ZERO_TRUST: Role '${user.role}' not permitted` });
      return;
    }

    // Enforce org isolation — users can only access their own org's data
    const orgId = req.params.orgId ?? req.query.organization_id;
    if (orgId && orgId !== user.organization_id && user.role !== 'super_admin') {
      res.status(403).json({ error: 'ZERO_TRUST: Cross-org access denied' });
      return;
    }

    next();
  };
}

// ── In-memory rate limiter (replace with Redis in production) ────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMiddleware(maxRequests = 100, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${(req as any).user?.user_id ?? req.ip}:${req.path}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({ error: 'RATE_LIMIT: Too many requests', retryAfterMs: entry.resetAt - now });
      return;
    }

    entry.count++;
    next();
  };
}

// ── AEGIS AI policy enforcement ──────────────────────────────────────────────

export function aegisPolicyMiddleware(eventBus?: EventBus) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Block requests to AI endpoints without ethical-ai tag acknowledgment
    if (req.path.includes('/agents/') || req.path.includes('/ai/')) {
      const policyAck = req.headers['x-aegis-policy-ack'];
      if (!policyAck) {
        res.status(403).json({
          error: 'AEGIS_POLICY: AI endpoint requires x-aegis-policy-ack header',
          docs: '/v1/aegis/policy',
        });
        return;
      }
    }
    next();
  };
}

// ── Connector health gate ────────────────────────────────────────────────────

export function connectorHealthGate(requiredConnectors: string[], registry: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (const connectorId of requiredConnectors) {
      const connector = registry.get(connectorId);
      if (!connector || connector.getStatus() === 'offline') {
        res.status(503).json({
          error: `SERVICE_UNAVAILABLE: Required connector '${connectorId}' is offline`,
          connectorId,
        });
        return;
      }
    }
    next();
  };
}

// ── Audit logging middleware ─────────────────────────────────────────────────

export function auditMiddleware(eventBus?: EventBus) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user) { next(); return; }

    res.on('finish', () => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        eventBus?.publish(
          'api.request.mutating',
          user.user_id,
          'user',
          {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            actorId: user.user_id,
            organizationId: user.organization_id,
            traceId: (req as any).traceId,
          }
        );
      }
    });

    next();
  };
}
