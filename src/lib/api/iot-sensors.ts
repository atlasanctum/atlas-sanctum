import type { RegenerativeMetrics } from '@/types/marketplace';

/**
 * IoT Sensor Data Simulator
 * Simulates real-time data from soil probes, bioacoustic sensors, and microbiome analysis
 */

interface SoilProbeReading {
  temperature: number; // °C
  moisture: number; // % (0-100)
  conductivity: number; // µS/cm (electrical conductivity)
  ph: number; // 4-8 scale
  nitrates: number; // ppm
  phosphates: number; // ppm
}

interface BioacousticReading {
  frequency_hz: number;
  decibels: number;
  species_detected: string[];
  activity_index: number; // 0-100
}

interface MicrobiomeReading {
  bacterial_diversity: number; // Shannon index
  fungal_ratio: number; // bacteria:fungi ratio
  microbial_count: number; // CFU/g
  organic_matter: number; // %
}

/**
 * Generate realistic soil probe readings
 * Represents real IoT sensors in the field
 */
export function generateSoilProbeReading(optimalRange: Partial<SoilProbeReading> = {}): SoilProbeReading {
  const defaults = {
    temperature: 20,
    moisture: 60,
    conductivity: 1000,
    ph: 6.5,
    nitrates: 25,
    phosphates: 15,
  };

  const optimal = { ...defaults, ...optimalRange };

  return {
    temperature: optimal.temperature + (Math.random() - 0.5) * 10,
    moisture: Math.min(100, Math.max(0, optimal.moisture + (Math.random() - 0.5) * 20)),
    conductivity: optimal.conductivity + (Math.random() - 0.5) * 300,
    ph: Math.min(8, Math.max(4, optimal.ph + (Math.random() - 0.5) * 1)),
    nitrates: Math.max(0, optimal.nitrates + (Math.random() - 0.5) * 15),
    phosphates: Math.max(0, optimal.phosphates + (Math.random() - 0.5) * 10),
  };
}

/**
 * Generate bioacoustic sensor readings
 * Detects pollinator and animal activity via sound patterns
 */
export function generateBioacousticReading(): BioacousticReading {
  // Common pollinator frequencies (Hz)
  const frequencies = [
    { hz: 240, species: 'honeybee', minDb: 70, maxDb: 85 },
    { hz: 340, species: 'bumblebee', minDb: 65, maxDb: 80 },
    { hz: 200, species: 'other-insects', minDb: 50, maxDb: 75 },
  ];

  // 60% chance of detecting activity
  if (Math.random() < 0.4) {
    return {
      frequency_hz: 0,
      decibels: 40 + Math.random() * 20, // Background noise
      species_detected: [],
      activity_index: 10 + Math.random() * 20, // Low activity
    };
  }

  const detected = frequencies[Math.floor(Math.random() * frequencies.length)];

  return {
    frequency_hz: detected.hz + (Math.random() - 0.5) * 50,
    decibels: detected.minDb + Math.random() * (detected.maxDb - detected.minDb),
    species_detected: [detected.species],
    activity_index: 40 + Math.random() * 50,
  };
}

/**
 * Generate microbiome health readings
 * Simulates eDNA sequencing or traditional microbial counts
 */
export function generateMicrobiomeReading(healthLevel: 'excellent' | 'good' | 'poor' = 'good'): MicrobiomeReading {
  // Higher health = higher diversity and microbial count
  const healthMultipliers = {
    excellent: { diversity: 4.0, count: 8e8, ratio: 0.5 },
    good: { diversity: 3.5, count: 6e8, ratio: 0.6 },
    poor: { diversity: 2.5, count: 3e8, ratio: 0.8 },
  };

  const multiplier = healthMultipliers[healthLevel];

  return {
    bacterial_diversity: multiplier.diversity + (Math.random() - 0.5) * 0.5, // Shannon index
    fungal_ratio: Math.min(1.5, Math.max(0.1, multiplier.ratio + (Math.random() - 0.5) * 0.2)),
    microbial_count: multiplier.count * (0.8 + Math.random() * 0.4),
    organic_matter: (healthLevel === 'excellent' ? 5 : healthLevel === 'good' ? 3 : 1) +
      Math.random() * 2,
  };
}

/**
 * Convert IoT sensor readings to RegenerativeMetrics score
 * Aggregates soil, bioacoustic, and microbiome data - matches new database schema
 */
export function iotReadingsToMetrics(
  projectId: string,
  soilReading: SoilProbeReading,
  bioacoustics: BioacousticReading,
  microbiome: MicrobiomeReading
): Partial<RegenerativeMetrics> {
  // Soil health scoring (0-100)
  // Optimal: pH 6.5, moisture 60%, conductivity 800-1200
  const phScore = Math.max(0, 100 - Math.abs(soilReading.ph - 6.5) * 20);
  const moistureScore = Math.max(0, 100 - Math.abs(soilReading.moisture - 60) * 1.5);
  const conductivityScore = soilReading.conductivity > 500 && soilReading.conductivity < 1500 ? 100 : 60;
  const soilHealthScore = (phScore + moistureScore + conductivityScore) / 3;

  // Biodiversity scoring from microbiome diversity
  // Shannon index > 3.5 = diverse; < 2.5 = low
  const biodiversityScore = Math.min(100, Math.max(0, (microbiome.bacterial_diversity / 4) * 100));

  // Overall current value (weighted average)
  const currentValue = parseFloat(((soilHealthScore * 0.4 + biodiversityScore * 0.4 + bioacoustics.activity_index * 0.2)).toFixed(2));

  return {
    project_id: projectId,
    zone_id: null,
    metric_name: 'Ecosystem Health Index',
    metric_category: 'soil_health',
    current_value: currentValue,
    baseline_value: 50,
    target_value: 85,
    improvement_percentage: parseFloat(((currentValue - 50) / 50 * 100).toFixed(2)),
    unit: '%',
    trend: currentValue > 60 ? 'improving' : currentValue < 40 ? 'declining' : 'stable',
    last_measured_at: new Date().toISOString(),
  };
}

/**
 * Simulate continuous IoT data stream
 * Returns readings at regular intervals
 */
export async function streamIoTData(
  projectId: string,
  onData: (metrics: Partial<RegenerativeMetrics>) => void,
  intervalSeconds: number = 3600 // Every hour
): Promise<() => void> {
  // Simulate health level based on project type
  let healthLevel: 'excellent' | 'good' | 'poor' = 'good';
  let healthTrend = Math.random() > 0.5 ? 1 : -1; // Improving or declining

  const interval = setInterval(() => {
    // Gradually change health level
    if (Math.random() < 0.1) {
      healthTrend *= -1;
    }

    if (healthLevel === 'good') {
      if (healthTrend > 0 && Math.random() < 0.3) {
        healthLevel = 'excellent';
      } else if (healthTrend < 0 && Math.random() < 0.3) {
        healthLevel = 'poor';
      }
    } else if (healthLevel === 'excellent' && healthTrend < 0 && Math.random() < 0.2) {
      healthLevel = 'good';
    } else if (healthLevel === 'poor' && healthTrend > 0 && Math.random() < 0.2) {
      healthLevel = 'good';
    }

    // Generate readings
    const soilReading = generateSoilProbeReading();
    const bioacoustic = generateBioacousticReading();
    const microbiome = generateMicrobiomeReading(healthLevel);

    // Convert to metrics
    const metrics = iotReadingsToMetrics(projectId, soilReading, bioacoustic, microbiome);

    // Call handler
    onData(metrics);
  }, intervalSeconds * 1000);

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Calculate water stress index from soil moisture and evapotranspiration
 */
export function calculateWaterStressIndex(
  soilMoisture: number,
  temperature: number,
  // Simplified ET estimation
): number {
  // Optimal moisture: 50-70%
  const moistureOptimal = Math.max(0, 100 - Math.abs(soilMoisture - 60) * 2);

  // High temperature increases water stress
  const temperatureStress = Math.max(0, (Math.abs(temperature - 20) / 15) * 30);

  return Math.max(0, 100 - moistureOptimal - temperatureStress);
}

/**
 * Generate nutrient recommendation based on soil readings
 */
export function generateNutrientRecommendation(
  soilReading: SoilProbeReading
): { nitrogen: string; phosphorus: string; potassium: string } {
  return {
    nitrogen: soilReading.nitrates < 20 ? 'High (deficient)' : soilReading.nitrates > 40 ? 'Low (excess)' : 'Adequate',
    phosphorus: soilReading.phosphates < 10 ? 'High (deficient)' : soilReading.phosphates > 25 ? 'Low (excess)' : 'Adequate',
    potassium: 'Monitor', // Would need separate K reading
  };
}

export type { SoilProbeReading, BioacousticReading, MicrobiomeReading };