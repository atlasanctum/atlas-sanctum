# ADR-013: Cosmos SDK for On-Chain Logic

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The platform requires trustless impact verification, decentralized identity
(DID), and on-chain governance. A blockchain layer is necessary for:

- Immutable impact attestation that cannot be altered by the platform operator
- Decentralized identity anchoring (W3C DID spec)
- Governance votes that are publicly auditable
- Carbon credit issuance with verifiable provenance

Options evaluated: Ethereum L2 (Optimism/Arbitrum), Cosmos SDK, Substrate,
Cardano, Solana.

## Decision

**Cosmos SDK** (`chain/`) for the primary application chain (`sanctumd`).  
**Cardano** for carbon credit NFT issuance (existing Plutus contracts in
`atlas-sanctum/contracts/`).

Custom Cosmos modules:
- `x/identity` — W3C DID anchoring and credential issuance
- `x/impact` — Impact measurement verification and attestation
- `x/oracle` — External data oracle with multi-party validation
- `x/rewards` — Regenerative rewards distribution
- `x/governance` — On-chain proposal and voting lifecycle
- `x/knowledge` — Knowledge graph root hash anchoring
- `x/did` — DID document management
- `x/regeneration` — Regenerative project lifecycle
- `x/staking_ext` — Extended staking with impact weighting

## On-Chain vs Off-Chain Boundary

| Data | Location | Reason |
|------|----------|--------|
| DID documents | On-chain (x/identity) | Trustless, self-sovereign |
| Impact attestations | On-chain (x/impact) | Immutability required |
| Governance votes | On-chain (x/governance) | Public auditability |
| Carbon credit issuance | Cardano (NFT) | Existing contracts, eUTXO model |
| Oracle price feeds | On-chain (x/oracle) | Manipulation resistance |
| User profiles | Off-chain (PostgreSQL) | Mutability, privacy, GDPR |
| Project metadata | Off-chain (PostgreSQL) | Query flexibility |
| Analytics | Off-chain (TimescaleDB) | Volume, mutability |
| Session state | Off-chain (Redis) | Ephemeral, high-frequency |

**Rule:** If removing the blockchain would make the data untrustworthy or
manipulable by the platform operator, it belongs on-chain.

## Consequences

**Positive**
- IBC enables cross-chain interoperability with the Cosmos ecosystem
- Sovereign chain — no gas auction, no dependency on Ethereum congestion
- Tendermint BFT consensus provides instant finality
- Cardano eUTXO model is well-suited for credit issuance (deterministic execution)

**Negative**
- Smaller validator ecosystem than Ethereum — requires active validator recruitment
- Requires running own infrastructure (addressed in `infrastructure/kubernetes/`)
- Two-chain architecture (Cosmos + Cardano) adds operational complexity

## Alternatives Considered

| Option | Reason Rejected |
|--------|----------------|
| Ethereum L2 | Gas costs and throughput incompatible with planetary-scale measurement data |
| Substrate | Smaller ecosystem, steeper learning curve, no IBC |
| Solana | Centralization concerns, history of outages |
| Single chain (Cosmos only) | Existing Cardano contracts represent significant investment |

## References

- `chain/` — Cosmos SDK chain implementation
- `atlas-sanctum/contracts/` — Cardano Plutus contracts
- [Cosmos SDK Documentation](https://docs.cosmos.network/)
- [W3C DID Specification](https://www.w3.org/TR/did-core/)
