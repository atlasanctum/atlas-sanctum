/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Core Type Definitions
 */

// ==================== Entity Types ====================

export type EntityType = 
  | 'vendor'
  | 'person'
  | 'beneficiary'
  | 'employee'
  | 'director'
  | 'company'
  | 'shell_company'
  | 'account'
  | 'device'
  | 'project'
  | 'contract'
  | 'location'
  | 'approval'
  | 'wallet'
  | 'report';

export type WatchStatus = 'normal' | 'watchlisted' | 'flagged' | 'blocked';

export interface Entity {
  id: string;
  entityType: EntityType;
  externalId?: string;
  name: string;
  attributes: Record<string, unknown>;
  riskScore: number;
  watchStatus: WatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Entity Link Types ====================

export type LinkType =
  | 'owns'
  | 'approved'
  | 'paid'
  | 'shares_device'
  | 'shares_address'
  | 'shares_phone'
  | 'shares_email'
  | 'shares_bank_account'
  | 'managed_by'
  | 'submitted'
  | 'verified_by'
  | 'transferred_to'
  | 'co_appears_with'
  | 'director_of'
  | 'beneficiary_of';

export interface EntityLink {
  id: number;
  fromEntityId: string;
  toEntityId: string;
  linkType: LinkType;
  metadata: Record<string, unknown>;
  confidence: number;
  createdAt: Date;
}

// ==================== Event Types ====================

export type EventType =
  | 'payment_approved'
  | 'payment_executed'
  | 'invoice_submitted'
  | 'invoice_approved'
  | 'procurement_awarded'
  | 'vendor_registered'
  | 'beneficiary_added'
  | 'role_changed'
  | 'access_granted'
  | 'document_submitted'
  | 'sensor_reading'
  | 'policy_approved'
  | 'report_filed';

export interface Event {
  id: string;
  eventType: EventType;
  sourceSystem: string;
  entityId?: string;
  timestamp: Date;
  amount?: number;
  currency: string;
  metadata: Record<string, unknown>;
  processed: boolean;
  createdAt: Date;
}

// ==================== Detection Rule Types ====================

export type RuleType = 'threshold' | 'sequence' | 'pattern' | 'policy' | 'frequency';

export type ManipulationClass = 
  | 'transaction'
  | 'identity'
  | 'governance'
  | 'information'
  | 'ecosystem';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface DetectionRule {
  id: string;
  name: string;
  description?: string;
  ruleType: RuleType;
  manipulationClass: ManipulationClass;
  condition: Record<string, unknown>;
  severity: Severity;
  weight: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Alert Types ====================

export type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';

export interface AlertExplanation {
  source: string;
  finding: string;
  weight: number;
}

export interface Alert {
  id: string;
  severity: Severity;
  entityId: string;
  signalSources: string[];
  explanation: AlertExplanation[];
  status: AlertStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Case Types ====================

export type CaseStatus = 'open' | 'investigating' | 'action_required' | 'resolved' | 'closed';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Case {
  id: string;
  title: string;
  description?: string;
  entityIds: string[];
  alertIds: string[];
  riskScore: number;
  confidence: number;
  riskFactors: string[];
  recommendedAction?: string;
  status: CaseStatus;
  priority: CasePriority;
  owner?: string;
  evidenceBundleUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Intervention Types ====================

export type InterventionAction =
  | 'observe'
  | 'soft_flag'
  | 'require_verification'
  | 'pause_disbursement'
  | 'lock_procurement'
  | 'quarantine_report'
  | 'restrict_access'
  | 'open_investigation'
  | 'notify_compliance'
  | 'generate_evidence'
  | 'smart_contract_deny'
  | 'vendor_blocklist'
  | 'wallet_freeze'
  | 'decision_reversal';

export type InterventionStatus = 'pending' | 'executed' | 'overturned' | 'failed';

export interface Intervention {
  id: string;
  caseId: string;
  actionType: InterventionAction;
  actionLevel: number;
  reason: string;
  executedBy?: string;
  executedAt?: Date;
  status: InterventionStatus;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// ==================== Anomaly Score Types ====================

export type AnomalyType =
  | 'peer_deviation'
  | 'temporal_anomaly'
  | 'behavioral_drift'
  | 'seasonal_outlier'
  | 'change_point'
  | 'frequency_anomaly';

export interface AnomalyScore {
  id: number;
  entityId: string;
  anomalyType: AnomalyType;
  score: number;
  explanation?: string;
  modelVersion?: string;
  createdAt: Date;
}

// ==================== Graph Risk Score Types ====================

export type GraphRiskType =
  | 'collusion_cluster'
  | 'circular_flow'
  | 'hidden_hub'
  | 'nepotism_structure'
  | 'procurement_ring'
  | 'approval_loop';

export interface GraphRiskScore {
  id: number;
  entityId: string;
  riskType: GraphRiskType;
  score: number;
  connectedEntities: string[];
  pathDescription?: string;
  createdAt: Date;
}

// ==================== Narrative Analysis Types ====================

export interface Contradiction {
  claim: string;
  evidence: string;
  severity: Severity;
}

export interface Omission {
  description: string;
  riskLevel: Severity;
}

export interface ClaimEvidenceMismatch {
  claim: string;
  expectedEvidence: string;
  actualEvidence?: string;
  confidence: number;
}

export interface NarrativeAnalysis {
  id: number;
  documentId: string;
  entityId?: string;
  consistencyScore: number;
  contradictions: Contradiction[];
  omissions: Omission[];
  claimEvidenceMismatches: ClaimEvidenceMismatch[];
  analyzedAt: Date;
}

// ==================== Audit Log Types ====================

export interface AuditLogEntry {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  details: Record<string, unknown>;
  evidenceHash?: string;
  createdAt: Date;
}

// ==================== Risk Scoring Types ====================

export interface RiskScoreComponents {
  ruleSeverity: number;
  statisticalAnomaly: number;
  graphCollusion: number;
  narrativeContradiction: number;
  accessAbuse: number;
  historicalRecurrence: number;
}

export interface RiskScoreResult {
  overallScore: number;
  confidence: number;
  components: RiskScoreComponents;
  multipliers: {
    financialExposure: number;
    publicHarm: number;
  };
  explanation: AlertExplanation[];
  uncertainty: string[];
  recommendedNextStep: string;
}

// ==================== Detection Request/Response Types ====================

export interface DetectionRequest {
  scopeType: 'entity' | 'project' | 'region';
  scopeId: string;
  includeGraph?: boolean;
  includeNarrativeChecks?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DetectionResponse {
  scopeId: string;
  riskScore: number;
  alertsCreated: number;
  topFindings: string[];
  details: {
    ruleHits: number;
    anomaliesDetected: number;
    graphRiskSignals: number;
    narrativeIssues: number;
  };
}

// ==================== Graph Network Types ====================

export interface GraphNode {
  id: string;
  type: EntityType;
  label?: string;
  riskScore?: number;
  attributes?: Record<string, unknown>;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: LinkType;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface RiskPath {
  path: string[];
  reason: string;
  score: number;
}

export interface EntityNetwork {
  center: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  riskPaths: RiskPath[];
}

// ==================== Intervention Policy Types ====================

export interface InterventionPolicy {
  actionLevel: number;
  actions: InterventionAction[];
  requiredAuthority: string[];
  maxAutomaticExecution: boolean;
  cooldownMinutes: number;
}

// ==================== API Request/Response Types ====================

export interface IngestEventRequest {
  eventType: EventType;
  sourceSystem: string;
  timestamp: string;
  entityRefs: string[];
  payload: Record<string, unknown>;
}

export interface UpsertEntityRequest {
  entityType: EntityType;
  externalId?: string;
  attributes: Record<string, unknown>;
}

export interface AlertFilter {
  severity?: Severity;
  status?: AlertStatus;
  region?: string;
  entityType?: EntityType;
  sourceEngine?: string;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}

export interface CasePromotionRequest {
  alertIds: string[];
  priority: CasePriority;
  assignTo?: string;
  title?: string;
  description?: string;
}

export interface InterventionRequest {
  caseId: string;
  action: InterventionAction;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface NarrativeAnalysisRequest {
  documentId: string;
  claims: string[];
  evidenceScope: {
    projectId?: string;
    entityId?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface NarrativeAnalysisResponse {
  consistencyScore: number;
  contradictions: Contradiction[];
  omissions: Omission[];
  claimEvidenceMismatches: ClaimEvidenceMismatch[];
}
