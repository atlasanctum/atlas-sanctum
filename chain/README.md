# Atlas Sanctum Protocol — Layer 1 Blockchain

A Cosmos SDK / CometBFT chain for verified health outcomes, regeneration markets, and impact-based funding coordination.

---

## Chain Specifications

| Property       | Value              |
|----------------|--------------------|
| Chain ID       | `sanctum-1`        |
| Binary         | `sanctumd`         |
| Bech32 Prefix  | `sanctum`          |
| Bond Denom     | `usan` (SAN)       |
| Impact Denom   | `uhlt` (HLT)       |
| Regen Denom    | `ureg` (REG)       |
| Consensus      | CometBFT (Tendermint v2) |
| SDK Version    | Cosmos SDK v0.50.x |

---

## Module Architecture

```
x/
├── identity/      — User roles & reputation (USER, CLINIC, ORACLE, VALIDATOR, PARTNER, ADMIN)
├── impact/        — Impact record submission, oracle verification, status lifecycle
├── oracle/        — Trusted verification node registry (HUMAN, API, SENSOR)
├── rewards/       — Mint & distribute uhlt/ureg on verified impact (70/20/10 split)
├── governance/    — Custom proposal types (Oracle, Treasury, Regeneration)
└── regeneration/  — Ecological project tracking (carbon, biodiversity, trees)
```

### Cross-Keeper Dependency Graph

```
ImpactKeeper
  ├── IdentityKeeper   (role checks)
  ├── OracleKeeper     (active oracle validation, duplicate prevention)
  └── RewardsKeeper    (auto-distribute on VERIFIED threshold)

OracleKeeper
  └── IdentityKeeper   (ADMIN role for suspend/reactivate)
```

---

## Quick Start

### Prerequisites

- Go 1.21+
- `make`

### Build

```bash
cd chain
make build
# Binary: ./build/sanctumd
```

### Initialize Local Devnet

```bash
make devnet
# Initializes ~/.sanctumd, creates genesis, starts node on localhost:26657
```

Or manually:

```bash
./scripts/init-chain.sh
./build/sanctumd start
```

---

## Key Workflows

### 1. Register Identity

```bash
sanctumd tx identity register USER '{"org":"Atlas Clinic"}' \
  --from mykey --chain-id sanctum-1
```

### 2. Register Oracle

```bash
sanctumd tx oracle register HUMAN \
  --from oracle-key --chain-id sanctum-1
```

### 3. Submit Impact Record

```bash
sanctumd tx impact submit HEALTH patients_treated 250 \
  --from provider-key --chain-id sanctum-1
```

### 4. Oracle Verification (3 required → auto-VERIFIED + rewards)

```bash
sanctumd tx impact verify <impact-id> --from oracle1 --chain-id sanctum-1
sanctumd tx impact verify <impact-id> --from oracle2 --chain-id sanctum-1
sanctumd tx impact verify <impact-id> --from oracle3 --chain-id sanctum-1
# Third confirmation triggers: status=VERIFIED, uhlt minted, 70/20/10 distributed
```

### 5. Query

```bash
sanctumd query impact record <impact-id>
sanctumd query impact by-status PENDING
sanctumd query oracle active-oracles
sanctumd query identity user <address>
```

---

## Reward Distribution

When an impact record reaches **3 oracle confirmations**:

| Recipient       | Share | Token |
|-----------------|-------|-------|
| Provider        | 70%   | `uhlt` (HEALTH) or `ureg` (CLIMATE/BIODIVERSITY/WATER) |
| Oracle Pool     | 20%   | → treasury (oracle-specific distribution via governance) |
| Treasury        | 10%   | → protocol treasury account |

Base reward: **1,000,000 micro-units** (1 HLT or 1 REG) per verified record.

---

## Security Properties

| Property                    | Implementation |
|-----------------------------|----------------|
| Replay protection           | Duplicate oracle confirmation check per record |
| Role-based access control   | ADMIN-only reputation updates, ORACLE-only verification |
| Immutability                | VERIFIED records cannot be modified or rejected |
| Store isolation             | Per-module KV prefix keys prevent cross-module collisions |
| Input validation            | `ValidateBasic()` on all messages before keeper execution |
| Deterministic state         | No time.Now() in consensus-critical paths (block height used for IDs) |
| Non-fatal reward errors     | Reward failure logged but does not roll back verification |

---

## Testing

```bash
make test              # All tests
make test-unit         # Keeper unit tests only
make test-integration  # Full pipeline integration tests
make test-cover        # Coverage report (target: ≥80%)
```

### Test Coverage

| Module      | Tests |
|-------------|-------|
| identity    | RegisterUser, DuplicatePrevention, AdminOnlyReputation, MetadataLimit, RoleFilter |
| oracle      | Register, Duplicate, SuspendAdminOnly, Reactivate, ActiveFilter, InvalidType |
| impact      | ThresholdVerification, DuplicateOraclePrevention, InactiveOracleRejection, Immutability, Rejection |
| integration | FullPipeline, SuspendedOracleBlocked, ReputationAdminOnly |

---

## Governance Proposals

Three custom proposal types extend the Cosmos governance module:

- **OracleProposal** — bulk oracle policy changes, threshold updates
- **TreasuryProposal** — treasury address rotation, reward split adjustment (must sum to 100%)
- **RegenerationProposal** — carbon accounting methodology, minimum thresholds

---

## Future Extensions

The architecture is designed for:

| Extension                    | Hook Point |
|------------------------------|------------|
| Proof-of-Regeneration consensus | Custom ABCI `EndBlocker` in `x/regeneration` |
| ZK proof verification        | `OracleKeeper.VerifyProof()` interface |
| AI fraud scoring             | `ImpactKeeper` pre-verification hook |
| IBC interoperability         | Standard Cosmos IBC module integration |
| Layer 2 scaling              | Impact record batching via `x/impact` batch messages |

---

## Directory Structure

```
chain/
├── app/                    — App wiring (keepers, module manager, store keys)
├── cmd/sanctumd/           — Binary entry point + CLI root
├── config/genesis.json     — Default genesis state
├── scripts/
│   ├── init-chain.sh       — Local devnet initialization
│   └── sample-txs.sh       — Sample transaction flows
├── tests/
│   ├── identity/           — Identity keeper tests
│   ├── impact/             — Impact keeper + msg server tests
│   ├── oracle/             — Oracle keeper tests
│   └── integration/        — Cross-module pipeline tests
├── x/
│   ├── identity/           — keeper/, types/, cli/, module.go
│   ├── impact/             — keeper/, types/, cli/, module.go
│   ├── oracle/             — keeper/, types/, module.go
│   ├── rewards/            — keeper/, types/, module.go
│   ├── governance/         — types/ (custom proposals)
│   └── regeneration/       — keeper/, types/, module.go
├── proto/sanctum/          — Protobuf definitions (all 6 modules)
├── go.mod
└── Makefile
```
