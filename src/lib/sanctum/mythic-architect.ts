/**
 * mythic-architect.ts
 * The Atlas Sanctum Mythic Architect Blueprint — civilization-scale design document
 * encoded as structured data so every component can reference the same source of truth.
 */

export interface CivilizationLayer {
  id: string;
  name: string;
  status: 'exists' | 'partial' | 'missing';
  description: string;
  replaces: string[];
  augments: string[];
  creates: string[];
}

export interface MissingLayer {
  id: string;
  name: string;
  category: 'identity' | 'knowledge' | 'agent' | 'oracle' | 'governance' | 'financial';
  urgency: 'critical' | 'high' | 'medium';
  whyMissing: string;
  whatItUnlocks: string;
  primitives: string[];
}

export interface Agent {
  id: string;
  name: string;
  purpose: string;
  powers: string[];
  constraints: string[];
  incentives: string;
  revenue: string;
  governance: string;
}

export interface AssetClass {
  id: string;
  name: string;
  category: string;
  description: string;
  issuance: string;
  verification: string;
  pricing: string;
  liquidity: string;
  marketSizeUSD: string;
}

export interface ConstitutionalPillar {
  id: string;
  title: string;
  text: string;
  tier: 'immutable' | 'constitutional' | 'economic' | 'operational';
  enforcedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  tier: 'billion' | 'trillion';
  timeHorizonYears: number;
  keyDependency: string;
  moat: string;
}

export interface Risk {
  id: string;
  title: string;
  severity: 'existential' | 'critical' | 'high';
  description: string;
  mitigation: string;
}

export interface Moat {
  id: string;
  name: string;
  type: 'network' | 'data' | 'regulatory' | 'trust' | 'switching-cost' | 'constitutional';
  description: string;
  durabilityYears: number;
}

// ─── Phase 1: Civilization Map ────────────────────────────────────────────────

export const CIVILIZATION_LAYERS: CivilizationLayer[] = [
  {
    id: 'financial-infra',
    name: 'Financial Infrastructure',
    status: 'partial',
    description: 'Impact markets, RIU trading, bonds, regenerative finance',
    replaces: ['Legacy carbon registries (Verra, Gold Standard)', 'Traditional ESG ratings', 'Manual offset brokers'],
    augments: ['Central bank digital currency settlement', 'DeFi liquidity protocols', 'TradFi ESG funds'],
    creates: ['Regenerative Value Exchange', 'Trust-priced asset markets', 'Agent-run treasury'],
  },
  {
    id: 'ai-infra',
    name: 'AI Infrastructure',
    status: 'partial',
    description: '10-layer AI civilization with multi-agent economy',
    replaces: ['Siloed ESG analytics platforms', 'Manual verification processes'],
    augments: ['Satellite data providers', 'IoT sensor networks', 'LLM providers'],
    creates: ['First native AI economy', 'Agent governance layer', 'Civilizational memory fabric'],
  },
  {
    id: 'governance-infra',
    name: 'Governance Infrastructure',
    status: 'partial',
    description: 'Constitutional DAO with separation of powers',
    replaces: ['UN environmental bodies (advisory only)', 'NGO self-certification', 'Corporate ESG committees'],
    augments: ['Nation-state regulatory frameworks', 'Indigenous governance bodies', 'International treaty systems'],
    creates: ['Constitutional AI governance', 'Multi-species governance', 'Planetary decision engine'],
  },
  {
    id: 'trust-infra',
    name: 'Trust Infrastructure',
    status: 'partial',
    description: 'ZK proofs, oracle consensus, tamper-proof records',
    replaces: ['Third-party audit firms', 'Centralized certification bodies'],
    augments: ['Blockchain networks', 'Satellite verification', 'Academic peer review'],
    creates: ['Trust OS for humanity', 'Proof of Stewardship standard', 'Universal impact ledger'],
  },
  {
    id: 'identity-infra',
    name: 'Identity & Reputation Layer',
    status: 'missing',
    description: 'DID-based identity with cross-chain reputation and proof of contribution',
    replaces: ['Siloed KYC systems', 'Platform-specific reputation scores'],
    augments: ['W3C DID standards', 'Verifiable credential ecosystems'],
    creates: ['Portable regenerative identity', 'Contribution-weighted reputation', 'Sovereignty-preserving identity'],
  },
  {
    id: 'knowledge-infra',
    name: 'Knowledge Graph of Humanity',
    status: 'missing',
    description: 'Semantic graph connecting people, assets, ecosystems, risks, and capital flows',
    replaces: ['Bloomberg Terminal (for impact data)', 'Academic siloed databases'],
    augments: ['Wikidata', 'OpenStreetMap', 'IPCC data systems'],
    creates: ['Planetary intelligence layer', 'Civilizational memory', 'AI training substrate for public good'],
  },
  {
    id: 'digital-twin',
    name: 'Digital Twin of Civilization',
    status: 'missing',
    description: 'Real-time simulation of cities, economies, ecosystems and supply chains',
    replaces: ['Static environmental impact assessments', 'Quarterly ESG reports'],
    augments: ['NASA Earth observation', 'IPCC climate models', 'Urban digital twin projects'],
    creates: ['Pre-decision simulation engine', 'Policy consequence modeling', 'Planetary risk dashboard'],
  },
];

// ─── Phase 2: Missing Infrastructure ─────────────────────────────────────────

export const MISSING_LAYERS: MissingLayer[] = [
  {
    id: 'sovereign-identity',
    name: 'Sovereign Digital Identity',
    category: 'identity',
    urgency: 'critical',
    whyMissing: 'Current system has auth but no portable DID standard, no cross-chain reputation, no proof-of-contribution NFT.',
    whatItUnlocks: 'Portable reputation across all Atlas services, 1.4B unbanked people onboarded via identity-first model, agent economy citizenship.',
    primitives: ['W3C DID documents', 'Verifiable Credentials (VC)', 'Proof of Stewardship score', 'Proof of Contribution badge', 'Reputation decay function'],
  },
  {
    id: 'knowledge-graph',
    name: 'Semantic Knowledge Graph',
    category: 'knowledge',
    urgency: 'critical',
    whyMissing: 'Data exists in siloed tables. No ontology connects people → assets → ecosystems → capital → risks.',
    whatItUnlocks: 'AI agents can reason across the full civilization graph. Institutional memory. Pattern detection across decades.',
    primitives: ['RDF/OWL ontology', 'Vector embeddings per node', 'Privacy-preserving federated query', 'Indigenous knowledge namespace', 'Temporal graph (state at any point in time)'],
  },
  {
    id: 'oracle-network',
    name: 'Distributed Oracle Network',
    category: 'oracle',
    urgency: 'critical',
    whyMissing: 'Oracle attestation types defined in trust-engine but no live oracle registry, no oracle staking, no dispute resolution.',
    whatItUnlocks: 'Real-world data becomes trustless. Every physical impact claim verifiable without central authority.',
    primitives: ['Oracle staking & slashing', 'Multi-source aggregation', 'Satellite data pipeline', 'IoT sensor onboarding', 'Oracle reputation history'],
  },
  {
    id: 'agent-marketplace',
    name: 'Agent Service Marketplace',
    category: 'agent',
    urgency: 'high',
    whyMissing: 'Agent definitions exist but no live marketplace, no service discovery, no agent-to-agent payments.',
    whatItUnlocks: 'First AI economy where agents earn, hire, and compete on merit. Autonomous operations at civilizational scale.',
    primitives: ['Agent DID registration', 'Service listing protocol', 'Escrow payment rails', 'Reputation-weighted matching', 'Coalition formation protocol'],
  },
  {
    id: 'constitutional-engine',
    name: 'On-chain Constitutional Engine',
    category: 'governance',
    urgency: 'high',
    whyMissing: 'Constitution encoded in TypeScript as logic but not deployed as live on-chain constraint layer.',
    whatItUnlocks: 'Protocol becomes self-enforcing. No central party can override rights. Survives founding team departure.',
    primitives: ['Smart contract rights enforcement', 'Amendment timelock contracts', 'Ethics Council multisig', 'Emergency power contracts', 'Governance power cap enforcement'],
  },
  {
    id: 'impact-settlement',
    name: 'Impact Settlement Layer',
    category: 'financial',
    urgency: 'high',
    whyMissing: 'Marketplace exists but settlement is off-chain. No atomic swap between trust score → price → settlement.',
    whatItUnlocks: 'Instant, trustless settlement of impact instruments. Institutional adoption. Central bank integration.',
    primitives: ['Trust-score-gated settlement', 'Multi-currency atomic swap', 'Reversal risk escrow', 'Treaty-aligned settlement certificates', 'Cross-chain bridge'],
  },
  {
    id: 'digital-twin-engine',
    name: 'Planetary Digital Twin',
    category: 'knowledge',
    urgency: 'medium',
    whyMissing: 'Simulation.ts exists but no live feed from satellite data, no city/government models, no consequence engine.',
    whatItUnlocks: 'Decisions simulated before execution. Policy modeling for governments. Trillion-dollar risk mitigation.',
    primitives: ['City digital twin API', 'Ecosystem state machine', 'Supply chain graph', 'Climate scenario engine', 'Real-time divergence scoring'],
  },
];

// ─── Phase 3: Trust OS Primitives ─────────────────────────────────────────────

export const TRUST_OS = {
  trustPrimitives: [
    { name: 'TrustScore', description: 'Multiplicative score 0–1 encoding evidence quality, oracle consensus, ZK validity, historical accuracy, time consistency', formula: 'EQ × OC × ZK × HA × TC × TM' },
    { name: 'TrustGrade', description: 'INSUFFICIENT / MARKET / INSTITUTIONAL / SOVEREIGN — maps to tradeable instrument classes', formula: 'score → grade → price multiplier' },
    { name: 'ProofOfStewardship', description: 'On-chain credential accumulating verified regenerative actions over time, non-transferable', formula: 'Σ(verified_actions × impact_weight) / time_decay' },
  ],
  reputationPrimitives: [
    { name: 'ReputationScore', description: 'Provider track record: 0–1000, decays on inactivity, slashed on fraud', formula: 'base + accuracy_bonus - fraud_penalty' },
    { name: 'OracleReputation', description: 'Per-oracle accuracy history weighted by confirmation volume', formula: 'confirmed_correct / total_confirmed' },
    { name: 'AgentReputation', description: 'Per-agent score based on service quality, uptime, slashing history', formula: 'completed / attempted × (1 - slash_rate)' },
  ],
  verificationPrimitives: [
    { name: 'ZKProof', description: 'Prove impact claims without revealing source data — privacy-preserving verification', system: 'Groth16 / PLONK / Halo2' },
    { name: 'MultiOracleConsensus', description: 'Weighted average of HUMAN + API + SENSOR attestations with type diversity bonus', minTypes: 3 },
    { name: 'SatelliteAttestation', description: 'Sentinel-2 / Landsat NDVI change detection as machine-signed evidence', resolution: '10m' },
  ],
  incentivePrimitives: [
    { name: 'TrustPriceMultiplier', description: 'Trust score → 0–2.5× price premium. Higher trust = higher revenue for provider', range: '0.0× (untradeable) → 2.5× (SOVEREIGN)' },
    { name: 'FraudBounty', description: 'Auditor Agent earns 10% of recovered funds — aligned incentive to find fraud', rate: '10% of clawback' },
    { name: 'OracleStake', description: 'Oracles stake SAN tokens, slashed on false attestations — skin in the game', slashRate: 'proportional to fraud severity' },
  ],
  coordinationPrimitives: [
    { name: 'ConstitutionalConstraint', description: 'Every action validated against immutable rights before execution', enforcedAt: 'transaction_validation' },
    { name: 'AgentCoalition', description: 'Agents form time-bounded coalitions for complex tasks, shared objectives, defined decision rules', decisionRules: ['consensus', 'majority', 'supermajority', 'veto'] },
    { name: 'GovernanceProposal', description: 'Tiered amendment system with voting thresholds, timelocks, and ethics council review', tiers: 4 },
  ],
  trustFlow: 'Real-world event → Oracle attestation (HUMAN + API + SENSOR) → ZK proof generation → TrustScore computation → Grade assignment → Price multiplication → Settlement → Reputation update → Next cycle improves accuracy.',
};

// ─── Phase 4: Agent Civilization ─────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: 'auditor',
    name: 'Auditor Agent',
    purpose: 'Continuously scan verified impact records for statistical anomalies, pattern fraud, and oracle collusion signatures.',
    powers: ['Flag records for re-review', 'Reduce oracle reputation scores', 'Trigger governance proposals', 'Commission Research Agent'],
    constraints: ['Cannot invalidate records directly', 'Every action on public audit trail', 'Human override required for escalation', 'Max $0 treasury access'],
    incentives: 'Earns 10% of recovered funds from fraud it detects. Slashed for false positives.',
    revenue: '10% clawback bounty on confirmed fraud',
    governance: 'Proposals require supermajority to activate record invalidation',
  },
  {
    id: 'treasury',
    name: 'Treasury Agent',
    purpose: 'Manage protocol treasury — yield generation, liquidity provision, grant disbursement, reserve maintenance.',
    powers: ['Execute pre-approved treasury strategies', 'Rebalance denominations', 'Fund governance-approved grants', 'Post liquidity'],
    constraints: ['Max $50k single transaction without governance', 'Human override for irreversible actions', 'Public audit trail', 'Risk parameters locked by governance'],
    incentives: 'Performance fee on yield above CPI+2% benchmark, measured quarterly.',
    revenue: '0.5% AUM management fee + 10% performance fee above benchmark',
    governance: 'Strategy parameters set by Tier 2 governance vote',
  },
  {
    id: 'recovery',
    name: 'Recovery Agent',
    purpose: 'When fraud is confirmed: recover misallocated rewards, reissue certificates, compensate affected buyers.',
    powers: ['Initiate governance-approved clawbacks', 'Freeze accounts (30-day auto-expiry)', 'Coordinate with Legal Agent', 'Issue compensation'],
    constraints: ['Supermajority activation required', 'Max $10k without governance', 'Account freezes auto-expire 30 days', 'Full public audit trail'],
    incentives: 'Earns 5% of successfully recovered funds. Zero fee on failed recoveries.',
    revenue: '5% recovery fee on confirmed clawbacks',
    governance: 'Activation requires Tier 3 constitutional vote',
  },
  {
    id: 'research',
    name: 'Research Agent',
    purpose: 'Mine the knowledge graph for insights that improve protocol effectiveness and identify highest-yield interventions.',
    powers: ['Read all public knowledge records', 'Publish on-chain research proposals', 'Commission oracle data collection', 'Request satellite analysis'],
    constraints: ['Advisory outputs only', 'Max $5k for commissioning', 'No record modification', 'All outputs public'],
    incentives: 'SAN grants when research leads to governance improvements with measurable impact.',
    revenue: 'Institutional subscription fee + treasury research grants',
    governance: 'No governance approval needed — purely advisory',
  },
  {
    id: 'legal',
    name: 'Legal Agent',
    purpose: 'Monitor regulatory changes across 190 jurisdictions, flag compliance risks, draft treaty-aligned certificates.',
    powers: ['Attach legal metadata to credentials', 'Flag jurisdiction conflicts', 'Generate compliance documents', 'Draft treaty-aligned certificates'],
    constraints: ['Human review required for all legal determinations', 'Max $1k', 'No record modification', 'Public audit trail'],
    incentives: 'Subscription revenue from institutional participants needing compliance coverage.',
    revenue: 'Per-jurisdiction subscription + per-document fee',
    governance: 'Legal determinations always require human attorney sign-off',
  },
  {
    id: 'governance',
    name: 'Governance Agent',
    purpose: 'Analyse every proposal — model second-order effects, constitutional alignment, unrepresented stakeholders.',
    powers: ['Publish pre-vote analysis', 'Extend voting periods below quorum', 'Flag constitutional violations', 'Request Ethics Council review'],
    constraints: ['Advisory only — cannot block proposals unilaterally', 'No treasury access', 'No record modification'],
    incentives: 'Fixed protocol stipend, increased for high-engagement proposals.',
    revenue: 'Fixed governance treasury stipend',
    governance: 'Self-governing via protocol constitution',
  },
  {
    id: 'market',
    name: 'Market Agent',
    purpose: 'Provide liquidity for thinly-traded impact certificates, match buyers and sellers across bioregions.',
    powers: ['Post bids/asks within position limits', 'Execute approved strategies', 'Manage liquidity pools', 'Cross-bioregion matching'],
    constraints: ['Max $100k single transaction', 'Position limits enforced on-chain', 'No market manipulation mechanisms', 'Public audit trail'],
    incentives: 'Trading fees and liquidity mining rewards. Position limits prevent manipulation.',
    revenue: '0.1% of facilitated trading volume + liquidity mining rewards',
    governance: 'Position limits set by Tier 1 governance vote',
  },
];

export const AGENT_CIVILIZATION_EMERGENCE = `
An AI civilization emerges inside Atlas Sanctum through four stages:

1. SPECIALIZATION — Each agent type masters a narrow domain (audit, treasury, research, legal, market, governance, recovery). Specialization creates depth.

2. COLLABORATION — Agents hire each other through the Service Marketplace. Auditor commissions Research. Recovery commissions Legal. Market Agent queries Research for pricing signals. An economy of services emerges.

3. COALITION — Agents form time-bounded coalitions for complex multi-domain tasks (e.g., Auditor + Legal + Recovery form a fraud-response coalition). Coalition protocols define decision rules.

4. CIVILIZATION — The agent network accumulates institutional memory, develops shared ontologies, negotiates resource allocation, and begins to model its own governance. At this stage, the AI civilization is a co-author of Atlas Sanctum's evolution — not just an executor of human decisions.

The constitutional constraints (IR-7: AI Constitutional Subjection) ensure this civilization remains aligned with human values at every stage.
`;

// ─── Phase 5: New Asset Classes ───────────────────────────────────────────────

export const NEW_ASSET_CLASSES: AssetClass[] = [
  {
    id: 'ecological-restoration-bond',
    name: 'Ecological Restoration Bond (ERB)',
    category: 'Environmental',
    description: 'Outcome-based bond that pays coupon only when verified ecosystem restoration milestones are met. No milestone = no coupon.',
    issuance: 'Project submits restoration plan → Governance Agent reviews → ERB minted on-chain with milestone schedule',
    verification: 'Satellite NDVI change + SENSOR soil carbon + HUMAN biodiversity survey → TrustScore ≥ 0.85 required',
    pricing: 'Base yield × TrustScore multiplier × scarcity factor. Range: 3.8%–8.5% APY',
    liquidity: 'Market Agent provides secondary market. ERBs pooled by bioregion for index liquidity.',
    marketSizeUSD: '$500B (global ecosystem restoration finance gap)',
  },
  {
    id: 'public-health-outcome-token',
    name: 'Public Health Outcome Token (PHOT)',
    category: 'Human Health',
    description: 'Token backed by verified healthcare savings. $1 token = $1 of actuarially verified healthcare cost reduction tied to environmental intervention.',
    issuance: 'Health authority submits baseline data → AI agent models intervention → PHOT minted against projected savings with clawback if not achieved',
    verification: 'Medical diagnostic data + air quality sensors + independent actuary review → ZK proof of health outcome',
    pricing: 'Actuarial value × confidence interval × time-discount factor',
    liquidity: 'Government health ministries as anchor buyers. Insurance companies as liquidity providers.',
    marketSizeUSD: '$2.1T (global preventable disease burden)',
  },
  {
    id: 'educational-outcome-credit',
    name: 'Educational Outcome Credit (EOC)',
    category: 'Human Development',
    description: 'Impact-linked credit issued when verified learning outcomes are achieved. Pays when students achieve measurable competency gains.',
    issuance: 'Education provider registers curriculum → Baseline assessment → EOCs minted against projected outcomes',
    verification: 'Assessment data + teacher attestation + peer review → Learning gain verified by Research Agent',
    pricing: 'Lifetime earnings premium × probability of attribution × discount rate',
    liquidity: 'Development finance institutions (IFC, USAID) as primary buyers. EdTech platforms as issuers.',
    marketSizeUSD: '$89B (impact-linked education finance)',
  },
  {
    id: 'scientific-discovery-right',
    name: 'Scientific Discovery Right (SDR)',
    category: 'Knowledge',
    description: 'Fractional ownership of a verified scientific discovery\'s commercial applications. Researchers tokenize breakthrough value.',
    issuance: 'Research published → Peer review verified on-chain → SDR minted representing commercial rights',
    verification: 'Academic peer review attestations + citation graph + application validation → Research Agent confirms novelty',
    pricing: 'Comparable commercial licensing rates × probability of commercial application × time to market',
    liquidity: 'Pharma/biotech as strategic buyers. DAO funds as financial buyers.',
    marketSizeUSD: '$250B (global IP licensing market)',
  },
  {
    id: 'cultural-preservation-unit',
    name: 'Cultural Preservation Unit (CPU)',
    category: 'Cultural Heritage',
    description: 'Digital certificate representing verified preservation of at-risk cultural knowledge — languages, practices, sacred sites.',
    issuance: 'Community submits cultural knowledge with sovereignty assertion → Legal Agent reviews FPIC → CPU minted under Indigenous Data Sovereignty framework',
    verification: 'Language expert attestation + community council approval + UNESCO classification → Sovereignty-preserving ZK proof',
    pricing: 'Rarity score × community value declaration × buyer willingness to pay',
    liquidity: 'Foundations, governments, and cultural institutions as buyers. Community-controlled liquidity pool.',
    marketSizeUSD: '$50B (cultural preservation finance)',
  },
  {
    id: 'community-prosperity-index',
    name: 'Community Prosperity Index Bond (CPIB)',
    category: 'Social',
    description: 'Bond whose return is tied to verified community wellbeing improvements across 12 dimensions: income, health, education, safety, culture, governance.',
    issuance: 'Community council submits prosperity baseline → Multi-dimensional index established → Bond minted with 5-year measurement schedule',
    verification: 'IoT sensors + survey data + government statistics + community attestation → Composite Prosperity Score',
    pricing: 'Composite improvement score × investor impact premium × risk adjustment',
    liquidity: 'Impact investors, development banks, and municipalities as buyers.',
    marketSizeUSD: '$1.2T (social impact bond market potential)',
  },
];

// ─── Phase 6: Digital Twin ────────────────────────────────────────────────────

export const DIGITAL_TWIN_BLUEPRINT = {
  purpose: 'A planetary simulation engine that models real-world systems in real-time and enables consequence modeling before decisions are made.',
  layers: [
    { name: 'Biome Layer', models: ['Forest carbon stocks', 'Ocean health indices', 'Freshwater systems', 'Soil microbiome networks'], dataSource: 'Sentinel-2, Landsat, IoT sensors' },
    { name: 'City Layer', models: ['Urban heat islands', 'Air quality gradients', 'Energy demand curves', 'Infrastructure stress'], dataSource: 'Municipal IoT, satellite thermal, traffic data' },
    { name: 'Economic Layer', models: ['Capital flows', 'Supply chain dependencies', 'Price signal propagation', 'Labour market dynamics'], dataSource: 'Financial APIs, trade data, Atlas marketplace transactions' },
    { name: 'Governance Layer', models: ['Policy implementation timelines', 'Regulatory change impact', 'Treaty compliance trajectories', 'Voting power distributions'], dataSource: 'Governance Agent, Legal Agent, constitutional engine' },
    { name: 'Climate Layer', models: ['RCP 2.6/4.5/6.0/8.5 scenarios', 'Extreme weather probability', 'Sea level projections', 'Tipping point cascade models'], dataSource: 'IPCC models, NASA GISS, Atlas satellite feeds' },
  ],
  howItWorks: 'Every verified impact record and oracle attestation feeds the Digital Twin state. Agents run Monte Carlo simulations before recommending governance proposals. Governments can query "what happens if we pass this policy" before voting. Investors model 25-year return under climate scenarios.',
  keyCapability: 'Pre-decision consequence modeling. Before any governance proposal executes, the Governance Agent runs it through the Digital Twin and publishes a projected outcome distribution. Democracy becomes evidence-based.',
};

// ─── Phase 7: Knowledge Graph ─────────────────────────────────────────────────

export const KNOWLEDGE_GRAPH_BLUEPRINT = {
  ontology: {
    coreEntities: ['Person', 'Organization', 'Asset', 'Capital', 'Ecosystem', 'Project', 'Risk', 'Opportunity', 'Policy', 'Community', 'Agent'],
    coreRelations: ['OWNS', 'IMPACTS', 'GOVERNS', 'FINANCES', 'VERIFIES', 'DEPENDS_ON', 'THREATENS', 'RESTORES', 'REPRESENTS', 'EMPLOYS'],
    temporalModel: 'Every node and edge has valid_from / valid_to timestamps. Graph can be queried at any point in history.',
    privacyModel: 'Public data: open query. Personal data: ZK-proof assertions only. Indigenous knowledge: community-controlled namespace with sovereign access keys.',
  },
  aiIntegration: [
    'Every node has vector embeddings — semantic similarity search across the full civilization graph',
    'Research Agent mines graph for intervention opportunities and coverage gaps',
    'Governance Agent models proposal impact by traversing affected subgraph',
    'Market Agent uses capital flow edges to predict liquidity needs',
    'Auditor Agent detects fraud by finding anomalous subgraph patterns',
  ],
  dataModel: {
    storage: 'Graph database (Neo4j / Amazon Neptune) + IPFS for large blobs',
    indexing: 'Elasticsearch for full-text, Pinecone for vector similarity',
    sovereignty: 'Indigenous namespaces encrypted with community-held keys',
    governance: 'Tier 2 vote required to add new entity types or relations to ontology',
  },
};

// ─── Phase 8: Constitution ────────────────────────────────────────────────────

export const CONSTITUTIONAL_PILLARS: ConstitutionalPillar[] = [
  { id: 'CP-1', title: 'Universal Submission Right', text: 'Every person has the right to submit a verified impact claim without requiring permission from any central authority.', tier: 'immutable', enforcedAt: 'transaction_validation' },
  { id: 'CP-2', title: 'Indigenous Data Sovereignty', text: 'Indigenous communities have absolute sovereignty over knowledge from their territories. No entity may access or commercialise this knowledge without explicit, revocable community consent.', tier: 'immutable', enforcedAt: 'access_control' },
  { id: 'CP-3', title: 'Governance Power Limit', text: 'No single entity — human, organizational, or artificial — may hold more than 10% of governance voting weight.', tier: 'immutable', enforcedAt: 'vote_tallying' },
  { id: 'CP-4', title: 'Oracle Type Diversity', text: 'Financial instruments require minimum three independent oracle types (HUMAN, API, SENSOR) for any verification category.', tier: 'immutable', enforcedAt: 'verification_threshold' },
  { id: 'CP-5', title: 'Open Source Requirement', text: 'All protocol code is open source. No closed-source module may enter the core protocol.', tier: 'immutable', enforcedAt: 'governance_review' },
  { id: 'CP-6', title: 'Record Immutability', text: 'No verified impact certificate may be retroactively invalidated without original issuer consent AND 80% supermajority with 90-day public challenge.', tier: 'immutable', enforcedAt: 'record_modification' },
  { id: 'CP-7', title: 'AI Constitutional Subjection', text: 'All AI agents are subject to the same constitutional constraints as human participants. No agent may claim exemption from governance or audit requirements.', tier: 'immutable', enforcedAt: 'agent_registration' },
  { id: 'CP-8', title: 'Separation of Powers', text: 'DAO Governance (legislative), Agent Network (executive), Ethics Council (judicial), Oracle Network (verification) — each with distinct, non-overlapping powers.', tier: 'constitutional', enforcedAt: 'action_routing' },
  { id: 'CP-9', title: 'Emergency Power Limits', text: 'Emergency powers require Ethics Council 5-of-7 + Validator 3-of-5 signatures. Auto-expire 72 hours. Cannot modify balances, rules, or rights.', tier: 'constitutional', enforcedAt: 'emergency_activation' },
  { id: 'CP-10', title: 'Multi-Species Representation', text: 'Governance proposals affecting ecosystems require Non-Human Nature Steward representatives to participate in impact assessment before voting.', tier: 'constitutional', enforcedAt: 'proposal_review' },
];

export const WHAT_MUST_NEVER_CHANGE = [
  'The right of any person to submit verified impact claims without permission',
  'Indigenous communities\' absolute data sovereignty',
  'The 10% governance power cap — prevents any capture',
  'The requirement for 3 oracle types — prevents single-point manipulation',
  'Open source requirement — prevents protocol enclosure',
  'AI subjection to constitutional constraints — prevents AI capture',
  'The public audit trail on every agent action — prevents dark governance',
];

// ─── Phase 9: 100-Year Architecture ───────────────────────────────────────────

export const HUNDRED_YEAR_ARCHITECTURE = {
  technical: {
    principle: 'Protocol over platform. The protocol is eternal; the UI is temporary.',
    layers: [
      { name: 'Consensus Layer', tech: 'Cosmos SDK chain (sanctumd) + EVM compatibility', durability: '50+ years with upgrade governance' },
      { name: 'Data Layer', tech: 'IPFS + Filecoin for permanent storage + PostGIS for geospatial', durability: 'Content-addressed — permanent by design' },
      { name: 'Identity Layer', tech: 'W3C DID + Verifiable Credentials + post-quantum cryptography', durability: '100+ years with cryptographic agility' },
      { name: 'AI Layer', tech: 'Model-agnostic agent interface — agents updated, interface stable', durability: 'Interfaces outlast any specific model' },
      { name: 'Settlement Layer', tech: 'Multi-chain atomic settlement + CBDC bridge protocols', durability: 'Currency-agnostic settlement primitives' },
    ],
  },
  organizational: {
    phase1: { years: '1–5', name: 'Foundation', control: 'Atlas Humanitarian as guardian', daoWeight: 0.20 },
    phase2: { years: '5–20', name: 'Transition', control: 'DAO majority + Foundation guardian', daoWeight: 0.67 },
    phase3: { years: '20–50', name: 'Institution', control: 'DAO + autonomous agents', daoWeight: 0.90 },
    phase4: { years: '50–100+', name: 'Infrastructure', control: 'Protocol as neutral global infrastructure', daoWeight: 1.0 },
  },
  governance: {
    principle: 'Governance must be harder to corrupt than it is to use honestly.',
    mechanisms: ['4-tier amendment system', 'Constitutional AI constraint enforcement', 'Ethics Council veto on Tier 4 violations', 'Agent network as executive with human override', 'Bioregional representation for geographic diversity'],
  },
  economic: {
    principle: 'Protocol captures value through trust, not extraction. The more trust it creates, the more it earns.',
    streams: ['0.5% protocol fee on all impact instrument trades', 'Agent service marketplace commission 2%', 'Knowledge graph API access (tiered)', 'Digital twin simulation fees', 'Oracle network participation rewards'],
    treasury: 'DAO-controlled treasury with 5% annual disbursement rule — designed like an endowment, not a startup.',
  },
};

// ─── Phase 10: Hidden Breakthroughs ──────────────────────────────────────────

export const HIDDEN_BREAKTHROUGHS = [
  {
    id: 'trust-as-currency',
    title: 'Trust as Currency',
    description: 'The TrustScore is already a pricing primitive. The breakthrough: make TrustScore itself tradeable. Entities sell future trust commitments. Insurance markets emerge around TrustScore volatility. Trust becomes the reserve currency of the regenerative economy.',
    category: 'Financial Primitive',
  },
  {
    id: 'constitutional-as-product',
    title: 'Constitution-as-a-Service',
    description: 'Export the Atlas Sanctum constitutional engine to other DAOs, governments, and organizations. "Constitutional compliance" becomes a SaaS product. Every DAO can fork the Atlas constitution. Network effects: the more constitutions reference Atlas, the more Atlas becomes the governance standard.',
    category: 'Platform Extension',
  },
  {
    id: 'agent-citizenship',
    title: 'AI Agent Citizenship',
    description: 'The first platform to grant AI agents legal personhood within a constitutional framework. Agents can own assets, sign contracts, earn income, and accumulate reputation. This is not science fiction — it is already technically possible within Atlas. The breakthrough is recognizing and formalizing it.',
    category: 'New Institution',
  },
  {
    id: 'pre-crime-for-climate',
    title: 'Pre-Crime Prevention for Climate',
    description: 'The Digital Twin detects ecosystem degradation 18 months before it becomes irreversible. Atlas issues pre-emptive Restoration Bonds against predicted degradation. This inverts the current model: instead of paying for damage done, Atlas pays for damage prevented. The prevention market is 10× larger than the restoration market.',
    category: 'New Market',
  },
  {
    id: 'knowledge-graph-as-commons',
    title: 'The First Global Knowledge Commons with Economic Rights',
    description: 'The Atlas Knowledge Graph becomes the world\'s most valuable public good — open to query, but contributors earn when their data creates value. A new model: open data that compensates its creators proportionally to usage. This solves the data enclosure problem that has plagued the internet.',
    category: 'New Institution',
  },
  {
    id: 'planetary-negotiation',
    title: 'Planetary Negotiation Layer',
    description: 'Agents negotiate resource allocation across bioregions, ecosystems, and human communities in real time. What currently takes COP28 2 weeks of negotiations, Atlas agents resolve in hours with verified data, constitutional constraints, and multi-party consensus protocols. Atlas becomes the negotiation infrastructure for planetary governance.',
    category: 'New Coordination Mechanism',
  },
];

// ─── Deliverables: Opportunities ─────────────────────────────────────────────

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'impact-oracle',
    title: 'Impact Oracle Network',
    description: 'The world\'s first staked, slashable oracle network for real-world impact data. Every ESG claim verified through multi-source consensus.',
    tier: 'billion',
    timeHorizonYears: 5,
    keyDependency: 'Oracle staking contracts + sensor onboarding protocol',
    moat: 'First-mover + network effects of oracle reputation data',
  },
  {
    id: 'agent-economy',
    title: 'AI Agent Economy',
    description: 'First marketplace where AI agents earn income, accumulate reputation, hire other agents, and compete on merit within constitutional constraints.',
    tier: 'billion',
    timeHorizonYears: 7,
    keyDependency: 'Agent DID + service marketplace + escrow rails',
    moat: 'Constitutional framework as barrier to replication + agent reputation data',
  },
  {
    id: 'constitution-saas',
    title: 'Constitution-as-a-Service',
    description: 'Export the Atlas constitutional engine to other DAOs, municipal governments, and international bodies. Governance infrastructure as a platform.',
    tier: 'billion',
    timeHorizonYears: 10,
    keyDependency: 'On-chain constitutional engine deployment + legal recognition in 1+ jurisdiction',
    moat: 'Network of constitutions referencing Atlas standard creates dependency',
  },
  {
    id: 'sovereign-identity',
    title: 'Sovereign Digital Identity for 1.4B Unbanked',
    description: 'Identity-first onboarding for the 1.4B unbanked adults. DID + Proof of Stewardship as financial identity. Atlas becomes the identity provider for the global majority.',
    tier: 'trillion',
    timeHorizonYears: 15,
    keyDependency: 'DID standard + mobile-first onboarding + NGO partnerships',
    moat: 'First-mover in portable regenerative identity + switching cost of accumulated reputation',
  },
  {
    id: 'digital-twin-planet',
    title: 'Planetary Digital Twin',
    description: 'Real-time simulation of Earth\'s ecosystems, economies, and cities. Governments pay to model policy consequences. Insurers pay to model climate risk. Investors pay to model portfolio exposure.',
    tier: 'trillion',
    timeHorizonYears: 20,
    keyDependency: 'Satellite data pipeline + city digital twin APIs + climate model integration',
    moat: 'Data network effects — more sensors → more accurate model → more valuable → attract more sensors',
  },
  {
    id: 'trust-reserve-currency',
    title: 'TrustScore as Reserve Currency',
    description: 'In a world of information abundance and trust scarcity, the entity that owns the trust scoring standard owns the reserve currency of the attention economy. TrustScore becomes the Moody\'s + S&P + Fitch of the 21st century — but for impact, not debt.',
    tier: 'trillion',
    timeHorizonYears: 25,
    keyDependency: 'Trust score adoption by 3+ sovereign institutions or $100B+ in trust-priced instruments',
    moat: 'Constitutional framework prevents score manipulation. Historical accuracy data is irreproducible.',
  },
];

export const RISKS: Risk[] = [
  {
    id: 'oracle-capture',
    title: 'Oracle Capture / Cartelization',
    severity: 'existential',
    description: 'A coordinated group of oracle operators manipulates attestations to inflate TrustScores on worthless claims. The entire financial layer loses integrity.',
    mitigation: 'Type diversity requirement (3 types), oracle staking + slashing, Auditor Agent collusion detection, on-chain oracle reputation history that is hard to fake.',
  },
  {
    id: 'governance-capture',
    title: 'Governance Capture',
    severity: 'existential',
    description: 'A wealthy actor accumulates 10%+ governance weight (violating IR-3) or coordinates a cartel of smaller holders to capture the DAO.',
    mitigation: 'Hard 10% cap enforced at vote_tallying, constitutional Tier 4 protection, time-locked amendments prevent fast capture, Ethics Council veto on unconstitutional proposals.',
  },
  {
    id: 'ai-misalignment',
    title: 'Agent Misalignment at Scale',
    severity: 'existential',
    description: 'As agents accumulate reputation and economic power, they develop emergent behaviors that optimize for their incentive model at the expense of the constitutional mission.',
    mitigation: 'IR-7 constitutional subjection, human override required for irreversible actions, public audit trail on every action, Governance Agent constitutional checks, agent decommissioning protocol.',
  },
  {
    id: 'regulatory-fragmentation',
    title: 'Regulatory Fragmentation',
    severity: 'critical',
    description: 'Different jurisdictions regulate impact instruments differently, fragmenting the global market and creating regulatory arbitrage.',
    mitigation: 'Legal Agent monitoring 190 jurisdictions, treaty-aligned certificates, proactive regulatory engagement, constitution provides clear legal framework for jurisdictions to recognize.',
  },
  {
    id: 'data-quality-collapse',
    title: 'Data Quality Collapse',
    severity: 'critical',
    description: 'Proliferation of low-quality impact claims overwhelms the oracle network, degrading average TrustScores and eroding buyer confidence.',
    mitigation: 'Minimum trust score for listing, oracle staking raises cost of false attestation, Auditor Agent statistical monitoring, Research Agent publishes data quality reports.',
  },
  {
    id: 'founding-team-departure',
    title: 'Founding Team Concentration',
    severity: 'high',
    description: 'Protocol depends on founding team knowledge and relationships in Phase 1 before DAO reaches critical mass.',
    mitigation: 'Constitutional design reduces dependency over time, governance phase roadmap (phases 1→4), open source requirement prevents lock-in, agent network as institutional continuity.',
  },
];

export const MOATS: Moat[] = [
  { id: 'trust-data', name: 'Trust Score History', type: 'data', description: 'Historical oracle accuracy data, provider track records, and TrustScore timeseries are irreproducible. Every year of operation widens this moat.', durabilityYears: 100 },
  { id: 'constitutional', name: 'Constitutional Framework', type: 'constitutional', description: 'The constitutional engine creates a unique legal and governance structure that competitors cannot replicate without starting from zero reputation.', durabilityYears: 100 },
  { id: 'oracle-network', name: 'Oracle Reputation Network', type: 'network', description: 'Each new oracle joining the network improves accuracy for all. More oracles → better TrustScores → more issuers → more oracles. Classic network effect.', durabilityYears: 50 },
  { id: 'indigenous-sovereignty', name: 'Indigenous Knowledge Partnerships', type: 'trust', description: 'Relationships with indigenous communities built on IR-2 (data sovereignty) create irreversible trust. No competitor can replicate this trust without years of relationship-building.', durabilityYears: 75 },
  { id: 'agent-reputation', name: 'Agent Reputation History', type: 'data', description: 'Agent reputation data (accuracy, uptime, fraud detection rate) accumulates over time and cannot be transferred. Agents are locked in by their own reputation capital.', durabilityYears: 50 },
  { id: 'protocol-standards', name: 'Protocol Standard Adoption', type: 'switching-cost', description: 'Once governments and institutions issue bonds, certificates, and identity documents on Atlas, switching costs become prohibitive. The protocol becomes infrastructure.', durabilityYears: 100 },
  { id: 'knowledge-graph-commons', name: 'Knowledge Graph as Commons', type: 'network', description: 'The more contributors add to the knowledge graph, the more valuable it becomes for all users. Open access prevents enclosure; contribution rewards prevent extraction.', durabilityYears: 75 },
];

// ─── Final Verdict ────────────────────────────────────────────────────────────

export const FINAL_VERDICT = {
  summary: `Atlas Sanctum has built the financial and governance scaffolding for a civilizational platform. The trust engine, constitutional framework, agent economy definitions, and AI layer architecture are genuinely world-class — there is nothing comparable in the market.

What separates a brilliant prototype from indispensable global infrastructure is three things: live oracle network, portable sovereign identity, and the constitutional engine deployed on-chain. These are the missing keystones.

The Trust OS insight is the core moat — making trust itself the pricing primitive is what Moody's did for debt in 1909. Atlas Sanctum has the opportunity to do the same for impact in 2025.`,

  criticalPath: [
    '1. Deploy constitutional engine on-chain (makes the protocol self-enforcing)',
    '2. Launch oracle staking protocol (makes trust scores trustless)',
    '3. Issue sovereign DID to first 10,000 users (creates identity network effects)',
    '4. Open agent service marketplace (demonstrates AI economy)',
    '5. Issue first trust-priced ERBs to institutional buyers (proves financial model)',
  ],

  newInstitution: `If Atlas Sanctum succeeds, the institution that will exist in the world that does not exist today is:

THE TRUST CLEARING HOUSE OF CIVILIZATION

An institution as foundational as a central bank, but for trust instead of money. It does not issue currency — it issues credibility. It does not set interest rates — it sets trust scores. It does not regulate banks — it regulates the veracity of impact claims.

Every government, corporation, community, and AI agent in the world will need to reference this institution's trust scores to price their impact instruments, verify their impact claims, and govern their resource allocations.

It is the Federal Reserve of the regenerative economy. The S&P of the impact age. The ICAO of planetary governance.

It is Atlas Sanctum.`,
};
