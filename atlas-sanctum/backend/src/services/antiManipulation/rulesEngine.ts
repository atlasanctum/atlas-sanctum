/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Rules and Policy Engine
 * 
 * Deterministic layer for catching known manipulation patterns fast
 */

import {
  DetectionRule,
  RuleType,
  ManipulationClass,
  Severity,
  Event,
  Entity,
  Alert,
  AlertExplanation
} from '../../types/antiManipulation';

// In-memory store for demo (would be PostgreSQL in production)
const rules: Map<string, DetectionRule> = new Map();

/**
 * Initializes default detection rules
 */
export function initializeDefaultRules(): void {
  const defaultRules: DetectionRule[] = [
    // Transaction Manipulation Rules
    {
      id: 'rule_001',
      name: 'Invoice Splitting',
      description: 'Multiple invoices just below review threshold',
      ruleType: 'threshold',
      manipulationClass: 'transaction',
      condition: {
        field: 'invoice_amount',
        operator: 'below_threshold',
        threshold: 10000,
        count: 3,
        window_days: 7
      },
      severity: 'high',
      weight: 0.28,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_002',
      name: 'Circular Payments',
      description: 'Payments forming circular flow between entities',
      ruleType: 'pattern',
      manipulationClass: 'transaction',
      condition: {
        pattern: 'circular_payment',
        min_cycle_length: 3,
        min_amount: 5000
      },
      severity: 'critical',
      weight: 0.35,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_003',
      name: 'Ghost Vendor',
      description: 'Vendor with no verifiable business presence',
      ruleType: 'policy',
      manipulationClass: 'identity',
      condition: {
        checks: ['business_registration', 'physical_address', 'tax_id', 'bank_account']
      },
      severity: 'high',
      weight: 0.30,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Identity Manipulation Rules
    {
      id: 'rule_004',
      name: 'Shared Bank Account',
      description: 'One bank account linked to multiple beneficiaries',
      ruleType: 'threshold',
      manipulationClass: 'identity',
      condition: {
        field: 'bank_account',
        linked_beneficiaries: 5,
        window_days: 30
      },
      severity: 'high',
      weight: 0.32,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_005',
      name: 'Synthetic Identity',
      description: 'Identity with inconsistent data points',
      ruleType: 'pattern',
      manipulationClass: 'identity',
      condition: {
        checks: ['id_format', 'age_consistency', 'address_validity', 'phone_validity']
      },
      severity: 'critical',
      weight: 0.38,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Governance Manipulation Rules
    {
      id: 'rule_006',
      name: 'Approval Clustering',
      description: 'Same approver for high concentration of awards',
      ruleType: 'threshold',
      manipulationClass: 'governance',
      condition: {
        field: 'approver_id',
        concentration_threshold: 0.8,
        min_awards: 10
      },
      severity: 'high',
      weight: 0.30,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_007',
      name: 'Last-Minute Changes',
      description: 'Approval changed within 10 minutes of disbursement',
      ruleType: 'sequence',
      manipulationClass: 'governance',
      condition: {
        sequence: ['approval_change', 'disbursement'],
        max_gap_minutes: 10
      },
      severity: 'critical',
      weight: 0.35,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Information Manipulation Rules
    {
      id: 'rule_008',
      name: 'Metric Inflation',
      description: 'Impact metrics jump without operational evidence',
      ruleType: 'threshold',
      manipulationClass: 'information',
      condition: {
        field: 'impact_metric',
        increase_threshold: 2.0,
        evidence_gap_days: 30
      },
      severity: 'high',
      weight: 0.25,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_009',
      name: 'Sensor Contradiction',
      description: 'Sensor report contradicts field claims',
      ruleType: 'pattern',
      manipulationClass: 'information',
      condition: {
        comparison: 'sensor_vs_report',
        deviation_threshold: 0.4
      },
      severity: 'critical',
      weight: 0.32,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Ecosystem Manipulation Rules
    {
      id: 'rule_010',
      name: 'Vendor Collusion',
      description: 'Multiple vendors with shared ownership/addresses',
      ruleType: 'pattern',
      manipulationClass: 'ecosystem',
      condition: {
        checks: ['shared_director', 'shared_address', 'shared_phone', 'similar_pricing']
      },
      severity: 'critical',
      weight: 0.40,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  defaultRules.forEach(rule => {
    rules.set(rule.id, rule);
  });
}

/**
 * Gets all rules
 */
export function getAllRules(): DetectionRule[] {
  return Array.from(rules.values());
}

/**
 * Gets enabled rules only
 */
export function getEnabledRules(): DetectionRule[] {
  return Array.from(rules.values()).filter(rule => rule.enabled);
}

/**
 * Gets rules by manipulation class
 */
export function getRulesByClass(manipulationClass: ManipulationClass): DetectionRule[] {
  return Array.from(rules.values()).filter(
    rule => rule.manipulationClass === manipulationClass
  );
}

/**
 * Gets a rule by ID
 */
export function getRule(ruleId: string): DetectionRule | undefined {
  return rules.get(ruleId);
}

/**
 * Creates or updates a rule
 */
export function upsertRule(rule: DetectionRule): DetectionRule {
  rule.updatedAt = new Date();
  rules.set(rule.id, rule);
  return rule;
}

/**
 * Enables or disables a rule
 */
export function setRuleEnabled(ruleId: string, enabled: boolean): DetectionRule | undefined {
  const rule = rules.get(ruleId);
  if (!rule) return undefined;

  const updated: DetectionRule = {
    ...rule,
    enabled,
    updatedAt: new Date()
  };
  rules.set(ruleId, updated);
  return updated;
}

/**
 * Evaluates a single event against all enabled rules
 */
export function evaluateEvent(
  event: Event,
  entity?: Entity,
  relatedEvents: Event[] = []
): AlertExplanation[] {
  const alerts: AlertExplanation[] = [];
  const enabledRules = getEnabledRules();

  enabledRules.forEach(rule => {
    try {
      const triggered = evaluateRule(rule, event, entity, relatedEvents);
      if (triggered) {
        alerts.push({
          source: 'rule_engine',
          finding: `${rule.name}: ${rule.description}`,
          weight: rule.weight
        });
      }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.id}:`, error);
    }
  });

  return alerts;
}

/**
 * Evaluates a specific rule against an event
 */
function evaluateRule(
  rule: DetectionRule,
  event: Event,
  entity?: Entity,
  relatedEvents: Event[] = []
): boolean {
  switch (rule.ruleType) {
    case 'threshold':
      return evaluateThresholdRule(rule, event, relatedEvents);
    case 'sequence':
      return evaluateSequenceRule(rule, event, relatedEvents);
    case 'pattern':
      return evaluatePatternRule(rule, event, entity, relatedEvents);
    case 'policy':
      return evaluatePolicyRule(rule, entity);
    case 'frequency':
      return evaluateFrequencyRule(rule, event, relatedEvents);
    default:
      return false;
  }
}

/**
 * Evaluates threshold-based rules
 */
function evaluateThresholdRule(
  rule: DetectionRule,
  event: Event,
  relatedEvents: Event[]
): boolean {
  const condition = rule.condition;
  const field = condition.field as string;
  const threshold = condition.threshold as number;
  const count = condition.count as number;
  const windowDays = condition.window_days as number;

  if (!field || !threshold || !count) return false;

  // Get events within the time window
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - windowDays);

  const relevantEvents = relatedEvents.filter(e => e.timestamp >= windowStart);

  // Count events below threshold
  let belowThresholdCount = 0;
  relevantEvents.forEach(e => {
    const value = e.metadata[field] || e.amount;
    if (typeof value === 'number' && value < threshold) {
      belowThresholdCount++;
    }
  });

  return belowThresholdCount >= count;
}

/**
 * Evaluates sequence-based rules
 */
function evaluateSequenceRule(
  rule: DetectionRule,
  event: Event,
  relatedEvents: Event[]
): boolean {
  const condition = rule.condition;
  const sequence = condition.sequence as string[];
  const maxGapMinutes = condition.max_gap_minutes as number;

  if (!sequence || sequence.length < 2) return false;

  // Sort events by timestamp
  const sortedEvents = [...relatedEvents, event].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Look for the sequence pattern
  for (let i = 0; i <= sortedEvents.length - sequence.length; i++) {
    let matches = true;
    for (let j = 0; j < sequence.length; j++) {
      if (sortedEvents[i + j].eventType !== sequence[j]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      // Check time gap
      const firstEvent = sortedEvents[i];
      const lastEvent = sortedEvents[i + sequence.length - 1];
      const gapMinutes =
        (lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime()) / (1000 * 60);

      if (gapMinutes <= maxGapMinutes) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Evaluates pattern-based rules
 */
function evaluatePatternRule(
  rule: DetectionRule,
  event: Event,
  entity?: Entity,
  relatedEvents: Event[] = []
): boolean {
  const condition = rule.condition;
  const pattern = condition.pattern as string;

  switch (pattern) {
    case 'circular_payment':
      return detectCircularPayments(event, relatedEvents, condition);
    case 'vendor_collusion':
      return detectVendorCollusion(entity, relatedEvents, condition);
    default:
      return false;
  }
}

/**
 * Detects circular payment patterns
 */
function detectCircularPayments(
  event: Event,
  relatedEvents: Event[],
  condition: Record<string, unknown>
): boolean {
  const minCycleLength = (condition.min_cycle_length as number) || 3;
  const minAmount = (condition.min_amount as number) || 5000;

  // Build payment graph
  const paymentGraph: Map<string, Set<string>> = new Map();

  [...relatedEvents, event]
    .filter(e => e.eventType === 'payment_approved' || e.eventType === 'payment_executed')
    .filter(e => (e.amount || 0) >= minAmount)
    .forEach(e => {
      const from = e.entityId;
      const to = e.metadata.to_entity_id as string;
      if (from && to) {
        if (!paymentGraph.has(from)) {
          paymentGraph.set(from, new Set());
        }
        paymentGraph.get(from)!.add(to);
      }
    });

  // Simple cycle detection (for demo - would use more sophisticated algorithm in production)
  for (const [start, neighbors] of paymentGraph.entries()) {
    for (const neighbor of neighbors) {
      if (paymentGraph.has(neighbor) && paymentGraph.get(neighbor)!.has(start)) {
        if (minCycleLength <= 2) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Detects vendor collusion patterns
 */
function detectVendorCollusion(
  entity: Entity | undefined,
  relatedEvents: Event[],
  condition: Record<string, unknown>
): boolean {
  if (!entity || entity.entityType !== 'vendor') return false;

  const checks = condition.checks as string[];
  if (!checks) return false;

  // Check for shared attributes with other vendors
  // This is a simplified version - production would use graph analysis
  return false;
}

/**
 * Evaluates policy-based rules
 */
function evaluatePolicyRule(rule: DetectionRule, entity?: Entity): boolean {
  if (!entity) return false;

  const condition = rule.condition;
  const checks = condition.checks as string[];

  if (!checks) return false;

  // Check if entity has required attributes
  let failedChecks = 0;
  checks.forEach(check => {
    if (!entity.attributes[check]) {
      failedChecks++;
    }
  });

  // If more than half the checks fail, flag as suspicious
  return failedChecks > checks.length / 2;
}

/**
 * Evaluates frequency-based rules
 */
function evaluateFrequencyRule(
  rule: DetectionRule,
  event: Event,
  relatedEvents: Event[]
): boolean {
  const condition = rule.condition;
  const eventType = condition.event_type as string;
  const maxCount = condition.max_count as number;
  const windowMinutes = condition.window_minutes as number;

  if (!eventType || !maxCount || !windowMinutes) return false;

  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - windowMinutes);

  const recentEvents = relatedEvents.filter(
    e => e.eventType === eventType && e.timestamp >= windowStart
  );

  return recentEvents.length >= maxCount;
}

/**
 * Gets rule statistics
 */
export function getRuleStats(): {
  total: number;
  enabled: number;
  disabled: number;
  byType: Record<string, number>;
  byClass: Record<string, number>;
  bySeverity: Record<string, number>;
} {
  const allRules = Array.from(rules.values());
  const byType: Record<string, number> = {};
  const byClass: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};

  allRules.forEach(rule => {
    byType[rule.ruleType] = (byType[rule.ruleType] || 0) + 1;
    byClass[rule.manipulationClass] = (byClass[rule.manipulationClass] || 0) + 1;
    bySeverity[rule.severity] = (bySeverity[rule.severity] || 0) + 1;
  });

  return {
    total: allRules.length,
    enabled: allRules.filter(r => r.enabled).length,
    disabled: allRules.filter(r => !r.enabled).length,
    byType,
    byClass,
    bySeverity
  };
}

// Initialize default rules on module load
initializeDefaultRules();
