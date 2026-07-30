import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'atlas_sanctum',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🌱 Starting database seed...');

    // Create organizations
    console.log('Creating organizations...');
    const orgId = 'org_001';
    await client.query(
      `INSERT INTO organizations (id, name, slug, country_code)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [orgId, 'Atlas Humanitarian', 'atlas-humanitarian', 'KE']
    );

    // Create users
    console.log('Creating users...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const users = [
      { id: 'usr_001', email: 'admin@atlas.org', full_name: 'Super Admin', role: 'super_admin' },
      { id: 'usr_002', email: 'analyst@atlas.org', full_name: 'Amina Noor', role: 'analyst' },
      { id: 'usr_003', email: 'decision@atlas.org', full_name: 'David Ochieng', role: 'decision_maker' },
      { id: 'usr_004', email: 'field@atlas.org', full_name: 'Grace Wanjiku', role: 'field_verifier' },
      { id: 'usr_005', email: 'partner@atlas.org', full_name: 'External Partner', role: 'external_partner' },
    ];

    for (const user of users) {
      await client.query(
        `INSERT INTO users (id, organization_id, email, full_name, role, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [user.id, orgId, user.email, user.full_name, user.role, passwordHash]
      );
    }

    // Create regions (Kenya example)
    console.log('Creating regions...');
    const regions = [
      { id: 'reg_001', name: 'Kenya', level: 'country', code: 'KE', country_code: 'KE' },
      { id: 'reg_010', name: 'Nairobi County', level: 'county', code: 'NRB', country_code: 'KE', parent_id: 'reg_001' },
      { id: 'reg_101', name: 'Nakuru East', level: 'district', code: 'NKE', country_code: 'KE', parent_id: 'reg_010' },
      { id: 'reg_102', name: 'Nakuru West', level: 'district', code: 'NKW', country_code: 'KE', parent_id: 'reg_010' },
      { id: 'reg_201', name: 'Upper Basin', level: 'watershed', code: 'UB', country_code: 'KE', parent_id: 'reg_001' },
    ];

    for (const region of regions) {
      await client.query(
        `INSERT INTO regions (id, parent_id, country_code, level, code, name)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [region.id, region.parent_id || null, region.country_code, region.level, region.code, region.name]
      );
    }

    // Create indicators
    console.log('Creating indicators...');
    const indicators = [
      { id: 'ind_001', code: 'clinic_staff_ratio', name: 'Clinic Staff Ratio', category: 'institutional', unit: 'ratio', aggregation_method: 'weighted_average', directionality: 'higher_is_better' },
      { id: 'ind_002', code: 'water_access_rate', name: 'Water Access Rate', category: 'human', unit: 'percent', aggregation_method: 'weighted_average', directionality: 'higher_is_better' },
      { id: 'ind_003', code: 'rainfall_variability', name: 'Rainfall Variability', category: 'ecological', unit: 'coefficient', aggregation_method: 'average', directionality: 'lower_is_better' },
      { id: 'ind_004', code: 'unemployment_rate', name: 'Unemployment Rate', category: 'economic', unit: 'percent', aggregation_method: 'weighted_average', directionality: 'lower_is_better' },
      { id: 'ind_005', code: 'school_enrollment', name: 'School Enrollment Rate', category: 'human', unit: 'percent', aggregation_method: 'weighted_average', directionality: 'higher_is_better' },
      { id: 'ind_006', code: 'crop_yield', name: 'Crop Yield', category: 'economic', unit: 'tons_per_hectare', aggregation_method: 'average', directionality: 'higher_is_better' },
      { id: 'ind_007', code: 'forest_cover', name: 'Forest Cover', category: 'ecological', unit: 'percent', aggregation_method: 'average', directionality: 'higher_is_better' },
      { id: 'ind_008', code: 'governance_score', name: 'Governance Score', category: 'institutional', unit: 'index', aggregation_method: 'weighted_average', directionality: 'higher_is_better' },
    ];

    for (const indicator of indicators) {
      await client.query(
        `INSERT INTO indicators (id, code, name, category, unit, aggregation_method, directionality)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [indicator.id, indicator.code, indicator.name, indicator.category, indicator.unit, indicator.aggregation_method, indicator.directionality]
      );
    }

    // Create data sources
    console.log('Creating data sources...');
    const dataSourceId = 'src_001';
    await client.query(
      `INSERT INTO data_sources (id, organization_id, name, type, category, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [dataSourceId, orgId, 'Kenya County Health Upload', 'file_upload', 'health', 'Quarterly county-level health indicators', 'usr_002']
    );

    // Create observations
    console.log('Creating observations...');
    const observations = [
      { indicator_id: 'ind_001', region_id: 'reg_101', value: 0.82, unit: 'ratio', observed_at: '2026-03-01' },
      { indicator_id: 'ind_002', region_id: 'reg_101', value: 61.2, unit: 'percent', observed_at: '2026-03-01' },
      { indicator_id: 'ind_003', region_id: 'reg_101', value: 0.35, unit: 'coefficient', observed_at: '2026-03-01' },
      { indicator_id: 'ind_004', region_id: 'reg_101', value: 12.5, unit: 'percent', observed_at: '2026-03-01' },
      { indicator_id: 'ind_005', region_id: 'reg_101', value: 78.3, unit: 'percent', observed_at: '2026-03-01' },
      { indicator_id: 'ind_006', region_id: 'reg_101', value: 2.8, unit: 'tons_per_hectare', observed_at: '2026-03-01' },
      { indicator_id: 'ind_007', region_id: 'reg_101', value: 15.2, unit: 'percent', observed_at: '2026-03-01' },
      { indicator_id: 'ind_008', region_id: 'reg_101', value: 0.65, unit: 'index', observed_at: '2026-03-01' },
    ];

    for (const obs of observations) {
      await client.query(
        `INSERT INTO observations (indicator_id, region_id, source_id, observed_at, value, unit)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [obs.indicator_id, obs.region_id, dataSourceId, obs.observed_at, obs.value, obs.unit]
      );
    }

    // Create model version
    console.log('Creating model version...');
    const modelVersionId = 'mver_001';
    await client.query(
      `INSERT INTO model_versions (id, model_name, version, model_type, status, config_json, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [modelVersionId, 'Fragility Model', 'v1.0', 'fragility', 'approved', '{"weights": {"economic": 0.3, "ecological": 0.25, "institutional": 0.25, "human": 0.2}}', 'usr_001']
    );

    // Create alert rule
    console.log('Creating alert rule...');
    await client.query(
      `INSERT INTO alert_rules (id, organization_id, name, metric, operator, threshold, scope_json, severity, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      ['arule_001', orgId, 'High fragility threshold', 'fragility_score', '>=', 0.75, '{"region_level": "district"}', 'high', 'usr_001']
    );

    // Create project
    console.log('Creating project...');
    const projectId = 'proj_001';
    await client.query(
      `INSERT INTO projects (id, organization_id, region_id, name, type, description, status, start_date, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [projectId, orgId, 'reg_201', 'Upper Basin Watershed Recovery Pilot', 'watershed_restoration', 'Pilot project for watershed restoration in Upper Basin region', 'active', '2026-04-01', '2027-03-31', 'usr_002']
    );

    // Add target metrics to project
    console.log('Adding project target metrics...');
    await client.query(
      `INSERT INTO project_target_metrics (project_id, metric_code, target_value, unit)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [projectId, 'hectares_restored', 1200, 'hectares']
    );

    await client.query(
      `INSERT INTO project_target_metrics (project_id, metric_code, target_value, unit)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [projectId, 'sediment_reduction', 18, 'percent']
    );

    // Create scenario
    console.log('Creating scenario...');
    const scenarioId = 'scn_001';
    await client.query(
      `INSERT INTO scenarios (id, organization_id, region_id, name, intervention_type, baseline_date, budget_amount, currency, duration_months, assumptions_json, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [scenarioId, orgId, 'reg_101', 'Expand rural clinic staffing', 'clinic_staff_expansion', '2026-03-01', 250000, 'USD', 12, '{"staff_increase_pct": 20, "training_completion_rate": 0.8}', 'usr_002']
    );

    // Seed connector registry
    console.log('Seeding connector registry...');
    const connectors = [
      { id: 'ai-connector', domain: 'ai', version: '1.0.0', tags: ['ai', 'aegis', 'agentic'] },
      { id: 'blockchain-connector', domain: 'blockchain', version: '1.0.0', tags: ['blockchain', 'web3', 'dao'] },
      { id: 'fintech-connector', domain: 'fintech', version: '1.0.0', tags: ['fintech', 'payments', 'treasury'] },
      { id: 'iot-edge-connector', domain: 'iot', version: '1.0.0', tags: ['iot', 'edge', 'telemetry'] },
      { id: 'observability-connector', domain: 'observability', version: '1.0.0', tags: ['observability', 'siem'] },
    ];
    for (const c of connectors) {
      await client.query(
        `INSERT INTO connector_registry (id, domain, version, tags)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.domain, c.version, c.tags]
      );
    }

    // Create action
    console.log('Creating action...');
    await client.query(
      `INSERT INTO actions (id, organization_id, region_id, related_scenario_id, type, title, description, owner_user_id, status, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      ['act_001', orgId, 'reg_101', scenarioId, 'funding_allocation', 'Approve rural clinic expansion tranche', 'Allocate initial implementation budget', 'usr_003', 'open', '2026-04-15', 'usr_002']
    );

    await client.query('COMMIT');
    console.log('✅ Database seed completed successfully!');
    console.log('\n📊 Created:');
    console.log('  - 1 organization');
    console.log('  - 5 users (admin, analyst, decision maker, field verifier, partner)');
    console.log('  - 5 regions (Kenya, Nairobi County, Nakuru East/West, Upper Basin)');
    console.log('  - 8 indicators');
    console.log('  - 1 data source');
    console.log('  - 8 observations');
    console.log('  - 1 model version');
    console.log('  - 1 alert rule');
    console.log('  - 1 project with target metrics');
    console.log('  - 1 scenario');
    console.log('  - 1 action');
    console.log('\n🔐 Login credentials:');
    console.log('  Email: admin@atlas.org');
    console.log('  Password: password123');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
