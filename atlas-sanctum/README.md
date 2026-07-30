# Atlas Sanctum: Covenant Runtime

**A covenant operating system for high-stakes decisions**

Atlas Sanctum turns: **real-world signals → risk reasoning → covenant execution → verified impact**

---

## Overview

Atlas Sanctum is a covenant runtime for real-world response systems. It connects trusted data, evaluates mission conditions, routes accountable action, and verifies whether impact truly happened.

### MVP Use Case

**Flood-risk-triggered emergency response for vulnerable communities**

- Real-world data ingestion
- Risk scoring automation
- Automated fund release rules
- Proof-of-impact verification

---

## Architecture

```
[External Data Sources]
  ├─ Weather API
  ├─ River / flood data
  ├─ Reserve / treasury data
  ├─ Field evidence uploads
  └─ Optional satellite / IoT inputs
          ↓
[Atlas API Gateway]
          ↓
[Risk Engine Service]
[Reserve Service]
[Covenant Engine]
[Verification Service]
          ↓
[Chainlink CRE Workflow / Oracle Layer]
          ↓
[Smart Contracts]
  ├─ CovenantRegistry
  ├─ ReserveVault
  ├─ ImpactVerifier
  └─ PayoutRouter
          ↓
[Frontend Dashboard]
```

---

## Smart Contracts

### CovenantRegistry
Manages covenant lifecycle and conditions.

**Key Functions:**
- `createCovenant()` - Create new covenant draft
- `armCovenant()` - Arm covenant for execution
- `markTriggered()` - Mark covenant as triggered
- `markExecuted()` - Mark covenant as executed with intervention reference
- `markVerified()` - Mark covenant as verified after impact confirmation

### ReserveVault
Manages emergency reserve funds for covenant payouts.

**Key Functions:**
- `deposit()` - Deposit tokens into reserve
- `withdraw()` - Withdraw tokens (owner only)
- `allocatePayout()` - Allocate payout for covenant execution
- `availableBalance()` - Get available balance for a token

### PayoutRouter
Routes validated payout executions and emits audit events.

**Key Functions:**
- `executePayout()` - Execute payout for a covenant
- Emits `PayoutExecuted` event for audit trail

### ImpactVerifier
Stores verification results and confidence scores for interventions.

**Key Functions:**
- `submitVerificationResult()` - Submit verification result
- `getVerification()` - Get verification details
- `getLatestVerification()` - Get latest verification for a covenant

---

## Backend API

### Auth
- `POST /api/auth/wallet/nonce` - Get nonce for wallet signature
- `POST /api/auth/wallet/verify` - Verify signed message and get session token

### Regions
- `GET /api/regions` - List regions
- `GET /api/regions/:id` - Get region details

### Risk
- `POST /api/risk/ingest` - Ingest new source data
- `POST /api/risk/score` - Compute and persist risk snapshot
- `GET /api/risk/latest/:regionId` - Get latest risk snapshot
- `GET /api/risk/history/:regionId` - Get risk trend for charts

### Covenants
- `POST /api/covenants` - Create covenant draft
- `POST /api/covenants/:id/arm` - Arm covenant for execution
- `GET /api/covenants` - List covenants
- `GET /api/covenants/:id` - Get covenant details
- `POST /api/covenants/:id/evaluate` - Run covenant engine evaluation
- `POST /api/covenants/:id/execute` - Trigger offchain workflow + onchain tx

### Reserves
- `GET /api/reserves` - List reserve pools
- `POST /api/reserves/verify` - Run reserve verification

### Interventions
- `GET /api/interventions` - List interventions
- `GET /api/interventions/:id` - Get intervention state
- `POST /api/interventions/:id/confirm` - Manually confirm execution

### Verification
- `POST /api/verifications/evidence` - Upload proof
- `POST /api/verifications/:interventionId/evaluate` - Aggregate evidence and compute confidence
- `POST /api/verifications/:interventionId/finalize` - Write verified result onchain

### Dashboard
- `GET /api/dashboard/summary` - Returns homepage summary

---

## Risk Engine

### Inputs
- Rainfall in last 24h
- Forecast rainfall in next 48h
- River level
- Vulnerability index

### Formula
```
riskScore = (0.35 * normalizedRainfall24h) +
            (0.30 * normalizedForecast48h) +
            (0.20 * normalizedRiverLevel) +
            (0.15 * vulnerabilityIndex)
```

Scale to 0–100.

### Severity Mapping
- 0–29: Low
- 30–54: Medium
- 55–74: High
- 75–100: Critical

---

## Covenant Engine

### Evaluation Logic
```typescript
eligible = riskThresholdMet &&
           reserveVerified &&
           sufficientBalance &&
           covenantArmed &&
           cooldownPassed
```

### Lifecycle
```
Draft → Armed → Triggered → Executed → Verified
```

---

## Frontend

### Pages
- `/` - Mission Control Dashboard
- `/regions` - Regions list
- `/regions/:id` - Region detail with risk thermometer
- `/covenants` - Covenants list
- `/covenants/:id` - Covenant detail with eligibility checks
- `/interventions` - Interventions list
- `/interventions/:id` - Intervention detail
- `/verification` - Verification console
- `/treasury` - Treasury and reserves

### Design Language
- Dark neutral base
- Restrained accent colors
- Red only for genuine alerts
- Blue/white for trust and clarity
- Strong typography
- No clutter

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Foundry (for smart contracts)

### Backend Setup
```bash
cd atlas-sanctum/backend
npm install
# Configure .env with database credentials
npm run db:migrate
npm run dev
```

### Frontend Setup
```bash
cd atlas-sanctum/apps/web
npm install
npm run dev
```

### Smart Contracts
```bash
cd atlas-sanctum/contracts
forge install
forge build
forge test
```

---

## Demo Scenario

### The Story
A region faces elevated flood risk.

Atlas Sanctum:
1. Ingests rainfall and hydrology data
2. Computes flood risk (Score: 78 - Critical)
3. Checks available emergency reserves ($25,000 verified)
4. Evaluates covenant conditions (All checks pass)
5. Auto-triggers covenant response
6. Records payout onchain ($5,000)
7. Verifies emergency supplies were delivered (91% confidence)

### Happy Path
1. Open Dashboard → See region at critical risk
2. Open Region Page → Run risk evaluation
3. Open Covenant Page → Checks all turn green
4. Click Execute → Show pending tx
5. Show Confirmed Payout → Navigate to verification
6. Upload Evidence → Finalize verification
7. Covenant status becomes "Verified"

---

## User Roles

### Steward
- Monitors risk
- Reviews covenant status
- Can approve manual actions

### Funder
- Sees reserves
- Sees where capital moved
- Sees proof-of-impact results

### Field Verifier
- Uploads delivery evidence
- Attaches geo/time metadata
- Signs verification payload

---

## Trust Model

### What's Real
- Covenant lifecycle management
- Risk scoring engine
- Reserve status logic
- Smart contract deployment
- Transaction execution
- Verification evidence flow

### What's Simplified (MVP)
- External data feeds (mocked)
- AI forecasting sophistication
- Satellite verification
- Institutional treasury integrations

---

## Security Assumptions

### Trust Assumptions
- Risk computation is offchain
- Reserve verification is mocked or semi-real
- Verification evidence is human-assisted
- Steward role has authority to arm covenant

### Safeguards
- Role-based access
- Wallet auth
- Signed evidence submissions
- Immutable tx/event log
- Evidence hashing
- Cooldowns on repeated execution

---

## Project Structure

```
atlas-sanctum/
├── contracts/           # Smart contracts (Solidity)
│   ├── src/
│   │   ├── CovenantRegistry.sol
│   │   ├── ReserveVault.sol
│   │   ├── PayoutRouter.sol
│   │   └── ImpactVerifier.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
├── backend/             # API server
│   ├── src/
│   │   ├── services/
│   │   │   ├── riskEngine.ts
│   │   │   └── covenantEngine.ts
│   │   └── routes/
│   │       └── covenantRoutes.ts
│   └── db/
│       └── migrations/
│           └── 001_covenant_system.sql
├── apps/
│   └── web/             # Frontend dashboard
│       └── src/
│           └── components/
│               ├── dashboard/
│               ├── covenant/
│               ├── verification/
│               └── treasury/
├── packages/
│   └── sdk/             # Typed API client
│       └── src/
│           └── index.ts
└── DEMO_SCRIPT.md       # 90-second demo guide
```

---

## License

MIT

---

## Built for

**Atlas Humanitarian** - Aligning action with truth
