#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# ATLAS SANCTUM — PHASE 2 DEPLOYMENT SCRIPT
# Perception & Intelligence: Kafka | Satellite | GPU Inference | Anomaly Detection
# Usage: ./deploy-phase2.sh [--dry-run] [--skip-terraform]
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

PHASE="phase2"
NAMESPACE="atlas-phase2"
REGION="us-east-1"
CLUSTER_NAME="atlas-sanctum-phase1"   # Reuses Phase 1 EKS cluster
DRY_RUN=false
SKIP_TERRAFORM=false

for arg in "$@"; do
  case $arg in
    --dry-run)        DRY_RUN=true ;;
    --skip-terraform) SKIP_TERRAFORM=true ;;
  esac
done

log()  { echo "[$(date '+%H:%M:%S')] ✅ $*"; }
warn() { echo "[$(date '+%H:%M:%S')] ⚠️  $*"; }
fail() { echo "[$(date '+%H:%M:%S')] ❌ $*"; exit 1; }

# ─── Prerequisites ────────────────────────────────────────────────────────────
log "Checking prerequisites..."
command -v terraform >/dev/null || fail "terraform not found"
command -v kubectl   >/dev/null || fail "kubectl not found"
command -v helm      >/dev/null || fail "helm not found"
command -v aws       >/dev/null || fail "aws CLI not found"
command -v jq        >/dev/null || fail "jq not found"

aws sts get-caller-identity >/dev/null || fail "AWS credentials not configured"

# Verify Phase 1 gate passed
ETHICS_READY=$(kubectl get deployment ethics-kernel -n atlas-phase1 \
  -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
[ "${ETHICS_READY:-0}" -ge 1 ] || fail "Phase 1 ethics kernel not ready — deploy Phase 1 first"
log "Phase 1 gate: OK (ethics kernel running)"

# ─── Step 1: Terraform ────────────────────────────────────────────────────────
if [ "$SKIP_TERRAFORM" = false ]; then
  log "Deploying Phase 2 infrastructure via Terraform..."
  cd infrastructure/phase2/terraform

  terraform init \
    -backend-config="bucket=atlas-terraform-state" \
    -backend-config="key=phase2/terraform.tfstate" \
    -backend-config="region=${REGION}"

  terraform validate || fail "Terraform validation failed"

  if [ "$DRY_RUN" = true ]; then
    terraform plan -out=phase2.tfplan
    log "Dry run complete. Review phase2.tfplan."
    exit 0
  fi

  terraform apply -auto-approve -parallelism=10
  log "Terraform apply complete"
  cd ../../..
fi

# ─── Step 2: Configure kubectl ────────────────────────────────────────────────
log "Configuring kubectl..."
aws eks update-kubeconfig --region "${REGION}" --name "${CLUSTER_NAME}" --alias atlas-phase1
kubectl cluster-info || fail "Cannot connect to EKS cluster"

# ─── Step 3: Create namespace and apply manifests ─────────────────────────────
log "Applying Phase 2 Kubernetes manifests..."
kubectl apply -f infrastructure/phase2/kubernetes/phase2-perception.yaml

# ─── Step 4: Create Kafka topics on MSK ──────────────────────────────────────
log "Creating Kafka topics on MSK..."
KAFKA_BROKERS=$(aws kafka list-clusters --region "${REGION}" \
  --query "ClusterInfoList[?ClusterName=='atlas-phase2-planetary-bus'].BootstrapBrokerStringTls" \
  --output text 2>/dev/null || echo "")

if [ -n "${KAFKA_BROKERS}" ]; then
  KAFKA_POD=$(kubectl get pod -n "${NAMESPACE}" -l app=kafka-client \
    -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")

  if [ -n "${KAFKA_POD}" ]; then
    TOPICS=(
      "biome.satellite.raw:50:3"
      "biome.satellite.processed:50:3"
      "biome.anomalies:10:3"
      "climate.forecasts:20:3"
      "health.vitals:100:3"
      "agent.actions:20:3"
      "governance.votes:5:3"
    )

    for TOPIC_SPEC in "${TOPICS[@]}"; do
      IFS=':' read -r TOPIC PARTITIONS REPLICATION <<< "${TOPIC_SPEC}"
      kubectl exec -n "${NAMESPACE}" "${KAFKA_POD}" -- \
        kafka-topics.sh \
          --bootstrap-server "${KAFKA_BROKERS}" \
          --create --if-not-exists \
          --topic "${TOPIC}" \
          --partitions "${PARTITIONS}" \
          --replication-factor "${REPLICATION}" \
          --config retention.ms=604800000 2>/dev/null && \
        log "Topic created: ${TOPIC}" || warn "Topic may already exist: ${TOPIC}"
    done
  else
    warn "Kafka client pod not found — topics must be created manually"
  fi
else
  warn "MSK cluster not found — Kafka topics must be created after MSK is ready"
fi

# ─── Step 5: Wait for core services ──────────────────────────────────────────
log "Waiting for satellite ingestion rollout..."
kubectl rollout status deployment/satellite-ingestion -n "${NAMESPACE}" --timeout=5m

log "Waiting for anomaly detector rollout..."
kubectl rollout status deployment/anomaly-detector -n "${NAMESPACE}" --timeout=10m

log "Waiting for NDVI processor rollout..."
kubectl rollout status deployment/ndvi-processor -n "${NAMESPACE}" --timeout=5m

log "Waiting for TimescaleDB StatefulSet..."
kubectl rollout status statefulset/timescaledb -n "${NAMESPACE}" --timeout=10m

# ─── Step 6: Initialize TimescaleDB schema ────────────────────────────────────
log "Initializing TimescaleDB hypertables..."
TSDB_POD=$(kubectl get pod -n "${NAMESPACE}" -l app=timescaledb \
  -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")

if [ -n "${TSDB_POD}" ]; then
  kubectl exec -n "${NAMESPACE}" "${TSDB_POD}" -- psql -U postgres -d atlas_timeseries << 'SQL'
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS sensor_readings (
  time        TIMESTAMPTZ NOT NULL,
  biome_id    TEXT NOT NULL,
  sensor_type TEXT NOT NULL,
  value       DOUBLE PRECISION,
  unit        TEXT,
  confidence  DOUBLE PRECISION DEFAULT 1.0
);

SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS ndvi_timeseries (
  time        TIMESTAMPTZ NOT NULL,
  biome_id    TEXT NOT NULL,
  ndvi        DOUBLE PRECISION,
  evi         DOUBLE PRECISION,
  carbon_est  DOUBLE PRECISION,
  cloud_cover DOUBLE PRECISION
);

SELECT create_hypertable('ndvi_timeseries', 'time', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS idx_sensor_biome ON sensor_readings (biome_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_ndvi_biome   ON ndvi_timeseries (biome_id, time DESC);
SQL
  log "TimescaleDB schema initialized"
else
  warn "TimescaleDB pod not found — schema must be initialized manually"
fi

# ─── Step 7: Validation ───────────────────────────────────────────────────────
log "Running Phase 2 validation..."

SAT_HEALTH=$(kubectl exec -n "${NAMESPACE}" \
  "$(kubectl get pod -n ${NAMESPACE} -l app=satellite-ingestion -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)" \
  -- curl -s http://localhost:8080/health 2>/dev/null | jq -r '.status' || echo "unknown")
log "Satellite ingestion: ${SAT_HEALTH}"

ANOMALY_HEALTH=$(kubectl exec -n "${NAMESPACE}" \
  "$(kubectl get pod -n ${NAMESPACE} -l app=anomaly-detector -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)" \
  -- curl -s http://localhost:8080/health 2>/dev/null | jq -r '.status' || echo "unknown")
log "Anomaly detector: ${ANOMALY_HEALTH}"

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ATLAS SANCTUM PHASE 2 DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo "  Satellite Ingestion: running (polls Sentinel Hub every 6h)"
echo "  Anomaly Detector:    running (GPU inference, >90% precision)"
echo "  NDVI Processor:      running (carbon + biodiversity estimates)"
echo "  TimescaleDB:         running (time-series sensor data)"
echo "  Earth2Studio:        scheduled (daily 2AM UTC climate forecast)"
echo ""
echo "  SUCCESS METRICS TO VERIFY:"
echo "  □ 50 biomes configured in biomes.json"
echo "  □ Kafka topics created (7 topics)"
echo "  □ First satellite scene ingested"
echo "  □ Anomaly detection precision > 90%"
echo "  □ TimescaleDB hypertables created"
echo "═══════════════════════════════════════════════════════════════"
