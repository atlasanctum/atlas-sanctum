import type { MeasurementData, RegenerativeMetrics, ValuationModel } from '@/types/marketplace';

/**
 * Generate realistic satellite measurement data
 * Simulates Sentinel-2 NDVI, CO2 levels, soil carbon readings
 */
export function generateMeasurementData(
  projectId: string,
  daysAgo: number = 0,
  projectType: string = 'soil_carbon'
): MeasurementData {
  const measurementDate = new Date();
  measurementDate.setDate(measurementDate.getDate() - daysAgo);
  measurementDate.setHours(Math.floor(Math.random() * 24), 0, 0, 0);

  // Realistic ranges by project type
  const baselineByType: Record<string, { co2: [number, number]; ndvi: [number, number]; soilC: [number, number] }> = {
    reforestation: { co2: [140, 180], ndvi: [0.5, 0.8], soilC: [30, 50] },
    renewable_energy: { co2: [120, 160], ndvi: [0.3, 0.6], soilC: [20, 40] },
    methane_capture: { co2: [100, 140], ndvi: [0.2, 0.5], soilC: [15, 35] },
    ocean_restoration: { co2: [130, 170], ndvi: [0.4, 0.7], soilC: [25, 45] },
    soil_carbon: { co2: [150, 190], ndvi: [0.6, 0.85], soilC: [40, 60] },
    direct_air_capture: { co2: [110, 150], ndvi: [0.1, 0.4], soilC: [10, 30] },
  };

  const baseline = baselineByType[projectType] || baselineByType.soil_carbon;

  // Add gradual improvement trend (regeneration)
  const improvementFactor = 1 + daysAgo * 0.001; // Slight improvement over time
  const co2_level = parseFloat(
    (baseline.co2[0] + Math.random() * (baseline.co2[1] - baseline.co2[0]) - daysAgo * 0.05).toFixed(2)
  );
  const ndvi_index = parseFloat(
    (baseline.ndvi[0] + Math.random() * (baseline.ndvi[1] - baseline.ndvi[0]) * improvementFactor).toFixed(3)
  );
  const soil_carbon_ppm = parseFloat(
    (baseline.soilC[0] + Math.random() * (baseline.soilC[1] - baseline.soilC[0]) + daysAgo * 0.02).toFixed(2)
  );

  // Determine anomalies (5% chance)
  const isAnomaly = Math.random() < 0.05;
  const anomalyReason = isAnomaly
    ? [
        'Unexpected CO₂ spike detected',
        'NDVI drop below seasonal average',
        'Soil moisture anomaly',
        'Temperature gradient unusual',
        'Sensor recalibration event',
      ][Math.floor(Math.random() * 5)]
    : null;

  // High confidence for normal readings, lower for anomalies
  const confidence_level = isAnomaly ? parseFloat((0.65 + Math.random() * 0.2).toFixed(2)) : parseFloat((0.85 + Math.random() * 0.1).toFixed(2));

  return {
    id: `meas-${projectId}-${daysAgo}-${Date.now()}`,
    project_id: projectId,
    measurement_date: measurementDate.toISOString(),
    satellite_source: Math.random() > 0.3 ? 'Sentinel-2' : 'Landsat-8',
    co2_level,
    soil_carbon_ppm,
    ndvi_index,
    biodiversity_score: parseFloat((50 + Math.random() * 40 + daysAgo * 0.01).toFixed(2)),
    temperature_celsius: parseFloat((20 + Math.random() * 15).toFixed(2)),
    precipitation_mm: parseFloat((Math.random() * 100).toFixed(2)),
    confidence_level,
    anomaly_flag: isAnomaly,
    anomaly_reason: anomalyReason,
    location: {
      type: 'Point',
      coordinates: [-10 - Math.random() * 90, -20 + Math.random() * 60], // Random global location
    },
    source_url: 'https://earthexplorer.usgs.gov/',
    raw_data: {
      source: 'sentinel-hub-mock',
      resolution: '10m',
      cloud_coverage: Math.floor(Math.random() * 30),
    },
    created_at: new Date().toISOString(),
  };
}

/**
 * Generate realistic regenerative metrics matching new database schema
 * Simulates ecosystem health from eDNA, bioacoustic, or satellite analysis
 */
export function generateRegenerativeMetrics(
  projectId: string,
  daysAgo: number = 0
): RegenerativeMetrics {
  const measurementDate = new Date();
  measurementDate.setDate(measurementDate.getDate() - daysAgo);

  // Improvement trend over time (regeneration effect)
  const improvementFactor = 1 + daysAgo * 0.002;

  // Generate values for new schema
  const currentValue = parseFloat((50 + Math.random() * 40 + daysAgo * 0.05).toFixed(2));
  const baselineValue = parseFloat((40 + Math.random() * 20).toFixed(2));
  const targetValue = parseFloat((80 + Math.random() * 15).toFixed(2));
  const improvementPercentage = parseFloat((((currentValue - baselineValue) / baselineValue) * 100).toFixed(2));

  const categories = ['soil_health', 'biodiversity', 'carbon_sequestration', 'water_quality'];
  const metricNames = ['Soil Microbiome Health', 'Biodiversity Index', 'Carbon Capture Rate', 'Water Retention'];
  const units = ['%', 'index', 'tons/ha/yr', '%'];
  const trends = ['improving', 'stable', 'declining'] as const;
  
  const categoryIndex = Math.floor(Math.random() * categories.length);

  return {
    id: `regen-${projectId}-${daysAgo}-${Date.now()}`,
    project_id: projectId,
    zone_id: null,
    metric_name: metricNames[categoryIndex],
    metric_category: categories[categoryIndex],
    current_value: Math.min(100, currentValue),
    baseline_value: baselineValue,
    target_value: targetValue,
    improvement_percentage: improvementPercentage,
    unit: units[categoryIndex],
    trend: trends[Math.floor(Math.random() * 3)],
    last_measured_at: measurementDate.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Generate valuation model with dynamic pricing
 * Calculates impact scores and reversal risk
 */
export function generateValuationModel(
  projectId: string,
  basePrice: number = 25.0,
  projectType: string = 'soil_carbon'
): ValuationModel {
  // Realistic impact weights
  const impact_co2_weight = 0.40;
  const impact_biodiversity_weight = 0.30;
  const impact_health_weight = 0.30;

  // Generate impact scores
  const co2_impact = 50 + Math.random() * 40; // 50-90
  const biodiversity_impact = 45 + Math.random() * 45; // 45-90
  const health_impact = 40 + Math.random() * 50; // 40-90

  // Calculate weighted impact score
  const weighted_impact_score = parseFloat(
    (
      co2_impact * impact_co2_weight +
      biodiversity_impact * impact_biodiversity_weight +
      health_impact * impact_health_weight
    ).toFixed(2)
  );

  // Confidence based on data quality (higher impact = higher confidence)
  const base_confidence = 0.80;
  const confidence_score = parseFloat(Math.min(0.99, base_confidence + (weighted_impact_score / 100) * 0.15).toFixed(2));

  // Confidence intervals (95% CI)
  const margin = (1 - confidence_score) * 15;
  const confidence_upper_bound = parseFloat(Math.min(1.0, confidence_score + margin / 100).toFixed(2));
  const confidence_lower_bound = parseFloat(Math.max(0.0, confidence_score - margin / 100).toFixed(2));

  // Reversal risk by project type
  const reversalRiskByType: Record<string, number> = {
    reforestation: 8,
    renewable_energy: 3,
    methane_capture: 4,
    ocean_restoration: 10,
    soil_carbon: 6,
    direct_air_capture: 2,
  };

  const reversal_risk_percent = reversalRiskByType[projectType] || 5;

  // Dynamic pricing multiplier
  const impact_multiplier = 0.8 + (weighted_impact_score / 100) * 0.6; // 0.8x to 1.4x
  const confidence_multiplier = 0.95 + (confidence_score - 0.75) * 0.4; // 0.95x to 1.2x
  const risk_multiplier = 1.0 - (reversal_risk_percent / 100) * 0.5; // Reduce price for high risk

  const final_credit_price = parseFloat(
    (basePrice * impact_multiplier * confidence_multiplier * risk_multiplier).toFixed(2)
  );

  return {
    id: `val-${projectId}-${Date.now()}`,
    project_id: projectId,
    impact_co2_weight,
    impact_biodiversity_weight,
    impact_health_weight,
    weighted_impact_score,
    confidence_score,
    confidence_upper_bound,
    confidence_lower_bound,
    reversal_risk_percent,
    reversal_risk_decay_rate: 0.95, // 5% annual decay
    permanence_bond_percent: 10,
    base_credit_price: basePrice,
    dynamic_price_multiplier: parseFloat((impact_multiplier * confidence_multiplier * risk_multiplier).toFixed(2)),
    final_credit_price,
    last_recomputed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Generate historical measurement data for 30-90 days
 */
export function generateHistoricalMeasurements(
  projectId: string,
  days: number = 30,
  projectType: string = 'soil_carbon'
): MeasurementData[] {
  const measurements: MeasurementData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    measurements.push(generateMeasurementData(projectId, i, projectType));
  }
  return measurements;
}

/**
 * Generate historical regenerative metrics for 30 days
 */
export function generateHistoricalRegenerativeMetrics(
  projectId: string,
  days: number = 30
): RegenerativeMetrics[] {
  const metrics: RegenerativeMetrics[] = [];
  for (let i = days - 1; i >= 0; i--) {
    metrics.push(generateRegenerativeMetrics(projectId, i));
  }
  return metrics;
}

/**
 * Detect anomalies in measurement data
 * Uses statistical methods to flag suspicious patterns
 */
export function detectAnomalies(measurements: MeasurementData[]): { [key: string]: boolean } {
  const anomalies: { [key: string]: boolean } = {};

  if (measurements.length < 3) return anomalies;

  // Calculate rolling statistics
  const co2Values = measurements.map((m) => m.co2_level || 0);
  const ndviValues = measurements.map((m) => m.ndvi_index || 0);

  const co2Mean = co2Values.reduce((a, b) => a + b, 0) / co2Values.length;
  const co2StdDev = Math.sqrt(
    co2Values.reduce((sum, val) => sum + Math.pow(val - co2Mean, 2), 0) / co2Values.length
  );

  const ndviMean = ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length;
  const ndviStdDev = Math.sqrt(
    ndviValues.reduce((sum, val) => sum + Math.pow(val - ndviMean, 2), 0) / ndviValues.length
  );

  // Flag points > 2 standard deviations from mean
  measurements.forEach((m) => {
    const co2Anomaly = Math.abs((m.co2_level || 0) - co2Mean) > 2 * co2StdDev;
    const ndviAnomaly = Math.abs((m.ndvi_index || 0) - ndviMean) > 2 * ndviStdDev;

    if (co2Anomaly || ndviAnomaly) {
      anomalies[m.id] = true;
    }
  });

  return anomalies;
}

/**
 * Forecast CO2 levels using simple trend analysis
 * Projects next 7 days based on recent trend
 */
export function forecastCO2Trend(measurements: MeasurementData[], daysAhead: number = 7) {
  if (measurements.length < 2) {
    return Array.from({ length: daysAhead }, () => 150);
  }

  const recent = measurements.slice(-7);
  const co2Values = recent.map((m) => m.co2_level || 150);

  // Simple linear regression
  const n = co2Values.length;
  const sumX = (n * (n + 1)) / 2;
  const sumY = co2Values.reduce((a, b) => a + b, 0);
  const sumXY = co2Values.reduce((sum, y, i) => sum + i * y, 0);
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate forecast
  interface ForecastItem {
    date: string;
    co2: number;
  }
  
  const forecast: ForecastItem[] = [];
  const lastDate = new Date(measurements[measurements.length - 1].measurement_date);
  for (let i = 1; i <= daysAhead; i++) {
    const predictedValue = intercept + slope * (n + i);
    forecast.push({
      date: new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
      co2: Math.max(100, Math.min(200, parseFloat(predictedValue.toFixed(2)))), // Clamp realistic range
    });
  }

  return forecast;
}

/**
 * Calculate credit multiplier based on ecosystem health metrics
 */
export function calculateEcosystemMultiplier(metrics: RegenerativeMetrics): number {
  // Use current_value as the primary score
  const healthScore = (metrics.current_value || 0) / 100;

  // Convert to price multiplier (0.5x to 1.5x)
  return 0.5 + healthScore * 1.0;
}