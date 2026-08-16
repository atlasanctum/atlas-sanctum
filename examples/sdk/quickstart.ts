/**
 * Atlas Sanctum SDK — Quick Start Example
 *
 * Run: npx ts-node examples/sdk/quickstart.ts
 * Requires: ATLAS_API_URL and ATLAS_API_TOKEN env vars
 */

import { AtlasSanctumClient } from '../../packages/sdk/index.js';

const client = new AtlasSanctumClient({
  apiUrl: process.env.ATLAS_API_URL ?? 'https://api.atlassanctum.com',
  token:  process.env.ATLAS_API_TOKEN,
});

async function main() {
  console.log('🌍 Atlas Sanctum SDK — Quick Start\n');

  // ── 1. Planetary Metrics ──────────────────────────────────────────────────
  const metrics = await client.impact.getPlanetaryMetrics();
  if (metrics.ok) {
    const m = metrics.data;
    console.log('📊 Planetary Metrics');
    console.log(`  Carbon budget remaining: ${m.carbonBudgetRemainingGt} Gt`);
    console.log(`  Biodiversity intactness: ${m.biodiversityIntactnessIndex}%`);
    console.log(`  Hectares protected:      ${m.hectaresProtected.toLocaleString()}`);
    console.log(`  Carbon verification:     ${(m.carbonVerificationRate * 100).toFixed(1)}%\n`);
  }

  // ── 2. List Impact Projects ───────────────────────────────────────────────
  const projects = await client.impact.listProjects({ status: 'verified', pageSize: 3 });
  if (projects.ok) {
    console.log('🌱 Verified Projects (first 3)');
    for (const p of projects.data.data) {
      console.log(`  [${p.type}] ${p.name} — ${p.carbonSequesteredTonnes.toLocaleString()} tCO₂`);
    }
    console.log();
  }

  // ── 3. Governance Proposals ───────────────────────────────────────────────
  const proposals = await client.governance.listProposals({ status: 'voting' });
  if (proposals.ok) {
    console.log('🏛 Active Governance Proposals');
    for (const p of proposals.data.data) {
      console.log(`  [${p.type}] ${p.title}`);
      console.log(`    Deadline: ${p.votingDeadline}`);
    }
    console.log();
  }

  // ── 4. AI Ecological Assessment ───────────────────────────────────────────
  const aiResult = await client.ai.process({
    type: 'ecological_assessment',
    location: { lat: -3.4, lng: -62.2, bioregion: 'amazon-basin' },
    context: {
      ndvi: 0.72,
      deforestationRateHaYr: 11000,
      explanation: 'Routine quarterly assessment of Amazon Basin health',
      restoration_path: 'Reforestation + community land stewardship',
    },
  });
  if (aiResult.ok) {
    const r = aiResult.data;
    console.log('🤖 AI Ecological Assessment');
    console.log(`  Ethics score:    ${(r.ethicsScore * 100).toFixed(0)}%`);
    console.log(`  Permitted:       ${r.permitted}`);
    console.log(`  Recommendations: ${r.recommendations.slice(0, 2).join(', ')}\n`);
  }

  // ── 5. Identity Profile ───────────────────────────────────────────────────
  const profile = await client.identity.getMyProfile();
  if (profile.ok) {
    const p = profile.data;
    console.log('🪪 My Identity');
    console.log(`  DID:               ${p.did}`);
    console.log(`  Role:              ${p.role}`);
    console.log(`  Verification:      ${p.verificationLevel}`);
    console.log(`  Reputation score:  ${(p.reputationScore * 100).toFixed(0)}%\n`);
  }

  // ── 6. Marketplace Listings ───────────────────────────────────────────────
  const listings = await client.marketplace.listListings({ creditType: 'carbon', verified: true });
  if (listings.ok) {
    console.log('💱 Carbon Credit Listings');
    for (const l of listings.data.data.slice(0, 3)) {
      console.log(`  ${l.projectName} — ${l.amount.toLocaleString()} tCO₂ @ $${l.pricePerUnit}/t`);
    }
  }
}

main().catch(console.error);
