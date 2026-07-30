# Atlas Humanitarian Platform - Comprehensive Database Architecture

## Executive Summary

This document outlines the complete database architecture for the Atlas Humanitarian platform, designed to support global humanitarian operations with multi-database integration, robust data governance, and compliance with international data protection standards.

## Architecture Overview

### Multi-Database Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ATLAS HUMANITARY PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  PostgreSQL │  │   MongoDB   │  │   Redis     │  │Elasticsearch│        │
│  │  (Primary)   │  │  (Docs)     │  │  (Cache)    │  │  (Search)   │        │
│  │              │  │              │  │              │  │              │        │
│  │ • Donors     │  │ • Case Files│  │ • Sessions   │  │ • Full-Text │        │
│  │ • Payments   │  │ • Media     │  │ • Rate Limit │  │ • Content   │        │
│  │ • Entities   │  │ • Forms     │  │ • Feature    │  │ • Analytics │        │
│  │ • Audit      │  │ • Logs      │  │   Flags      │  │ • Logs      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────────────────────────────────────────────┐   │
│  │   Neo4j     │  │              Data Services Layer                      │   │
│  │  (Graph)    │  │  • Connection Pooling   • Query Optimization         │   │
│  │              │  │  • Transaction Mgmt     • Replication Sync            │   │
│  │ • Relationships││  • Schema Management    • Backup Coordination        │   │
│  │ • Impact     │  │  • Compliance Engine    • Audit Logging             │   │
│  │   Analysis   │  └─────────────────────────────────────────────────────┘   │
│  │ • Traversal  │                                                             │
│  └─────────────┘                                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. PostgreSQL - Relational Data Management

### 1.1 Core Schema Design

#### Users and Authentication
```sql
-- Users table with GDPR compliance fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'beneficiary',
    status user_status NOT NULL DEFAULT 'active',
    
    -- GDPR: Consent management
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP WITH TIME ZONE,
    consent_version VARCHAR(20),
    privacy_policy_accepted BOOLEAN DEFAULT FALSE,
    
    -- Data residency
    data_residency_country ISO_COUNTRY_CODE NOT NULL DEFAULT 'US',
    data_processing_jurisdiction VARCHAR(100),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    
    -- Security
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret_encrypted TEXT,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Roles enumeration
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'organization_admin',
    'field_coordinator',
    'case_manager',
    'donor',
    'beneficiary',
    'volunteer',
    'auditor',
    'api_client'
);

CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification',
    'deleted',
    'data_anonymized'
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'organization_admin'))
    );
```

#### Donors and Organizations
```sql
-- Organizations (NGOs, UN agencies, etc.)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    acronym VARCHAR(50),
    organization_type organization_type NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(50),
    website URL,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    country ISO_COUNTRY_CODE NOT NULL,
    postal_code VARCHAR(20),
    geographic_coordinates POINT,
    
    -- Verification
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    -- Compliance
    compliance_status JSONB DEFAULT '{}',
    risk_level risk_level NOT NULL DEFAULT 'low',
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    CONSTRAINT chk_valid_coordinates CHECK (
        geographic_coordinates IS NULL OR 
        (ST_Y(geographic_coordinates) BETWEEN -90 AND 90 AND
         ST_X(geographic_coordinates) BETWEEN -180 AND 180)
    )
);

-- Donor profiles
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    
    -- Donor details
    donor_type donor_type NOT NULL,
    anonymous_donor BOOLEAN DEFAULT FALSE,
    display_name VARCHAR(255),
    
    -- Giving preferences
    giving_level DECIMAL(15,2),
    preferred_program_areas UUID[],
    giving_frequency giving_frequency,
    recurring_donor BOOLEAN DEFAULT FALSE,
    
    -- Recognition
    recognition_preferences JSONB DEFAULT '{}',
    certificate_requested BOOLEAN DEFAULT FALSE,
    
    -- Compliance
    kyc_status verification_status NOT NULL DEFAULT 'pending',
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    aml_screened BOOLEAN DEFAULT FALSE,
    aml_screened_at TIMESTAMP WITH TIME ZONE,
    
    -- Lifetime giving
    total_lifetime_giving DECIMAL(18,2) DEFAULT 0,
    first_gift_date DATE,
    last_gift_date DATE,
    gift_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_donors_org ON donors(organization_id);
CREATE INDEX idx_donors_type ON donors(donor_type);
CREATE INDEX idx_donors_total_giving ON donors(total_lifetime_giving DESC);
```

#### Financial Transactions
```sql
-- Transactions with ACID compliance
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    project_id UUID,
    campaign_id UUID,
    
    -- Transaction details
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    currency ISO_CURRENCY_CODE NOT NULL DEFAULT 'USD',
    amount DECIMAL(18,2) NOT NULL,
    fee DECIMAL(18,2) DEFAULT 0,
    net_amount DECIMAL(18,2) NOT NULL,
    
    -- Payment method
    payment_method payment_method NOT NULL,
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    
    -- Timestamps
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    reversed_at TIMESTAMP WITH TIME ZONE,
    
    -- Compliance
    receipt_generated BOOLEAN DEFAULT FALSE,
    receipt_sent_at TIMESTAMP WITH TIME ZONE,
    tax_deductible BOOLEAN DEFAULT TRUE,
    tax_receipt_id UUID,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    notes TEXT,
    
    CONSTRAINT chk_positive_amount CHECK (amount > 0)
);

-- Transaction status history for audit
CREATE TABLE transaction_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    previous_status transaction_status,
    new_status transaction_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods enumeration
CREATE TYPE transaction_type AS ENUM (
    'donation',
    'refund',
    'disbursement',
    'fee',
    'adjustment',
    'pledge',
    'recurring'
);

CREATE TYPE transaction_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded',
    'disputed',
    'on_hold'
);

CREATE TYPE payment_method AS ENUM (
    'credit_card',
    'debit_card',
    'bank_transfer',
    'paypal',
    'crypto',
    'check',
    'cash',
    'wire',
    'mobile_money'
);

-- Indexes for performance
CREATE INDEX idx_transactions_donor ON transactions(donor_id, created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status, created_at);
CREATE INDEX idx_transactions_amount ON transactions(amount DESC);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);

-- Materialized view for donor reporting
CREATE MATERIALIZED VIEW donor_summary AS
SELECT 
    d.id,
    d.donor_type,
    COALESCE(o.name, 'Individual') as org_name,
    COUNT(t.id) as total_transactions,
    SUM(t.amount) as total_giving,
    MAX(t.created_at) as last_gift_date,
    AVG(t.amount) as avg_gift_size
FROM donors d
LEFT JOIN transactions t ON t.donor_id = d.id AND t.status = 'completed'
LEFT JOIN organizations o ON o.id = d.organization_id
GROUP BY d.id, d.donor_type, o.name;

CREATE UNIQUE INDEX idx_donor_summary ON donor_summary(id);
```

---

## 2. MongoDB - Document Storage

### 2.1 Collection Design

#### Humanitarian Case Files
```javascript
// Case files collection - flexible schema for varying field operations
const caseFilesCollection = {
    name: 'case_files',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['case_id', 'status', 'created_at', 'created_by'],
            properties: {
                case_id: {
                    bsonType: 'string',
                    description: 'Unique case identifier'
                },
                status: {
                    enum: ['open', 'in_progress', 'pending_review', 'closed', 'archived'],
                    description: 'Current case status'
                },
                priority: {
                    enum: ['critical', 'high', 'medium', 'low'],
                    default: 'medium'
                },
                case_type: {
                    bsonType: 'string',
                    description: 'Type of humanitarian case'
                },
                beneficiaries: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        properties: {
                            beneficiary_id: { bsonType: 'string' },
                            relationship: { bsonType: 'string' },
                            is_primary: { bsonType: 'bool' }
                        }
                    }
                },
                location: {
                    bsonType: 'object',
                    properties: {
                        country: { bsonType: 'string' },
                        region: { bsonType: 'string' },
                        district: { bsonType: 'string' },
                        coordinates: {
                            bsonType: 'object',
                            properties: {
                                type: { enum: ['Point'] },
                                coordinates: { bsonType: 'array', items: { bsonType: 'double' } }
                            }
                        },
                        address: { bsonType: 'string' }
                    }
                },
                assessments: {
                    bsonType: 'array',
                    description: 'Multiple assessments from different time periods'
                },
                interventions: {
                    bsonType: 'array',
                    description: 'Services provided to beneficiaries'
                },
                documents: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'object',
                        properties: {
                            document_id: { bsonType: 'string' },
                            document_type: { bsonType: 'string' },
                            url: { bsonType: 'string' },
                            uploaded_at: { bsonType: 'date' }
                        }
                    }
                },
                timeline: {
                    bsonType: 'array',
                    description: 'Chronological events and updates'
                },
                confidentiality_level: {
                    enum: ['public', 'internal', 'confidential', 'restricted'],
                    default: 'internal'
                },
                created_at: { bsonType: 'date' },
                updated_at: { bsonType: 'date' },
                created_by: { bsonType: 'string' },
                assigned_to: { bsonType: 'string' }
            }
        }
    },
    indexes: [
        { key: { case_id: 1 }, unique: true },
        { key: { status: 1 } },
        { key: { priority: 1, status: 1 } },
        { key: { 'location.coordinates': '2dsphere' } },
        { key: { 'location.country': 1 } },
        { key: { created_at: -1 } },
        { key: { updated_at: -1 } },
        { key: { '$**': 'text' }, weights: { 'description': 10, 'narrative': 5 } }
    ]
};

// Dynamic form submissions - varying schemas
const dynamicFormsCollection = {
    name: 'form_submissions',
    indexes: [
        { key: { form_id: 1, submitted_at: -1 } },
        { key: { 'location.country': 1 } },
        { key: { submitted_by: 1 } },
        { key: { status: 1 } }
    ]
};

// Media assets
const mediaAssetsCollection = {
    name: 'media_assets',
    indexes: [
        { key: { asset_id: 1 }, unique: true },
        { key: { 'metadata.tags': 1 } },
        { key: { 'location.coordinates': '2dsphere' } },
        { key: { 'metadata.campaigns': 1 } },
        { key: { 'compliance.gdpr_consent': 1 } }
    ]
};
```

### 2.2 Document Models

```typescript
// Case File Document Interface
interface CaseFileDocument {
    _id: ObjectId;
    case_id: string;
    status: CaseStatus;
    priority: PriorityLevel;
    case_type: string;
    case_category: string;
    
    beneficiaries: BeneficiaryReference[];
    location: GeoLocation;
    
    // Assessments (array for historical tracking)
    assessments: Assessment[];
    
    // Services provided
    interventions: Intervention[];
    
    // Attachments
    documents: DocumentReference[];
    
    // Timeline
    timeline: TimelineEvent[];
    
    // Financial summary
    funding: {
        allocated: number;
        disbursed: number;
        remaining: number;
        currency: string;
    };
    
    // Outcomes
    outcomes: {
        status: string;
        metrics: Record<string, number>;
        narrative: string;
        closed_at?: Date;
    };
    
    // Compliance
    confidentiality_level: ConfidentialityLevel;
    data_retention_date: Date;
    
    // Audit
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    version: number;
}

interface Assessment {
    assessment_id: string;
    assessment_type: string;
    assessed_by: string;
    assessed_at: Date;
    
    // Flexible assessment data
    data: Record<string, any>;
    
    // Scoring
    scores: {
        vulnerability: number;
        urgency: number;
        feasibility: number;
        impact_potential: number;
    };
    
    // Recommendations
    recommendations: string[];
    
    // Supporting documents
    attachments: string[];
}

interface Intervention {
    intervention_id: string;
    intervention_type: string;
    service_code: string;
    
    start_date: Date;
    end_date?: Date;
    
    provider: {
        organization_id: string;
        staff_ids: string[];
    };
    
    beneficiaries_served: number;
    cost: number;
    currency: string;
    
    outcomes: {
        metric: string;
        target: number;
        actual: number;
        unit: string;
    }[];
    
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}
```

---

## 3. Redis - Caching and Real-Time Features

### 3.1 Cache Strategy

```typescript
// Redis Configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    
    // Connection pool
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
    
    // Cluster mode
    cluster: {
        enabled: process.env.REDIS_CLUSTER_ENABLED === 'true',
        nodes: [
            { host: 'redis-node-1', port: 6379 },
            { host: 'redis-node-2', port: 6379 },
            { host: 'redis-node-3', port: 6379 }
        ]
    }
};

// Cache Keys Namespace
const CACHE_KEYS = {
    SESSION: 'sess:',
    USER: 'usr:',
    DONOR: 'don:',
    CASE: 'case:',
    ORG: 'org:',
    RATE_LIMIT: 'rl:',
    FEATURE_FLAG: 'ff:',
    LEADERBOARD: 'lb:',
    COUNTER: 'cnt:',
    QUEUE: 'q:',
    
    // Key patterns
    sessionTTL: 86400,        // 24 hours
    userTTL: 3600,            // 1 hour
    caseTTL: 1800,            // 30 minutes
    rateLimitWindow: 900,     // 15 minutes
    featureFlagTTL: 300       // 5 minutes
};

// Session Management
class SessionCache {
    private redis: Redis;
    
    async createSession(sessionId: string, data: SessionData): Promise<void> {
        const key = `${CACHE_KEYS.SESSION}${sessionId}`;
        await this.redis.setex(
            key,
            CACHE_KEYS.sessionTTL,
            JSON.stringify({
                ...data,
                created_at: new Date().toISOString(),
                last_activity: new Date().toISOString()
            })
        );
        
        // Add to user's session set
        const userSessionsKey = `${CACHE_KEYS.USER}${data.user_id}:sessions`;
        await this.redis.sadd(userSessionsKey, sessionId);
        await this.redis.expire(userSessionsKey, CACHE_KEYS.sessionTTL);
    }
    
    async getSession(sessionId: string): Promise<SessionData | null> {
        const key = `${CACHE_KEYS.SESSION}${sessionId}`;
        const data = await this.redis.get(key);
        if (!data) return null;
        
        // Update last activity
        const session = JSON.parse(data);
        session.last_activity = new Date().toISOString();
        await this.redis.setex(key, CACHE_KEYS.sessionTTL, JSON.stringify(session));
        
        return session;
    }
    
    async invalidateSession(sessionId: string, userId: string): Promise<void> {
        const sessionKey = `${CACHE_KEYS.SESSION}${sessionId}`;
        const userSessionsKey = `${CACHE_KEYS.USER}${userId}:sessions`;
        
        await Promise.all([
            this.redis.del(sessionKey),
            this.redis.srem(userSessionsKey, sessionId)
        ]);
    }
}

// Rate Limiting
class RateLimiter {
    private redis: Redis;
    private windowSeconds: number;
    private maxRequests: number;
    
    async checkRateLimit(
        identifier: string, 
        endpoint: string
    ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
        const key = `${CACHE_KEYS.RATE_LIMIT}${endpoint}:${identifier}`;
        const now = Date.now();
        const windowStart = now - (this.windowSeconds * 1000);
        
        // Remove old entries
        await this.redis.zremrangebyscore(key, 0, windowStart);
        
        // Count current requests
        const count = await this.redis.zcard(key);
        
        if (count >= this.maxRequests) {
            // Get oldest entry's timestamp for reset time
            const oldest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
            const resetAt = parseInt(oldest[1]) + (this.windowSeconds * 1000);
            
            return {
                allowed: false,
                remaining: 0,
                resetAt
            };
        }
        
        // Add current request
        await this.redis.zadd(key, now, `${now}-${Math.random()}`);
        await this.redis.expire(key, this.windowSeconds);
        
        return {
            allowed: true,
            remaining: this.maxRequests - count - 1,
            resetAt: now + (this.windowSeconds * 1000)
        };
    }
}

// Feature Flags
class FeatureFlags {
    private redis: Redis;
    
    async getFlag(flagKey: string, userId?: string): Promise<FeatureFlagValue> {
        const key = `${CACHE_KEYS.FEATURE_FLAG}${flagKey}`;
        const flag = await this.redis.get(key);
        
        if (!flag) {
            return { enabled: false, value: null, source: 'default' };
        }
        
        const flagData = JSON.parse(flag);
        
        // Check user targeting
        if (flagData.targeting && userId) {
            if (flagData.targeting.users?.includes(userId)) {
                return { enabled: true, value: flagData.value, source: 'user_targeted' };
            }
            
            const userPercentage = this.hashForPercentage(userId, flagData.name);
            if (userPercentage <= flagData.targeting.percentage) {
                return { enabled: true, value: flagData.value, source: 'percentage' };
            }
        }
        
        return {
            enabled: flagData.enabled,
            value: flagData.value,
            source: 'global'
        };
    }
    
    async setFlag(flagKey: string, value: any, options?: FlagOptions): Promise<void> {
        const key = `${CACHE_KEYS.FEATURE_FLAG}${flagKey}`;
        const flagData = {
            name: flagKey,
            enabled: true,
            value,
            targeting: options?.targeting || null,
            updated_at: new Date().toISOString(),
            updated_by: options?.updatedBy
        };
        
        await this.redis.setex(key, CACHE_KEYS.featureFlagTTL, JSON.stringify(flagData));
    }
}
```

---

## 4. Elasticsearch - Full-Text Search

### 4.1 Index Configuration

```json
{
    "settings": {
        "number_of_shards": 3,
        "number_of_replicas": 2,
        "analysis": {
            "analyzer": {
                "multilingual_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "asciifolding",
                        "multilingual_stemmer"
                    ]
                },
                "autocomplete_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "asciifolding",
                        "autocomplete_filter"
                    ]
                }
            },
            "filter": {
                "multilingual_stemmer": {
                    "type": "stemmer",
                    "language": ["english", "french", "spanish", "arabic", "swahili"]
                },
                "autocomplete_filter": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 20
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "content_id": { "type": "keyword" },
            "content_type": { "type": "keyword" },
            
            // Multi-language text fields
            "title": {
                "type": "text",
                "analyzer": "multilingual_analyzer",
                "fields": {
                    "raw": { "type": "keyword" },
                    "autocomplete": {
                        "type": "text",
                        "analyzer": "autocomplete_analyzer"
                    }
                }
            },
            "description": {
                "type": "text",
                "analyzer": "multilingual_analyzer"
            },
            "content": {
                "type": "text",
                "analyzer": "multilingual_analyzer"
            },
            
            // Metadata
            "language": { "type": "keyword" },
            "countries": { "type": "keyword" },
            "regions": { "type": "keyword" },
            "topics": { "type": "keyword" },
            "tags": { "type": "keyword" },
            
            // Date filters
            "created_at": { "type": "date" },
            "updated_at": { "type": "date" },
            "published_at": { "type": "date" },
            
            // Access control
            "access_levels": { "type": "keyword" },
            "organization_ids": { "type": "keyword" },
            
            // Boost factors
            "boost": {
                "type": "float",
                "default": 1.0
            },
            
            // Geolocation
            "location": { "type": "geo_point" },
            
            // Aggregations
            "stats": {
                "properties": {
                    "views": { "type": "integer" },
                    "shares": { "type": "integer" },
                    "relevance_score": { "type": "float" }
                }
            }
        }
    }
}
```

### 4.2 Search Implementation

```typescript
// Elasticsearch Client Configuration
const elasticConfig = {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USER,
        password: process.env.ELASTICSEARCH_PASSWORD
    },
    maxRetries: 3,
    requestTimeout: 30000,
    sniffOnStart: true
};

// Case Files Search
class CaseSearchService {
    private client: Client;
    private indexName = 'atlas_case_files';
    
    async searchCases(params: CaseSearchParams): Promise<SearchResults<CaseSearchResult>> {
        const { 
            query, 
            countries, 
            status, 
            priority,
            dateRange,
            location,
            page = 1, 
            limit = 20 
        } = params;
        
        const must: QueryDslQueryContainer[] = [];
        const filter: QueryDslQueryContainer[] = [];
        
        // Full-text search
        if (query) {
            must.push({
                multi_match: {
                    query,
                    fields: ['title^3', 'description^2', 'content', 'narrative'],
                    type: 'best_fields',
                    fuzziness: 'AUTO'
                }
            });
        }
        
        // Filters
        if (countries?.length) {
            filter.push({ terms: { countries } });
        }
        
        if (status?.length) {
            filter.push({ terms: { status } });
        }
        
        if (priority?.length) {
            filter.push({ terms: { priority } });
        }
        
        if (dateRange) {
            filter.push({
                range: {
                    created_at: {
                        gte: dateRange.start,
                        lte: dateRange.end
                    }
                }
            });
        }
        
        if (location) {
            filter.push({
                geo_distance: {
                    distance: location.radius || '50km',
                    location: {
                        lat: location.lat,
                        lon: location.lng
                    }
                }
            });
        }
        
        const searchBody = {
            from: (page - 1) * limit,
            size: limit,
            query: {
                bool: {
                    must: must.length ? must : [{ match_all: {} }],
                    filter
                }
            },
            sort: [
                { _score: { order: 'desc' } },
                { created_at: { order: 'desc' } }
            ],
            highlight: {
                fields: {
                    description: {},
                    content: { fragment_size: 150 }
                }
            },
            aggs: {
                by_status: { terms: { field: 'status' } },
                by_priority: { terms: { field: 'priority' } },
                by_country: { terms: { field: 'countries', size: 20 } }
            }
        };
        
        const response = await this.client.search({
            index: this.indexName,
            body: searchBody
        });
        
        return this.formatSearchResults(response, page, limit);
    }
    
    async indexCase(caseData: CaseDocument): Promise<void> {
        await this.client.index({
            index: this.indexName,
            id: caseData.case_id,
            body: caseData,
            refresh: 'wait_for'
        });
    }
}

// Multi-language search support
class MultilingualSearch {
    async search(
        query: string, 
        languages: string[] = ['en', 'fr', 'es', 'ar']
    ): Promise<SearchResult[]> {
        const searches = languages.map(lang => ({
            index: `atlas_${lang}`,
            body: {
                query: {
                    match: {
                        [`content.${lang}`]: {
                            query,
                            fuzziness: 'AUTO'
                        }
                    }
                }
            }
        }));
        
        const response = await this.client.msearch({ body: searches });
        return this.mergeResults(response);
    }
}
```

---

## 5. Neo4j - Graph Database

### 5.1 Graph Schema

```cypher
// Entity Labels
:Beneficiary {
    id: UUID!,
    name: String!,
    demographic: String,
    location: Point,
    status: String,
    created_at: DateTime
}

:Donor {
    id: UUID!,
    name: String!,
    type: String,
    giving_level: String,
    total_giving: Float,
    anonymous: Boolean
}

:Organization {
    id: UUID!,
    name: String!,
    type: String!,
    sector: String,
    country: String,
    verified: Boolean
}

:Project {
    id: UUID!,
    name: String!,
    status: String,
    budget: Float,
    start_date: DateTime,
    end_date: DateTime
}

:Location {
    id: UUID!,
    name: String!,
    type: String,
    country: String,
    coordinates: Point
}

:Case {
    id: UUID!,
    case_id: String!,
    status: String,
    priority: String,
    created_at: DateTime
}

// Relationship Types
(:Beneficiary)-[:PARTICIPATES_IN]->(:Case)
(:Beneficiary)-[:LOCATED_AT]->(:Location)
(:Beneficiary)-[:RECEIVES_AID_FROM]->(:Organization)

(:Donor)-[:FUNDS]->(:Project)
(:Donor)-[:SUPPORTS]->(:Organization)
(:Donor)-[:GIVES_TO]->(:Case)

(:Organization)-[:IMPLEMENTS]->(:Project)
(:Organization)-[:SERVES]->(:Location)
(:Organization)-[:PARTNERS_WITH]->(:Organization)

(:Case)-[:LOCATED_IN]->(:Location)
(:Case)-[:FUNDED_BY]->(:Donor)
(:Case)-[:ASSIGNED_TO]->(:Organization)
```

### 5.2 Impact Analysis Queries

```cypher
// Find all beneficiaries impacted by a donor's contributions
MATCH (donor:Donor {id: $donorId})-[:FUNDS]->(case:Case)-[:PARTICIPATES_IN]->(beneficiary:Beneficiary)
RETURN beneficiary, case, donor
ORDER BY case.created_at DESC

// Find path between donor and beneficiary through organization
MATCH path = (donor:Donor)-[*1..3]-(beneficiary:Beneficiary)
WHERE donor.id = $donorId AND beneficiary.id = $beneficiaryId
RETURN path, length(path) as hops

// Find collaborative networks for resource allocation
MATCH (org:Organization)-[:PARTNERS_WITH]->(partner:Organization)
WHERE org.sector = $sector
WITH org, collect(partner) as partners
RETURN org, partners, size(partners) as network_size
ORDER BY network_size DESC

// Impact analysis: Track aid distribution across regions
MATCH (location:Location)<-[:LOCATED_IN]-(case:Case)-[:FUNDED_BY]->(donor:Donor)
WHERE case.status = 'completed'
WITH location, 
     count(DISTINCT case) as cases,
     count(DISTINCT donor) as funders,
     collect(DISTINCT donor.name) as donor_names
RETURN location.name, cases, funders, donor_names
ORDER BY cases DESC

// Find underserved areas requiring resources
MATCH (location:Location)
OPTIONAL MATCH (location)<-[:LOCATED_IN]-(case:Case)
WITH location, count(case) as case_count
WHERE case_count < 5
RETURN location, case_count
ORDER BY case_count ASC
```

### 5.3 Graph Service Implementation

```typescript
class GraphDatabaseService {
    private driver: Driver;
    private session: Session;
    
    async connect(): Promise<void> {
        this.driver = neo4j.driver(
            process.env.NEO4J_URI || 'bolt://localhost:7687',
            neo4j.auth.basic(
                process.env.NEO4J_USER || 'neo4j',
                process.env.NEO4J_PASSWORD || 'password'
            )
        );
        await this.driver.verifyConnectivity();
    }
    
    // Create entities
    async createEntity(label: string, properties: Record<string, any>): Promise<any> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                `CREATE (n:${label} $props) RETURN n`,
                { props: properties }
            );
            return result.records[0].get('n').properties;
        } finally {
            await session.close();
        }
    }
    
    // Create relationships
    async createRelationship(
        fromLabel: string, 
        fromId: string, 
        toLabel: string, 
        toId: string,
        relationshipType: string,
        properties?: Record<string, any>
    ): Promise<void> {
        const session = this.driver.session();
        try {
            await session.run(
                `
                MATCH (from:${fromLabel} {id: $fromId})
                MATCH (to:${toLabel} {id: $toId})
                CREATE (from)-[r:${relationshipType}]->(to)
                SET r = $props
                RETURN r
                `,
                { fromId, toId, props: properties || {} }
            );
        } finally {
            await session.close();
        }
    }
    
    // Traverse relationships for impact analysis
    async findImpactPath(
        startId: string, 
        endId: string, 
        maxHops: number = 5
    ): Promise<any[]> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                `
                MATCH path = (start)-[*1..${maxHops}]-(end)
                WHERE start.id = $startId AND end.id = $endId
                RETURN path, length(path) as hops
                ORDER BY hops ASC
                LIMIT 1
                `,
                { startId, endId }
            );
            
            if (result.records.length === 0) return [];
            
            return this.parsePath(result.records[0].get('path'));
        } finally {
            await session.close();
        }
    }
    
    // Find all connected entities for resource allocation
    async findConnectedNetwork(
        entityId: string, 
        entityType: string,
        depth: number = 2
    ): Promise<NetworkResult> {
        const session = this.driver.session();
        try {
            const result = await session.run(
                `
                MATCH (start:${entityType} {id: $entityId})
                CALL apoc.path.subgraphAll(start, {maxLevel: $depth})
                YIELD nodes, relationships
                RETURN nodes, relationships
                `,
                { entityId, depth }
            );
            
            return this.formatNetwork(result);
        } finally {
            await session.close();
        }
    }
}
```

---

## 6. Data Governance Framework

### 6.1 Data Ownership Model

```typescript
interface DataOwnership {
    entityType: string;
    owner: {
        role: string;
        organization?: string;
    };
    stewards: {
        role: string;
        permissions: Permission[];
    }[];
    retentionPolicy: RetentionPolicy;
    complianceRequirements: ComplianceRequirement[];
}

const DATA_OWNERSHIP_MODEL: DataOwnership[] = [
    {
        entityType: 'beneficiary',
        owner: { role: 'organization_admin' },
        stewards: [
            { role: 'case_manager', permissions: ['read', 'update'] },
            { role: 'field_coordinator', permissions: ['read', 'create', 'update'] }
        ],
        retentionPolicy: {
            duration: 'P10Y',
            action: 'anonymize',
            exceptions: ['legal_hold']
        },
        complianceRequirements: ['GDPR', 'HIPAA']
    },
    {
        entityType: 'donor',
        owner: { role: 'organization_admin' },
        stewards: [
            { role: 'fundraising_manager', permissions: ['read', 'update'] }
        ],
        retentionPolicy: {
            duration: 'P7Y',
            action: 'delete',
            exceptions: ['tax_records']
        },
        complianceRequirements: ['GDPR', 'PCI_DSS']
    },
    {
        entityType: 'transaction',
        owner: { role: 'finance_director' },
        stewards: [
            { role: 'accountant', permissions: ['read', 'create'] },
            { role: 'auditor', permissions: ['read'] }
        ],
        retentionPolicy: {
            duration: 'P7Y',
            action: 'archive',
            exceptions: ['audit_trail']
        },
        complianceRequirements: ['SOX', 'PCI_DSS']
    }
];
```

### 6.2 Referential Integrity

```typescript
class ReferentialIntegrityService {
    private pgPool: Pool;
    private mongoDb: Db;
    
    // Validate foreign key relationships
    async validateRelationship(
        fromCollection: string,
        fromId: string,
        toCollection: string,
        toId: string
    ): Promise<boolean> {
        // PostgreSQL check
        if (this.isPostgresCollection(fromCollection)) {
            const result = await this.pgPool.query(
                `SELECT 1 FROM ${fromCollection} WHERE id = $1`,
                [fromId]
            );
            return result.rows.length > 0;
        }
        
        // MongoDB check
        const document = await this.mongoDb
            .collection(fromCollection)
            .findOne({ _id: fromId });
        return document !== null;
    }
    
    // Cascade delete with audit
    async cascadeDelete(
        collection: string,
        id: string,
        reason: string,
        deletedBy: string
    ): Promise<CascadeResult> {
        const session = await this.pgPool.connect();
        try {
            await session.query('BEGIN');
            
            // Get all dependent relationships
            const dependencies = await this.getDependencies(collection, id);
            
            // Create audit entries
            for (const dep of dependencies) {
                await session.query(
                    `INSERT INTO deletion_audit 
                     (entity_type, entity_id, deleted_by, reason, deleted_at, cascade_from)
                     VALUES ($1, $2, $3, $4, NOW(), $5)`,
                    [dep.type, dep.id, deletedBy, reason, id]
                );
            }
            
            // Perform deletions
            const deleted: string[] = [];
            for (const dep of dependencies) {
                await this.deleteEntity(dep.type, dep.id);
                deleted.push(`${dep.type}:${dep.id}`);
            }
            
            await session.query('COMMIT');
            
            return {
                success: true,
                deletedEntities: deleted,
                auditEntry: {
                    primaryEntity: `${collection}:${id}`,
                    deletedBy,
                    reason,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            await session.query('ROLLBACK');
            throw error;
        } finally {
            session.release();
        }
    }
}
```

### 6.3 Indexing Strategy

```typescript
// PostgreSQL Index Strategy
const POSTGRES_INDEXES = {
    // Primary key indexes (automatic)
    
    // Foreign key indexes
    foreignKeyIndexes: [
        { table: 'transactions', column: 'donor_id', name: 'idx_transactions_donor' },
        { table: 'transactions', column: 'organization_id', name: 'idx_transactions_org' },
        { table: 'donors', column: 'user_id', name: 'idx_donors_user', unique: true },
        { table: 'case_files', column: 'assigned_to', name: 'idx_cases_assigned' }
    ],
    
    // Composite indexes for common queries
    compositeIndexes: [
        {
            name: 'idx_transactions_status_date',
            columns: ['status', 'created_at DESC'],
            description: 'Filter by status and sort by date'
        },
        {
            name: 'idx_donors_giving_type',
            columns: ['donor_type', 'total_lifetime_giving DESC'],
            description: 'Sort donors by type and giving level'
        },
        {
            name: 'idx_cases_priority_status',
            columns: ['priority', 'status'],
            description: 'Filter cases by priority and status'
        }
    ],
    
    // Partial indexes for specific use cases
    partialIndexes: [
        {
            name: 'idx_active_cases',
            condition: "status IN ('open', 'in_progress')",
            description: 'Index only active cases'
        },
        {
            name: 'idx_completed_transactions',
            condition: "status = 'completed'",
            description: 'Index completed transactions for reporting'
        }
    ],
    
    // GIN indexes for JSONB
    jsonbIndexes: [
        {
            name: 'idx_user_preferences',
            column: 'preferences',
            type: 'gin',
            description: 'Index user preferences for personalization'
        }
    ],
    
    // Geospatial indexes
    geospatialIndexes: [
        {
            name: 'idx_locations_coordinates',
            column: 'coordinates',
            type: 'gist',
            description: 'Spatial queries for location-based searches'
        }
    ]
};

// MongoDB Index Strategy
const MONGO_INDEXES = {
    caseFiles: [
        { key: { case_id: 1 }, unique: true },
        { key: { status: 1, priority: 1 } },
        { key: { 'location.coordinates': '2dsphere' } },
        { key: { '$all': 'text' }, weights: { description: 10, narrative: 5 } },
        { key: { created_at: -1 } },
        { key: { 'beneficiaries.beneficiary_id': 1 } }
    ],
    
    formSubmissions: [
        { key: { form_id: 1, submitted_at: -1 } },
        { key: { status: 1 } },
        { key: { submitted_by: 1 } }
    ],
    
    mediaAssets: [
        { key: { asset_id: 1 }, unique: true },
        { key: { 'metadata.tags': 1 } },
        { key: { 'compliance.gdpr_consent': 1 } }
    ]
};
```

---

## 7. Data Migration and Versioning

### 7.1 Migration Framework

```typescript
interface Migration {
    id: string;
    version: string;
    description: string;
    up: (db: Database) => Promise<void>;
    down: (db: Database) => Promise<void>;
    validate: () => Promise<MigrationValidation>;
    createdAt: Date;
    checksum: string;
}

class MigrationManager {
    private migrations: Map<string, Migration> = new Map();
    private executedMigrations: Set<string> = new Set();
    
    async runMigrations(targetVersion?: string): Promise<MigrationResult[]> {
        const results: MigrationResult[] = [];
        const sortedMigrations = this.sortMigrations();
        
        for (const migration of sortedMigrations) {
            if (targetVersion && migration.version > targetVersion) {
                break;
            }
            
            if (this.executedMigrations.has(migration.id)) {
                continue;
            }
            
            try {
                // Validate migration pre-conditions
                const validation = await migration.validate();
                if (!validation.valid) {
                    results.push({
                        migrationId: migration.id,
                        status: 'skipped',
                        reason: validation.errors.join(', ')
                    });
                    continue;
                }
                
                // Execute migration
                await migration.up(this.db);
                
                // Record execution
                await this.recordMigration(migration);
                this.executedMigrations.add(migration.id);
                
                results.push({
                    migrationId: migration.id,
                    status: 'success',
                    executedAt: new Date().toISOString()
                });
            } catch (error) {
                results.push({
                    migrationId: migration.id,
                    status: 'failed',
                    error: (error as Error).message
                });
                
                // Run rollback
                await this.runRollback(migration);
                
                throw error;
            }
        }
        
        return results;
    }
    
    async createMigration(
        description: string,
        up: MigrationScript,
        down: MigrationScript
    ): Promise<Migration> {
        const id = generateMigrationId();
        const version = this.calculateNextVersion();
        const timestamp = new Date();
        
        const migration: Migration = {
            id,
            version,
            description,
            up,
            down,
            validate: async () => ({ valid: true, errors: [] }),
            createdAt: timestamp,
            checksum: calculateChecksum(up.toString())
        };
        
        // Write migration file
        await this.writeMigrationFile(migration);
        
        return migration;
    }
}

// Example Migration
const migration_001_add_case_geolocation: Migration = {
    id: '001_add_case_geolocation',
    version: '1.1.0',
    description: 'Add geolocation support to case files',
    
    up: async (db) => {
        // Add location field to MongoDB
        await db.collection('case_files').updateMany(
            { location: { $exists: false } },
            { $set: { location: null, location_coordinates: null } }
        );
        
        // Add geospatial index
        await db.collection('case_files').createIndex(
            { 'location.coordinates': '2dsphere' }
        );
        
        // Add PostgreSQL column
        await db.query(`
            ALTER TABLE cases 
            ADD COLUMN IF NOT EXISTS 
            geographic_coordinates POINT;
        `);
        
        // Update procedures
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_cases_geography 
            ON cases USING GIST (geographic_coordinates);
        `);
    },
    
    down: async (db) => {
        await db.collection('case_files').dropIndex(
            'location.coordinates_2dsphere'
        );
        
        await db.query(`
            ALTER TABLE cases 
            DROP COLUMN IF EXISTS geographic_coordinates;
        `);
    },
    
    createdAt: new Date('2024-01-15'),
    checksum: 'abc123...'
};
```

---

## 8. Backup and Disaster Recovery

### 8.1 Backup Strategy

```typescript
interface BackupConfig {
    postgres: {
        fullBackup: { schedule: string; retention: number };
        incrementalBackup: { interval: number; retention: number };
        pointInTimeRecovery: { enabled: boolean; retention: number };
    };
    mongodb: {
        fullBackup: { schedule: string; retention: number };
        oplogBackup: { interval: number; retention: number };
    };
    redis: {
        snapshotBackup: { schedule: string; retention: number };
        appendOnlyFile: { enabled: boolean; fsync: string };
    };
    elasticsearch: {
        snapshotBackup: { schedule: string; retention: number };
        crossCluster: { enabled: boolean };
    };
    neo4j: {
        fullBackup: { schedule: string; retention: number };
        consistencyCheck: { schedule: string };
    };
}

class BackupService {
    private pgPool: Pool;
    private mongoDb: Db;
    private redis: Redis;
    private elasticClient: Client;
    private neo4jDriver: Driver;
    
    async performFullBackup(): Promise<BackupResult> {
        const backupId = generateBackupId();
        const startTime = Date.now();
        
        try {
            // PostgreSQL backup
            const pgResult = await this.backupPostgres(backupId);
            
            // MongoDB backup
            const mongoResult = await this.backupMongoDB(backupId);
            
            // Redis backup
            const redisResult = await this.backupRedis(backupId);
            
            // Elasticsearch snapshot
            const esResult = await this.backupElasticsearch(backupId);
            
            // Neo4j backup
            const neo4jResult = await this.backupNeo4j(backupId);
            
            const duration = Date.now() - startTime;
            
            return {
                backupId,
                status: 'success',
                startTime: new Date(startTime).toISOString(),
                endTime: new Date().toISOString(),
                duration,
                components: {
                    postgres: pgResult,
                    mongodb: mongoResult,
                    redis: redisResult,
                    elasticsearch: esResult,
                    neo4j: neo4jResult
                },
                size: this.calculateTotalSize(),
                checksum: await this.generateChecksum(backupId)
            };
        } catch (error) {
            return {
                backupId,
                status: 'failed',
                error: (error as Error).message,
                startTime: new Date(startTime).toISOString()
            };
        }
    }
    
    private async backupPostgres(backupId: string): Promise<ComponentBackupResult> {
        const backupPath = `/backups/postgres/${backupId}`;
        
        // Use pg_dump for logical backup
        const { stdout, stderr } = await execAsync(
            `pg_dump -h ${process.env.PG_HOST} \
             -U ${process.env.PG_USER} \
             -d ${process.env.PG_DATABASE} \
             -Fc \
             -f ${backupPath}/full.dump`
        );
        
        // Verify backup
        await execAsync(`pg_restore --list ${backupPath}/full.dump > ${backupPath}/toc.txt`);
        
        // Calculate checksum
        const checksum = await this.calculateFileChecksum(`${backupPath}/full.dump`);
        
        // Upload to object storage
        await this.uploadToStorage(
            `${backupPath}/full.dump`,
            `s3://${this.bucket}/backups/postgres/${backupId}/full.dump`
        );
        
        return {
            path: `${backupPath}/full.dump`,
            size: await this.getFileSize(`${backupPath}/full.dump`),
            checksum,
            uploaded: true
        };
    }
    
    async restoreFromBackup(backupId: string, pointInTime?: Date): Promise<RestoreResult> {
        const startTime = Date.now();
        
        try {
            // Stop application traffic
            await this.enableMaintenanceMode();
            
            // Stop services
            await this.stopServices();
            
            // Restore each component
            await this.restorePostgres(backupId, pointInTime);
            await this.restoreMongoDB(backupId);
            await this.restoreRedis(backupId);
            await this.restoreElasticsearch(backupId);
            await this.restoreNeo4j(backupId);
            
            // Verify integrity
            await this.verifyDataIntegrity();
            
            // Restart services
            await this.startServices();
            await this.disableMaintenanceMode();
            
            return {
                status: 'success',
                backupId,
                duration: Date.now() - startTime,
                verified: true
            };
        } catch (error) {
            await this.disableMaintenanceMode();
            throw error;
        }
    }
}
```

### 8.2 Disaster Recovery Procedures

```typescript
interface DisasterRecoveryPlan {
    rto: number; // Recovery Time Objective (hours)
    rpo: number; // Recovery Point Objective (hours)
    procedures: DisasterProcedure[];
    contacts: Contact[];
    runbooks: Runbook[];
}

const DISASTER_RECOVERY_PLAN: DisasterRecoveryPlan = {
    rto: 4, // 4 hours
    rpo: 1, // 1 hour data loss max
    
    procedures: [
        {
            id: 'DR-001',
            name: 'Primary Database Failure',
            severity: 'critical',
            steps: [
                {
                    order: 1,
                    action: 'Detect failure',
                    automated: true,
                    tool: 'health_check'
                },
                {
                    order: 2,
                    action: 'Promote replica to primary',
                    automated: true,
                    command: 'patronictl promote'
                },
                {
                    order: 3,
                    action: 'Update DNS/connection strings',
                    automated: true,
                    tool: 'service_discovery'
                },
                {
                    order: 4,
                    action: 'Verify data consistency',
                    automated: false,
                    manualSteps: [
                        'Run consistency check queries',
                        'Verify transaction counts',
                        'Check for orphaned records'
                    ]
                }
            ]
        },
        {
            id: 'DR-002',
            name: 'Region Outage',
            severity: 'critical',
            steps: [
                {
                    order: 1,
                    action: 'Activate disaster recovery site',
                    automated: false,
                    approval: 'DR_COORDINATOR'
                },
                {
                    order: 2,
                    action: 'Restore from cross-region backup',
                    automated: false
                },
                {
                    order: 3,
                    action: 'Update global load balancer',
                    automated: false
                },
                {
                    order: 4,
                    action: 'Notify stakeholders',
                    automated: true,
                    tool: 'notification_service'
                }
            ]
        }
    ],
    
    runbooks: [
        {
            id: 'RB-001',
            title: 'Database Recovery',
            content: `
## Objective
Restore database service after primary failure

## Prerequisites
- Access to monitoring dashboard
- SSH access to database servers
- Backup verification access

## Steps
1. Confirm failure in monitoring
2. Check replica lag
3. Decide on promotion vs restore
4. Execute recovery steps
5. Verify application connectivity
6. Run smoke tests
            `
        }
    ]
};
```

---

## 9. GDPR and Compliance

### 9.1 Data Subject Rights Implementation

```typescript
class GDPRComplianceService {
    async processDataSubjectRequest(request: DataSubjectRequest): Promise<void> {
        const { type, requestId, userId, details } = request;
        
        switch (type) {
            case 'access':
                await this.exportUserData(userId, requestId);
                break;
            case 'rectification':
                await this.rectifyUserData(userId, details);
                break;
            case 'erasure':
                await this.eraseUserData(userId, requestId);
                break;
            case 'portability':
                await this.exportPortableData(userId, requestId);
                break;
            case 'restriction':
                await this.restrictUserData(userId, details);
                break;
            case 'objection':
                await this.recordObjection(userId, details);
                break;
        }
    }
    
    private async eraseUserData(userId: string, requestId: string): Promise<void> {
        const session = await this.pgPool.connect();
        try {
            await session.query('BEGIN');
            
            // 1. Anonymize personal data in PostgreSQL
            await session.query(
                `UPDATE users 
                 SET email = $1, 
                     name = 'ANONYMIZED',
                     phone = NULL,
                     deleted_at = NOW(),
                     data_anonymized = TRUE
                 WHERE id = $2`,
                [`deleted_${requestId}@anonymized.local`, userId]
            );
            
            // 2. Anonymize in MongoDB case files
            await this.mongoDb.collection('case_files').updateMany(
                { 'beneficiaries.beneficiary_id': userId },
                { 
                    $set: {
                        'beneficiaries.$.name': 'ANONYMIZED',
                        'beneficiaries.$.contact': null,
                        'beneficiaries.$.anonymized_at': new Date()
                    }
                }
            );
            
            // 3. Remove from Redis cache
            await this.redis.del(`usr:${userId}:*`);
            
            // 4. Remove from Elasticsearch
            await this.elasticClient.deleteByQuery({
                index: 'atlas_*',
                body: {
                    query: {
                        term: { 'metadata.user_id': userId }
                    }
                }
            });
            
            // 5. Remove from Neo4j relationships
            await this.neo4jSession.run(
                `MATCH (n {id: $userId}) DETACH DELETE n`,
                { userId }
            );
            
            // 6. Record the erasure
            await session.query(
                `INSERT INTO gdpr_requests 
                 (request_id, user_id, request_type, status, completed_at)
                 VALUES ($1, $2, 'erasure', 'completed', NOW())`,
                [requestId, userId]
            );
            
            await session.query('COMMIT');
        } catch (error) {
            await session.query('ROLLBACK');
            throw error;
        } finally {
            session.release();
        }
    }
    
    private async exportUserData(userId: string, requestId: string): Promise<void> {
        const exportData: ExportPackage = {
            requestId,
            generatedAt: new Date().toISOString(),
            format: 'json',
            data: {}
        };
        
        // Collect from PostgreSQL
        const pgData = await this.pgPool.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        );
        exportData.data.users = pgData.rows;
        
        // Collect from MongoDB
        const mongoData = await this.mongoDb
            .collection('case_files')
            .find({ 'beneficiaries.beneficiary_id': userId })
            .toArray();
        exportData.data.case_files = mongoData;
        
        // Collect transactions
        const transactionData = await this.pgPool.query(
            `SELECT * FROM transactions WHERE donor_id = $1`,
            [userId]
        );
        exportData.data.transactions = transactionData.rows;
        
        // Add data portability format
        exportData.data.portability = {
            format: 'json',
            schema_version: '1.0',
            exported_at: new Date().toISOString()
        };
        
        // Store for download
        await this.storeExport(exportData);
        
        // Notify user
        await this.notifyUser(userId, 'data_export_ready', { requestId });
    }
}
```

### 9.2 Audit Logging

```typescript
interface AuditLog {
    id: string;
    timestamp: Date;
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    changes: {
        before: Record<string, any>;
        after: Record<string, any>;
    };
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    result: 'success' | 'failure';
    error?: string;
}

class AuditService {
    async log(params: AuditLogParams): Promise<void> {
        const entry: AuditLog = {
            id: uuidv4(),
            timestamp: new Date(),
            ...params,
            result: 'success'
        };
        
        // Write to PostgreSQL audit table
        await this.pgPool.query(
            `INSERT INTO audit_logs 
             (id, user_id, action, resource_type, resource_id, 
              changes_before, changes_after, ip_address, user_agent, session_id, result)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                entry.id,
                entry.userId,
                entry.action,
                entry.resourceType,
                entry.resourceId,
                JSON.stringify(entry.changes?.before || {}),
                JSON.stringify(entry.changes?.after || {}),
                entry.ipAddress,
                entry.userAgent,
                entry.sessionId,
                entry.result
            ]
        );
        
        // Also write to MongoDB for flexible querying
        await this.mongoDb.collection('audit_logs').insertOne(entry);
    }
    
    async query(params: AuditQueryParams): Promise<AuditLog[]> {
        const query: any = {};
        
        if (params.userId) query.userId = params.userId;
        if (params.action) query.action = params.action;
        if (params.resourceType) query.resourceType = params.resourceType;
        if (params.resourceId) query.resourceId = params.resourceId;
        if (params.startDate || params.endDate) {
            query.timestamp = {};
            if (params.startDate) query.timestamp.$gte = params.startDate;
            if (params.endDate) query.timestamp.$lte = params.endDate;
        }
        
        return this.mongoDb
            .collection('audit_logs')
            .find(query)
            .sort({ timestamp: -1 })
            .limit(params.limit || 100)
            .toArray();
    }
}
```

---

## 10. Performance Optimization

### 10.1 Query Optimization

```sql
-- Example: Optimized query for donor list with aggregations
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
WITH donor_totals AS (
    SELECT 
        d.id,
        COUNT(t.id) as transaction_count,
        SUM(t.amount) as total_giving,
        MAX(t.created_at) as last_gift,
        ARRAY_AGG(DISTINCT p.program_area) FILTER (WHERE p.program_area IS NOT NULL) as programs
    FROM donors d
    LEFT JOIN transactions t ON t.donor_id = d.id AND t.status = 'completed'
    LEFT JOIN projects p ON p.id = t.project_id
    WHERE d.status = 'active'
    GROUP BY d.id
)
SELECT 
    dt.*,
    u.email,
    u.created_at as donor_since,
    o.name as organization_name
FROM donor_totals dt
JOIN users u ON u.id = dt.id
LEFT JOIN organizations o ON o.id = dt.organization_id
WHERE dt.total_giving > 1000
ORDER BY dt.total_giving DESC
LIMIT 100;

-- Result shows:
-- -> Hash Right Join  (cost=245.67..312.45 rows=1000)
--    Hash Cond: (u.id = dt.id)
-- -> Seq Scan on donors d  (cost=0.00..45.23 rows=1000)
-- Filter: (status = 'active')
-- -> Hash  (cost=145.67..145.67 rows=500)
--    -> GroupAggregate  (cost=145.23..145.67 rows=500)
--        Group Key: d.id
--        -> Sort  (cost=145.12..145.23 rows=500)
--            Sort Key: d.id
--            -> Nested Loop Left Join  (cost=45.12..95.67 rows=500)
--                -> Index Scan on donors d  (cost=0.12..8.45 rows=100)
-- Index Cond: (status = 'active')
```

### 10.2 Connection Pooling

```typescript
// PostgreSQL Connection Pool Configuration
const postgresPoolConfig = {
    // Pool size
    min: 2,
    max: 20,
    
    // Connection timeout
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    
    // Statement timeout
    statement_timeout: 30000,
    
    // Prepared statements
    max: 100,
    
    // Failover
    targetSessionAttrs: 'read-write'
};

// MongoDB Connection Pool
const mongoPoolConfig = {
    maxPoolSize: 100,
    minPoolSize: 10,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    
    // Replica set
    replicaSet: {
        readPreference: 'primaryPreferred',
        secondaryAcceptableLatencyMS: 15
    }
};

// Redis Cluster
const redisClusterConfig = {
    scaleReads: 'slave',
    redisOptions: {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true
    }
};
```

---

## Summary

This comprehensive database architecture provides:

1. **PostgreSQL**: ACID-compliant storage for donors, transactions, and entities with row-level security
2. **MongoDB**: Flexible document storage for case files and dynamic forms with geospatial support
3. **Redis**: High-performance caching for sessions, rate limiting, and feature flags
4. **Elasticsearch**: Full-text search across multilingual content with advanced analyzers
5. **Neo4j**: Graph database for relationship mapping and impact analysis
6. **Data Governance**: Ownership, retention, and compliance frameworks
7. **Backup/Recovery**: Comprehensive DR procedures with RTO/RPO objectives
8. **GDPR Compliance**: Data subject rights implementation and audit logging

All components integrate through a unified data services layer providing consistent connection management, query optimization, and cross-database transactions where needed.