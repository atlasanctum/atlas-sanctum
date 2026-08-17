# Governance

Atlas Sanctum is governed by a multi-layered constitutional system combining
on-chain DAO governance, the Covenant Code (constitutional OS), and the AI Ethics Engine.

---

## Governance Layers

### 1. Constitutional Layer — Covenant Code

The Covenant Code (`src/sanctum/`) is the constitutional operating system.
It encodes ethical constraints as hard-coded rules, not soft guidelines.

Six covenant layers:

| Layer | Name | Purpose |
|-------|------|---------|
| I | Purpose | Mission alignment — why we exist |
| II | Resilience | System durability — how we persist |
| III | Innovation | Adaptive capacity — how we evolve |
| IV | Governance | Decision authority — how we decide |
| V | Institution | Organizational form — how we structure |
| VI | Learning | Knowledge integration — how we improve |

Every platform action must be traceable to at least one covenant layer.

### 2. DAO Layer — On-Chain Governance

Smart contract: [`services/blockchain/dao/AtlasSanctumDAO.sol`](../../services/blockchain/dao/AtlasSanctumDAO.sol)
Chain module: [`chain/proto/sanctum/governance/v1/`](../../chain/proto/sanctum/governance/v1/)

#### Proposal Lifecycle

```
Draft → Active (voting open) → Passed / Rejected / Vetoed → Executed
```

#### Voting Parameters

| Parameter | Value |
|-----------|-------|
| Voting period | 7 days |
| Quorum | 50% of eligible weight |
| Supermajority | 67% of decisive votes |
| Veto window | 2 days after vote closes |

#### Proposal Types

- **Policy** — Platform operational policies
- **Constitutional Amendment** — Changes to the Covenant Code
- **Resource Allocation** — Treasury and grant decisions
- **Partnership** — Formal partner agreements
- **Parameter Change** — Governance parameter updates

#### Indigenous Guardian Veto

Indigenous Guardians hold veto power over any proposal that affects:
- Indigenous territories or bioregions
- Indigenous knowledge systems
- FPIC protocols
- Sacred ecology protections

This veto is encoded in the smart contract and cannot be overridden by any other governance mechanism.

### 3. AI Ethics Layer — Constitutional Pre-Flight

Every AI action passes a constitutional pre-flight check before execution.

Hard block conditions (any one blocks the action):
- Identity not verified (`identityVerified`)
- No covenant authority (`authorityVerified`)
- Forbidden signals in payload (`purposeValid`)
- Indigenous rights violation (`rightsProtected`)

Soft checks (reduce ethics score):
- No public good signal (`publicGoodIncreased`)
- Decision not explainable (`decisionExplainable`)
- No restoration path (`restorationPossible`)

Ethics score < 0.3 → hard block
Ethics score 0.3–0.6 → human review required
Ethics score > 0.6 → auto-approved (unless role requires human approval)

---

## Seven-Generation Planning

Every governance proposal must declare its **seven-generation impact** —
the effect on people and ecosystems 175 years into the future (7 × 25 years).

This is enforced at the smart contract level: proposals without a
`sevenGenerationImpact` field are rejected.

---

## FPIC — Free, Prior, and Informed Consent

All indigenous knowledge contributions require FPIC before storage or use.

FPIC is enforced by the `IndigenousKnowledgeVault` (`services/ai/knowledge-commons/KnowledgeCommons.ts`):
- `consentGranted: false` → throws, knowledge not stored
- Sacred knowledge (`accessLevel: 'sacred'`) → only accessible to explicitly granted parties
- FPIC records are immutable and auditable

---

## Governance Participation

| Role | Capabilities |
|------|-------------|
| Community Member | Vote on proposals, submit field observations |
| Council Member | Submit proposals, form coalitions |
| Indigenous Guardian | Veto power, FPIC authority |
| AI Agent | Propose policy drafts (requires human co-sponsor) |
| Admin | Member management, parameter changes |

---

## Audit & Accountability

Every governance action is recorded to the Governance Audit Layer (Layer 13):
- Immutable, hash-chained audit log
- Every AI action, ethics evaluation, and human override
- Publicly queryable via GraphQL (`aiExplainability` query)
- Appeals process with defined deadline

---

## Roadmap

- ✅ Covenant Code (constitutional OS)
- ✅ Ethics pre-flight engine
- ✅ Smart contract DAO (`AtlasSanctumDAO.sol`)
- ✅ Governance proto definitions (`chain/proto/sanctum/governance/v1/`)
- ✅ Indigenous Guardian veto
- ✅ FPIC enforcement
- 🚧 Global DAO deployment (on-chain governance — in progress)
- 🚧 Bioregional governance nodes
- 🚧 Cross-chain governance (Cosmos IBC)
- 🚧 Mobile voting interface
