-- Blockchain mint records: server-side minting events
CREATE TABLE IF NOT EXISTS blockchain_mint_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES carbon_projects(id) ON DELETE RESTRICT,
    recipient_address TEXT NOT NULL,
    amount          NUMERIC(28, 18) NOT NULL,
    tx_hash         TEXT NOT NULL UNIQUE,
    minted_by       UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mint_records_project ON blockchain_mint_records(project_id);
CREATE INDEX IF NOT EXISTS idx_mint_records_recipient ON blockchain_mint_records(recipient_address);

-- Blockchain retirement records: user-initiated RIU retirements
CREATE TABLE IF NOT EXISTS blockchain_retirement_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    wallet_address  TEXT NOT NULL,
    project_id      UUID NOT NULL REFERENCES carbon_projects(id) ON DELETE RESTRICT,
    amount          NUMERIC(28, 18) NOT NULL,
    tx_hash         TEXT NOT NULL UNIQUE,
    reason          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_retirement_records_user ON blockchain_retirement_records(user_id);
CREATE INDEX IF NOT EXISTS idx_retirement_records_project ON blockchain_retirement_records(project_id);
CREATE INDEX IF NOT EXISTS idx_retirement_records_wallet ON blockchain_retirement_records(wallet_address);

-- Enable RLS
ALTER TABLE blockchain_mint_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_retirement_records ENABLE ROW LEVEL SECURITY;

-- Admins can see all records; users can see their own mint and retirement records
CREATE POLICY mint_records_admin ON blockchain_mint_records
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY mint_records_own ON blockchain_mint_records
    FOR SELECT USING (
        minted_by = auth.uid()
    );

CREATE POLICY retirement_records_own ON blockchain_retirement_records
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY retirement_records_admin ON blockchain_retirement_records
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
