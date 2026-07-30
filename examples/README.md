# examples/

Runnable examples showing how to integrate with Atlas Sanctum.

## Structure

```
examples/
├── sdk/           — TypeScript SDK usage examples
├── agents/        — Custom AI agent examples
└── integrations/  — Third-party integration examples (IoT, satellite, DeFi)
```

## SDK Examples

### Basic Impact Query

```typescript
// examples/sdk/impact-query.ts
import { AtlasSanctumClient } from '@atlas-sanctum/sdk';

const client = new AtlasSanctumClient({
  apiUrl: 'https://api.atlassanctum.com',
  token: process.env.ATLAS_API_TOKEN,
});

const metrics = await client.impact.getPlanetaryMetrics();
if (metrics.ok) {
  console.log(`Carbon budget remaining: ${metrics.data.carbonBudgetRemainingGt} GtCO2`);
  console.log(`Biodiversity intactness: ${metrics.data.biodiversityIntactnessIndex}%`);
}
```

### Submit a Governance Proposal

```typescript
// examples/sdk/governance-proposal.ts
const proposal = await client.governance.submitProposal({
  title: 'Protect Amazon headwaters bioregion',
  description: 'Establish a new bioregional council for the upper Amazon watershed.',
  type: 'policy',
  proposedBy: 'did:sanctum:org:amazon-guardians',
  affectedBioregions: ['amazon-basin'],
  sevenGenerationImpact: 'Protects water security for 40M people across 7 generations.',
  votingDeadline: '2027-06-01T00:00:00Z',
});
```

### Run an AI Ecological Assessment

```typescript
// examples/sdk/ai-assessment.ts
const result = await client.ai.process({
  type: 'ecological_assessment',
  location: { lat: -3.4, lng: -62.2, bioregion: 'amazon-basin' },
  context: { ndvi: 0.72, carbonDensityTonnesHa: 180, threatLevel: 'moderate' },
  language: 'pt',
});

if (result.ok && result.data.permitted) {
  console.log('Recommendations:', result.data.recommendations);
  // Get plain-language explanation
  const explanation = await client.ai.getExplainability(result.data.auditEntryId);
}
```

## Running Examples

```bash
cd examples/sdk
npx tsx impact-query.ts
```

Set `ATLAS_API_TOKEN` in your environment before running.
