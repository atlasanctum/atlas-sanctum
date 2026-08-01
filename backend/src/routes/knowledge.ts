/**
 * Atlas Sanctum — Knowledge System Route
 * Six-layer Civilization Knowledge Engine REST surface.
 *
 * Mounts under: /api/v3/sanctum/knowledge
 *
 * Endpoints:
 *   POST /query      — Unified query across SQL + Graph + Vector + IR layers
 *   POST /ingest     — Ingest a document through the full pipeline
 *   GET  /stats      — Knowledge engine index statistics
 *   GET  /assets     — List knowledge assets (Layer 1 — SQL)
 *   GET  /assets/:id — Get a single knowledge asset
 *   GET  /entities   — List knowledge entities (Layer 3 — Graph nodes)
 *   GET  /graph/:id  — Traverse the knowledge graph from an entity
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';
import { agentServiceClient } from '../services/agentServiceClient';
import { auditLayer } from './planes/ai-orchestration';

const router = Router();
router.use(authenticate);

const handle = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('[Knowledge Route]', { error, path: req.path });
      next(error);
    }
  };

// ─── Unified Query ────────────────────────────────────────────────────────────

/**
 * POST /query
 * Routes a natural language query across all six knowledge layers.
 * Returns a cited, evidence-backed synthesis with reasoning trace.
 *
 * Body: {
 *   text: string,
 *   domain?: string,
 *   top_k?: number,
 *   access_levels?: string[],
 *   include_graph?: boolean,
 *   include_sql?: boolean
 * }
 *
 * Example:
 *   { "text": "Show Kenyan restoration projects funded by climate resilience orgs" }
 */
router.post('/query', handle(async (req) => {
  const user = (req as any).user;
  const { text, domain, top_k, access_levels, include_graph, include_sql } = req.body;
  if (!text || typeof text !== 'string') throw new Error('text is required');

  auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: 'knowledge',
    action: 'knowledge:query',
    payload: { query: text.slice(0, 200), domain },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['knowledge', 'query'],
  });

  return agentServiceClient.knowledgeQuery({
    text,
    user_id: user.id,
    domain:  domain ?? null,
    top_k:   top_k ?? 10,
    access_levels: access_levels ?? ['public', 'community', 'institutional'],
    include_graph: include_graph ?? true,
    include_sql:   include_sql ?? true,
  });
}));

// ─── Ingestion ────────────────────────────────────────────────────────────────

/**
 * POST /ingest
 * Ingest a document through the full knowledge pipeline:
 * OCR → metadata → summarisation → entity extraction
 * → embedding → graph update → search indexing
 *
 * Body: { source_type, source_ref, raw_text, metadata? }
 */
router.post('/ingest', handle(async (req) => {
  const user = (req as any).user;
  const { source_type, source_ref, raw_text, metadata } = req.body;
  if (!source_type) throw new Error('source_type is required');
  if (!source_ref)  throw new Error('source_ref is required');
  if (!raw_text)    throw new Error('raw_text is required');

  auditLayer.record({
    eventType: 'agent_action',
    userId: user.id,
    domain: 'knowledge',
    action: 'knowledge:ingest',
    payload: { source_type, source_ref: source_ref.slice(0, 200) },
    outcome: 'pending',
    timestamp: Date.now() as any,
    tags: ['knowledge', 'ingest', source_type],
  });

  return agentServiceClient.knowledgeIngest({ source_type, source_ref, raw_text, metadata });
}));

// ─── Stats ────────────────────────────────────────────────────────────────────

router.get('/stats', handle(async (_req) => {
  return agentServiceClient.knowledgeStats();
}));

// ─── Assets (Layer 1 — SQL) ───────────────────────────────────────────────────

/**
 * GET /assets
 * List knowledge assets from the relational layer.
 * Query params: domain, type, bioregion, access_level, tags, page, page_size
 */
router.get('/assets', handle(async (req) => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabase
    .from('knowledge_assets')
    .select('asset_id,title,summary,domain,type,tags,access_level,citation_count,published_at,bioregion')
    .eq('is_latest', true)
    .order('citation_count', { ascending: false });

  if (req.query.domain)       query = query.eq('domain', req.query.domain as string);
  if (req.query.type)         query = query.eq('type', req.query.type as string);
  if (req.query.bioregion)    query = query.eq('bioregion', req.query.bioregion as string);
  if (req.query.access_level) query = query.eq('access_level', req.query.access_level as string);

  const page     = parseInt(req.query.page as string ?? '1');
  const pageSize = parseInt(req.query.page_size as string ?? '20');
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { assets: data, total: count, page, page_size: pageSize };
}));

/**
 * GET /assets/:id
 * Get a single knowledge asset by asset_id.
 */
router.get('/assets/:id', handle(async (req) => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from('knowledge_assets')
    .select('*')
    .eq('asset_id', req.params.id)
    .eq('is_latest', true)
    .single();

  if (error) throw new Error(error.message);
  return data;
}));

// ─── Entities (Layer 3 — Graph nodes) ────────────────────────────────────────

/**
 * GET /entities
 * List knowledge entities.
 * Query params: type, domain, label, page, page_size
 */
router.get('/entities', handle(async (req) => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabase
    .from('knowledge_entities')
    .select('entity_id,type,label,domain,properties')
    .eq('is_canonical', true)
    .order('label');

  if (req.query.type)   query = query.eq('type', req.query.type as string);
  if (req.query.domain) query = query.eq('domain', req.query.domain as string);
  if (req.query.label)  query = query.ilike('label', `%${req.query.label}%`);

  const page     = parseInt(req.query.page as string ?? '1');
  const pageSize = parseInt(req.query.page_size as string ?? '20');
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { entities: data, page, page_size: pageSize };
}));

/**
 * GET /graph/:entityId
 * Traverse the knowledge graph from an entity.
 * Query params: depth (default 2)
 */
router.get('/graph/:entityId', handle(async (req) => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const entityId = req.params.entityId;
  const depth    = Math.min(parseInt(req.query.depth as string ?? '2'), 3);

  // BFS over knowledge_relationships using SQL (Neo4j handles this in production)
  const visited  = new Set<string>([entityId]);
  const frontier = [entityId];
  const nodes:   any[] = [];
  const edges:   any[] = [];

  for (let d = 0; d < depth && frontier.length; d++) {
    const { data: rels } = await supabase
      .from('knowledge_relationships')
      .select('from_entity_id,to_entity_id,relation_type,weight,evidence')
      .in('from_entity_id', frontier);

    const nextFrontier: string[] = [];
    for (const rel of rels ?? []) {
      edges.push(rel);
      if (!visited.has(rel.to_entity_id)) {
        visited.add(rel.to_entity_id);
        nextFrontier.push(rel.to_entity_id);
      }
    }

    if (nextFrontier.length) {
      const { data: entityData } = await supabase
        .from('knowledge_entities')
        .select('entity_id,type,label,domain')
        .in('entity_id', nextFrontier);
      nodes.push(...(entityData ?? []));
    }
    frontier.length = 0;
    frontier.push(...nextFrontier);
  }

  return { root: entityId, depth, nodes, edges };
}));

export default router;
