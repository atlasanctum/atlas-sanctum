/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Narrative Consistency Engine
 * 
 * Compares "what is being said" vs "what reality signals show"
 */

import {
  NarrativeAnalysis,
  Contradiction,
  Omission,
  ClaimEvidenceMismatch,
  Severity,
  Event,
  Entity
} from '../../types/antiManipulation';

// In-memory store for demo (would be PostgreSQL in production)
const narrativeAnalyses: Map<number, NarrativeAnalysis> = new Map();
let narrativeIdCounter = 1;

/**
 * Analyzes narrative consistency against evidence
 */
export function analyzeNarrativeConsistency(
  documentId: string,
  claims: string[],
  evidenceEvents: Event[],
  entity?: Entity
): NarrativeAnalysis {
  const contradictions: Contradiction[] = [];
  const omissions: Omission[] = [];
  const claimEvidenceMismatches: ClaimEvidenceMismatch[] = [];

  // Analyze each claim against evidence
  claims.forEach(claim => {
    const analysis = analyzeClaim(claim, evidenceEvents, entity);
    
    if (analysis.contradiction) {
      contradictions.push(analysis.contradiction);
    }
    
    if (analysis.omission) {
      omissions.push(analysis.omission);
    }
    
    if (analysis.mismatch) {
      claimEvidenceMismatches.push(analysis.mismatch);
    }
  });

  // Check for missing important information
  const missingInfo = detectMissingInformation(evidenceEvents, claims);
  omissions.push(...missingInfo);

  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(
    contradictions,
    omissions,
    claimEvidenceMismatches,
    claims.length
  );

  const analysis: NarrativeAnalysis = {
    id: narrativeIdCounter++,
    documentId,
    entityId: entity?.id,
    consistencyScore,
    contradictions,
    omissions,
    claimEvidenceMismatches,
    analyzedAt: new Date()
  };

  narrativeAnalyses.set(analysis.id, analysis);
  return analysis;
}

/**
 * Analyzes a single claim against evidence
 */
function analyzeClaim(
  claim: string,
  evidenceEvents: Event[],
  entity?: Entity
): {
  contradiction?: Contradiction;
  omission?: Omission;
  mismatch?: ClaimEvidenceMismatch;
} {
  const lowerClaim = claim.toLowerCase();

  // Check for operational claims
  if (lowerClaim.includes('operational') || lowerClaim.includes('functioning') || lowerClaim.includes('active')) {
    return analyzeOperationalClaim(claim, evidenceEvents);
  }

  // Check for delivery claims
  if (lowerClaim.includes('delivered') || lowerClaim.includes('distributed') || lowerClaim.includes('reached')) {
    return analyzeDeliveryClaim(claim, evidenceEvents);
  }

  // Check for compliance claims
  if (lowerClaim.includes('compliant') || lowerClaim.includes('verified') || lowerClaim.includes('approved')) {
    return analyzeComplianceClaim(claim, evidenceEvents);
  }

  // Check for impact claims
  if (lowerClaim.includes('impact') || lowerClaim.includes('benefit') || lowerClaim.includes('improvement')) {
    return analyzeImpactClaim(claim, evidenceEvents);
  }

  // Check for financial claims
  if (lowerClaim.includes('spent') || lowerClaim.includes('cost') || lowerClaim.includes('budget')) {
    return analyzeFinancialClaim(claim, evidenceEvents);
  }

  return {};
}

/**
 * Analyzes operational claims (e.g., "95% of sensors are operational")
 */
function analyzeOperationalClaim(
  claim: string,
  evidenceEvents: Event[]
): {
  contradiction?: Contradiction;
  mismatch?: ClaimEvidenceMismatch;
} {
  const lowerClaim = claim.toLowerCase();
  
  // Extract percentage if mentioned
  const percentMatch = lowerClaim.match(/(\d+)%/);
  const claimedPercent = percentMatch ? parseInt(percentMatch[1]) : null;

  // Look for sensor/operational events
  const operationalEvents = evidenceEvents.filter(e => 
    e.eventType === 'sensor_reading' || 
    e.metadata.operational !== undefined
  );

  if (operationalEvents.length > 0 && claimedPercent !== null) {
    // Calculate actual operational rate
    const operationalCount = operationalEvents.filter(e => 
      e.metadata.operational === true || e.metadata.status === 'operational'
    ).length;
    
    const actualPercent = (operationalCount / operationalEvents.length) * 100;
    const deviation = Math.abs(claimedPercent - actualPercent);

    if (deviation > 20) { // More than 20% deviation
      return {
        contradiction: {
          claim,
          evidence: `Only ${actualPercent.toFixed(0)}% of ${operationalEvents.length} readings show operational status`,
          severity: deviation > 40 ? 'critical' : 'high'
        }
      };
    }
  }

  return {};
}

/**
 * Analyzes delivery claims (e.g., "No delays in last-mile delivery")
 */
function analyzeDeliveryClaim(
  claim: string,
  evidenceEvents: Event[]
): {
  contradiction?: Contradiction;
  mismatch?: ClaimEvidenceMismatch;
} {
  const lowerClaim = claim.toLowerCase();
  
  // Look for delivery-related events
  const deliveryEvents = evidenceEvents.filter(e => 
    e.eventType.includes('delivery') || 
    e.eventType.includes('dispatch') ||
    e.metadata.delivery_status !== undefined
  );

  if (lowerClaim.includes('no delays') || lowerClaim.includes('on time')) {
    const delayedEvents = deliveryEvents.filter(e =>
      e.metadata.delivery_status === 'delayed' ||
      (e.metadata.delay_days as number) > 0
    );

    if (delayedEvents.length > 0) {
      return {
        contradiction: {
          claim,
          evidence: `${delayedEvents.length} delivery delays detected in evidence`,
          severity: delayedEvents.length > 3 ? 'critical' : 'high'
        }
      };
    }
  }

  if (lowerClaim.includes('all delivered') || lowerClaim.includes('100%')) {
    const failedEvents = deliveryEvents.filter(e => 
      e.metadata.delivery_status === 'failed' ||
      e.metadata.delivery_status === 'returned'
    );

    if (failedEvents.length > 0) {
      return {
        contradiction: {
          claim,
          evidence: `${failedEvents.length} failed or returned deliveries found`,
          severity: 'critical'
        }
      };
    }
  }

  return {};
}

/**
 * Analyzes compliance claims
 */
function analyzeComplianceClaim(
  claim: string,
  evidenceEvents: Event[]
): {
  contradiction?: Contradiction;
  mismatch?: ClaimEvidenceMismatch;
} {
  const lowerClaim = claim.toLowerCase();
  
  // Look for compliance-related events
  const complianceEvents = evidenceEvents.filter(e => 
    e.eventType.includes('audit') || 
    e.eventType.includes('inspection') ||
    e.metadata.compliance_status !== undefined
  );

  if (lowerClaim.includes('fully compliant') || lowerClaim.includes('100% compliant')) {
    const nonCompliantEvents = complianceEvents.filter(e =>
      e.metadata.compliance_status === 'non_compliant' ||
      (e.metadata.violations as number) > 0
    );

    if (nonCompliantEvents.length > 0) {
      return {
        contradiction: {
          claim,
          evidence: `${nonCompliantEvents.length} non-compliance events found`,
          severity: 'critical'
        }
      };
    }
  }

  return {};
}

/**
 * Analyzes impact claims
 */
function analyzeImpactClaim(
  claim: string,
  evidenceEvents: Event[]
): {
  contradiction?: Contradiction;
  mismatch?: ClaimEvidenceMismatch;
} {
  const lowerClaim = claim.toLowerCase();
  
  // Extract numbers from claim
  const numberMatch = lowerClaim.match(/(\d[\d,]*)/);
  const claimedNumber = numberMatch ? parseInt(numberMatch[1].replace(/,/g, '')) : null;

  if (claimedNumber !== null) {
    // Look for impact-related events
    const impactEvents = evidenceEvents.filter(e => 
      e.metadata.impact_value !== undefined ||
      e.metadata.beneficiaries !== undefined ||
      e.metadata.households_reached !== undefined
    );

    if (impactEvents.length > 0) {
      const totalImpact = impactEvents.reduce((sum, e) => {
        return sum + (e.metadata.impact_value as number || 0) +
               (e.metadata.beneficiaries as number || 0) +
               (e.metadata.households_reached as number || 0);
      }, 0);

      const deviation = Math.abs(claimedNumber - totalImpact) / claimedNumber;

      if (deviation > 0.3) { // More than 30% deviation
        return {
          mismatch: {
            claim,
            expectedEvidence: `Evidence should show approximately ${claimedNumber} impact units`,
            actualEvidence: `Evidence shows ${totalImpact} impact units`,
            confidence: 1 - deviation
          }
        };
      }
    }
  }

  return {};
}

/**
 * Analyzes financial claims
 */
function analyzeFinancialClaim(
  claim: string,
  evidenceEvents: Event[]
): {
  contradiction?: Contradiction;
  mismatch?: ClaimEvidenceMismatch;
} {
  const lowerClaim = claim.toLowerCase();
  
  // Extract amounts from claim
  const amountMatch = lowerClaim.match(/\$?([\d,]+)/);
  const claimedAmount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : null;

  if (claimedAmount !== null) {
    // Look for financial events
    const financialEvents = evidenceEvents.filter(e => 
      e.amount !== undefined ||
      e.metadata.amount !== undefined
    );

    if (financialEvents.length > 0) {
      const totalAmount = financialEvents.reduce((sum, e) => {
        return sum + (e.amount || 0) + (e.metadata.amount as number || 0);
      }, 0);

      const deviation = Math.abs(claimedAmount - totalAmount) / claimedAmount;

      if (deviation > 0.2) { // More than 20% deviation
        return {
          mismatch: {
            claim,
            expectedEvidence: `Evidence should show approximately $${claimedAmount.toLocaleString()}`,
            actualEvidence: `Evidence shows $${totalAmount.toLocaleString()}`,
            confidence: 1 - deviation
          }
        };
      }
    }
  }

  return {};
}

/**
 * Detects missing important information
 */
function detectMissingInformation(
  evidenceEvents: Event[],
  claims: string[]
): Omission[] {
  const omissions: Omission[] = [];
  const lowerClaims = claims.map(c => c.toLowerCase()).join(' ');

  // Check for service interruptions
  const interruptionEvents = evidenceEvents.filter(e => 
    e.metadata.service_status === 'interrupted' ||
    e.metadata.outage === true
  );

  if (interruptionEvents.length > 0 && !lowerClaims.includes('interruption') && !lowerClaims.includes('outage')) {
    omissions.push({
      description: `${interruptionEvents.length} service interruptions not mentioned in narrative`,
      riskLevel: interruptionEvents.length > 2 ? 'high' : 'medium'
    });
  }

  // Check for failures
  const failureEvents = evidenceEvents.filter(e => 
    e.metadata.status === 'failed' ||
    e.metadata.failure === true
  );

  if (failureEvents.length > 0 && !lowerClaims.includes('failure') && !lowerClaims.includes('failed')) {
    omissions.push({
      description: `${failureEvents.length} failures not mentioned in narrative`,
      riskLevel: failureEvents.length > 2 ? 'high' : 'medium'
    });
  }

  // Check for delays
  const delayEvents = evidenceEvents.filter(e =>
    (e.metadata.delay_days as number) > 0 ||
    e.metadata.late === true
  );

  if (delayEvents.length > 0 && !lowerClaims.includes('delay') && !lowerClaims.includes('late')) {
    omissions.push({
      description: `${delayEvents.length} delays not mentioned in narrative`,
      riskLevel: delayEvents.length > 3 ? 'high' : 'medium'
    });
  }

  return omissions;
}

/**
 * Calculates overall consistency score
 */
function calculateConsistencyScore(
  contradictions: Contradiction[],
  omissions: Omission[],
  mismatches: ClaimEvidenceMismatch[],
  totalClaims: number
): number {
  if (totalClaims === 0) return 1.0;

  // Weight different types of issues
  const contradictionWeight = 0.5;
  const omissionWeight = 0.3;
  const mismatchWeight = 0.2;

  // Calculate penalty
  let penalty = 0;

  contradictions.forEach(c => {
    penalty += contradictionWeight * (c.severity === 'critical' ? 1.0 : 0.6);
  });

  omissions.forEach(o => {
    penalty += omissionWeight * (o.riskLevel === 'high' ? 0.8 : 0.4);
  });

  mismatches.forEach(m => {
    penalty += mismatchWeight * (1 - m.confidence);
  });

  // Normalize penalty by number of claims
  const normalizedPenalty = Math.min(1, penalty / totalClaims);

  // Return score (1 = perfect consistency, 0 = complete inconsistency)
  return Math.max(0, 1 - normalizedPenalty);
}

/**
 * Gets narrative analysis by ID
 */
export function getNarrativeAnalysis(analysisId: number): NarrativeAnalysis | undefined {
  return narrativeAnalyses.get(analysisId);
}

/**
 * Gets narrative analyses for a document
 */
export function getNarrativeAnalysesByDocument(documentId: string): NarrativeAnalysis[] {
  return Array.from(narrativeAnalyses.values()).filter(
    analysis => analysis.documentId === documentId
  );
}

/**
 * Gets narrative analyses for an entity
 */
export function getNarrativeAnalysesByEntity(entityId: string): NarrativeAnalysis[] {
  return Array.from(narrativeAnalyses.values()).filter(
    analysis => analysis.entityId === entityId
  );
}

/**
 * Gets low consistency narratives
 */
export function getLowConsistencyNarratives(threshold: number = 0.5): NarrativeAnalysis[] {
  return Array.from(narrativeAnalyses.values()).filter(
    analysis => analysis.consistencyScore < threshold
  );
}

/**
 * Gets narrative statistics
 */
export function getNarrativeStats(): {
  total: number;
  averageConsistency: number;
  lowConsistencyCount: number;
  totalContradictions: number;
  totalOmissions: number;
} {
  const allAnalyses = Array.from(narrativeAnalyses.values());
  
  const averageConsistency = allAnalyses.length > 0
    ? allAnalyses.reduce((a, b) => a + b.consistencyScore, 0) / allAnalyses.length
    : 0;

  const totalContradictions = allAnalyses.reduce(
    (sum, a) => sum + a.contradictions.length, 0
  );

  const totalOmissions = allAnalyses.reduce(
    (sum, a) => sum + a.omissions.length, 0
  );

  return {
    total: allAnalyses.length,
    averageConsistency,
    lowConsistencyCount: allAnalyses.filter(a => a.consistencyScore < 0.5).length,
    totalContradictions,
    totalOmissions
  };
}

/**
 * Clears all narrative analyses (for testing)
 */
export function clearNarrativeAnalyses(): void {
  narrativeAnalyses.clear();
  narrativeIdCounter = 1;
}
