/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Anomaly Detection Service
 * 
 * Detects new or subtle manipulation patterns using statistical methods
 */

import {
  AnomalyScore,
  AnomalyType,
  Event,
  Entity
} from '../../types/antiManipulation';

// In-memory store for demo (would be PostgreSQL in production)
const anomalyScores: Map<number, AnomalyScore> = new Map();
let anomalyIdCounter = 1;

/**
 * Detects anomalies for an entity based on its events
 */
export function detectAnomalies(
  entityId: string,
  events: Event[],
  entity?: Entity
): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  // Run different anomaly detection methods
  scores.push(...detectPeerDeviation(entityId, events, entity));
  scores.push(...detectTemporalAnomalies(entityId, events));
  scores.push(...detectBehavioralDrift(entityId, events));
  scores.push(...detectFrequencyAnomalies(entityId, events));

  // Store scores
  scores.forEach(score => {
    anomalyScores.set(score.id, score);
  });

  return scores;
}

/**
 * Detects deviation from peer group behavior
 */
function detectPeerDeviation(
  entityId: string,
  events: Event[],
  entity?: Entity
): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  if (events.length < 5) return scores;

  // Calculate average transaction amount
  const amounts = events
    .filter(e => e.amount !== undefined)
    .map(e => e.amount!);

  if (amounts.length < 3) return scores;

  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  // Check for outliers (values more than 2 standard deviations from mean)
  const outliers = amounts.filter(amount => Math.abs(amount - mean) > 2 * stdDev);

  if (outliers.length > 0) {
    const outlierRatio = outliers.length / amounts.length;
    const maxDeviation = Math.max(...outliers.map(o => Math.abs(o - mean) / stdDev));

    scores.push({
      id: anomalyIdCounter++,
      entityId,
      anomalyType: 'peer_deviation',
      score: Math.min(1, outlierRatio * maxDeviation),
      explanation: `Found ${outliers.length} transactions deviating significantly from peer average (mean: ${mean.toFixed(2)}, stdDev: ${stdDev.toFixed(2)})`,
      modelVersion: '1.0.0',
      createdAt: new Date()
    });
  }

  return scores;
}

/**
 * Detects temporal anomalies (unusual timing patterns)
 */
function detectTemporalAnomalies(entityId: string, events: Event[]): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  if (events.length < 10) return scores;

  // Group events by hour of day
  const hourCounts: Record<number, number> = {};
  events.forEach(event => {
    const hour = event.timestamp.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  // Calculate expected distribution (uniform)
  const totalEvents = events.length;
  const expectedPerHour = totalEvents / 24;

  // Find hours with unusual activity
  const unusualHours: Array<{ hour: number; count: number; deviation: number }> = [];
  Object.entries(hourCounts).forEach(([hour, count]) => {
    const deviation = Math.abs(count - expectedPerHour) / expectedPerHour;
    if (deviation > 1.5) { // 150% deviation from expected
      unusualHours.push({ hour: parseInt(hour), count, deviation });
    }
  });

  if (unusualHours.length > 0) {
    const maxDeviation = Math.max(...unusualHours.map(h => h.deviation));
    const unusualHourDescriptions = unusualHours
      .map(h => `${h.hour}:00 (${h.count} events, ${(h.deviation * 100).toFixed(0)}% deviation)`)
      .join(', ');

    scores.push({
      id: anomalyIdCounter++,
      entityId,
      anomalyType: 'temporal_anomaly',
      score: Math.min(1, maxDeviation / 3),
      explanation: `Unusual activity detected at hours: ${unusualHourDescriptions}`,
      modelVersion: '1.0.0',
      createdAt: new Date()
    });
  }

  return scores;
}

/**
 * Detects behavioral drift over time
 */
function detectBehavioralDrift(entityId: string, events: Event[]): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  if (events.length < 20) return scores;

  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Split into two halves
  const midpoint = Math.floor(sortedEvents.length / 2);
  const firstHalf = sortedEvents.slice(0, midpoint);
  const secondHalf = sortedEvents.slice(midpoint);

  // Compare average amounts
  const firstHalfAmounts = firstHalf.filter(e => e.amount !== undefined).map(e => e.amount!);
  const secondHalfAmounts = secondHalf.filter(e => e.amount !== undefined).map(e => e.amount!);

  if (firstHalfAmounts.length > 0 && secondHalfAmounts.length > 0) {
    const firstMean = firstHalfAmounts.reduce((a, b) => a + b, 0) / firstHalfAmounts.length;
    const secondMean = secondHalfAmounts.reduce((a, b) => a + b, 0) / secondHalfAmounts.length;

    const drift = Math.abs(secondMean - firstMean) / firstMean;

    if (drift > 0.5) { // 50% drift
      scores.push({
        id: anomalyIdCounter++,
        entityId,
        anomalyType: 'behavioral_drift',
        score: Math.min(1, drift),
        explanation: `Behavioral drift detected: average transaction amount changed from ${firstMean.toFixed(2)} to ${secondMean.toFixed(2)} (${(drift * 100).toFixed(0)}% change)`,
        modelVersion: '1.0.0',
        createdAt: new Date()
      });
    }
  }

  // Compare event type distribution
  const firstHalfTypes: Record<string, number> = {};
  const secondHalfTypes: Record<string, number> = {};

  firstHalf.forEach(e => {
    firstHalfTypes[e.eventType] = (firstHalfTypes[e.eventType] || 0) + 1;
  });

  secondHalf.forEach(e => {
    secondHalfTypes[e.eventType] = (secondHalfTypes[e.eventType] || 0) + 1;
  });

  // Calculate distribution difference
  const allTypes = new Set([...Object.keys(firstHalfTypes), ...Object.keys(secondHalfTypes)]);
  let distributionDiff = 0;

  allTypes.forEach(type => {
    const firstRatio = (firstHalfTypes[type] || 0) / firstHalf.length;
    const secondRatio = (secondHalfTypes[type] || 0) / secondHalf.length;
    distributionDiff += Math.abs(firstRatio - secondRatio);
  });

  if (distributionDiff > 0.3) {
    scores.push({
      id: anomalyIdCounter++,
      entityId,
      anomalyType: 'behavioral_drift',
      score: Math.min(1, distributionDiff),
      explanation: `Event type distribution changed significantly (difference: ${(distributionDiff * 100).toFixed(0)}%)`,
      modelVersion: '1.0.0',
      createdAt: new Date()
    });
  }

  return scores;
}

/**
 * Detects frequency anomalies (unusual event rates)
 */
function detectFrequencyAnomalies(entityId: string, events: Event[]): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  if (events.length < 10) return scores;

  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Calculate time gaps between events
  const gaps: number[] = [];
  for (let i = 1; i < sortedEvents.length; i++) {
    const gap = sortedEvents[i].timestamp.getTime() - sortedEvents[i - 1].timestamp.getTime();
    gaps.push(gap);
  }

  if (gaps.length < 5) return scores;

  // Calculate average gap and standard deviation
  const meanGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const varianceGap = gaps.reduce((a, b) => a + Math.pow(b - meanGap, 2), 0) / gaps.length;
  const stdDevGap = Math.sqrt(varianceGap);

  // Find unusual gaps (very short or very long)
  const unusualGaps = gaps.filter(gap => Math.abs(gap - meanGap) > 2 * stdDevGap);

  if (unusualGaps.length > 0) {
    const shortGaps = unusualGaps.filter(gap => gap < meanGap - 2 * stdDevGap);
    const longGaps = unusualGaps.filter(gap => gap > meanGap + 2 * stdDevGap);

    let explanation = '';
    if (shortGaps.length > 0) {
      const avgShortGap = shortGaps.reduce((a, b) => a + b, 0) / shortGaps.length;
      explanation += `${shortGaps.length} unusually short gaps (avg: ${(avgShortGap / 1000 / 60).toFixed(1)} minutes). `;
    }
    if (longGaps.length > 0) {
      const avgLongGap = longGaps.reduce((a, b) => a + b, 0) / longGaps.length;
      explanation += `${longGaps.length} unusually long gaps (avg: ${(avgLongGap / 1000 / 60 / 60).toFixed(1)} hours).`;
    }

    scores.push({
      id: anomalyIdCounter++,
      entityId,
      anomalyType: 'frequency_anomaly',
      score: Math.min(1, unusualGaps.length / gaps.length),
      explanation: explanation.trim(),
      modelVersion: '1.0.0',
      createdAt: new Date()
    });
  }

  // Check for burst activity (many events in short time)
  const recentEvents = sortedEvents.filter(e => {
    const age = Date.now() - e.timestamp.getTime();
    return age < 24 * 60 * 60 * 1000; // Last 24 hours
  });

  if (recentEvents.length > 10) {
    const burstScore = Math.min(1, recentEvents.length / 50);
    scores.push({
      id: anomalyIdCounter++,
      entityId,
      anomalyType: 'frequency_anomaly',
      score: burstScore,
      explanation: `Burst activity detected: ${recentEvents.length} events in last 24 hours`,
      modelVersion: '1.0.0',
      createdAt: new Date()
    });
  }

  return scores;
}

/**
 * Detects seasonal outliers
 */
function detectSeasonalOutliers(
  entityId: string,
  events: Event[],
  historicalEvents: Event[] = []
): AnomalyScore[] {
  const scores: AnomalyScore[] = [];

  if (events.length < 5 || historicalEvents.length < 20) return scores;

  // Group by month
  const currentMonth = new Date().getMonth();
  const currentMonthEvents = events.filter(e => e.timestamp.getMonth() === currentMonth);
  const historicalMonthEvents = historicalEvents.filter(e => e.timestamp.getMonth() === currentMonth);

  if (currentMonthEvents.length === 0 || historicalMonthEvents.length === 0) return scores;

  // Compare amounts
  const currentAmounts = currentMonthEvents.filter(e => e.amount !== undefined).map(e => e.amount!);
  const historicalAmounts = historicalMonthEvents.filter(e => e.amount !== undefined).map(e => e.amount!);

  if (currentAmounts.length > 0 && historicalAmounts.length > 0) {
    const currentMean = currentAmounts.reduce((a, b) => a + b, 0) / currentAmounts.length;
    const historicalMean = historicalAmounts.reduce((a, b) => a + b, 0) / historicalAmounts.length;

    const deviation = Math.abs(currentMean - historicalMean) / historicalMean;

    if (deviation > 0.5) {
      scores.push({
        id: anomalyIdCounter++,
        entityId,
        anomalyType: 'seasonal_outlier',
        score: Math.min(1, deviation),
        explanation: `Seasonal outlier: current month average (${currentMean.toFixed(2)}) deviates ${(deviation * 100).toFixed(0)}% from historical average (${historicalMean.toFixed(2)})`,
        modelVersion: '1.0.0',
        createdAt: new Date()
      });
    }
  }

  return scores;
}

/**
 * Gets anomaly scores for an entity
 */
export function getAnomalyScores(entityId: string): AnomalyScore[] {
  return Array.from(anomalyScores.values()).filter(score => score.entityId === entityId);
}

/**
 * Gets anomaly scores by type
 */
export function getAnomalyScoresByType(anomalyType: AnomalyType): AnomalyScore[] {
  return Array.from(anomalyScores.values()).filter(score => score.anomalyType === anomalyType);
}

/**
 * Gets high-severity anomalies
 */
export function getHighSeverityAnomalies(threshold: number = 0.7): AnomalyScore[] {
  return Array.from(anomalyScores.values()).filter(score => score.score >= threshold);
}

/**
 * Gets anomaly statistics
 */
export function getAnomalyStats(): {
  total: number;
  byType: Record<string, number>;
  averageScore: number;
  highSeverityCount: number;
} {
  const allScores = Array.from(anomalyScores.values());
  const byType: Record<string, number> = {};

  allScores.forEach(score => {
    byType[score.anomalyType] = (byType[score.anomalyType] || 0) + 1;
  });

  const averageScore = allScores.length > 0
    ? allScores.reduce((a, b) => a + b.score, 0) / allScores.length
    : 0;

  return {
    total: allScores.length,
    byType,
    averageScore,
    highSeverityCount: allScores.filter(s => s.score >= 0.7).length
  };
}

/**
 * Clears all anomaly scores (for testing)
 */
export function clearAnomalyScores(): void {
  anomalyScores.clear();
  anomalyIdCounter = 1;
}
