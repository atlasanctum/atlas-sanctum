/**
 * AI Recommendations Service
 * Frontend service for AI-powered predictions and recommendations
 */

import { v4 as uuidv4 } from 'uuid';

// Types for AI predictions
export interface CarbonPrediction {
  projectId: string;
  currentSequestration: number;
  predictedSequestration: number;
  confidenceScore: number;
  predictionPeriod: 'month' | 'quarter' | 'year' | '5year' | '10year';
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalVariation: number;
  recommendations: string[];
}

export interface ProjectRecommendation {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  relevanceScore: number;
  reasons: string[];
  expectedImpact: {
    carbonReduction: number;
    waterConservation: number;
    biodiversityScore: number;
    communityBenefit: number;
    regenerationScore: number;
  };
  estimatedCost: number;
  timeToImpact: string;
  alignmentWithGoals: number;
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface SmartInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'opportunity' | 'warning' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'carbon' | 'water' | 'biodiversity' | 'community' | 'finance';
  actionable: boolean;
  actionItems?: string[];
  relatedMetrics?: string[];
  expiresAt?: string;
  createdAt: string;
}

export interface UserBehaviorProfile {
  userId: string;
  interests: {
    category: string;
    score: number;
    keywords: string[];
  }[];
  engagementScore: number;
  preferredImpactAreas: string[];
  donationPatterns: {
    averageAmount: number;
    frequency: string;
    preferredCategories: string[];
    preferredProjectSize: 'small' | 'medium' | 'large';
  }[];
  projectInteractions: {
    projectId: string;
    views: number;
    timeSpent: number;
    donations: number;
    interactions: string[];
    lastInteraction: string;
  }[];
  recommendationsEnabled: boolean;
  lastAnalyzed: string;
}

// API Configuration
const API_BASE = import.meta.env.VITE_API_URL || '/api/v2';

class AIService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data or return null if expired
   */
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Cache data with timestamp
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Fetch carbon prediction for a project
   */
  async getCarbonPrediction(
    projectId: string,
    period: 'month' | 'quarter' | 'year' | '5year' | '10year' = 'year',
    useCache = true
  ): Promise<CarbonPrediction | null> {
    const cacheKey = `carbon:${projectId}:${period}`;
    
    if (useCache) {
      const cached = this.getCached<CarbonPrediction>(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch(
        `${API_BASE}/ai/carbon-prediction/${projectId}?period=${period}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch carbon prediction');
      
      const data = await response.json();
      this.setCache(cacheKey, data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching carbon prediction:', error);
      return null;
    }
  }

  /**
   * Get personalized recommendations for a user
   */
  async getRecommendations(
    userId: string,
    limit = 5,
    useCache = true
  ): Promise<ProjectRecommendation[]> {
    const cacheKey = `recommendations:${userId}:${limit}`;
    
    if (useCache) {
      const cached = this.getCached<ProjectRecommendation[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch(
        `${API_BASE}/ai/recommendations/${userId}?limit=${limit}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const data = await response.json();
      this.setCache(cacheKey, data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  /**
   * Get smart insights for the platform
   */
  async getInsights(useCache = true): Promise<SmartInsight[]> {
    const cacheKey = 'insights';
    
    if (useCache) {
      const cached = this.getCached<SmartInsight[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch(`${API_BASE}/ai/insights`);
      
      if (!response.ok) throw new Error('Failed to fetch insights');
      
      const data = await response.json();
      this.setCache(cacheKey, data.data);
      return data.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }

  /**
   * Analyze user behavior and get profile
   */
  async analyzeUserBehavior(userId: string): Promise<UserBehaviorProfile | null> {
    try {
      const response = await fetch(`${API_BASE}/ai/analyze-behavior/${userId}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to analyze user behavior');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return null;
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Generate mock data for demo mode
   */
  generateMockCarbonPredictions(): CarbonPrediction[] {
    return [
      {
        projectId: 'amazon-rainforest',
        currentSequestration: 1250,
        predictedSequestration: 1850,
        confidenceScore: 0.89,
        predictionPeriod: 'year',
        trend: 'increasing',
        seasonalVariation: 0.12,
        recommendations: [
          'Consider expanding protected area by 20%',
          'Invest in anti-deforestation monitoring',
          'Partner with indigenous communities for stewardship'
        ]
      },
      {
        projectId: 'coral-reef-restoration',
        currentSequestration: 320,
        predictedSequestration: 580,
        confidenceScore: 0.76,
        predictionPeriod: 'year',
        trend: 'increasing',
        seasonalVariation: 0.08,
        recommendations: [
          'Deploy additional coral nurseries',
          'Monitor water temperature closely',
          'Engage local fishing communities'
        ]
      },
      {
        projectId: 'mangrove-conservation',
        currentSequestration: 890,
        predictedSequestration: 1100,
        confidenceScore: 0.92,
        predictionPeriod: 'year',
        trend: 'stable',
        seasonalVariation: 0.05,
        recommendations: [
          'Maintain current protection levels',
          'Expand community-based monitoring',
          'Explore carbon credit opportunities'
        ]
      }
    ];
  }

  generateMockRecommendations(): ProjectRecommendation[] {
    const categories = ['forest_conservation', 'ocean_conservation', 'renewable_energy', 'community_development'];
    
    return categories.flatMap((category, i) => ({
      id: uuidv4(),
      projectId: `project-${category}-${i}`,
      projectName: `${category.replace(/_/g, ' ')} Project ${i + 1}`,
      category,
      relevanceScore: 0.5 + Math.random() * 0.5,
      reasons: ['Aligned with your interests', 'High impact potential'],
      expectedImpact: {
        carbonReduction: Math.floor(100 + Math.random() * 2000),
        waterConservation: Math.floor(10 + Math.random() * 500),
        biodiversityScore: Math.floor(50 + Math.random() * 50),
        communityBenefit: Math.floor(30 + Math.random() * 70),
        regenerationScore: Math.floor(40 + Math.random() * 60)
      },
      estimatedCost: Math.floor(10000 + Math.random() * 90000),
      timeToImpact: '1 year',
      alignmentWithGoals: 0.6 + Math.random() * 0.4,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      tags: [category, 'verified', 'impact']
    }));
  }

  generateMockInsights(): SmartInsight[] {
    return [
      {
        id: uuidv4(),
        type: 'prediction',
        title: 'Carbon Sequestration Surge Expected',
        description: 'Based on recent growth patterns, forest projects are projected to exceed annual carbon targets by 15-20%.',
        confidence: 0.88,
        impact: 'high',
        category: 'carbon',
        actionable: true,
        actionItems: ['Review top-performing projects', 'Consider scaling successful interventions'],
        relatedMetrics: ['carbon_absorption', 'forest_growth', 'biomass_accumulation'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'trend',
        title: 'Community-Led Projects Gaining Momentum',
        description: 'Projects with strong community involvement show 2.3x better long-term sustainability outcomes.',
        confidence: 0.82,
        impact: 'medium',
        category: 'community',
        actionable: true,
        actionItems: ['Prioritize community proposals', 'Invest in community capacity building'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'opportunity',
        title: 'Blue Carbon Projects Underfunded',
        description: 'Ocean-based carbon projects represent only 5% of portfolio but show exceptional cost-effectiveness.',
        confidence: 0.79,
        impact: 'high',
        category: 'carbon',
        actionable: true,
        actionItems: ['Review ocean conservation opportunities', 'Consider pilot investment in blue carbon'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'warning',
        title: 'Dry Season Impact Alert',
        description: 'Several Mediterranean climate projects showing stress indicators. Consider supplementary irrigation.',
        confidence: 0.91,
        impact: 'high',
        category: 'biodiversity',
        actionable: true,
        actionItems: ['Assess water needs', 'Implement drought mitigation strategies'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'anomaly',
        title: 'Unusual Donation Pattern Detected',
        description: 'Micro-donations under $10 have increased 340% this month, indicating growing grassroots support.',
        confidence: 0.85,
        impact: 'low',
        category: 'finance',
        actionable: false,
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export const aiService = new AIService();
export default aiService;
