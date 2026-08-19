/**
 * Node Zero Seed Script
 *
 * Provisions the minimum data required to start the Node Zero sprint:
 *   - 1 verifier account (admin)
 *   - 5 test farmer accounts (Kiambu County)
 *   - 1 Node Zero carbon project (Kiambu Regenerative Agriculture)
 *
 * Usage:
 *   DATABASE_URL=<url> npx ts-node src/scripts/node-zero-seed.ts
 *
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 */

import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'atlas-node-zero-salt').digest('hex');
}

const VERIFIER = {
  email: 'verifier@atlas-node-zero.org',
  password: 'NodeZero2024!',
  display_name: 'Node Zero Verifier',
  role: 'admin',
};

const FARMERS = [
  { email: 'wanjiku.kamau@kiambu.test', display_name: 'Wanjiku Kamau', phone: '254712345001' },
  { email: 'mwangi.njoroge@kiambu.test', display_name: 'Mwangi Njoroge', phone: '254712345002' },
  { email: 'achieng.otieno@kiambu.test', display_name: 'Achieng Otieno', phone: '254712345003' },
  { email: 'fatuma.hassan@kiambu.test', display_name: 'Fatuma Hassan', phone: '254712345004' },
  { email: 'kipchoge.rotich@kiambu.test', display_name: 'Kipchoge Rotich', phone: '254712345005' },
];

const NODE_ZERO_PROJECT = {
  name: 'Kiambu Regenerative Agriculture — Node Zero',
  description:
    'Pilot node for Atlas Sanctum. 50 smallholder farms in Kiambu County, Kenya. ' +
    'Measuring soil carbon sequestration via Sentinel-2 NDVI proxy and IoT sensors (Month 2). ' +
    'Revenue: carbon credit issuance + verification fee. Payout: M-Pesa B2C.',
  location: 'Kiambu County, Kenya',
  bioregion: 'east-africa-highlands',
  project_type: 'regenerative_agriculture',
  target_co2_reduction: 500,
  area_hectares: 250,
  status: 'approved',
};

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Ensure phone_number column exists (non-blocking)
    await client.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;`
    ).catch(() => {});

    // Seed verifier account
    const verifierResult = await client.query(
      `INSERT INTO users (email, password_hash, display_name, role, email_verified)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
       RETURNING id`,
      [VERIFIER.email, hashPassword(VERIFIER.password), VERIFIER.display_name, VERIFIER.role]
    );
    const verifierId = verifierResult.rows[0].id;
    console.log(`✅ Verifier: ${VERIFIER.email} (id: ${verifierId})`);

    // Seed farmer accounts
    for (const farmer of FARMERS) {
      await client.query(
        `INSERT INTO users (email, password_hash, display_name, role, email_verified, phone_number)
         VALUES ($1, $2, $3, 'farmer', true, $4)
         ON CONFLICT (email) DO UPDATE SET phone_number = EXCLUDED.phone_number`,
        [farmer.email, hashPassword('Farmer2024!'), farmer.display_name, farmer.phone]
      );
      console.log(`✅ Farmer: ${farmer.display_name} (${farmer.phone})`);
    }

    // Seed Node Zero project
    const projectResult = await client.query(
      `INSERT INTO carbon_projects
         (owner_id, name, description, location, bioregion, project_type,
          target_co2_reduction, area_hectares, status, approved_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [
        verifierId,
        NODE_ZERO_PROJECT.name,
        NODE_ZERO_PROJECT.description,
        NODE_ZERO_PROJECT.location,
        NODE_ZERO_PROJECT.bioregion,
        NODE_ZERO_PROJECT.project_type,
        NODE_ZERO_PROJECT.target_co2_reduction,
        NODE_ZERO_PROJECT.area_hectares,
        NODE_ZERO_PROJECT.status,
      ]
    );

    let projectId: string;
    if (projectResult.rows.length > 0) {
      projectId = projectResult.rows[0].id;
      console.log(`✅ Node Zero project created (id: ${projectId})`);
    } else {
      const existing = await client.query(
        `SELECT id FROM carbon_projects WHERE name = $1 LIMIT 1`,
        [NODE_ZERO_PROJECT.name]
      );
      projectId = existing.rows[0]?.id;
      console.log(`ℹ️  Node Zero project already exists (id: ${projectId})`);
    }

    await client.query('COMMIT');

    console.log(`\n🔑 Add to Render environment variables:`);
    console.log(`   NODE_ZERO_PROJECT_ID=${projectId}`);
    console.log(`\n📋 Credentials:`);
    console.log(`   Verifier: ${VERIFIER.email} / ${VERIFIER.password}`);
    console.log(`   Farmers:  <email> / Farmer2024!`);
    console.log(`\n🚀 Next: POST /api/satellite-proxy/ingest`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
