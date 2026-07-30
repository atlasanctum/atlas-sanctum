# @atlas-sanctum/sdk

The official typed JavaScript/TypeScript client SDK for Atlas Sanctum.

## Install

```bash
npm install @atlas-sanctum/sdk
```

## Quick Start

```typescript
import { AtlasSanctumClient } from '@atlas-sanctum/sdk';

const client = new AtlasSanctumClient({
  apiUrl: 'https://api.atlassanctum.com',
  token: '<your-api-token>',
});

// Planetary metrics
const metrics = await client.impact.getPlanetaryMetrics();

// List verified carbon projects
const projects = await client.impact.listProjects({ type: 'reforestation', status: 'verified' });

// Submit a governance proposal
const proposal = await client.governance.submitProposal({
  title: 'Expand Amazon bioregional council',
  description: '...',
  type: 'policy',
  proposedBy: 'did:sanctum:org:xyz',
  affectedBioregions: ['amazon-basin'],
  sevenGenerationImpact: '...',
  votingDeadline: '2027-01-01T00:00:00Z',
});

// Run an AI civilizational request
const aiResult = await client.ai.process({
  type: 'ecological_assessment',
  location: { lat: -3.4, lng: -62.2, bioregion: 'amazon-basin' },
  context: { ndvi: 0.72, carbonDensity: 180 },
});

// Get plain-language explanation of any AI decision
if (aiResult.ok) {
  const explanation = await client.ai.getExplainability(aiResult.data.auditEntryId);
}
```

## Domains

| Module | Description |
|--------|-------------|
| `client.impact` | Projects, verifications, regenerative credits, planetary metrics |
| `client.governance` | Proposals, voting, tallies, constitutional amendments |
| `client.ai` | Civilizational AI requests, agent status, explainability |
| `client.identity` | DID profiles, verification levels, covenant bindings |
| `client.marketplace` | Credit listings, orders, settlement |

## Error Handling

Every method returns `ApiResult<T>`:

```typescript
const result = await client.impact.getProject('proj-123');

if (result.ok) {
  console.log(result.data.name);
} else {
  console.error(result.error.code, result.error.message);
}
```

## License

Apache 2.0
