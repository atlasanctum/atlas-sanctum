/**
 * Atlas Sanctum — Agent Network Example
 *
 * Demonstrates dispatching tasks through the multi-agent network
 * and reading results from the constitutional workflow.
 *
 * Run: npx ts-node examples/agents/dispatch.ts
 */

import AtlasAgentNetwork, { AgentTask } from '../../services/ai/agents/AgentNetwork.js';

async function main() {
  console.log('🤖 Atlas Sanctum — Agent Network Demo\n');

  // ── Network health ────────────────────────────────────────────────────────
  const health = AtlasAgentNetwork.health();
  console.log('Network Health:');
  console.log(`  Agents online:     ${health.online} / ${health.total}`);
  console.log(`  Avg ethics score:  ${(health.avgEthicsScore * 100).toFixed(0)}%\n`);

  // ── Dispatch: Ecological Assessment ──────────────────────────────────────
  const ecoTask: AgentTask = {
    taskId: 'task-eco-001',
    type: 'ecological_assessment',
    payload: {
      bioregion: 'amazon-basin',
      ndvi: 0.72,
      deforestationRateHaYr: 11000,
      explanation: 'Quarterly Amazon health check',
      restoration_path: 'Community-led reforestation',
      restore: true,
    },
    priority: 4,
    requiredRoles: ['ecology', 'forecasting', 'ethics'],
    covenantId: 'covenant-amazon-2026',
    requestedBy: 'did:sanctum:field-agent-001',
    createdAt: Date.now(),
  };

  console.log('📋 Dispatching: Ecological Assessment');
  const ecoResults = await AtlasAgentNetwork.orchestrator.dispatch(ecoTask);
  for (const r of ecoResults) {
    console.log(`  [${r.role}] ${r.outcome} — ethics: ${(r.ethicsScore * 100).toFixed(0)}%`);
    console.log(`    ${r.rationale}`);
  }
  console.log();

  // ── Dispatch: Governance Proposal ────────────────────────────────────────
  const govTask: AgentTask = {
    taskId: 'task-gov-001',
    type: 'governance_proposal',
    payload: {
      title: 'Amazon Basin Protection Act 2026',
      description: 'Establish 5M hectare protected corridor',
      explanation: 'Prevent tipping point crossing in Amazon biome',
      restoration_path: 'Indigenous-led land stewardship',
      regenerate: true,
      protect: true,
    },
    priority: 5,
    requiredRoles: ['governance', 'ethics', 'culture'],
    covenantId: 'covenant-governance-2026',
    requestedBy: 'did:sanctum:council-member-001',
    createdAt: Date.now(),
  };

  console.log('📋 Dispatching: Governance Proposal');
  const govResults = await AtlasAgentNetwork.orchestrator.dispatch(govTask);
  for (const r of govResults) {
    console.log(`  [${r.role}] ${r.outcome} — human review: ${r.requiresHumanReview}`);
  }
  console.log();

  // ── Form a coalition ──────────────────────────────────────────────────────
  const coalition = AtlasAgentNetwork.orchestrator.formCoalition(
    'Amazon Emergency Response',
    ['ecology', 'disaster', 'governance'],
  );
  console.log('🤝 Coalition Formed:');
  console.log(`  ID:       ${coalition.coalitionId}`);
  console.log(`  Members:  ${coalition.members.join(', ')}`);
  console.log(`  Rule:     ${coalition.decisionRule}`);
  console.log(`  Status:   ${coalition.status}`);
  console.log();

  // ── Agent health report ───────────────────────────────────────────────────
  console.log('📊 Agent Health Report:');
  const report = AtlasAgentNetwork.registry.getHealthReport();
  for (const h of report.slice(0, 5)) {
    console.log(`  ${h.role.padEnd(14)} | ${h.status.padEnd(12)} | ethics: ${(h.avgEthicsScore * 100).toFixed(0)}% | tasks: ${h.tasksCompleted}`);
  }
}

main().catch(console.error);
