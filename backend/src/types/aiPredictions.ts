/**
 * AI Predictions & Recommendations Types
 */

// Carbon Sequestration Prediction
export interface CarbonPrediction {
  projectId: string;
  currentSequestration: number;
  predictedSequestration: number;
  confidenceScore: number;
  predictionPeriod: 'month' | 'quarter' | 'year' | '5year' | '10year';
  startDate: string;
  endDate: string;
  factors: PredictionFactor[];
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalVariation: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

export interface PredictionFactor {
  name: string;
  impact: number;
  value: string;
  description: string;
}

export interface RiskFactor {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  mitigation: string;
}

// Project Recommendation
export interface ProjectRecommendation {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  relevanceScore: number;
  reasons: string[];
  expectedImpact: ImpactEstimate;
  estimatedCost: number;
  timeToImpact: string;
  alignmentWithGoals: number;
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface ImpactEstimate {
  carbonReduction: number;
  waterConservation: number;
  biodiversityScore: number;
  communityBenefit: number;
  regenerationScore: number;
}

// Smart Insights
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

// User Behavior Analysis
export interface UserBehaviorProfile {
  userId: string;
  interests: InterestCategory[];
  engagementScore: number;
  preferredImpactAreas: string[];
  donationPatterns: DonationPattern[];
  projectInteractions: ProjectInteraction[];
  recommendationsEnabled: boolean;
  lastAnalyzed: string;
}

export interface InterestCategory {
  category: string;
  score: number;
  keywords: string[];
}

export interface DonationPattern {
  averageAmount: number;
  frequency: string;
  preferredCategories: string[];
  preferredProjectSize: 'small' | 'medium' | 'large';
}

export interface ProjectInteraction {
  projectId: string;
  views: number;
  timeSpent: number;
  donations: number;
  interactions: string[];
  lastInteraction: string;
}
