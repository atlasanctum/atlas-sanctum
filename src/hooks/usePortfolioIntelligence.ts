import { useMemo, useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CarbonProject } from '@/types/marketplace';

export interface PortfolioMetrics {
  totalValue: number;
  totalCredits: number;
  averagePrice: number;
  totalCarbonOffset: number;
  diversificationScore: number; // 0-100
  riskProfile: 'conservative' | 'balanced' | 'aggressive';
  projectedAnnualImpact: number;
  currentYield: number; // percentage
  portfolioComposition: {
    projectType: string;
    percentage: number;
    value: number;
  }[];
}

export interface Recommendation {
  id: string;
  type: 'diversification' | 'high_impact' | 'undervalued' | 'market_opportunity';
  project: CarbonProject;
  reason: string;
  confidence: number; // 0-100
  estimatedROI?: number;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Advanced portfolio analytics and intelligence
 * Provides metrics, composition analysis, and AI-driven recommendations
 */
export function usePortfolioIntelligence(userId?: string) {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<CarbonProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user holdings
  const fetchHoldings = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_holdings')
        .select(
          `
          *,
          carbon_projects (*)
        `
        )
        .eq('user_id', userId);

      if (error) throw error;
      setHoldings(data || []);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch all projects for comparison
  const fetchAllProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('carbon_projects')
        .select('*')
        .eq('status', 'active')
        .limit(100);

      if (error) throw error;
      setAllProjects((data || []) as CarbonProject[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  // Calculate portfolio metrics
  const calculateMetrics = useCallback(
    (holdings: any[], projects: CarbonProject[]): PortfolioMetrics => {
      const totalValue = holdings.reduce(
        (sum, h) => sum + h.quantity * h.carbon_projects?.price_per_credit || 0,
        0
      );
      const totalCredits = holdings.reduce((sum, h) => sum + h.quantity, 0);
      const averagePrice = totalCredits > 0 ? totalValue / totalCredits : 0;
      const totalCarbonOffset = holdings.reduce(
        (sum, h) => sum + h.quantity * (h.carbon_projects?.co2_offset_per_credit || 0),
        0
      );

      // Calculate diversification score
      const typeDistribution: { [key: string]: number } = {};
      holdings.forEach((h) => {
        const type = h.carbon_projects?.project_type || 'unknown';
        typeDistribution[type] = (typeDistribution[type] || 0) + h.quantity;
      });

      const diversificationScore = Math.min(
        100,
        (Object.keys(typeDistribution).length / 6) * 100
      );

      // Determine risk profile based on diversification and concentration
      const maxConcentration = Math.max(
        ...Object.values(typeDistribution).map((v: any) =>
          totalCredits > 0 ? (v / totalCredits) * 100 : 0
        ),
        0
      );

      let riskProfile: 'conservative' | 'balanced' | 'aggressive' = 'balanced';
      if (diversificationScore > 70 && maxConcentration < 40) {
        riskProfile = 'conservative';
      } else if (diversificationScore < 30 || maxConcentration > 60) {
        riskProfile = 'aggressive';
      }

      // Project annual impact
      const projectedAnnualImpact = totalCarbonOffset * 1.15; // 15% growth assumption
      const currentYield = totalValue > 0 ? ((projectedAnnualImpact * 50) / totalValue) * 100 : 0;

      // Portfolio composition
      const portfolioComposition = Object.entries(typeDistribution).map(
        ([type, quantity]: [string, any]) => ({
          projectType: type,
          percentage: totalCredits > 0 ? (quantity / totalCredits) * 100 : 0,
          value: quantity * averagePrice,
        })
      );

      return {
        totalValue,
        totalCredits,
        averagePrice,
        totalCarbonOffset,
        diversificationScore,
        riskProfile,
        projectedAnnualImpact,
        currentYield,
        portfolioComposition,
      };
    },
    []
  );

  // Generate recommendations
  const generateRecommendations = useCallback(
    (holdings: any[], metrics: PortfolioMetrics, projects: CarbonProject[]): Recommendation[] => {
      const recommendations: Recommendation[] = [];
      const heldProjectIds = new Set(holdings.map((h) => h.project_id));

      // 1. Diversification recommendations
      const underrepresentedTypes = ['renewable_energy', 'ocean_restoration', 'soil_carbon'].filter(
        (type) => !holdings.some((h) => h.carbon_projects?.project_type === type)
      );

      underrepresentedTypes.forEach((type) => {
        const project = projects.find((p) => p.project_type === type);
        if (project && !heldProjectIds.has(project.id)) {
          recommendations.push({
            id: `div-${project.id}`,
            type: 'diversification',
            project,
            reason: `Add ${type.replace(/_/g, ' ')} to diversify your portfolio`,
            confidence: 75,
            priority: 'medium',
          });
        }
      });

      // 2. High-impact opportunities
      const highImpactProjects = projects
        .filter((p) => p.impact_score && p.impact_score > 80 && !heldProjectIds.has(p.id))
        .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
        .slice(0, 3);

      highImpactProjects.forEach((project) => {
        recommendations.push({
          id: `impact-${project.id}`,
          type: 'high_impact',
          project,
          reason: `High impact project with ${project.impact_score}/100 score`,
          confidence: 85,
          estimatedROI: 15,
          priority: 'high',
        });
      });

      // 3. Undervalued opportunities (good price relative to impact)
      const undervaluedProjects = projects
        .filter((p) => {
          const priceToImpact = p.price_per_credit / (p.impact_score || 50);
          return priceToImpact < 0.5 && !heldProjectIds.has(p.id);
        })
        .slice(0, 3);

      undervaluedProjects.forEach((project) => {
        recommendations.push({
          id: `value-${project.id}`,
          type: 'undervalued',
          project,
          reason: 'Good value: high impact at competitive price',
          confidence: 80,
          priority: 'medium',
        });
      });

      return recommendations.sort((a, b) => b.confidence - a.confidence);
    },
    []
  );

  // Update metrics when holdings change
  useEffect(() => {
    if (holdings.length > 0 || allProjects.length > 0) {
      const newMetrics = calculateMetrics(holdings, allProjects);
      setMetrics(newMetrics);
    }
  }, [holdings, allProjects, calculateMetrics]);

  // Fetch data on mount
  useEffect(() => {
    if (userId) {
      fetchHoldings();
      fetchAllProjects();
    }
  }, [userId, fetchHoldings, fetchAllProjects]);

  // Generate recommendations
  const recommendations = useMemo(
    () =>
      metrics && allProjects.length > 0
        ? generateRecommendations(holdings, metrics, allProjects)
        : [],
    [metrics, holdings, allProjects, generateRecommendations]
  );

  // Rebalance suggestion
  const getRebalanceSuggestion = useCallback(() => {
    if (!metrics) return null;

    if (metrics.riskProfile === 'aggressive' && metrics.diversificationScore < 40) {
      return {
        type: 'diversification',
        action: 'Consider adding 2-3 different project types to reduce risk',
        impact: 'Could improve portfolio stability',
      };
    }

    if (
      metrics.portfolioComposition.some((c) => c.percentage > 50) &&
      metrics.diversificationScore < 50
    ) {
      return {
        type: 'concentration',
        action: 'Your portfolio is concentrated in one project type',
        impact: 'Diversification could improve returns',
      };
    }

    return null;
  }, [metrics]);

  // Export portfolio data
  const exportPortfolioData = useCallback(() => {
    if (!metrics || !holdings) return null;

    return {
      timestamp: new Date().toISOString(),
      metrics,
      holdings: holdings.map((h) => ({
        projectName: h.carbon_projects?.title,
        quantity: h.quantity,
        purchasePrice: h.purchase_price,
        currentPrice: h.carbon_projects?.price_per_credit,
        value: h.quantity * h.carbon_projects?.price_per_credit,
        retired: h.retired,
      })),
    };
  }, [metrics, holdings]);

  return {
    metrics,
    holdings,
    isLoading,
    recommendations,
    rebalanceSuggestion: getRebalanceSuggestion(),
    exportPortfolioData,
    refetch: () => {
      if (userId) {
        fetchHoldings();
        fetchAllProjects();
      }
    },
  };
}

/**
 * Hook for portfolio comparison and benchmarking
 */
export function usePortfolioBenchmark(userPortfolioMetrics?: PortfolioMetrics) {
  // Mock benchmark data since we don't have aggregate data yet
  const benchmarkData = useMemo(() => ({
    avg_diversification: 55,
    avg_yield: 12,
    avg_value: 5000,
  }), []);

  const comparison = useMemo(() => {
    if (!userPortfolioMetrics) return null;

    return {
      diversificationVsAverage:
        userPortfolioMetrics.diversificationScore - benchmarkData.avg_diversification,
      yieldVsAverage:
        userPortfolioMetrics.currentYield - benchmarkData.avg_yield,
      valueVsAverage: userPortfolioMetrics.totalValue - benchmarkData.avg_value,
    };
  }, [userPortfolioMetrics, benchmarkData]);

  return { benchmarkData, comparison };
}
