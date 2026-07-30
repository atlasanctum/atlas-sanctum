# ADR-015: AI Agent Architecture via MCP

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The platform has multiple domain agents (Climate, Health, Governance, Finance,
Research) implemented in `backend/src/agents/`. They currently have no standard
protocol for tool registration, capability discovery, or inter-agent
communication. Adding new agents requires understanding each agent's internal
API.

The Model Context Protocol (MCP) provides a standard JSON-RPC 2.0 interface
for tool-using AI agents.

## Decision

Implement MCP as the agent communication standard:

- Each domain agent exposes an **MCP server** with registered tools
- The orchestrator is an **MCP client** that routes intent to the correct agent
- Agent tools are registered in a central **tool registry**
- Agents communicate through the orchestrator — never directly with each other

**Agent isolation:** Each agent runs in its own process boundary. Direct
agent-to-agent calls are forbidden. This prevents runaway agent chains and
makes permission enforcement tractable.

**Guardrails (mandatory for every agent response):**
1. Prompt injection filter — all user input sanitized before reaching the LLM
2. Factual grounding check — citations required for factual claims
3. Confidence threshold — responses below 0.6 confidence are flagged, not suppressed
4. Ethics pre-check — implemented in `BaseAgent.run()` via `intelligencePlane.evaluateEthics()`
5. PII stripping — all agent inputs/outputs logged with PII removed

**Which tasks use AI vs deterministic software:**

| Task | Approach | Reason |
|------|----------|--------|
| Input validation | Deterministic | Correct answer exists |
| RBAC checks | Deterministic | Security-critical, must be auditable |
| Payment calculations | Deterministic | Financial accuracy required |
| Intent classification | AI | Natural language, ambiguous |
| Anomaly detection | AI | Pattern recognition at scale |
| Policy summarization | AI | Natural language generation |
| Schema migrations | Deterministic | Correctness is binary |
| Forecasting | AI + statistical | Uncertainty quantification needed |

## Model Drift Detection

- Shadow mode evaluation: new model versions run in parallel with production
- Outputs compared against a golden dataset weekly
- Alert when divergence exceeds 15% on domain-specific benchmarks
- All model inputs/outputs logged (PII-stripped) to `agent_runs` table

## Consequences

**Positive**
- Standard protocol — new agents are added without changing the orchestrator
- Tool capabilities are discoverable at runtime
- Agent isolation limits blast radius of a misbehaving agent
- MCP is an emerging industry standard (Anthropic, OpenAI tooling)

**Negative**
- MCP adds a serialization/deserialization layer vs direct function calls
- Requires running an MCP server process per agent domain
- Tool schema must be kept in sync with implementation

## References

- `backend/src/agents/base/BaseAgent.ts` — ReAct agent implementation
- `backend/src/agents/climate/ClimateAgent.ts` — MCP-wired domain agent
- `backend/src/middleware/promptInjection.ts` — injection filter
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
