-- Initial schema for Decentralized AI Governance
-- Migration 001

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(66) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(512),
    soulbound_token_id VARCHAR(255),
    voting_power DECIMAL(36, 0) DEFAULT 0,
    reputation_score DECIMAL(5, 2) DEFAULT 0,
    participation_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Member domain expertise
CREATE TABLE IF NOT EXISTS member_domain_expertise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    expertise_score DECIMAL(5, 2) DEFAULT 0,
    rank INT,
    verifications INT DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE,
    UNIQUE(member_id, domain_id)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    image_url VARCHAR(512),
    criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Member badges
CREATE TABLE IF NOT EXISTS member_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transaction_hash VARCHAR(66),
    UNIQUE(member_id, badge_id)
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposer_id UUID REFERENCES members(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    proposal_hash VARCHAR(66),
    proposal_type VARCHAR(50) CHECK (proposal_type IN ('parameter_change', 'treasury_allocation', 'partnership', 'upgrade', 'emergency', 'constitutional')),
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'pending_execution', 'executed', 'rejected', 'defeated', 'expired')),
    voting_mechanism VARCHAR(50) CHECK (voting_mechanism IN ('quadratic', 'conviction', 'holographic', 'futarchy', 'liquid', 'optimistic', 'zk')),
    start_at TIMESTAMP WITH TIME ZONE,
    end_at TIMESTAMP WITH TIME ZONE,
    quorum DECIMAL(5, 2) DEFAULT 0,
    yes_votes DECIMAL(36, 0) DEFAULT 0,
    no_votes DECIMAL(36, 0) DEFAULT 0,
    total_votes DECIMAL(36, 0) DEFAULT 0,
    execution_data JSONB,
    risk_score DECIMAL(5, 2) DEFAULT 0,
    ai_ethics_score DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Proposal choices
CREATE TABLE IF NOT EXISTS proposal_choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    label VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES members(id),
    choice_id UUID REFERENCES proposal_choices(id),
    voting_power DECIMAL(36, 0) DEFAULT 1,
    quadratic_weight DECIMAL(36, 0) DEFAULT 1,
    justification TEXT,
    signature VARCHAR(256),
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proposal_id, voter_id)
);

-- Delegations table
CREATE TABLE IF NOT EXISTS delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegator_id UUID REFERENCES members(id) ON DELETE CASCADE,
    delegate_id UUID REFERENCES members(id) ON DELETE CASCADE,
    voting_power DECIMAL(36, 0) DEFAULT 0,
    domains UUID[], -- Array of domain IDs
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(delegator_id)
);

-- Challenges table (for optimistic governance)
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    challenger_id UUID REFERENCES members(id),
    bond DECIMAL(36, 0) NOT NULL,
    reason TEXT NOT NULL,
    evidence JSONB,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected', 'resolved')),
    valid_votes DECIMAL(36, 0) DEFAULT 0,
    invalid_votes DECIMAL(36, 0) DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Impact certificates
CREATE TABLE IF NOT EXISTS impact_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id),
    certificate_type VARCHAR(50) CHECK (certificate_type IN ('hypercert', 'impact_nft', 'outcome_token')),
    predicted_impact JSONB NOT NULL,
    current_price DECIMAL(36, 0),
    total_supply DECIMAL(36, 0),
    circulating_supply DECIMAL(36, 0),
    maturity_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'mature', 'settled')),
    settlement_value DECIMAL(36, 0),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Retroactive funding rounds
CREATE TABLE IF NOT EXISTS rgf_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    total_funding DECIMAL(36, 0) NOT NULL,
    start_at TIMESTAMP WITH TIME ZONE,
    end_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RPGF projects
CREATE TABLE IF NOT EXISTS rgf_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID REFERENCES rgf_rounds(id),
    contributor_id UUID REFERENCES members(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    impact_report TEXT,
    impact_metrics JSONB,
    funding_requested DECIMAL(36, 0),
    funding_allocated DECIMAL(36, 0),
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'funded', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Impact attestations
CREATE TABLE IF NOT EXISTS impact_attestations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES rgf_projects(id),
    attester_id UUID REFERENCES members(id),
    attestation TEXT,
    impact_rating INT CHECK (impact_rating BETWEEN 1 AND 5),
    signature VARCHAR(256),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Threat detections
CREATE TABLE IF NOT EXISTS threat_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id),
    threat_type VARCHAR(50) CHECK (threat_type IN ('flash_loan', 'sybil_attack', 'vote_buying', 'whale_manipulation', 'treasury_drain', 'coordinated_voting', 'delegation_anomaly')),
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    description TEXT,
    affected_entities JSONB,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'investigating')),
    confidence DECIMAL(5, 2),
    automatic_response TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Governance metrics snapshot
CREATE TABLE IF NOT EXISTS governance_metrics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_proposals INT DEFAULT 0,
    active_proposals INT DEFAULT 0,
    passed_proposals INT DEFAULT 0,
    rejected_proposals INT DEFAULT 0,
    total_voters INT DEFAULT 0,
    active_voters INT DEFAULT 0,
    participation_rate DECIMAL(5, 2) DEFAULT 0,
    average_quorum DECIMAL(5, 2) DEFAULT 0,
    treasury_balance DECIMAL(36, 0) DEFAULT 0,
    total_delegated DECIMAL(36, 0) DEFAULT 0,
    avg_decision_time_seconds INT DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_members_wallet ON members(wallet_address);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_type ON proposals(proposal_type);
CREATE INDEX IF NOT EXISTS idx_votes_proposal ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_delegations_delegator ON delegations(delegator_id);
CREATE INDEX IF NOT EXISTS idx_delegations_delegate ON delegations(delegate_id);
CREATE INDEX IF NOT EXISTS idx_challenges_proposal ON challenges(proposal_id);
CREATE INDEX IF NOT EXISTS idx_rgf_projects_round ON rgf_projects(round_id);

-- Insert default domains
INSERT INTO domains (name, description, color_code) VALUES
    ('AI Safety', 'Research and implementation of AI safety measures', '#FF6B6B'),
    ('Machine Learning', 'Core machine learning research and development', '#4ECDC4'),
    ('Governance', 'Decentralized governance mechanisms', '#45B7D1'),
    ('Economics', 'Token economics and incentive design', '#96CEB4'),
    ('Privacy', 'Privacy-preserving technologies', '#FFEAA7'),
    ('Scalability', 'Network scalability solutions', '#DDA0DD'),
    ('User Experience', 'User interface and experience design', '#F39C12'),
    ('Security', 'Security audits and vulnerability management', '#E74C3C')
ON CONFLICT (name) DO NOTHING;

-- Insert default badges
INSERT INTO badges (name, description, rarity, criteria) VALUES
    ('Early Adopter', 'Member since genesis', 'legendary', '{"min_timestamp": 0}'),
    ('Proposal Master', 'Created 10+ proposals', 'epic', '{"min_proposals": 10}'),
    ('Dedicated Voter', 'Voted on 50+ proposals', 'rare', '{"min_votes": 50}'),
    ('Domain Expert', 'Ranked top 5 in a domain', 'epic', '{"domain_rank": 5}'),
    ('Consistent Participant', '90%+ participation rate', 'rare', '{"min_participation": 90}'),
    ('Ethics Champion', 'High AI ethics score', 'legendary', '{"min_ethics_score": 90}'),
    ('Delegation Master', 'Received 1000+ delegated votes', 'epic', '{"min_delegated": 1000}'),
    ('Challenge Resolver', 'Successfully resolved challenges', 'rare', '{"min_challenges_resolved": 5}')
ON CONFLICT (name) DO NOTHING;
