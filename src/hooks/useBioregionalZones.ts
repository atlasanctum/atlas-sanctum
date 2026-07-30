import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BioregionalZone {
  id: string;
  name: string;
  code: string;
  region: string;
  country: string;
  climate_type: string | null;
  description: string | null;
  coordinates: any | null;
  biodiversity_index: number | null;
  carbon_sequestration_rate: number | null;
  active_projects: number | null;
  total_area_hectares: number | null;
  risk_level: string | null;
  created_at: string;
  updated_at: string;
}

export const useBioregionalZones = (zoneIds?: string[]  ) => {
  const query = useQuery<BioregionalZone[]>({
    queryKey: ["bioregional-zones", zoneIds],
    queryFn: async () => {
      let queryBuilder = supabase
        .from("bioregional_zones")
        .select("*")
        .order("name");

      if (zoneIds && zoneIds.length > 0) {
        queryBuilder = queryBuilder.in("id", zoneIds);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Error fetching bioregional zones:", error);
        throw error;
      }

      return data || [];
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useBioregionalZoneByCoordinates = (
  latitude: number | null,
  longitude: number | null
) => {
  const query = useQuery<BioregionalZone | null>({
    queryKey: ["bioregional-zone-location", latitude, longitude],
    enabled: latitude != null && longitude != null,
    queryFn: async () => {
      // For now, return the first zone as we don't have coordinate-based lookup
      const { data, error } = await supabase
        .from("bioregional_zones")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching zone by coordinates:", error);
        return null;
      }

      return data;
    },
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useClimateRiskAssessment = (zoneId?: string) => {
  return useQuery({
    queryKey: ["climate-risk", zoneId],
    enabled: !!zoneId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bioregional_zones")
        .select("risk_level, biodiversity_index, carbon_sequestration_rate")
        .eq("id", zoneId!)
        .single();

      if (error) throw error;

      const riskScore =
        data.risk_level === "critical"
          ? 90
          : data.risk_level === "high"
            ? 75
            : data.risk_level === "medium"
              ? 50
              : 25;

      return {
        risk_level: data.risk_level || "low",
        score: riskScore,
        factors: [
          `Biodiversity index: ${data.biodiversity_index?.toFixed(2) || "N/A"}`,
          `Carbon rate: ${data.carbon_sequestration_rate || "N/A"} t/ha/yr`,
        ],
      };
    },
  });
};

export const useIndigenousLands = () => {
  // The new schema doesn't have indigenous land data, return empty for now
  return {
    data: [],
    isLoading: false,
  };
};
