# RB-004: Chain Halt (sanctumd)

**Severity:** P1  
**SLO Impact:** Blockchain operations (DID anchoring, impact attestation, governance votes)  
**On-Call:** Blockchain Team + Platform Engineering

---

## Detection

Alert fires when:
- `sanctumd_latest_block_height` does not increase for 60 seconds
- `sanctumd_consensus_validators_bonded < 2/3 * total_validators`

---

## What a Chain Halt Means

A chain halt means Tendermint BFT consensus has stalled. This happens when:
- Less than 2/3 of voting power is online (validator outage)
- A consensus bug causes validators to disagree on a block
- A governance upgrade proposal requires a coordinated restart

**Impact during halt:**
- New transactions cannot be submitted (DID anchoring, credit issuance, votes)
- Read operations (queries) continue to work against the last committed state
- Off-chain operations (API, database, AI) are unaffected

---

## Immediate Actions

### 1. Diagnose

```bash
# Check block production
curl http://sanctumd-rpc:26657/status | jq '.result.sync_info'

# Check validator set
curl http://sanctumd-rpc:26657/validators | jq '.result.validators | length'

# Check consensus state
curl http://sanctumd-rpc:26657/consensus_state | jq '.result.round_state'
```

### 2. Check validator health

```bash
kubectl get pods -l app=sanctumd-validator -n atlas-chain
kubectl logs -l app=sanctumd-validator -n atlas-chain --since=10m | grep -E 'ERROR|PANIC|halt'
```

### 3. Identify the halt type

| Symptom | Likely Cause |
|---------|-------------|
| `< 2/3 validators online` | Validator outage — restart validators |
| `consensus_state shows round > 10` | Consensus bug — coordinate restart |
| `UPGRADE NEEDED` in logs | Governance upgrade — apply binary upgrade |

---

## Recovery Procedures

### Validator outage (most common)

```bash
# Restart the validator pod
kubectl rollout restart deployment/sanctumd-validator -n atlas-chain

# Monitor recovery
kubectl logs -f -l app=sanctumd-validator -n atlas-chain | grep 'committed state'
```

### Coordinated restart (consensus bug)

1. Notify all validator operators via the validator Slack channel
2. Agree on a halt height (the last committed block)
3. Each validator exports state and restarts with `--halt-height=<N>`
4. Coordinate restart at the same time

### Governance upgrade

```bash
# Apply the new binary
kubectl set image deployment/sanctumd-validator \
  sanctumd=ghcr.io/atlassanctum/sanctumd:NEW_VERSION \
  -n atlas-chain
kubectl rollout restart deployment/sanctumd-validator -n atlas-chain
```

---

## Post-Halt

- Verify block production resumes: `curl http://sanctumd-rpc:26657/status`
- Check for any transactions that failed during the halt — they need to be resubmitted
- Notify users if DID anchoring or credit issuance was delayed
- Write incident report with root cause and validator participation data
