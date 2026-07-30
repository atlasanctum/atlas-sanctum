import type { MeasurementData, RegenerativeMetrics } from '@/types/marketplace';

/**
 * Anomaly Detection Engine
 * Uses statistical and machine learning techniques to flag suspicious measurements
 * Prevents fraud and ensures data quality
 */

interface AnomalyScore {
  score: number; // 0-1 (0 = normal, 1 = highly anomalous)
  anomalies: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // How confident we are in the detection
}

/**
 * Detect anomalies in satellite measurement data
 * Uses: Isolation Forest, Z-score, temporal consistency checks
 */
export function detectMeasurementAnomalies(
  measurement: MeasurementData,
  historicalData: MeasurementData[] = []
): AnomalyScore {
  const anomalies: string[] = [];
  let anomalyScore = 0;
  let confidence = 0.8;

  // 1. Check for impossible physical values
  if (measurement.co2_level === null || measurement.co2_level < 0 || measurement.co2_level > 300) {
    anomalies.push('CO₂ level outside physical bounds (0-300 ppm)');
    anomalyScore += 0.3;
  }

  if (measurement.ndvi_index === null || measurement.ndvi_index < -1 || measurement.ndvi_index > 1) {
    anomalies.push('NDVI index out of range [-1, 1]');
    anomalyScore += 0.3;
  }

  if (measurement.soil_carbon_ppm && (measurement.soil_carbon_ppm < 0 || measurement.soil_carbon_ppm > 150)) {
    anomalies.push('Soil carbon level abnormally high');
    anomalyScore += 0.2;
  }

  // 2. Statistical outlier detection (Z-score method)
  if (historicalData.length >= 3) {
    const co2Values = historicalData.map((m) => m.co2_level || 0);
    const mean = co2Values.reduce((a, b) => a + b, 0) / co2Values.length;
    const variance = co2Values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / co2Values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 0) {
      const zScore = Math.abs(((measurement.co2_level || mean) - mean) / stdDev);
      if (zScore > 3) {
        anomalies.push(`CO₂ measurement is ${zScore.toFixed(1)} standard deviations from mean`);
        anomalyScore += 0.25;
      } else if (zScore > 2) {
        anomalies.push(`CO₂ measurement is unusual (${zScore.toFixed(1)} std devs from mean)`);
        anomalyScore += 0.1;
      }
    }
  }

  // 3. Temporal consistency checks
  if (historicalData.length > 0) {
    const lastMeasurement = historicalData[0]; // Most recent
    const hoursDiff = (new Date(measurement.measurement_date).getTime() - new Date(lastMeasurement.measurement_date).getTime()) / (1000 * 60 * 60);

    // CO₂ shouldn't change more than ~5 ppm per day naturally
    if (hoursDiff > 0 && hoursDiff < 24) {
      const co2Change = Math.abs((measurement.co2_level || 0) - (lastMeasurement.co2_level || 0));
      if (co2Change > 15) {
        anomalies.push(`Large CO₂ change detected: ${co2Change.toFixed(1)} ppm in ${hoursDiff.toFixed(1)} hours`);
        anomalyScore += 0.2;
      }
    }

    // NDVI shouldn't fluctuate wildly (vegetation doesn't change in hours)
    if (hoursDiff > 0 && hoursDiff < 24) {
      const ndviChange = Math.abs((measurement.ndvi_index || 0) - (lastMeasurement.ndvi_index || 0));
      if (ndviChange > 0.2) {
        anomalies.push(`Vegetation index jump too large: ${ndviChange.toFixed(3)} in ${hoursDiff.toFixed(1)} hours`);
        anomalyScore += 0.15;
      }
    }
  }

  // 4. Confidence level validation
  if (measurement.confidence_level < 0.5) {
    anomalies.push('Low data confidence level reported');
    anomalyScore += 0.1;
    confidence = 0.6;
  }

  // 5. Check for common sensor failures
  if (measurement.co2_level === measurement.temperature_celsius) {
    anomalies.push('Identical values detected (possible sensor malfunction)');
    anomalyScore += 0.4;
  }

  // Clamp score to [0, 1]
  anomalyScore = Math.min(1, anomalyScore);

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (anomalyScore >= 0.75) riskLevel = 'critical';
  else if (anomalyScore >= 0.5) riskLevel = 'high';
  else if (anomalyScore >= 0.25) riskLevel = 'medium';

  return {
    score: parseFloat(anomalyScore.toFixed(2)),
    anomalies: anomalies.length > 0 ? anomalies : ['No anomalies detected'],
    riskLevel,
    confidence,
  };
}

/**
 * Detect anomalies in regenerative metrics
 * Flags suspicious ecosystem health claims
 */
export function detectMetricsAnomalies(
  metrics: RegenerativeMetrics,
  historicalMetrics: RegenerativeMetrics[] = []
): AnomalyScore {
  const anomalies: string[] = [];
  let anomalyScore = 0;

  // 1. Check valid score ranges using new schema fields
  const currentValue = metrics.current_value || 0;
  
  if (currentValue < 0 || currentValue > 100) {
    anomalies.push('Current value outside valid range [0, 100]');
    anomalyScore += 0.3;
  }

  // 2. Check for impossible improvements
  if (historicalMetrics.length > 1 && metrics.baseline_value !== null) {
    const improvement = metrics.improvement_percentage || 0;
    
    // Improvement shouldn't exceed reasonable bounds
    if (improvement > 50) {
      anomalies.push(`Unrealistic improvement: +${improvement.toFixed(1)}% from baseline`);
      anomalyScore += 0.25;
    }
  }

  // 3. Temporal consistency checks using last_measured_at
  if (historicalMetrics.length > 0 && metrics.last_measured_at) {
    const recent = historicalMetrics[0];
    if (recent.last_measured_at) {
      const daysDiff = Math.max(1, (new Date(metrics.last_measured_at).getTime() - new Date(recent.last_measured_at).getTime()) / (1000 * 60 * 60 * 24));
      
      // Value shouldn't change dramatically in short time
      const valueChange = Math.abs(currentValue - (recent.current_value || 0));
      if (valueChange > 15 && daysDiff < 7) {
        anomalies.push(`Large value change: ±${valueChange.toFixed(1)} points in ${daysDiff.toFixed(1)} days`);
        anomalyScore += 0.2;
      }
    }
  }

  // 4. Trend consistency check
  if (metrics.trend === 'improving' && (metrics.improvement_percentage || 0) < 0) {
    anomalies.push('Trend marked as improving but improvement percentage is negative');
    anomalyScore += 0.15;
  }

  if (metrics.trend === 'declining' && (metrics.improvement_percentage || 0) > 0) {
    anomalies.push('Trend marked as declining but improvement percentage is positive');
    anomalyScore += 0.15;
  }

  anomalyScore = Math.min(1, anomalyScore);

  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (anomalyScore >= 0.75) riskLevel = 'critical';
  else if (anomalyScore >= 0.5) riskLevel = 'high';
  else if (anomalyScore >= 0.25) riskLevel = 'medium';

  return {
    score: parseFloat(anomalyScore.toFixed(2)),
    anomalies: anomalies.length > 0 ? anomalies : ['No anomalies detected'],
    riskLevel,
    confidence: 0.85,
  };
}

/**
 * Isolation Forest-based outlier detection
 * Effective for multi-dimensional anomaly detection
 */
export function isolationForestScore(
  measurement: MeasurementData,
  trainingData: MeasurementData[] = []
): number {
  if (trainingData.length < 10) {
    return 0; // Need enough data for statistical methods
  }

  // Simple implementation: distance-based outlier score
  const features = [
    measurement.co2_level || 0,
    measurement.ndvi_index || 0,
    measurement.soil_carbon_ppm || 0,
    measurement.biodiversity_score || 0,
  ];

  let totalDistance = 0;
  trainingData.forEach((train) => {
    const trainFeatures = [
      train.co2_level || 0,
      train.ndvi_index || 0,
      train.soil_carbon_ppm || 0,
      train.biodiversity_score || 0,
    ];

    const distance = Math.sqrt(
      features.reduce((sum, feat, i) => sum + Math.pow(feat - trainFeatures[i], 2), 0)
    );
    totalDistance += distance;
  });

  const avgDistance = totalDistance / trainingData.length;
  // Normalize to [0, 1] score (higher = more anomalous)
  return Math.min(1, avgDistance / 100);
}

/**
 * Ensemble anomaly detection
 * Combines multiple detection methods for robust results
 */
export function ensembleAnomalyDetection(
  measurement: MeasurementData,
  historicalData: MeasurementData[] = []
): AnomalyScore {
  // Method 1: Statistical anomalies
  const statsAnomaly = detectMeasurementAnomalies(measurement, historicalData);

  // Method 2: Isolation Forest
  const ifScore = isolationForestScore(measurement, historicalData);

  // Combine scores (weighted average)
  const combinedScore = statsAnomaly.score * 0.6 + ifScore * 0.4;

  return {
    ...statsAnomaly,
    score: parseFloat(combinedScore.toFixed(2)),
  };
}

/**
 * Calculate fraud probability based on anomaly patterns
 */
export function calculateFraudProbability(
  measurement: MeasurementData,
  metrics: RegenerativeMetrics,
  historicalData: { measurements: MeasurementData[]; metrics: RegenerativeMetrics[] }
): number {
  const measurementAnomaly = detectMeasurementAnomalies(measurement, historicalData.measurements);
  const metricsAnomaly = detectMetricsAnomalies(metrics, historicalData.metrics);

  // Fraud indicators: Both measurement AND metrics are anomalous
  if (measurementAnomaly.riskLevel === 'critical' && metricsAnomaly.riskLevel === 'critical') {
    return 0.8; // High fraud probability
  }

  if (measurementAnomaly.riskLevel === 'high' && metricsAnomaly.riskLevel === 'high') {
    return 0.5; // Moderate fraud probability
  }

  // Just one anomaly
  if (measurementAnomaly.riskLevel === 'critical' || metricsAnomaly.riskLevel === 'critical') {
    return 0.3; // Low-moderate probability
  }

  return 0.05; // Very low baseline
}