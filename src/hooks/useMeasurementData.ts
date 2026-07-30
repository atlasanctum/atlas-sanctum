import { useQuery } from "@tanstack/react-query";
import type { MeasurementData, MeasurementSummary } from "@/types/marketplace";

// Generate mock measurement data
const generateMockMeasurements = (projectId: string, days: number = 30): MeasurementData[] => {
  const measurements: MeasurementData[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    measurements.push({
      id: `measurement-${projectId}-${i}`,
      project_id: projectId,
      measurement_date: date.toISOString(),
      satellite_source: i % 3 === 0 ? "Sentinel-2" : i % 3 === 1 ? "Landsat-8" : "IoT-Sensor",
      co2_level: 380 + Math.random() * 30 - 15,
      soil_carbon_ppm: 2500 + Math.random() * 500,
      ndvi_index: 0.6 + Math.random() * 0.3,
      biodiversity_score: 70 + Math.random() * 25,
      temperature_celsius: 22 + Math.random() * 8,
      precipitation_mm: Math.random() * 50,
      confidence_level: 0.85 + Math.random() * 0.1,
      anomaly_flag: Math.random() < 0.05,
      anomaly_reason: Math.random() < 0.05 ? "Unusual CO2 spike detected" : null,
      location: { type: "Point", coordinates: [-60.0, -3.0] },
      source_url: null,
      raw_data: null,
      created_at: date.toISOString(),
    });
  }

  return measurements;
};

interface UseMeasurementDataOptions {
  days?: number;
}

export const useMeasurementData = (projectId: string | undefined, options?: UseMeasurementDataOptions) => {
  const days = options?.days ?? 30;
  
  const query = useQuery<MeasurementData[]>({
    queryKey: ["measurements", projectId, days],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) return [];
      await new Promise((resolve) => setTimeout(resolve, 300));
      return generateMockMeasurements(projectId, days);
    },
  });

  // Compute summary from latest measurements
  const summary: MeasurementSummary | null = query.data
    ? {
        latest: query.data[0] || null,
        average_co2_7d: computeAverage(query.data.slice(0, 7).map((m) => m.co2_level)),
        average_ndvi_7d: computeAverage(query.data.slice(0, 7).map((m) => m.ndvi_index)),
        anomalies_count: query.data.filter((m) => m.anomaly_flag).length,
        confidence_trend: computeConfidenceTrend(query.data.slice(0, 7)),
        last_updated: query.data[0]?.measurement_date || new Date().toISOString(),
      }
    : null;

  return {
    data: query.data || [],
    summary,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// Additional hook exports for components
export const useMeasurementSummary = (projectId: string | undefined) => {
  const { summary, isLoading } = useMeasurementData(projectId);
  return { data: summary, isLoading };
};

export const useLatestMeasurement = (projectId: string | undefined) => {
  const { data, isLoading } = useMeasurementData(projectId, { days: 1 });
  return { data: data?.[0] || null, isLoading };
};

// Helper to compute average of optional numbers
function computeAverage(values: (number | null | undefined)[]): number | null {
  const filtered = values.filter((v): v is number => v != null);
  if (filtered.length === 0) return null;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
}

// Helper to determine confidence trend
function computeConfidenceTrend(recent: MeasurementData[]): "improving" | "stable" | "declining" {
  if (recent.length < 2) return "stable";

  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.ceil(recent.length / 2));

  const avg1 = firstHalf.reduce((sum, m) => sum + m.confidence_level, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((sum, m) => sum + m.confidence_level, 0) / secondHalf.length;

  const diff = avg2 - avg1;
  if (diff > 0.05) return "improving";
  if (diff < -0.05) return "declining";
  return "stable";
}
