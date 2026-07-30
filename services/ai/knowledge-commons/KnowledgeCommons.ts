/**
 * Atlas Sanctum — Knowledge Commons
 * Humanity's living memory.
 *
 * Implements:
 *   - KnowledgeRepository: stores research, indigenous knowledge, datasets, policies
 *   - SemanticSearch: vector-similarity search over knowledge assets
 *   - KnowledgeGraph: entity-relationship graph with traversal
 *   - IndigenousKnowledgeVault: FPIC-governed sovereign knowledge store
 *   - KnowledgeCommons: top-level orchestrator
 *
 * Production: Neo4j (graph) + Weaviate (vector search) + PostgreSQL (metadata)
 */

// ─── Knowledge Asset Types ────────────────────────────────────────────────────

export type KnowledgeAssetType =
  | 'research_paper'
  | 'indigenous_knowledge'
  | 'open_dataset'
  | 'educational_resource'
  | 'ai_model_card'
  | 'policy_library'
  | 'impact_story'
  | 'methodology'
  | 'field_observation';

export type AccessLevel = 'public' | 'community' | 'institutional' | 'sacred';
export type DataRights  = 'open' | 'shared' | 'community_sovereign' | 'sacred_sovereign';

export interface KnowledgeAsset {
  assetId: string;
  type: KnowledgeAssetType;
  title: string;
  summary: string;
  content: string;
  authors: string[];
  domain: string;
  tags: string[];
  language: string;
  accessLevel: AccessLevel;
  dataRights: DataRights;
  license: string;
  sourceUrl?: string;
  bioregion?: string;
  community?: string;
  fpicGranted?: boolean;
  embeddings?: number[];
  citationCount: number;
  verifiedBy: string[];
  publishedAt: number;
  updatedAt: number;
}

export interface KnowledgeNode {
  nodeId: string;
  label: string;
  type: 'concept' | 'entity' | 'relation' | 'axiom' | 'practice' | 'place';
  domain: string;
  properties: Record<string, unknown>;
  assetIds: string[];
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  relation: string;
  weight: number;
  evidence: string[];
}

export interface SearchResult {
  asset: KnowledgeAsset;
  score: number;
  matchedFields: string[];
}

// ─── Knowledge Repository ─────────────────────────────────────────────────────

export class KnowledgeRepository {
  private assets = new Map<string, KnowledgeAsset>();

  store(asset: KnowledgeAsset): void {
    this.assets.set(asset.assetId, asset);
  }

  get(assetId: string): KnowledgeAsset | undefined {
    return this.assets.get(assetId);
  }

  query(filter: {
    type?: KnowledgeAssetType;
    domain?: string;
    accessLevel?: AccessLevel;
    bioregion?: string;
    language?: string;
    tags?: string[];
  }): KnowledgeAsset[] {
    return [...this.assets.values()].filter(a => {
      if (filter.type        && a.type        !== filter.type)        return false;
      if (filter.domain      && a.domain      !== filter.domain)      return false;
      if (filter.accessLevel && a.accessLevel !== filter.accessLevel) return false;
      if (filter.bioregion   && a.bioregion   !== filter.bioregion)   return false;
      if (filter.language    && a.language    !== filter.language)     return false;
      if (filter.tags?.length && !filter.tags.some(t => a.tags.includes(t))) return false;
      return true;
    });
  }

  stats(): { total: number; byType: Record<string, number>; byDomain: Record<string, number> } {
    const byType: Record<string, number> = {};
    const byDomain: Record<string, number> = {};
    this.assets.forEach(a => {
      byType[a.type]     = (byType[a.type]     ?? 0) + 1;
      byDomain[a.domain] = (byDomain[a.domain] ?? 0) + 1;
    });
    return { total: this.assets.size, byType, byDomain };
  }
}

// ─── Semantic Search ──────────────────────────────────────────────────────────
// Production: Weaviate vector DB. Falls back to TF-IDF keyword similarity.

interface VectorSearchClient {
  search(query: string, topK: number, accessFilter?: AccessLevel): Promise<SearchResult[]>;
  index(asset: KnowledgeAsset): Promise<void>;
  isAvailable(): boolean;
}

class WeaviateSearchClient implements VectorSearchClient {
  private readonly url: string;
  private readonly apiKey: string;
  private readonly className = 'KnowledgeAsset';
  private _available: boolean | null = null;

  constructor() {
    this.url = (typeof process !== 'undefined' && process.env?.WEAVIATE_URL) ?? '';
    this.apiKey = (typeof process !== 'undefined' && process.env?.WEAVIATE_API_KEY) ?? '';
  }

  isAvailable(): boolean {
    return !!(this.url && this.apiKey);
  }

  async index(asset: KnowledgeAsset): Promise<void> {
    if (!this.isAvailable()) return;
    await fetch(`${this.url}/v1/objects`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({
        class: this.className,
        id: asset.assetId,
        properties: {
          title:       asset.title,
          summary:     asset.summary,
          content:     asset.content,
          domain:      asset.domain,
          tags:        asset.tags.join(' '),
          accessLevel: asset.accessLevel,
          assetType:   asset.type,
          language:    asset.language,
          bioregion:   asset.bioregion ?? '',
        },
      }),
    });
  }

  async search(query: string, topK: number, accessFilter?: AccessLevel): Promise<SearchResult[]> {
    const accessible: AccessLevel[] = accessFilter
      ? [accessFilter]
      : ['public', 'community', 'institutional'];

    const whereFilter = {
      operator: 'ContainsAny',
      path: ['accessLevel'],
      valueTextArray: accessible,
    };

    const body = {
      query: `{
        Get {
          ${this.className}(
            nearText: { concepts: ["${query.replace(/"/g, '')}"] }
            limit: ${topK}
            where: ${JSON.stringify(whereFilter)}
          ) {
            title summary domain tags accessLevel assetType
            _additional { id certainty }
          }
        }
      }`,
    };

    const res = await fetch(`${this.url}/v1/graphql`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Weaviate search failed: ${res.status}`);
    const data = await res.json() as any;
    const hits = data?.data?.Get?.[this.className] ?? [];

    return hits.map((hit: any) => ({
      asset: {
        assetId:      hit._additional.id,
        type:         hit.assetType,
        title:        hit.title,
        summary:      hit.summary,
        content:      '',
        authors:      [],
        domain:       hit.domain,
        tags:         (hit.tags ?? '').split(' ').filter(Boolean),
        language:     'en',
        accessLevel:  hit.accessLevel,
        dataRights:   'open' as DataRights,
        license:      '',
        citationCount: 0,
        verifiedBy:   [],
        publishedAt:  0,
        updatedAt:    0,
      } as KnowledgeAsset,
      score:         hit._additional.certainty ?? 0,
      matchedFields: ['title', 'summary'],
    }));
  }

  private _headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }
}

export class SemanticSearch {
  private readonly weaviate = new WeaviateSearchClient();

  constructor(private readonly repo: KnowledgeRepository) {}

  async indexAsset(asset: KnowledgeAsset): Promise<void> {
    if (this.weaviate.isAvailable()) {
      await this.weaviate.index(asset).catch(err =>
        console.warn('[KnowledgeCommons] Weaviate index failed, asset stored locally only:', err)
      );
    }
  }

  search(query: string, topK = 10, accessFilter?: AccessLevel): SearchResult[] {
    // Weaviate search is async — use searchAsync for production vector search
    return this._keywordSearch(query, topK, accessFilter);
  }

  async searchAsync(query: string, topK = 10, accessFilter?: AccessLevel): Promise<SearchResult[]> {
    if (this.weaviate.isAvailable()) {
      try {
        return await this.weaviate.search(query, topK, accessFilter);
      } catch (err) {
        console.warn('[KnowledgeCommons] Weaviate search failed, falling back to keyword search:', err);
      }
    }
    return this._keywordSearch(query, topK, accessFilter);
  }

  private _keywordSearch(query: string, topK: number, accessFilter?: AccessLevel): SearchResult[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const accessible: AccessLevel[] = accessFilter
      ? [accessFilter]
      : ['public', 'community', 'institutional'];

    return this.repo.query({ accessLevel: undefined })
      .filter(a => accessible.includes(a.accessLevel))
      .map(asset => {
        const matchedFields: string[] = [];
        let score = 0;
        terms.forEach(term => {
          if (asset.title.toLowerCase().includes(term))   { score += 3; matchedFields.push('title'); }
          if (asset.summary.toLowerCase().includes(term)) { score += 2; matchedFields.push('summary'); }
          if (asset.tags.some(t => t.includes(term)))     { score += 2; matchedFields.push('tags'); }
          if (asset.domain.toLowerCase().includes(term))  { score += 1; matchedFields.push('domain'); }
          if (asset.content.toLowerCase().includes(term)) { score += 1; matchedFields.push('content'); }
        });
        return { asset, score: score / (terms.length * 9), matchedFields: [...new Set(matchedFields)] };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

// ─── Knowledge Graph ──────────────────────────────────────────────────────────

export class KnowledgeGraphStore {
  private nodes = new Map<string, KnowledgeNode>();
  private edges: KnowledgeEdge[] = [];

  addNode(node: KnowledgeNode): void { this.nodes.set(node.nodeId, node); }
  addEdge(edge: KnowledgeEdge): void { this.edges.push(edge); }

  getNode(nodeId: string): KnowledgeNode | undefined { return this.nodes.get(nodeId); }

  traverse(startId: string, depth = 2): KnowledgeNode[] {
    const visited = new Set<string>();
    const result: KnowledgeNode[] = [];
    const queue: { id: string; d: number }[] = [{ id: startId, d: 0 }];

    while (queue.length) {
      const { id, d } = queue.shift()!;
      if (visited.has(id) || d > depth) continue;
      visited.add(id);
      const node = this.nodes.get(id);
      if (node) result.push(node);
      this.edges
        .filter(e => e.from === id)
        .forEach(e => queue.push({ id: e.to, d: d + 1 }));
    }
    return result;
  }

  findPath(fromId: string, toId: string): KnowledgeNode[] {
    const visited = new Set<string>();
    const queue: { id: string; path: string[] }[] = [{ id: fromId, path: [fromId] }];

    while (queue.length) {
      const { id, path } = queue.shift()!;
      if (id === toId) return path.map(p => this.nodes.get(p)!).filter(Boolean);
      if (visited.has(id)) continue;
      visited.add(id);
      this.edges
        .filter(e => e.from === id)
        .forEach(e => queue.push({ id: e.to, path: [...path, e.to] }));
    }
    return [];
  }

  queryByDomain(domain: string): KnowledgeNode[] {
    return [...this.nodes.values()].filter(n => n.domain === domain);
  }
}

// ─── Indigenous Knowledge Vault ───────────────────────────────────────────────
// FPIC-governed. Sacred knowledge requires explicit community consent.

export interface FPICRecord {
  communityId: string;
  assetId: string;
  consentGranted: boolean;
  grantedBy: string[];
  grantedAt: number;
  conditions: string[];
  expiresAt?: number;
}

export class IndigenousKnowledgeVault {
  private vault = new Map<string, KnowledgeAsset>();
  private fpicRecords = new Map<string, FPICRecord>();

  store(asset: KnowledgeAsset, fpic: FPICRecord): void {
    if (!fpic.consentGranted) {
      throw new Error(`FPIC not granted for asset "${asset.assetId}" from community "${fpic.communityId}"`);
    }
    this.vault.set(asset.assetId, asset);
    this.fpicRecords.set(asset.assetId, fpic);
  }

  access(assetId: string, requesterId: string): KnowledgeAsset | null {
    const fpic = this.fpicRecords.get(assetId);
    if (!fpic?.consentGranted) return null;
    if (fpic.expiresAt && Date.now() > fpic.expiresAt) return null;
    // Sacred assets: only accessible to granted parties
    const asset = this.vault.get(assetId);
    if (asset?.accessLevel === 'sacred' && !fpic.grantedBy.includes(requesterId)) return null;
    return asset ?? null;
  }

  getFPIC(assetId: string): FPICRecord | undefined {
    return this.fpicRecords.get(assetId);
  }

  listPublicAssets(): KnowledgeAsset[] {
    return [...this.vault.values()].filter(a => a.accessLevel === 'public');
  }
}

// ─── Knowledge Commons ────────────────────────────────────────────────────────

export class KnowledgeCommons {
  readonly repository = new KnowledgeRepository();
  readonly search     = new SemanticSearch(this.repository);
  readonly graph      = new KnowledgeGraphStore();
  readonly indigenous = new IndigenousKnowledgeVault();

  constructor() { this.seedFoundationalKnowledge(); }

  contribute(asset: KnowledgeAsset): void {
    this.repository.store(asset);
    this.search.indexAsset(asset); // async, non-blocking
  }

  discover(query: string, topK = 10): SearchResult[] {
    return this.search.search(query, topK);
  }

  async discoverAsync(query: string, topK = 10): Promise<SearchResult[]> {
    return this.search.searchAsync(query, topK);
  }

  stats() {
    return {
      ...this.repository.stats(),
      graphNodes: this.graph.queryByDomain('').length,
      indigenousAssets: this.indigenous.listPublicAssets().length,
    };
  }

  private seedFoundationalKnowledge(): void {
    const seed: KnowledgeAsset[] = [
      {
        assetId: 'k-001', type: 'research_paper', title: 'Planetary Boundaries Framework',
        summary: 'Defines nine Earth-system processes with boundaries that must not be crossed.',
        content: 'Rockström et al. (2009) identified nine planetary boundaries...',
        authors: ['Johan Rockström', 'Will Steffen'],
        domain: 'climate', tags: ['planetary-boundaries', 'earth-system', 'tipping-points'],
        language: 'en', accessLevel: 'public', dataRights: 'open',
        license: 'CC BY 4.0', citationCount: 12000, verifiedBy: ['atlas-sanctum'],
        publishedAt: 1262304000000, updatedAt: Date.now(),
      },
      {
        assetId: 'k-002', type: 'methodology', title: 'Verra VM0042 Carbon Verification Methodology',
        summary: 'Methodology for measuring and verifying carbon sequestration in improved forest management.',
        content: 'VM0042 provides a standardized approach to quantifying GHG emission reductions...',
        authors: ['Verra'], domain: 'climate',
        tags: ['carbon', 'verification', 'forest', 'methodology'],
        language: 'en', accessLevel: 'public', dataRights: 'open',
        license: 'CC BY 4.0', citationCount: 3400, verifiedBy: ['atlas-sanctum'],
        publishedAt: 1609459200000, updatedAt: Date.now(),
      },
      {
        assetId: 'k-003', type: 'policy_library', title: 'CARE Principles for Indigenous Data Governance',
        summary: 'Collective Benefit, Authority to Control, Responsibility, Ethics — framework for indigenous data sovereignty.',
        content: 'The CARE Principles complement the FAIR data principles by centering indigenous rights...',
        authors: ['Global Indigenous Data Alliance'],
        domain: 'governance', tags: ['indigenous', 'data-sovereignty', 'FPIC', 'CARE'],
        language: 'en', accessLevel: 'public', dataRights: 'open',
        license: 'CC BY 4.0', citationCount: 890, verifiedBy: ['atlas-sanctum'],
        publishedAt: 1577836800000, updatedAt: Date.now(),
      },
    ];
    seed.forEach(a => this.repository.store(a));

    // Seed graph
    const nodes: KnowledgeNode[] = [
      { nodeId: 'n-carbon-cycle',    label: 'Carbon Cycle',           type: 'concept', domain: 'climate',    properties: {}, assetIds: ['k-001', 'k-002'] },
      { nodeId: 'n-biodiversity',    label: 'Biodiversity',           type: 'concept', domain: 'ecology',    properties: {}, assetIds: ['k-001'] },
      { nodeId: 'n-indigenous-rights',label: 'Indigenous Rights',     type: 'axiom',   domain: 'governance', properties: {}, assetIds: ['k-003'] },
      { nodeId: 'n-regeneration',    label: 'Regenerative Economics', type: 'concept', domain: 'economics',  properties: {}, assetIds: [] },
    ];
    nodes.forEach(n => this.graph.addNode(n));
    this.graph.addEdge({ from: 'n-carbon-cycle', to: 'n-biodiversity',    relation: 'supports',  weight: 0.9, evidence: ['k-001'] });
    this.graph.addEdge({ from: 'n-biodiversity', to: 'n-regeneration',    relation: 'enables',   weight: 0.8, evidence: ['k-001'] });
    this.graph.addEdge({ from: 'n-indigenous-rights', to: 'n-regeneration', relation: 'grounds', weight: 1.0, evidence: ['k-003'] });
  }
}

export const AtlasKnowledgeCommons = new KnowledgeCommons();
export default AtlasKnowledgeCommons;
