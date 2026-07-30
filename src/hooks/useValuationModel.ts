import { useQuery } from "@tanstack/react-query";
import type { ValuationModel, ImpactBreakdown } from "@/types/marketplace";

// Mock valuation model generator
const generateMockValuation = (projectId: string): ValuationModel => {
  return {
    id: `val-${projectId}`,
    project_id: projectId,
    impact_co2_weight: 0.45,
    impact_biodiversity_weight: 0.35,
    impact_health_weight: 0.2,
    weighted_impact_score: 75 + Math.random() * 15,
    confidence_score: 0.85 + Math.random() * 0.1,
    confidence_upper_bound: 85 + Math.random() * 10,
    confidence_lower_bound: 65 + Math.random() * 10,
    reversal_risk_percent: 5 + Math.random() * 8,
    reversal_risk_decay_rate: 0.92 + Math.random() * 0.05,
    permanence_bond_percent: 2 + Math.random() * 3,
    base_credit_price: 20 + Math.random() * 15,
    dynamic_price_multiplier: 1.5 + Math.random() * 1.5,
    final_credit_price: 45 + Math.random() * 30,
    last_recomputed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const useValuationModel = (projectId: string | undefined) => {
  const query = useQuery<ValuationModel | null>({
    queryKey: ["valuation-model", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) return null;
      await new Promise((resolve) => setTimeout(resolve, 300));
      return generateMockValuation(projectId);
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

// Additional exported hooks
export const useDynamicCreditPrice = (projectId: string | undefined) => {
  const { data: valuation } = useValuationModel(projectId);
  
  return {
    data: valuation ? {
      base_price: valuation.base_credit_price || 25,
      final_price: valuation.final_credit_price || 50,
      price_change_percent: ((valuation.final_credit_price || 50) - (valuation.base_credit_price || 25)) / (valuation.base_credit_price || 25) * 100,
      multipliers: {
        impact: valuation.dynamic_price_multiplier,
        confidence: valuation.confidence_score || 0.9,
        risk: 1 - (valuation.reversal_risk_percent / 100),
      },
    } : null,
  };
};

export const useImpactBreakdown = (projectId: string | undefined) => {
  const { data: valuation } = useValuationModel(projectId);
  
  return {
    data: valuation ? computeImpactBreakdown(valuation) : null,
  };
};

export const useReversalRiskDecay = (projectId: string | undefined, years: number = 10) => {
  const { data: valuation } = useValuationModel(projectId);
  
  if (!valuation) return { data: null };
  
  const currentRisk = valuation.reversal_risk_percent;
  const futureRisk = currentRisk * Math.pow(valuation.reversal_risk_decay_rate, years);
  
  return {
    data: {
      current_risk: currentRisk,
      future_risk: futureRisk,
      risk_reduction_percent: ((currentRisk - futureRisk) / currentRisk) * 100,
      permanence_score: 100 - futureRisk,
      permanence_bond_amount: valuation.permanence_bond_percent,
      decay_rate: valuation.reversal_risk_decay_rate,
    },
  };
};

export const useValuationConfidenceInterval = (projectId: string | undefined) => {
  const { data: valuation } = useValuationModel(projectId);
  
  return {
    data: valuation ? {
      confidence_level: (valuation.confidence_score || 0.85) * 100,
      lower_bound: valuation.confidence_lower_bound || 70,
      upper_bound: valuation.confidence_upper_bound || 90,
      score: valuation.weighted_impact_score || 75,
    } : null,
  };
};

export const usePriceProjection = (projectId: string | undefined) => {
  const { data: valuation } = useValuationModel(projectId);
  
  if (!valuation) return { data: null };
  
  const currentPrice = valuation.final_credit_price || 50;
  const projectedPrices = Array.from({ length: 10 }, (_, year) => ({
    year: year + 1,
    price: currentPrice * (1 + 0.05 * (year + 1)), // 5% annual appreciation
  }));
  
  return {
    data: {
      current_price: currentPrice,
      worst_case: currentPrice * 0.8,
      best_case: currentPrice * 1.5,
      projected_prices: projectedPrices,
    },
  };
};

// Helper to compute impact breakdown from valuation model
export function computeImpactBreakdown(model: ValuationModel): ImpactBreakdown {
  const totalWeight = model.impact_co2_weight + model.impact_biodiversity_weight + model.impact_health_weight;

  const co2Component = {
    value: 100,
    weight: model.impact_co2_weight,
    contribution: (model.impact_co2_weight / totalWeight) * (model.weighted_impact_score || 0),
  };

  const biodiversityComponent = {
    value: 100,
    weight: model.impact_biodiversity_weight,
    contribution: (model.impact_biodiversity_weight / totalWeight) * (model.weighted_impact_score || 0),
  };

  const healthComponent = {
    value: 100,
    weight: model.impact_health_weight,
    contribution: (model.impact_health_weight / totalWeight) * (model.weighted_impact_score || 0),
  };

  return {
    co2_component: co2Component,
    biodiversity_component: biodiversityComponent,
    health_component: healthComponent,
    final_score: model.weighted_impact_score || 0,
    confidence_interval: [
      model.confidence_lower_bound || 0,
      model.confidence_upper_bound || 100,
    ],
    reversal_risk_adjusted_price: model.final_credit_price || 0,
  };
}
