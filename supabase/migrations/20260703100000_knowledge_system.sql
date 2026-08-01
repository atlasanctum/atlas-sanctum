-- =============================================================================
-- Atlas Sanctum — Knowledge System Relational Foundation
-- Layer 1: Structured truth for the six-layer knowledge architecture
--
-- Tables:
--   knowledge_assets        — versioned documents, papers, policies, stories
--   knowledge_entities      — extracted named entities (persons, orgs, places)
--   knowledge_relationships — typed edges between entities
--   knowledge_ingestion_log — pipeline audit trail for every ingested document
--   knowledge_embeddings    — vector metadata (actual vectors in Weaviate/pgvector)
--   knowledge_citations     — citation graph between assets
--   knowledge_fpic_records  — FPIC consent for indigenous knowledge
--   knowledge_search_index  — BM25 term frequency index for IR engine
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram similarity for fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- accent-insensitive search

-- =============================================================================
-- KNOWLEDGE ASSETS (Layer 1 + Layer 2 metadata)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_assets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id        VARCHAR(100) UNIQUE NOT NULL,  -- stable external ID
    type            VARCHAR(50)  NOT NULL,          -- research_paper | policy | impact_story | ...
    title           TEXT         NOT NULL,
    summary         TEXT,
    content         TEXT,                           -- full text (may be large)
    authors         TEXT[]       NOT NULL DEFAULT '{}',
    domain          VARCHAR(100) NOT NULL,          -- climate | governance | health | ...
    subdomain       VARCHAR(100),
    tags            TEXT[]       NOT NULL DEFAULT '{}',
    language        VARCHAR(10)  NOT NULL DEFAULT 'en',
    access_level    VARCHAR(30)  NOT NULL DEFAULT 'public',  -- public | community | institutional | sacred
    data_rights     VARCHAR(30)  NOT NULL DEFAULT 'open',    -- open | shared | community_sovereign | sacred_sovereign
    license         VARCHAR(100),
    source_url      TEXT,
    bioregion       VARCHAR(100),
    community       VARCHAR(200),
    fpic_granted    BOOLEAN      DEFAULT FALSE,
    citation_count  INTEGER      DEFAULT 0,
    verified_by     TEXT[]       DEFAULT '{}',
    confidence      DECIMAL(4,3) DEFAULT 1.0,
    -- Versioning
    version         INTEGER      NOT NULL DEFAULT 1,
    previous_id     UUID         REFERENCES knowledge_assets(id),
    is_latest       BOOLEAN      NOT NULL DEFAULT TRUE,
    -- Ingestion tracking
    ingestion_id    UUID,
    -- Timestamps
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT ka_access_level_check CHECK (access_level IN ('public','community','institutional','sacred')),
    CONSTRAINT ka_data_rights_check  CHECK (data_rights  IN ('open','shared','community_sovereign','sacred_sovereign'))
);

CREATE INDEX IF NOT EXISTS idx_ka_domain       ON knowledge_assets(domain);
CREATE INDEX IF NOT EXISTS idx_ka_type         ON knowledge_assets(type);
CREATE INDEX IF NOT EXISTS idx_ka_access       ON knowledge_assets(access_level);
CREATE INDEX IF NOT EXISTS idx_ka_bioregion    ON knowledge_assets(bioregion);
CREATE INDEX IF NOT EXISTS idx_ka_tags         ON knowledge_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_ka_authors      ON knowledge_assets USING GIN(authors);
CREATE INDEX IF NOT EXISTS idx_ka_latest       ON knowledge_assets(is_latest) WHERE is_latest = TRUE;
CREATE INDEX IF NOT EXISTS idx_ka_title_trgm   ON knowledge_assets USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ka_content_fts  ON knowledge_assets USING GIN(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(content,'')));

-- =============================================================================
-- KNOWLEDGE ENTITIES (Layer 3 — graph nodes, stored relationally)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_entities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id       VARCHAR(100) UNIQUE NOT NULL,
    type            VARCHAR(50)  NOT NULL,  -- PERSON | ORGANIZATION | PROJECT | PLACE | CONCEPT | POLICY | NATURAL_RESOURCE
    label           TEXT         NOT NULL,
    domain          VARCHAR(100) NOT NULL,
    properties      JSONB        NOT NULL DEFAULT '{}',
    source_asset_ids TEXT[]      DEFAULT '{}',
    confidence      DECIMAL(4,3) DEFAULT 1.0,
    -- Deduplication
    canonical_id    UUID         REFERENCES knowledge_entities(id),  -- points to canonical if duplicate
    is_canonical    BOOLEAN      NOT NULL DEFAULT TRUE,
    -- Temporal
    valid_from      TIMESTAMPTZ,
    valid_to        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ke_type      ON knowledge_entities(type);
CREATE INDEX IF NOT EXISTS idx_ke_domain    ON knowledge_entities(domain);
CREATE INDEX IF NOT EXISTS idx_ke_label_trgm ON knowledge_entities USING GIN(label gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ke_canonical ON knowledge_entities(is_canonical) WHERE is_canonical = TRUE;
CREATE INDEX IF NOT EXISTS idx_ke_props     ON knowledge_entities USING GIN(properties);

-- =============================================================================
-- KNOWLEDGE RELATIONSHIPS (Layer 3 — graph edges, stored relationally)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_relationships (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_entity_id  VARCHAR(100) NOT NULL REFERENCES knowledge_entities(entity_id),
    to_entity_id    VARCHAR(100) NOT NULL REFERENCES knowledge_entities(entity_id),
    relation_type   VARCHAR(100) NOT NULL,  -- funds | protects | employs | causes | contradicts | ...
    weight          DECIMAL(4,3) NOT NULL DEFAULT 1.0,
    evidence        TEXT[]       DEFAULT '{}',  -- asset_ids supporting this relationship
    properties      JSONB        DEFAULT '{}',
    confidence      DECIMAL(4,3) DEFAULT 1.0,
    -- Temporal
    valid_from      TIMESTAMPTZ,
    valid_to        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT kr_no_self_loop CHECK (from_entity_id <> to_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_kr_from     ON knowledge_relationships(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_kr_to       ON knowledge_relationships(to_entity_id);
CREATE INDEX IF NOT EXISTS idx_kr_type     ON knowledge_relationships(relation_type);
CREATE INDEX IF NOT EXISTS idx_kr_weight   ON knowledge_relationships(weight DESC);

-- =============================================================================
-- KNOWLEDGE INGESTION LOG (pipeline audit trail)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_ingestion_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingestion_id    UUID         NOT NULL DEFAULT uuid_generate_v4(),
    source_type     VARCHAR(50)  NOT NULL,  -- pdf | url | api | manual | sensor
    source_ref      TEXT         NOT NULL,  -- URL, file path, or external ID
    status          VARCHAR(30)  NOT NULL DEFAULT 'pending',
    -- Pipeline stages (each timestamped)
    ocr_completed_at        TIMESTAMPTZ,
    metadata_extracted_at   TIMESTAMPTZ,
    summarized_at           TIMESTAMPTZ,
    entities_extracted_at   TIMESTAMPTZ,
    relationships_extracted_at TIMESTAMPTZ,
    embeddings_generated_at TIMESTAMPTZ,
    graph_updated_at        TIMESTAMPTZ,
    relational_updated_at   TIMESTAMPTZ,
    search_indexed_at       TIMESTAMPTZ,
    -- Results
    asset_id        UUID         REFERENCES knowledge_assets(id),
    entities_found  INTEGER      DEFAULT 0,
    relationships_found INTEGER  DEFAULT 0,
    error_message   TEXT,
    processing_ms   INTEGER,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT kil_status_check CHECK (status IN ('pending','processing','completed','failed','partial'))
);

CREATE INDEX IF NOT EXISTS idx_kil_status     ON knowledge_ingestion_log(status);
CREATE INDEX IF NOT EXISTS idx_kil_source     ON knowledge_ingestion_log(source_type);
CREATE INDEX IF NOT EXISTS idx_kil_created    ON knowledge_ingestion_log(created_at DESC);

-- =============================================================================
-- KNOWLEDGE EMBEDDINGS METADATA (Layer 4 — vectors live in Weaviate/pgvector)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id        UUID         NOT NULL REFERENCES knowledge_assets(id) ON DELETE CASCADE,
    chunk_index     INTEGER      NOT NULL DEFAULT 0,  -- for chunked documents
    chunk_text      TEXT         NOT NULL,
    model           VARCHAR(100) NOT NULL DEFAULT 'text-embedding-3-small',
    dimensions      INTEGER      NOT NULL DEFAULT 1536,
    vector_store    VARCHAR(50)  NOT NULL DEFAULT 'weaviate',  -- weaviate | pgvector | qdrant
    external_id     VARCHAR(200),  -- ID in the external vector store
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (asset_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_kemb_asset   ON knowledge_embeddings(asset_id);
CREATE INDEX IF NOT EXISTS idx_kemb_model   ON knowledge_embeddings(model);

-- =============================================================================
-- KNOWLEDGE CITATIONS (citation graph between assets)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_citations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citing_asset_id UUID         NOT NULL REFERENCES knowledge_assets(id),
    cited_asset_id  UUID         NOT NULL REFERENCES knowledge_assets(id),
    citation_text   TEXT,         -- the exact quote or reference
    page_number     INTEGER,
    confidence      DECIMAL(4,3) DEFAULT 1.0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (citing_asset_id, cited_asset_id)
);

CREATE INDEX IF NOT EXISTS idx_kcit_citing ON knowledge_citations(citing_asset_id);
CREATE INDEX IF NOT EXISTS idx_kcit_cited  ON knowledge_citations(cited_asset_id);

-- =============================================================================
-- FPIC RECORDS (Layer 1 — consent governance for indigenous knowledge)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_fpic_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id        UUID         NOT NULL REFERENCES knowledge_assets(id),
    community_id    VARCHAR(200) NOT NULL,
    consent_granted BOOLEAN      NOT NULL DEFAULT FALSE,
    granted_by      TEXT[]       NOT NULL DEFAULT '{}',
    granted_at      TIMESTAMPTZ,
    conditions      TEXT[]       DEFAULT '{}',
    expires_at      TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ,
    revocation_reason TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fpic_asset     ON knowledge_fpic_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_fpic_community ON knowledge_fpic_records(community_id);
CREATE INDEX IF NOT EXISTS idx_fpic_consent   ON knowledge_fpic_records(consent_granted);

-- =============================================================================
-- KNOWLEDGE SEARCH INDEX (Layer 5 — BM25 term statistics)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_search_index (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id        UUID         NOT NULL REFERENCES knowledge_assets(id) ON DELETE CASCADE,
    term            VARCHAR(200) NOT NULL,
    term_frequency  INTEGER      NOT NULL DEFAULT 1,   -- TF: occurrences in this doc
    field           VARCHAR(30)  NOT NULL DEFAULT 'content',  -- title | summary | content | tags
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (asset_id, term, field)
);

CREATE INDEX IF NOT EXISTS idx_ksi_term    ON knowledge_search_index(term);
CREATE INDEX IF NOT EXISTS idx_ksi_asset   ON knowledge_search_index(asset_id);
CREATE INDEX IF NOT EXISTS idx_ksi_tf      ON knowledge_search_index(term_frequency DESC);

-- Materialized view: document frequency per term (for BM25 IDF calculation)
CREATE MATERIALIZED VIEW IF NOT EXISTS knowledge_term_df AS
SELECT
    term,
    field,
    COUNT(DISTINCT asset_id) AS doc_frequency
FROM knowledge_search_index
GROUP BY term, field;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ktdf_term_field ON knowledge_term_df(term, field);

-- =============================================================================
-- QUERY LOG (unified query engine audit)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_query_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_id        UUID         NOT NULL DEFAULT uuid_generate_v4(),
    user_id         UUID,
    query_text      TEXT         NOT NULL,
    intent          VARCHAR(100),  -- classified intent
    layers_used     TEXT[]       DEFAULT '{}',  -- sql | graph | vector | document | hybrid
    result_count    INTEGER      DEFAULT 0,
    latency_ms      INTEGER,
    confidence      DECIMAL(4,3),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kql_user    ON knowledge_query_log(user_id);
CREATE INDEX IF NOT EXISTS idx_kql_intent  ON knowledge_query_log(intent);
CREATE INDEX IF NOT EXISTS idx_kql_created ON knowledge_query_log(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE knowledge_assets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_relationships   ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_fpic_records    ENABLE ROW LEVEL SECURITY;

-- Public assets are readable by everyone
CREATE POLICY ka_public_read ON knowledge_assets
    FOR SELECT USING (access_level = 'public');

-- Authenticated users can read community and institutional assets
CREATE POLICY ka_auth_read ON knowledge_assets
    FOR SELECT TO authenticated
    USING (access_level IN ('public', 'community', 'institutional'));

-- Sacred assets: only service role (FPIC check happens in application layer)
CREATE POLICY ka_sacred_service ON knowledge_assets
    FOR SELECT TO service_role
    USING (TRUE);

-- Entities and relationships follow asset access rules
CREATE POLICY ke_public_read ON knowledge_entities
    FOR SELECT USING (TRUE);  -- entities themselves are not access-controlled; assets are

CREATE POLICY kr_public_read ON knowledge_relationships
    FOR SELECT USING (TRUE);

-- FPIC records: service role only
CREATE POLICY fpic_service_only ON knowledge_fpic_records
    FOR ALL TO service_role USING (TRUE);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION ka_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ka_updated_at
    BEFORE UPDATE ON knowledge_assets
    FOR EACH ROW EXECUTE FUNCTION ka_update_timestamp();

CREATE TRIGGER ke_updated_at
    BEFORE UPDATE ON knowledge_entities
    FOR EACH ROW EXECUTE FUNCTION ka_update_timestamp();

-- Mark previous version as non-latest when a new version is inserted
CREATE OR REPLACE FUNCTION ka_version_control()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.previous_id IS NOT NULL THEN
        UPDATE knowledge_assets SET is_latest = FALSE WHERE id = NEW.previous_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ka_version_on_insert
    AFTER INSERT ON knowledge_assets
    FOR EACH ROW EXECUTE FUNCTION ka_version_control();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Latest version of each asset with citation count
CREATE OR REPLACE VIEW v_knowledge_assets_latest AS
SELECT
    ka.*,
    COALESCE(cite_in.count, 0)  AS incoming_citations,
    COALESCE(cite_out.count, 0) AS outgoing_citations
FROM knowledge_assets ka
LEFT JOIN (
    SELECT cited_asset_id AS asset_id, COUNT(*) AS count
    FROM knowledge_citations GROUP BY cited_asset_id
) cite_in  ON cite_in.asset_id  = ka.id
LEFT JOIN (
    SELECT citing_asset_id AS asset_id, COUNT(*) AS count
    FROM knowledge_citations GROUP BY citing_asset_id
) cite_out ON cite_out.asset_id = ka.id
WHERE ka.is_latest = TRUE;

-- Entity relationship summary
CREATE OR REPLACE VIEW v_entity_connections AS
SELECT
    e.entity_id,
    e.label,
    e.type,
    e.domain,
    COUNT(DISTINCT r_out.id) AS outgoing_relationships,
    COUNT(DISTINCT r_in.id)  AS incoming_relationships,
    COUNT(DISTINCT r_out.id) + COUNT(DISTINCT r_in.id) AS total_connections
FROM knowledge_entities e
LEFT JOIN knowledge_relationships r_out ON r_out.from_entity_id = e.entity_id
LEFT JOIN knowledge_relationships r_in  ON r_in.to_entity_id   = e.entity_id
WHERE e.is_canonical = TRUE
GROUP BY e.entity_id, e.label, e.type, e.domain;

-- Ingestion pipeline health
CREATE OR REPLACE VIEW v_ingestion_health AS
SELECT
    status,
    source_type,
    COUNT(*)                                    AS total,
    AVG(processing_ms)                          AS avg_processing_ms,
    AVG(entities_found)                         AS avg_entities,
    AVG(relationships_found)                    AS avg_relationships,
    MAX(created_at)                             AS last_ingestion
FROM knowledge_ingestion_log
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY status, source_type;

COMMENT ON TABLE knowledge_assets          IS 'Versioned knowledge assets: papers, policies, stories, datasets';
COMMENT ON TABLE knowledge_entities        IS 'Named entities extracted from knowledge assets for graph construction';
COMMENT ON TABLE knowledge_relationships   IS 'Typed relationships between entities forming the knowledge graph';
COMMENT ON TABLE knowledge_ingestion_log   IS 'Audit trail for the knowledge ingestion pipeline';
COMMENT ON TABLE knowledge_embeddings      IS 'Metadata for vector embeddings stored in Weaviate/pgvector';
COMMENT ON TABLE knowledge_citations       IS 'Citation graph between knowledge assets';
COMMENT ON TABLE knowledge_fpic_records    IS 'FPIC consent records for indigenous knowledge assets';
COMMENT ON TABLE knowledge_search_index    IS 'BM25 term frequency index for the information retrieval engine';
COMMENT ON TABLE knowledge_query_log       IS 'Audit log for unified query engine requests';
