import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RegenerativeMetric {
  id: string;
  project_id: string | null;
  zone_id: string | null;
  metric_name: string;
  metric_category: string;
  current_value: number;
  baseline_value: number | null;
  target_value: number | null;
  improvement_percentage: number | null;
  unit: string;
  trend: string | null;
  last_measured_at: string | null;
  created_at: string;
  updated_at: string;
}

interface RegenerativeMetricsTrend {
  microbiome_trend_30d: number | null;
  biodiversity_trend_30d: number | null;
  crop_diversity_trend_30d: number | null;
  pollinator_trend_30d: number | null;
  latest_scores: RegenerativeMetric | null;
  health_status: "excellent" | "good" | "fair" | "poor";
}

interface UseRegenerativeMetricsOptions {
  days?: number;
}

export const useRegenerativeMetrics = (
  projectId: string | undefined,
  options?: UseRegenerativeMetricsOptions
) => {
  const query = useQuery<RegenerativeMetric[]>({
    queryKey: ["regenerative-metrics", projectId, options?.days],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("regenerative_metrics")
        .select("*")
        .order("last_measured_at", { ascending: false });

      if (projectId) {
        queryBuilder = queryBuilder.eq("project_id", projectId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching regenerative metrics:", error);
        throw error;
      }

      return data || [];
    },
  });

  // Compute trend from latest measurements
  const trend: RegenerativeMetricsTrend | null = query.data?.length
    ? {
        microbiome_trend_30d: computeTrendFromMetrics(query.data, "Soil"),
        biodiversity_trend_30d: computeTrendFromMetrics(query.data, "Biodiversity"),
        crop_diversity_trend_30d: computeTrendFromMetrics(query.data, "Land Use"),
        pollinator_trend_30d: null,
        latest_scores: query.data[0] || null,
        health_status: computeHealthStatus(query.data),
      }
    : null;

  return {
    data: query.data || [],
    trend,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useSoilHealthScore = (projectId: string | undefined) => {
  const { data } = useRegenerativeMetrics(projectId);
  const soilMetric = data?.find((m) => m.metric_category === "Soil");

  return {
    data: soilMetric
      ? {
          score: soilMetric.current_value,
          level:
            soilMetric.current_value >= 80
              ? "excellent"
              : soilMetric.current_value >= 60
                ? "good"
                : soilMetric.current_value >= 40
                  ? "fair"
                  : "poor",
          recommendations: [
            "Increase cover crop diversity",
            "Reduce tillage frequency",
            "Add organic matter amendments",
          ],
        }
      : null,
  };
};

export const useBiodiversityIndex = (projectId: string | undefined) => {
  const { data } = useRegenerativeMetrics(projectId);
  const bioMetric = data?.find((m) => m.metric_category === "Biodiversity");

  return {
    data: bioMetric
      ? {
          index: bioMetric.current_value * 100,
          status:
            bioMetric.current_value >= 0.8
              ? "high"
              : bioMetric.current_value >= 0.5
                ? "moderate"
                : "low",
          species_estimate: Math.floor(bioMetric.current_value * 100),
          pollinator_presence: bioMetric.current_value > 0.6,
          conservation_priority: bioMetric.current_value >= 0.85,
        }
      : null,
  };
};

export const useCropDiversityMetrics = (projectId: string | undefined) => {
  const { data } = useRegenerativeMetrics(projectId);
  const landMetric = data?.find((m) => m.metric_category === "Land Use");

  return {
    data: landMetric
      ? {
          diversity_index: landMetric.current_value,
          diversity_level:
            landMetric.current_value >= 70
              ? "high"
              : landMetric.current_value >= 40
                ? "moderate"
                : "low",
          crop_count: Math.floor(landMetric.current_value / 10),
          is_monoculture: landMetric.current_value < 30,
        }
      : null,
  };
};

export const useRegenerativeMetricsTrend = (projectId: string | undefined) => {
  const { trend } = useRegenerativeMetrics(projectId);
  return { data: trend };
};

// Helper to compute trend from metrics by category
function computeTrendFromMetrics(
  metrics: RegenerativeMetric[],
  category: string
): number | null {
  const categoryMetric = metrics.find((m) => m.metric_category === category);
  return categoryMetric?.improvement_percentage || null;
}

// Helper to compute health status
function computeHealthStatus(
  metrics: RegenerativeMetric[]
): "excellent" | "good" | "fair" | "poor" {
  if (!metrics.length) return "fair";

  const avgImprovement =
    metrics.reduce((sum, m) => sum + (m.improvement_percentage || 0), 0) /
    metrics.length;

  if (avgImprovement >= 40) return "excellent";
  if (avgImprovement >= 25) return "good";
  if (avgImprovement >= 10) return "fair";
  return "poor";
}
