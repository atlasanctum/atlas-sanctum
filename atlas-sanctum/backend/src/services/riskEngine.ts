/**
 * Atlas Sanctum Risk Engine
 * Computes regional risk scores from environmental data
 */

export interface RiskInputs {
  rainfallMm24h: number;
  forecastRainMm48h?: number;
  riverLevelMeters?: number;
  vulnerabilityIndex: number;
}

export interface RiskOutput {
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    rainfall24h: number;
    forecast48h: number;
    riverLevelMeters: number;
    vulnerabilityIndex: number;
  };
  normalizedFactors: {
    rainfall24h: number;
    forecast48h: number;
    riverLevelMeters: number;
    vulnerabilityIndex: number;
  };
}

// Normalization ranges based on real-world flood data
const NORMALIZATION_RANGES = {
  rainfall24h: { min: 0, max: 150 }, // mm
  forecast48h: { min: 0, max: 200 }, // mm
  riverLevelMeters: { min: 0, max: 8 }, // meters
};

// Weights for risk calculation
const WEIGHTS = {
  rainfall24h: 0.35,
  forecast48h: 0.30,
  riverLevelMeters: 0.20,
  vulnerabilityIndex: 0.15,
};

/**
 * Normalizes a value to 0-100 scale
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}

/**
 * Determines severity level from risk score
 */
function getSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score < 30) return 'low';
  if (score < 55) return 'medium';
  if (score < 75) return 'high';
  return 'critical';
}

/**
 * Computes flood risk score from environmental inputs
 * 
 * Formula:
 * riskScore = (0.35 * normalizedRainfall24h) +
 *             (0.30 * normalizedForecast48h) +
 *             (0.20 * normalizedRiverLevel) +
 *             (0.15 * vulnerabilityIndex * 100)
 */
export function computeRiskScore(inputs: RiskInputs): RiskOutput {
  // Normalize inputs
  const normalizedRainfall24h = normalize(
    inputs.rainfallMm24h,
    NORMALIZATION_RANGES.rainfall24h.min,
    NORMALIZATION_RANGES.rainfall24h.max
  );

  const normalizedForecast48h = normalize(
    inputs.forecastRainMm48h ?? 0,
    NORMALIZATION_RANGES.forecast48h.min,
    NORMALIZATION_RANGES.forecast48h.max
  );

  const normalizedRiverLevel = normalize(
    inputs.riverLevelMeters ?? 0,
    NORMALIZATION_RANGES.riverLevelMeters.min,
    NORMALIZATION_RANGES.riverLevelMeters.max
  );

  const normalizedVulnerability = inputs.vulnerabilityIndex * 100;

  // Compute weighted risk score
  const riskScore = Math.round(
    (WEIGHTS.rainfall24h * normalizedRainfall24h) +
    (WEIGHTS.forecast48h * normalizedForecast48h) +
    (WEIGHTS.riverLevelMeters * normalizedRiverLevel) +
    (WEIGHTS.vulnerabilityIndex * normalizedVulnerability)
  );

  // Clamp to 0-100
  const clampedScore = Math.max(0, Math.min(100, riskScore));

  return {
    riskScore: clampedScore,
    severity: getSeverity(clampedScore),
    factors: {
      rainfall24h: inputs.rainfallMm24h,
      forecast48h: inputs.forecastRainMm48h ?? 0,
      riverLevelMeters: inputs.riverLevelMeters ?? 0,
      vulnerabilityIndex: inputs.vulnerabilityIndex,
    },
    normalizedFactors: {
      rainfall24h: normalizedRainfall24h,
      forecast48h: normalizedForecast48h,
      riverLevelMeters: normalizedRiverLevel,
      vulnerabilityIndex: normalizedVulnerability,
    },
  };
}

/**
 * Validates risk inputs
 */
export function validateRiskInputs(inputs: RiskInputs): string[] {
  const errors: string[] = [];

  if (inputs.rainfallMm24h < 0) {
    errors.push('Rainfall cannot be negative');
  }

  if (inputs.forecastRainMm48h !== undefined && inputs.forecastRainMm48h < 0) {
    errors.push('Forecast rainfall cannot be negative');
  }

  if (inputs.riverLevelMeters !== undefined && inputs.riverLevelMeters < 0) {
    errors.push('River level cannot be negative');
  }

  if (inputs.vulnerabilityIndex < 0 || inputs.vulnerabilityIndex > 1) {
    errors.push('Vulnerability index must be between 0 and 1');
  }

  return errors;
}

/**
 * Generates a risk snapshot ID
 */
export function generateRiskSnapshotId(regionId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `risk_${regionId}_${timestamp}_${random}`;
}
