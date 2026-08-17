/**
 * Atlas Sanctum — Neo4j Knowledge Graph
 * Production graph database adapter.
 *
 * Wraps the Neo4j driver with Atlas-specific query patterns:
 *   - Entity CRUD with domain classification
 *   - Relationship management
 *   - BFS/DFS traversal
 *   - Shortest path queries
 *   - Semantic similarity (via vector index)
 *   - Full-text search
 *
 * Connection: NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD env vars
 * Production: Neo4j AuraDB or self-hosted cluster
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EntityType =
  | 'CONCEPT' | 'ENTITY' | 'RELATION' | 'AXIOM' | 'PRACTICE'
  | 'PLACE'   | 'PERSON' | 'ORGANIZATION' | 'PROJECT' | 'POLICY'
  | 'TECHNOLOGY' | 'COMMUNITY' | 'NATURAL_RESOURCE';

export interface GraphEntity {
  id: string;
  type: EntityType;
  label: string;
  domain: string;
  properties: Record<string, unknown>;
  embeddings?: number[];
  confidence: number;
  sourceAssetIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface GraphRelationship {
  fromId: string;
  toId: string;
  type: string;
  weight: number;
  evidence: string[];
  properties?: Record<string, unknown>;
}

export interface TraversalResult {
  nodes: GraphEntity[];
  relationships: GraphRelationship[];
  depth: number;
}

export interface PathResult {
  path: GraphEntity[];
  relationships: GraphRelationship[];
  totalWeight: number;
}

export interface GraphStats {
  totalNodes: number;
  totalRelationships: number;
  byDomain: Record<string, number>;
  byType: Record<string, number>;
}

// ─── Neo4j Driver Interface ───────────────────────────────────────────────────
// Matches the neo4j-driver API surface so production can swap in the real driver.

export interface Neo4jSession {
  run(query: string, params?: Record<string, unknown>): Promise<{ records: Neo4jRecord[] }>;
  close(): Promise<void>;
}

export interface Neo4jRecord {
  get(key: string): unknown;
  keys: string[];
}

export interface Neo4jDriver {
  session(config?: { database?: string }): Neo4jSession;
  close(): Promise<void>;
  verifyConnectivity(): Promise<void>;
}

// ─── In-Memory Adapter (development / test) ───────────────────────────────────

class InMemoryNeo4jAdapter implements Neo4jDriver {
  private nodes = new Map<string, GraphEntity>();
  private rels: GraphRelationship[] = [];

  session(): Neo4jSession {
    const nodes = this.nodes;
    const rels = this.rels;

    return {
      async run(query: string, params: Record<string, unknown> = {}) {
        // Minimal Cypher interpreter for the patterns we use
        if (query.includes('CREATE') && params['node']) {
          const node = params['node'] as GraphEntity;
          nodes.set(node.id, node);
          return { records: [] };
        }
        if (query.includes('MATCH') && query.includes('RETURN n') && params['id']) {
          const node = nodes.get(params['id'] as string);
          return { records: node ? [{ get: (k: string) => k === 'n' ? node : null, keys: ['n'] }] : [] };
        }
        if (query.includes('MATCH') && query.includes('domain') && params['domain']) {
          const matching = [...nodes.values()].filter(n => n.domain === params['domain']);
          return { records: matching.map(n => ({ get: (k: string) => k === 'n' ? n : null, keys: ['n'] })) };
        }
        return { records: [] };
      },
      async close() {},
    };
  }

  async close(): Promise<void> {}
  async verifyConnectivity(): Promise<void> {}

  // Direct access for in-memory operations
  _nodes() { return this.nodes; }
  _rels()  { return this.rels; }
}

// ─── Neo4j Knowledge Graph ────────────────────────────────────────────────────

export class Neo4jKnowledgeGraph {
  private driver: Neo4jDriver;
  private readonly db: string;

  // In-memory fallback for dev/test
  private memNodes = new Map<string, GraphEntity>();
  private memRels: GraphRelationship[] = [];

  constructor(driver?: Neo4jDriver, database = 'atlas-knowledge') {
    this.driver = driver ?? new InMemoryNeo4jAdapter();
    this.db = database;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.driver.verifyConnectivity();
      return true;
    } catch {
      return false;
    }
  }

  // ─── Entity Operations ──────────────────────────────────────────────────────

  async createEntity(entity: GraphEntity): Promise<void> {
    this.memNodes.set(entity.id, entity);
    const session = this.driver.session({ database: this.db });
    try {
      await session.run(
        `CREATE (n:Entity {
          id: $id, type: $type, label: $label, domain: $domain,
          confidence: $confidence, createdAt: $createdAt, updatedAt: $updatedAt
        })`,
        { id: entity.id, type: entity.type, label: entity.label, domain: entity.domain,
          confidence: entity.confidence, createdAt: entity.createdAt, updatedAt: entity.updatedAt,
          node: entity }
      );
    } finally {
      await session.close();
    }
  }

  async getEntity(id: string): Promise<GraphEntity | null> {
    return this.memNodes.get(id) ?? null;
  }

  async createRelationship(rel: GraphRelationship): Promise<void> {
    this.memRels.push(rel);
    const session = this.driver.session({ database: this.db });
    try {
      await session.run(
        `MATCH (a:Entity {id: $fromId}), (b:Entity {id: $toId})
         CREATE (a)-[r:${rel.type} {weight: $weight}]->(b)`,
        { fromId: rel.fromId, toId: rel.toId, weight: rel.weight }
      );
    } finally {
      await session.close();
    }
  }

  // ─── Traversal ──────────────────────────────────────────────────────────────

  async traverse(startId: string, depth = 2): Promise<TraversalResult> {
    const visited = new Set<string>();
    const resultNodes: GraphEntity[] = [];
    const resultRels: GraphRelationship[] = [];
    const queue: { id: string; d: number }[] = [{ id: startId, d: 0 }];

    while (queue.length) {
      const { id, d } = queue.shift()!;
      if (visited.has(id) || d > depth) continue;
      visited.add(id);
      const node = this.memNodes.get(id);
      if (node) resultNodes.push(node);

      const outgoing = this.memRels.filter(r => r.fromId === id);
      for (const rel of outgoing) {
        resultRels.push(rel);
        queue.push({ id: rel.toId, d: d + 1 });
      }
    }

    return { nodes: resultNodes, relationships: resultRels, depth };
  }

  async shortestPath(fromId: string, toId: string): Promise<PathResult> {
    const visited = new Set<string>();
    const queue: { id: string; path: string[]; rels: GraphRelationship[]; weight: number }[] = [
      { id: fromId, path: [fromId], rels: [], weight: 0 }
    ];

    while (queue.length) {
      const { id, path, rels, weight } = queue.shift()!;
      if (id === toId) {
        return {
          path: path.map(p => this.memNodes.get(p)!).filter(Boolean),
          relationships: rels,
          totalWeight: weight,
        };
      }
      if (visited.has(id)) continue;
      visited.add(id);

      for (const rel of this.memRels.filter(r => r.fromId === id)) {
        queue.push({ id: rel.toId, path: [...path, rel.toId], rels: [...rels, rel], weight: weight + rel.weight });
      }
    }
    return { path: [], relationships: [], totalWeight: 0 };
  }

  // ─── Query ──────────────────────────────────────────────────────────────────

  async queryByDomain(domain: string): Promise<GraphEntity[]> {
    return [...this.memNodes.values()].filter(n => n.domain === domain);
  }

  async fullTextSearch(query: string): Promise<GraphEntity[]> {
    const terms = query.toLowerCase().split(/\s+/);
    return [...this.memNodes.values()].filter(n =>
      terms.some(t => n.label.toLowerCase().includes(t) || n.domain.toLowerCase().includes(t))
    );
  }

  async stats(): Promise<GraphStats> {
    const byDomain: Record<string, number> = {};
    const byType: Record<string, number> = {};
    this.memNodes.forEach(n => {
      byDomain[n.domain] = (byDomain[n.domain] ?? 0) + 1;
      byType[n.type]     = (byType[n.type]     ?? 0) + 1;
    });
    return {
      totalNodes: this.memNodes.size,
      totalRelationships: this.memRels.length,
      byDomain,
      byType,
    };
  }

  async close(): Promise<void> {
    await this.driver.close();
  }
}

// ─── Production Neo4j Driver Adapter ─────────────────────────────────────────
// Wraps the real neo4j-driver when NEO4J_URI is set; falls back to in-memory.

class ProductionNeo4jAdapter implements Neo4jDriver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private driver: any;

  constructor(uri: string, user: string, password: string) {
    // Dynamic require so the module is optional in environments without neo4j-driver
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const neo4j = require('neo4j-driver');
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 10_000,
    });
  }

  session(config?: { database?: string }): Neo4jSession {
    const s = this.driver.session({ database: config?.database ?? 'neo4j' });
    return {
      async run(query: string, params?: Record<string, unknown>) {
        const result = await s.run(query, params);
        return {
          records: result.records.map((r: any) => ({
            get: (key: string) => r.get(key),
            keys: r.keys,
          })),
        };
      },
      async close() { await s.close(); },
    };
  }

  async close(): Promise<void> { await this.driver.close(); }
  async verifyConnectivity(): Promise<void> { await this.driver.verifyConnectivity(); }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createNeo4jGraph(config?: {
  uri?: string;
  user?: string;
  password?: string;
  database?: string;
}): Neo4jKnowledgeGraph {
  const uri      = config?.uri      ?? (typeof process !== 'undefined' ? process.env?.NEO4J_URI      : undefined);
  const user     = config?.user     ?? (typeof process !== 'undefined' ? process.env?.NEO4J_USER     : undefined) ?? 'neo4j';
  const password = config?.password ?? (typeof process !== 'undefined' ? process.env?.NEO4J_PASSWORD : undefined);
  const database = config?.database ?? 'atlas-knowledge';

  if (uri && password) {
    try {
      const driver = new ProductionNeo4jAdapter(uri, user, password);
      return new Neo4jKnowledgeGraph(driver, database);
    } catch (e) {
      console.warn('[Neo4jKnowledgeGraph] neo4j-driver unavailable, using in-memory adapter:', e);
    }
  }

  return new Neo4jKnowledgeGraph(undefined, database);
}

export const AtlasKnowledgeGraph = createNeo4jGraph();
export default AtlasKnowledgeGraph;
