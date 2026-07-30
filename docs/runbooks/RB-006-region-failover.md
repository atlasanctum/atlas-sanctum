# RB-006: Region Failover

**Severity:** P1  
**SLO Impact:** Platform uptime SLO (> 99.95%)  
**On-Call:** Platform Engineering + Infrastructure Team

---

## Detection

Alert fires when:
- Primary region (us-east-1) health check fails for 3 consecutive minutes
- `atlas_api_up == 0` in us-east-1 for 3 minutes

---

## Architecture

```
Primary:   AWS us-east-1  (EKS, RDS primary, ElastiCache)
Secondary: AWS eu-west-1  (EKS standby, RDS read replica → promoted on failover)
CDN:       Vercel Edge    (automatic failover via health checks)
DNS:       Route 53       (health-check-based failover, TTL: 60s)
```

---

## RTO / RPO Targets

| Metric | Target |
|--------|--------|
| RTO (Recovery Time Objective) | < 15 minutes |
| RPO (Recovery Point Objective) | < 5 minutes |

---

## Failover Procedure

### Step 1: Confirm the outage (2 minutes)

```bash
# Check primary region health
curl -f https://api.atlassanctum.org/health || echo "PRIMARY DOWN"

# Check secondary region directly
curl -f https://eu.api.atlassanctum.org/health || echo "SECONDARY DOWN"

# Check AWS health dashboard
open https://health.aws.amazon.com/health/status
```

### Step 2: Promote RDS read replica (5 minutes)

```bash
# In eu-west-1
aws rds promote-read-replica \
  --db-instance-identifier atlas-db-eu-west-1-replica \
  --region eu-west-1

# Wait for promotion (2-3 minutes)
aws rds wait db-instance-available \
  --db-instance-identifier atlas-db-eu-west-1-replica \
  --region eu-west-1
```

### Step 3: Update DNS failover (1 minute)

Route 53 health-check-based failover should trigger automatically.
If not:

```bash
# Force DNS failover to eu-west-1
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://infrastructure/failover/eu-west-1-records.json
```

### Step 4: Scale up secondary region (3 minutes)

```bash
# Scale API pods in eu-west-1
kubectl scale deployment atlas-api --replicas=6 -n atlas-production \
  --context=atlas-eu-west-1

# Update database connection string to promoted replica
kubectl set env deployment/atlas-api \
  DATABASE_URL=$EU_WEST_1_DB_URL \
  -n atlas-production \
  --context=atlas-eu-west-1
```

### Step 5: Verify

```bash
# Confirm traffic is routing to eu-west-1
curl -v https://api.atlassanctum.org/health 2>&1 | grep 'x-region'

# Check error rate
kubectl logs -l app=atlas-api -n atlas-production \
  --context=atlas-eu-west-1 --since=5m | grep '"status":5'
```

---

## Failback (after primary region recovers)

1. Verify primary region is fully healthy (all services green for 30 minutes)
2. Sync any data written to eu-west-1 during the outage back to us-east-1
3. Update DNS to point back to us-east-1 (during low-traffic window)
4. Demote eu-west-1 RDS back to read replica
5. Scale down eu-west-1 to standby capacity

---

## Post-Incident

- Document the outage duration and data loss (if any) in the incident report
- Review RPO — if data loss exceeded 5 minutes, investigate replication lag
- Update this runbook if the procedure needed adjustment
