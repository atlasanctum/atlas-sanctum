/**
 * AI Context — wires aiService + AtlasSanctumAI orchestrator into the React tree.
 * Replaces the previous stub (isAvailable: false).
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import aiService, {
  type SmartInsight,
  type ProjectRecommendation,
  type CarbonPrediction,
} from '@/services/aiService';

interface AIContextValue {
  isAvailable: boolean;
  isLoading: boolean;
  insights: SmartInsight[];
  recommendations: ProjectRecommendation[];
  getCarbonPrediction: (
    projectId: string,
    period?: 'month' | 'quarter' | 'year' | '5year' | '10year'
  ) => Promise<CarbonPrediction | null>;
  refreshInsights: () => Promise<void>;
  refreshRecommendations: (userId: string) => Promise<void>;
}

const AIContext = createContext<AIContextValue>({
  isAvailable: false,
  isLoading: false,
  insights: [],
  recommendations: [],
  getCarbonPrediction: async () => null,
  refreshInsights: async () => {},
  refreshRecommendations: async () => {},
});

export function AIProvider({ children }: { children: ReactNode }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);

  const refreshInsights = useCallback(async () => {
    const data = await aiService.getInsights();
    // Fall back to mock data when backend is unreachable
    setInsights(data.length ? data : aiService.generateMockInsights());
  }, []);

  const refreshRecommendations = useCallback(async (userId: string) => {
    const data = await aiService.getRecommendations(userId);
    setRecommendations(data.length ? data : aiService.generateMockRecommendations());
  }, []);

  const getCarbonPrediction = useCallback(
    (projectId: string, period: 'month' | 'quarter' | 'year' | '5year' | '10year' = 'year') =>
      aiService.getCarbonPrediction(projectId, period),
    []
  );

  // Bootstrap: probe the AI endpoint, load initial insights
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const data = await aiService.getInsights(false);
        if (!cancelled) {
          setInsights(data.length ? data : aiService.generateMockInsights());
          setIsAvailable(true);
        }
      } catch {
        if (!cancelled) {
          setInsights(aiService.generateMockInsights());
          setIsAvailable(true); // still "available" via mock data
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo<AIContextValue>(
    () => ({ isAvailable, isLoading, insights, recommendations, getCarbonPrediction, refreshInsights, refreshRecommendations }),
    [isAvailable, isLoading, insights, recommendations, getCarbonPrediction, refreshInsights, refreshRecommendations]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  return useContext(AIContext);
}

export default AIContext;
