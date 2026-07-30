-- EthosDAO Collective Tables Migration
-- Creates tables for managing collective workspace members, proposals, achievements, and impact metrics

-- EthosDAO Members Table
CREATE TABLE IF NOT EXISTS ethosdao_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    avatar TEXT,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
    contributions INTEGER DEFAULT 0,
    impact_level VARCHAR(50) DEFAULT 'Medium',
    expertise JSONB DEFAULT '[]',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EthosDAO Proposals Table
CREATE TABLE IF NOT EXISTS ethosdao_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'voting', 'passed', 'rejected')),
    votes_yes INTEGER DEFAULT 0,
    votes_no INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    yes_percent DECIMAL(5, 2) DEFAULT 0,
    proposer_id UUID,
    proposer_name VARCHAR(255),
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EthosDAO Achievements Table
CREATE TABLE IF NOT EXISTS ethosdao_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EthosDAO Impact Metrics Table
CREATE TABLE IF NOT EXISTS ethosdao_impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    change_text VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default impact metrics
INSERT INTO ethosdao_impact_metrics (label, value, change_text, category) VALUES
    ('Carbon Sequestered', '12234', '+19%', 'carbon'),
    ('Water Conserved', '450000000', '+12%', 'water'),
    ('Active Stewards', '2847', '+156', 'stewards'),
    ('Biodiversity Score', '87', 'Above target', 'biodiversity')
ON CONFLICT DO NOTHING;

-- Insert sample achievements
INSERT INTO ethosdao_achievements (title, description, icon, unlocked_at) VALUES
    ('Carbon Neutral Certified', 'Achieved carbon neutrality for 3 consecutive years', 'award', CURRENT_TIMESTAMP),
    ('1000 Projects Funded', 'Land restoration and conservation initiatives', 'trending-up', CURRENT_TIMESTAMP),
    ('Knowledge Shared', '500+ research papers and case studies', 'heart', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample members
INSERT INTO ethosdao_members (name, role, avatar, status, contributions, impact_level, expertise, joined_at) VALUES
    ('Regen Leader', 'Steward', '🌱', 'online', 1247, 'High', '["Regenerative Agriculture", "Carbon Markets"]', CURRENT_TIMESTAMP),
    ('Climate Scientist', 'Researcher', '🔬', 'online', 892, 'High', '["Climate Modeling", "Data Analysis"]', CURRENT_TIMESTAMP),
    ('Community Builder', 'Facilitator', '🤝', 'away', 756, 'Medium', ['Community Engagement', 'Education']', CURRENT_TIMESTAMP),
    ('Tech Innovator', 'Developer', '💻', 'online', 1024, 'High', '["Web3", "Smart Contracts"]', CURRENT_TIMESTAMP),
    ('Biodiversity Expert', 'Ecologist', '🦋', 'offline', 543, 'Medium', '["Ecology", "Conservation"]', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample proposals
INSERT INTO ethosdao_proposals (title, description, status, votes_yes, votes_no, total_votes, yes_percent, proposer_id, proposer_name, ends_at) VALUES
    ('Expand Rainforest Restoration Initiative', 'Launch comprehensive reforestation program in Amazon basin', 'active', 892, 345, 1237, 72.1, gen_random_uuid(), 'Regen Leader', CURRENT_TIMESTAMP + INTERVAL '2 days'),
    ('Launch Coastal Conservation Network', 'Establish mangrove restoration network across East African coast', 'voting', 567, 267, 834, 68.0, gen_random_uuid(), 'Climate Scientist', CURRENT_TIMESTAMP + INTERVAL '5 days'),
    ('Fund Regenerative Agriculture Program', 'Support smallholder farmers with regenerative practices training', 'review', 369, 87, 456, 80.9, gen_random_uuid(), 'Community Builder', CURRENT_TIMESTAMP + INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ethosdao_members_contributions ON ethosdao_members(contributions DESC);
CREATE INDEX IF NOT EXISTS idx_ethosdao_members_status ON ethosdao_members(status);
CREATE INDEX IF NOT EXISTS idx_ethosdao_proposals_status ON ethosdao_proposals(status);
CREATE INDEX IF NOT EXISTS idx_ethosdao_proposals_ends_at ON ethosdao_proposals(ends_at);
CREATE INDEX IF NOT EXISTS idx_ethosdao_metrics_category ON ethosdao_impact_metrics(category);

-- Add comments
COMMENT ON TABLE ethosdao_members IS 'EthosDAO collective members with roles and contributions';
COMMENT ON TABLE ethosdao_proposals IS 'Governance proposals for collective decision making';
COMMENT ON TABLE ethosdao_achievements IS 'Milestones and achievements unlocked by the collective';
COMMENT ON TABLE ethosdao_impact_metrics IS 'Trackable impact metrics for the collective';
