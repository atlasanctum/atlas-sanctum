/**
 * AI-Powered Impact Predictions & Recommendations Dashboard
 * ML-based carbon forecasting and personalized recommendations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  Zap,
  Leaf,
  Droplets,
  Sun
} from 'lucide-react';

// Types for AI predictions with uncertainty quantification
interface CarbonPrediction {
  projectId: string;
  currentSequestration: number;
  predictedSequestration: number;
  predictedLowerCI: number;  // 95% confidence interval lower bound
  predictedUpperCI: number;  // 95% confidence interval upper bound
  confidenceScore: number;
  confidenceLevel: number;  // e.g., 0.95 for 95% CI
  predictionPeriod: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalVariation: number;
  recommendations: string[];
  epistemicStatus: 'well_supported' | 'supported' | 'preliminary' | 'speculative';
  modelVersion: string;
  lastCalibrated: string;
  dataQualityScore: number;
  deferralReason?: string;
}

interface SmartInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'opportunity' | 'warning' | 'trend';
  title: string;
  description: string;
  confidence: number;
  confidenceInterval: [number, number];  // Lower and upper bounds
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  actionItems?: string[];
  uncertaintyExplanation?: string;  // Human-readable explanation of uncertainty
}

// Mock data for demo mode with uncertainty quantification
const mockCarbonPredictions: CarbonPrediction[] = [
  {
    projectId: 'amazon-rainforest',
    currentSequestration: 1250,
    predictedSequestration: 1850,
    predictedLowerCI: 1650,
    predictedUpperCI: 2050,
    confidenceScore: 0.89,
    confidenceLevel: 0.95,
    predictionPeriod: 'year',
    trend: 'increasing',
    seasonalVariation: 0.12,
    recommendations: [
      'Consider expanding protected area by 20%',
      'Invest in anti-deforestation monitoring',
      'Partner with indigenous communities for stewardship'
    ],
    epistemicStatus: 'well_supported',
    modelVersion: 'v2.1.0',
    lastCalibrated: '2024-01-15',
    dataQualityScore: 0.92
  },
  {
    projectId: 'coral-reef-restoration',
    currentSequestration: 320,
    predictedSequestration: 580,
    predictedLowerCI: 450,
    predictedUpperCI: 710,
    confidenceScore: 0.76,
    confidenceLevel: 0.90,
    predictionPeriod: 'year',
    trend: 'increasing',
    seasonalVariation: 0.08,
    recommendations: [
      'Deploy additional coral nurseries',
      'Monitor water temperature closely',
      'Engage local fishing communities'
    ],
    epistemicStatus: 'supported',
    modelVersion: 'v2.0.5',
    lastCalibrated: '2024-01-10',
    dataQualityScore: 0.78
  },
  {
    projectId: 'mangrove-conservation',
    currentSequestration: 890,
    predictedSequestration: 1100,
    predictedLowerCI: 980,
    predictedUpperCI: 1220,
    confidenceScore: 0.92,
    confidenceLevel: 0.95,
    predictionPeriod: 'year',
    trend: 'stable',
    seasonalVariation: 0.05,
    recommendations: [
      'Maintain current protection levels',
      'Expand community-based monitoring',
      'Explore carbon credit opportunities'
    ],
    epistemicStatus: 'well_supported',
    modelVersion: 'v2.1.2',
    lastCalibrated: '2024-01-18',
    dataQualityScore: 0.95
  }
];

interface ProjectRecommendation {
  id: string;
  projectName: string;
  matchScore: number;
  relevanceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: string;
  category: string;
  description: string;
  expectedImpact: {
    carbonReduction: number;
    waterConservation: number;
    biodiversityScore: number;
    communityBenefit: number;
  };
  reasons: string[];
}

const mockRecommendations: ProjectRecommendation[] = [
  {
    id: 'rec-1',
    projectName: 'Amazon Reforestation Initiative',
    matchScore: 0.95,
    relevanceScore: 0.95,
    riskLevel: 'low',
    expectedReturn: '12-18%',
    category: 'Reforestation',
    description: 'High-impact reforestation project with strong community support.',
    expectedImpact: { carbonReduction: 1200, waterConservation: 450, biodiversityScore: 87, communityBenefit: 92 },
    reasons: ['Strong historical performance', 'Community-led stewardship', 'Verified methodology'],
  },
  {
    id: 'rec-2',
    projectName: 'Blue Carbon Mangrove Restoration',
    matchScore: 0.88,
    relevanceScore: 0.88,
    riskLevel: 'medium',
    expectedReturn: '8-14%',
    category: 'Ocean Restoration',
    description: 'Coastal mangrove restoration with significant biodiversity co-benefits.',
    expectedImpact: { carbonReduction: 800, waterConservation: 320, biodiversityScore: 79, communityBenefit: 85 },
    reasons: ['Growing blue carbon market', 'Coastal protection co-benefits', 'Low competition'],
  },
];

const mockInsights: SmartInsight[] = [
  {
    id: 'insight-1',
    type: 'prediction',
    title: 'Carbon Sequestration Surge Expected',
    description: 'Based on recent growth patterns, forest projects are projected to exceed annual carbon targets by 15-20%.',
    confidence: 0.88,
    confidenceInterval: [0.82, 0.94],
    impact: 'high',
    actionable: true,
    actionItems: ['Review top-performing projects', 'Consider scaling successful interventions'],
    uncertaintyExplanation: 'Based on 5 years of historical data with strong correlation patterns'
  },
  {
    id: 'insight-2',
    type: 'trend',
    title: 'Community-Led Projects Gaining Momentum',
    description: 'Projects with strong community involvement show 2.3x better long-term sustainability outcomes.',
    confidence: 0.82,
    confidenceInterval: [0.75, 0.89],
    impact: 'medium',
    actionable: true,
    actionItems: ['Prioritize community proposals', 'Invest in community capacity building'],
    uncertaintyExplanation: 'Analysis of 234 projects across 12 bioregions'
  },
  {
    id: 'insight-3',
    type: 'opportunity',
    title: 'Blue Carbon Projects Underfunded',
    description: 'Ocean-based carbon projects represent only 5% of portfolio but show exceptional cost-effectiveness.',
    confidence: 0.79,
    confidenceInterval: [0.71, 0.87],
    impact: 'high',
    actionable: true,
    actionItems: ['Review ocean conservation opportunities', 'Consider pilot investment in blue carbon'],
    uncertaintyExplanation: 'Limited historical data; projection based on 28 blue carbon projects'
  },
  {
    id: 'insight-4',
    type: 'warning',
    title: 'Dry Season Impact Alert',
    description: 'Several Mediterranean climate projects showing stress indicators. Consider supplementary irrigation.',
    confidence: 0.91,
    confidenceInterval: [0.86, 0.96],
    impact: 'high',
    actionable: true,
    actionItems: ['Assess water needs', 'Implement drought mitigation strategies'],
    uncertaintyExplanation: 'High confidence due to satellite monitoring data and ground sensors'
  }
];

// Chart data
const carbonTrendData = [
  { month: 'Jan', actual: 1200, predicted: 1200 },
  { month: 'Feb', actual: 1350, predicted: 1350 },
  { month: 'Mar', actual: 1420, predicted: 1420 },
  { month: 'Apr', actual: 1580, predicted: 1580 },
  { month: 'May', actual: 1650, predicted: 1650 },
  { month: 'Jun', actual: 1720, predicted: 1750 },
  { month: 'Jul', predicted: 1820 },
  { month: 'Aug', predicted: 1900 },
  { month: 'Sep', predicted: 1980 },
  { month: 'Oct', predicted: 2050 },
  { month: 'Nov', predicted: 2120 },
  { month: 'Dec', predicted: 2200 }
];

const impactDistribution = [
  { name: 'Carbon Reduction', value: 45, color: '#10b981' },
  { name: 'Water Conservation', value: 25, color: '#3b82f6' },
  { name: 'Biodiversity', value: 20, color: '#8b5cf6' },
  { name: 'Community Benefit', value: 10, color: '#f59e0b' }
];

// Utility components
const InsightCard: React.FC<{ insight: SmartInsight; index: number }> = ({ insight, index }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'prediction': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'anomaly': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      default: return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBorderColor = () => {
    switch (insight.type) {
      case 'prediction': return 'border-emerald-500/30';
      case 'anomaly': return 'border-amber-500/30';
      case 'opportunity': return 'border-blue-500/30';
      case 'warning': return 'border-red-500/30';
      case 'trend': return 'border-cyan-500/30';
      default: return 'border-purple-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-xl bg-slate-800/50 border ${getBorderColor()} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-700/50">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-white">{insight.title}</h4>
            <span className="text-xs text-slate-400">
              {Math.round(insight.confidence * 100)}% confident
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-2">{insight.description}</p>
          {insight.actionable && insight.actionItems && (
            <div className="space-y-1">
              {insight.actionItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <ChevronDown className="w-3 h-3" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RecommendationCard: React.FC<{ recommendation: ProjectRecommendation; index: number }> = ({ 
  recommendation, 
  index 
}) => {
  const getRiskColor = () => {
    switch (recommendation.riskLevel) {
      case 'low': return 'text-emerald-400 bg-emerald-400/10';
      case 'medium': return 'text-amber-400 bg-amber-400/10';
      case 'high': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getCategoryIcon = () => {
    switch (recommendation.category) {
      case 'forest_conservation': return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'ocean_conservation': return <Droplets className="w-4 h-4 text-blue-400" />;
      default: return <Sun className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getCategoryIcon()}
          <span className="text-sm font-medium text-white">{recommendation.projectName}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRiskColor()}`}>
          {recommendation.riskLevel} risk
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Match Score</span>
          <span>{Math.round(recommendation.relevanceScore * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${recommendation.relevanceScore * 100}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center p-2 rounded-lg bg-slate-700/30">
          <div className="text-lg font-semibold text-emerald-400">
            {recommendation.expectedImpact.carbonReduction}
          </div>
          <div className="text-xs text-slate-400">tCO₂</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-slate-700/30">
          <div className="text-lg font-semibold text-blue-400">
            {recommendation.expectedImpact.waterConservation}
          </div>
          <div className="text-xs text-slate-400">ML water</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-slate-700/30">
          <div className="text-lg font-semibold text-purple-400">
            {recommendation.expectedImpact.biodiversityScore}
          </div>
          <div className="text-xs text-slate-400">biodiv</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-slate-700/30">
          <div className="text-lg font-semibold text-amber-400">
            {recommendation.expectedImpact.communityBenefit}
          </div>
          <div className="text-xs text-slate-400">community</div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {recommendation.reasons.map((reason, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {reason}
          </div>
        ))}
      </div>

      <button className="w-full py-2 rounded-lg bg-cyan-600/20 text-cyan-400 text-sm font-medium hover:bg-cyan-600/30 transition-colors flex items-center justify-center gap-2">
        Learn More <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const CarbonPredictionCard: React.FC<{ prediction: CarbonPrediction; index: number }> = ({ 
  prediction, 
  index 
}) => {
  const getTrendIcon = () => {
    switch (prediction.trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-white">ML Forecast</span>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className="text-xs text-slate-400 capitalize">{prediction.trend}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Current</div>
          <div className="text-xl font-semibold text-white">{prediction.currentSequestration.toLocaleString()}</div>
          <div className="text-xs text-slate-500">tCO₂ sequestered</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Predicted</div>
          <div className="text-xl font-semibold text-emerald-400">{prediction.predictedSequestration.toLocaleString()}</div>
          <div className="text-xs text-slate-500">tCO₂ by year end</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Model Confidence</span>
          <span>{Math.round(prediction.confidenceScore * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidenceScore * 100}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-slate-400">AI Recommendations:</div>
        {prediction.recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <Zap className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
            {rec}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Main component
const AIInsightsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<CarbonPrediction[]>([]);
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'recommendations'>('overview');

  const fetchAIData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use mock data for demo
    setPredictions(mockCarbonPredictions);
    setRecommendations(mockRecommendations);
    setInsights(mockInsights);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAIData();
  }, [fetchAIData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Brain className="w-16 h-16 text-cyan-400" />
          </motion.div>
          <p className="text-slate-400">AI is analyzing your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              AI Impact Predictions
            </h1>
            <p className="text-slate-400 mt-1">
              Machine learning-powered insights and personalized recommendations
            </p>
          </div>
          <button
            onClick={fetchAIData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'predictions', 'recommendations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-400">Total Predicted Impact</span>
                  </div>
                  <div className="text-2xl font-bold text-white">4,530 tCO₂</div>
                  <div className="text-xs text-emerald-400">+18% from current</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Avg Confidence</span>
                  </div>
                  <div className="text-2xl font-bold text-white">86%</div>
                  <div className="text-xs text-blue-400">High reliability</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Active Insights</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{insights.length}</div>
                  <div className="text-xs text-purple-400">AI-generated</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-slate-400">Recommendations</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{recommendations.length}</div>
                  <div className="text-xs text-amber-400">Personalized</div>
                </motion.div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Carbon Trend Chart */}
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Carbon Sequestration Forecast</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={carbonTrendData}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#10b981"
                        fill="url(#colorActual)"
                        strokeWidth={2}
                        name="Actual"
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        fill="url(#colorPredicted)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Impact Distribution */}
                <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Impact Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={impactDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {impactDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insights Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Smart Insights
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <InsightCard key={insight.id} insight={insight} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'predictions' && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-3 gap-4">
                {predictions.map((prediction, index) => (
                  <CarbonPredictionCard key={prediction.projectId} prediction={prediction} index={index} />
                ))}
              </div>

              {/* Detailed Chart */}
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Multi-Project Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={predictions.map(p => ({
                    name: p.projectId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    current: p.currentSequestration,
                    predicted: p.predictedSequestration
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="current" fill="#10b981" name="Current" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" fill="#3b82f6" name="Predicted" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Personalized Recommendations
                </h3>
                <span className="text-sm text-slate-400">
                  Based on your interests and behavior
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {recommendations.map((recommendation, index) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
                ))}
              </div>

              {/* Recommendation Factors */}
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Recommendation Factors</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-slate-700/30 text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">35%</div>
                    <div className="text-xs text-slate-400">Category Match</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-700/30 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">28%</div>
                    <div className="text-xs text-slate-400">Impact Alignment</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-700/30 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">22%</div>
                    <div className="text-xs text-slate-400">Risk Profile</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-700/30 text-center">
                    <div className="text-2xl font-bold text-amber-400 mb-1">15%</div>
                    <div className="text-xs text-slate-400">Past Engagement</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
