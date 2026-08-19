/**
 * Atlas Sanctum — Research Integration API
 * Exposes all open research domains as structured, queryable endpoints.
 *
 * Domains integrated:
 *   1. Climate Tipping Points (9 elements, intervention matrix, tipping risk scoring)
 *   2. DAO Governance (constitutional rules, voting thresholds, sub-DAO quorums)
 *   3. Indigenous Knowledge / FPIC (protocols, benefit-sharing, sovereignty rules)
 *
 * All data is cross-referenced with the Neo4j Knowledge Graph for semantic queries.
 *
 * Routes:
 *   GET  /api/v3/research/domains                    — list all research domains
 *   GET  /api/v3/research/climate/tipping-points     — all 9 tipping elements
 *   GET  /api/v3/research/climate/tipping-points/:id — single element + interventions
 *   GET  /api/v3/research/climate/risk-score         — compute tipping risk score
 *   GET  /api/v3/research/governance/constitution    — constitutional principles
 *   GET  /api/v3/research/governance/voting          — voting mechanisms + thresholds
 *   GET  /api/v3/research/governance/sub-daos        — sub-DAO registry
 *   GET  /api/v3/research/fpic/protocols             — FPIC phase protocols
 *   GET  /api/v3/research/fpic/benefit-sharing       — benefit-sharing framework
 *   POST /api/v3/research/fpic/assess                — assess a project for FPIC requirements
 *   GET  /api/v3/research/knowledge-graph/query      — semantic search across all domains
 */

import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import AtlasKnowledgeGraph from '../../../services/analytics/neo4j/KnowledgeGraph';

const router = express.Router();

// ─── Research Domain Registry ─────────────────────────────────────────────────

const RESEARCH_DOMAINS = [
  {
    id: 'climate',
    name: 'Climate Tipping Points & Regenerative Interventions',
    description: 'Earth system tipping elements, proximity thresholds, and regenerative intervention strategies',
    creditTypes: ['carbon', 'biodiversity', 'ocean', 'water'],
    dataSource: 'research/climate/tipping_points_and_regenerative_interventions.md',
    references: ['Lenton et al. 2019', 'Armstrong McKay et al. 2022', 'IPCC AR6 WG1'],
  },
  {
    id: 'governance',
    name: 'DAO Governance for Regenerative Organizations',
    description: 'Constitutional constraints, quadratic voting, indigenous veto rights, seven-generation impact assessment',
    creditTypes: ['governance_token'],
    dataSource: 'research/governance/dao_governance_design_for_regenerative_organizations.md',
    references: ['Buterin 2021', 'Ostrom 1990', 'Zargham et al. 2020', 'UNDRIP 2007'],
  },
  {
    id: 'fpic',
    name: 'Indigenous Knowledge & FPIC Protocols',
    description: 'Free Prior Informed Consent protocols, knowledge sovereignty, benefit-sharing framework',
    creditTypes: ['biodiversity', 'carbon', 'cultural'],
    dataSource: 'research/indigenous-knowledge/fpic_protocols_and_knowledge_sovereignty.md',
    references: ['UNDRIP 2007', 'Nagoya Protocol 2010', 'ILO 169', 'Tuhiwai Smith 2012'],
  },
];

// ─── Climate Tipping Points Data ──────────────────────────────────────────────

const TIPPING_ELEMENTS = [
  {
    id: 'wais',
    name: 'West Antarctic Ice Sheet',
    threshold_celsius: 1.5,
    urgency: 'high',
    reversibility: 'none',
    currentStatus: 'Approaching — Thwaites Glacier retreating 14 km/yr (2023)',
    consequence: '3–5 m sea level rise over centuries',
    atlasDomain: 'climate',
    primaryCreditType: 'carbon',
    interventions: [
      { type: 'rapid_decarbonization', priority: 1, scalability: 'global' },
      { type: 'marine_cloud_brightening', priority: 2, scalability: 'experimental' },
      { type: 'coastal_ecosystem_restoration', priority: 3, scalability: 'regional' },
    ],
    monitoring: { source: 'Copernicus SAR', digitalTwin: 'Antarctic', updateFrequency: '5-day' },
  },
  {
    id: 'greenland',
    name: 'Greenland Ice Sheet',
    threshold_celsius: 1.5,
    urgency: 'low',
    reversibility: 'none',
    currentStatus: 'Net mass loss 280 Gt/yr (2020–2023 average)',
    consequence: '7 m sea level rise (multi-century)',
    atlasDomain: 'climate',
    primaryCreditType: 'carbon',
    interventions: [
      { type: 'arctic_ecosystem_restoration', priority: 1, scalability: 'regional' },
      { type: 'albedo_enhancement_reforestation', priority: 2, scalability: 'regional' },
    ],
    monitoring: { source: 'NASA GRACE-FO', digitalTwin: 'Arctic', updateFrequency: 'monthly' },
  },
  {
    id: 'amazon',
    name: 'Amazon Rainforest Dieback',
    threshold_celsius: 1.5,
    threshold_deforestation_pct: 20,
    urgency: 'critical',
    reversibility: 'medium',
    currentStatus: '~17% deforested; 2023 deforestation rate down 50% from 2022 peak',
    consequence: 'Savannification of 60% of Amazon; 90 Gt CO₂ release',
    atlasDomain: 'climate',
    primaryCreditType: 'carbon',
    secondaryCreditType: 'biodiversity',
    interventions: [
      { type: 'zero_deforestation_supply_chains', priority: 1, scalability: 'global' },
      { type: 'indigenous_land_rights_fpic', priority: 2, scalability: 'regional' },
      { type: 'native_species_reforestation', priority: 3, scalability: 'regional', target_ha: 12_000_000 },
      { type: 'payments_for_ecosystem_services', priority: 4, scalability: 'regional' },
    ],
    monitoring: { source: 'NOAA NDVI + Copernicus', digitalTwin: 'Amazon', updateFrequency: '16-day' },
  },
  {
    id: 'amoc',
    name: 'Atlantic Meridional Overturning Circulation',
    threshold_celsius: 1.8,
    urgency: 'high',
    reversibility: 'very_low',
    currentStatus: 'Weakest in 1,000 years (Caesar et al. 2021)',
    consequence: 'European cooling, Amazon drought, monsoon disruption',
    atlasDomain: 'ocean',
    primaryCreditType: 'carbon',
    interventions: [
      { type: 'freshwater_management', priority: 1, scalability: 'regional' },
      { type: 'ocean_carbon_sequestration_kelp_seagrass', priority: 2, scalability: 'regional' },
    ],
    monitoring: { source: 'RAPID array', digitalTwin: 'Atlantic', updateFrequency: 'continuous' },
  },
  {
    id: 'coral_reefs',
    name: 'Coral Reef Systems',
    threshold_celsius: 1.5,
    urgency: 'critical',
    reversibility: 'low',
    currentStatus: '2023 global bleaching — 54% of reef area affected',
    consequence: 'Loss of 25% of marine biodiversity habitat; 1B people food insecure',
    atlasDomain: 'ocean',
    primaryCreditType: 'ocean',
    secondaryCreditType: 'biodiversity',
    interventions: [
      { type: 'coral_assisted_evolution', priority: 1, scalability: 'local' },
      { type: 'marine_protected_areas_30x30', priority: 2, scalability: 'global' },
      { type: 'local_stressor_reduction', priority: 3, scalability: 'regional' },
      { type: 'ocean_alkalinity_enhancement', priority: 4, scalability: 'experimental' },
    ],
    monitoring: { source: 'NOAA Coral Reef Watch', digitalTwin: 'Coral Triangle', updateFrequency: 'weekly' },
  },
  {
    id: 'permafrost',
    name: 'Permafrost Carbon Feedback',
    threshold_celsius: 2.0,
    urgency: 'high',
    reversibility: 'very_low',
    currentStatus: '1.5M km² showing active thaw (2023)',
    consequence: 'Release of 1,500 Gt carbon + methane hydrates',
    atlasDomain: 'climate',
    primaryCreditType: 'carbon',
    interventions: [
      { type: 'rewilding_large_herbivores', priority: 1, scalability: 'regional', model: 'Pleistocene Park' },
      { type: 'peatland_restoration', priority: 2, scalability: 'regional' },
      { type: 'methane_capture_thaw_lakes', priority: 3, scalability: 'local' },
    ],
    monitoring: { source: 'ESA CCI permafrost', digitalTwin: 'Siberia/Arctic', updateFrequency: 'annual' },
  },
  {
    id: 'boreal_forest',
    name: 'Boreal Forest Dieback',
    threshold_celsius: 3.0,
    urgency: 'medium',
    reversibility: 'medium',
    currentStatus: '2023 Canadian fires released 480 Mt CO₂',
    consequence: 'Loss of 30% of terrestrial carbon sink',
    atlasDomain: 'climate',
    primaryCreditType: 'carbon',
    secondaryCreditType: 'biodiversity',
    interventions: [
      { type: 'fire_adapted_forest_management', priority: 1, scalability: 'regional' },
      { type: 'assisted_species_migration', priority: 2, scalability: 'regional' },
      { type: 'indigenous_led_land_stewardship', priority: 3, scalability: 'regional' },
    ],
    monitoring: { source: 'NASA FIRMS', digitalTwin: 'Boreal', updateFrequency: 'daily' },
  },
  {
    id: 'indian_monsoon',
    name: 'Indian Summer Monsoon Destabilization',
    threshold_celsius: 2.5,
    urgency: 'medium',
    reversibility: 'medium',
    currentStatus: '2023 monsoon 6% below average; increasing variability',
    consequence: 'Food insecurity for 1.4B people',
    atlasDomain: 'agriculture',
    primaryCreditType: 'water',
    interventions: [
      { type: 'watershed_restoration', priority: 1, scalability: 'regional' },
      { type: 'regenerative_agriculture_soil_water', priority: 2, scalability: 'regional' },
      { type: 'aerosol_reduction', priority: 3, scalability: 'global' },
    ],
    monitoring: { source: 'NOAA precipitation', digitalTwin: 'South Asia', updateFrequency: 'daily' },
  },
  {
    id: 'sahel',
    name: 'Sahel Greening / Desertification',
    threshold_celsius: null,
    urgency: 'medium',
    reversibility: 'high',
    currentStatus: 'Partial greening 1982–2015; reversal risk with drought',
    consequence: 'Bidirectional — can tip toward greening or desertification',
    atlasDomain: 'agriculture',
    primaryCreditType: 'biodiversity',
    interventions: [
      { type: 'great_green_wall', priority: 1, scalability: 'continental', nations: 11 },
      { type: 'farmer_managed_natural_regeneration', priority: 2, scalability: 'regional' },
      { type: 'water_harvesting_zai_pits', priority: 3, scalability: 'local' },
    ],
    monitoring: { source: 'MODIS NDVI', digitalTwin: 'Sahel', updateFrequency: '16-day' },
  },
];

// ─── DAO Governance Data ──────────────────────────────────────────────────────

const CONSTITUTIONAL_PRINCIPLES = [
  { id: 1, name: 'Do No Harm', description: 'No proposal may cause net ecological harm as measured by Atlas Sanctum impact scoring', hardBlock: true },
  { id: 2, name: 'Indigenous Sovereignty', description: 'No proposal affecting indigenous territories may proceed without FPIC', hardBlock: true },
  { id: 3, name: 'Seven-Generation Horizon', description: 'All proposals must include a 175-year impact assessment', hardBlock: false },
  { id: 4, name: 'Transparency', description: 'All governance actions are publicly auditable on sanctum-1', hardBlock: false },
  { id: 5, name: 'Reversibility Preference', description: 'Where two paths achieve the same outcome, the more reversible path is preferred', hardBlock: false },
];

const VOTING_THRESHOLDS = [
  { proposalType: 'standard_operational', requiredMajority: 0.51, description: 'Standard operational decisions' },
  { proposalType: 'budget_over_1m', requiredMajority: 0.67, description: 'Budget allocation >$1M' },
  { proposalType: 'constitutional_amendment', requiredMajority: 0.80, description: 'Constitutional amendment' },
  { proposalType: 'critical_ecological_risk', requiredMajority: 0.90, description: 'Critical ecological risk proposals' },
  { proposalType: 'indigenous_territory', requiredMajority: 0.75, additionalRequirement: 'FPIC', description: 'Proposals affecting indigenous territories' },
];

const SUB_DAOS = [
  { id: 'climate-council', name: 'Climate Council', domain: 'Carbon, forests, oceans', minQuorumPct: 0.15 },
  { id: 'health-council', name: 'Health Council', domain: 'Healthcare, nutrition', minQuorumPct: 0.10 },
  { id: 'finance-council', name: 'Finance Council', domain: 'RVX, DeFi, payments', minQuorumPct: 0.20 },
  { id: 'knowledge-council', name: 'Knowledge Council', domain: 'Research, education, TEK', minQuorumPct: 0.10 },
  { id: 'indigenous-council', name: 'Indigenous Council', domain: 'FPIC, territorial rights', minQuorumPct: null, note: 'Community-defined quorum' },
  { id: 'technology-council', name: 'Technology Council', domain: 'AI ethics, security, infrastructure', minQuorumPct: 0.15 },
];

// ─── FPIC Data ────────────────────────────────────────────────────────────────

const FPIC_PHASES = [
  { phase: 1, name: 'Initial Contact', durationWeeks: '1–4', keyActions: ['Identify legitimate community representatives', 'Provide project overview in local language', 'Allow community deliberation time', 'No data collection'] },
  { phase: 2, name: 'Information Sharing', durationWeeks: '4–12', keyActions: ['Detailed project documentation', 'Independent legal/technical support for community', 'Site visits and demonstrations', 'Q&A on community schedule'] },
  { phase: 3, name: 'Deliberation', durationWeeks: '12–24', keyActions: ['Community-led internal deliberation', 'Traditional decision-making processes respected', 'Minimum 90-day deliberation for projects >1,000 ha'] },
  { phase: 4, name: 'Consent Decision', durationWeeks: 'variable', keyActions: ['Decision recorded in community preferred format', 'Consent document specifies scope, duration, data use, benefit-sharing, exit conditions', 'Stored in FPIC vault with community-held encryption key', 'Registered on sanctum-1 as immutable consent record'] },
  { phase: 5, name: 'Ongoing Consent', durationWeeks: 'annual', keyActions: ['Annual consent renewal for multi-year projects', 'Community can modify or revoke at any time', 'Revocation triggers immediate project pause and data deletion'] },
];

const BENEFIT_SHARING = [
  { contributionType: 'TEK used in carbon methodology', minBenefitSharePct: 20, creditType: 'carbon' },
  { contributionType: 'Land stewardship (custodianship)', minBenefitSharePct: 30, creditType: 'all' },
  { contributionType: 'Biodiversity monitoring', minBenefitSharePct: 25, creditType: 'biodiversity' },
  { contributionType: 'Cultural landscape protection', minBenefitSharePct: 15, creditType: 'all' },
  { contributionType: 'Seed/plant knowledge', minBenefitSharePct: 25, creditType: 'derived_products' },
];

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get('/domains', (_req: Request, res: Response) => {
  res.json({ domains: RESEARCH_DOMAINS });
});

// Climate
router.get('/climate/tipping-points', (_req: Request, res: Response) => {
  const { urgency, domain, creditType } = _req.query as Record<string, string>;
  let results = TIPPING_ELEMENTS;
  if (urgency) results = results.filter(e => e.urgency === urgency);
  if (domain) results = results.filter(e => e.atlasDomain === domain);
  if (creditType) results = results.filter(e => e.primaryCreditType === creditType || (e as any).secondaryCreditType === creditType);
  res.json({ elements: results, total: results.length });
});

router.get('/climate/tipping-points/:id', (req: Request, res: Response) => {
  const element = TIPPING_ELEMENTS.find(e => e.id === req.params.id);
  if (!element) return res.status(404).json({ code: 'not_found' });
  res.json(element);
});

router.get('/climate/risk-score', (req: Request, res: Response) => {
  const {
    temperature_anomaly_delta,
    ecosystem_integrity_index,
    human_pressure_index,
    rate_of_change_acceleration,
    regenerative_intervention_coverage,
  } = req.query as Record<string, string>;

  const t = parseFloat(temperature_anomaly_delta ?? '0');
  const e = parseFloat(ecosystem_integrity_index ?? '0.5');
  const h = parseFloat(human_pressure_index ?? '0.5');
  const r = parseFloat(rate_of_change_acceleration ?? '0');
  const i = parseFloat(regenerative_intervention_coverage ?? '0');

  // Research-derived scoring formula
  const riskScore = Math.min(1, Math.max(0,
    (t * 0.35) + ((1 - e) * 0.25) + (h * 0.20) + (r * 0.15) - (i * 0.05)
  ));

  const level = riskScore >= 0.8 ? 'critical' : riskScore >= 0.6 ? 'high' : riskScore >= 0.4 ? 'medium' : 'low';

  res.json({
    riskScore: parseFloat(riskScore.toFixed(3)),
    level,
    inputs: { temperature_anomaly_delta: t, ecosystem_integrity_index: e, human_pressure_index: h, rate_of_change_acceleration: r, regenerative_intervention_coverage: i },
    methodology: 'Atlas Sanctum Tipping Risk Score v1 — based on Armstrong McKay et al. 2022',
  });
});

// Governance
router.get('/governance/constitution', (_req: Request, res: Response) => {
  res.json({ principles: CONSTITUTIONAL_PRINCIPLES, covenantCode: 'sanctum-1:covenant/v1' });
});

router.get('/governance/voting', (_req: Request, res: Response) => {
  res.json({
    mechanisms: ['quadratic_voting', 'reputation_weighted', 'conviction_voting'],
    thresholds: VOTING_THRESHOLDS,
    reputationWeightCap: 0.30,
    convictionDecayFactor: 0.9,
  });
});

router.get('/governance/sub-daos', (_req: Request, res: Response) => {
  res.json({ subDAOs: SUB_DAOS });
});

// FPIC
router.get('/fpic/protocols', (_req: Request, res: Response) => {
  res.json({ phases: FPIC_PHASES, totalMinimumWeeks: 24, ongoingConsentRequired: true });
});

router.get('/fpic/benefit-sharing', (_req: Request, res: Response) => {
  res.json({ framework: BENEFIT_SHARING, paymentFrequency: 'quarterly', currencies: ['fiat', 'stablecoin', 'rvx_credits'] });
});

// POST /fpic/assess — assess whether a project requires FPIC
router.post('/fpic/assess', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { projectAreaHa, indigenousTerritory, knowledgeUsed, locationCoordinates } = req.body;

  const requiresFPIC = !!(indigenousTerritory || knowledgeUsed);
  const extendedDeliberation = projectAreaHa >= 1000;
  const minimumWeeks = extendedDeliberation ? 24 : 16;

  const applicablePhases = FPIC_PHASES.map(p => ({
    ...p,
    durationWeeks: p.phase === 3 && extendedDeliberation ? '12–24 (extended — project >1,000 ha)' : p.durationWeeks,
  }));

  const benefitShareRules = knowledgeUsed
    ? BENEFIT_SHARING.filter(b => knowledgeUsed.includes('carbon') ? b.creditType === 'carbon' || b.creditType === 'all' : true)
    : [];

  res.json({
    requiresFPIC,
    extendedDeliberation,
    minimumWeeks,
    phases: requiresFPIC ? applicablePhases : [],
    benefitShareRules,
    vetoRights: indigenousTerritory ? 'absolute — no override possible' : 'not applicable',
    blockchainRegistration: 'sanctum-1 immutable consent record required',
  });
});

// Knowledge graph semantic search across all research domains
router.get('/knowledge-graph/query', async (req: Request, res: Response) => {
  const { q, domain } = req.query as Record<string, string>;
  if (!q) return res.status(422).json({ code: 'invalid', message: 'q (query) required' });

  try {
    const results = domain
      ? await AtlasKnowledgeGraph.queryByDomain(domain)
      : await AtlasKnowledgeGraph.fullTextSearch(q);

    const stats = await AtlasKnowledgeGraph.stats();

    res.json({
      query: q,
      domain: domain ?? 'all',
      results: results.slice(0, 20),
      total: results.length,
      graphStats: stats,
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
