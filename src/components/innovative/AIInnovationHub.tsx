import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'prediction' | 'optimization' | 'analysis' | 'generation';
  status: 'training' | 'active' | 'idle' | 'error';
  accuracy: number;
  lastTrained: Date;
  predictions: number;
  confidence: number;
}

interface InnovationMetric {
  category: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface AIInsight {
  id: string;
  title: string;
  type: 'opportunity' | 'risk' | 'optimization' | 'prediction';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  recommendations: string[];
  timestamp: Date;
}

const AIInnovationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'insights' | 'analytics' | 'automation'>('models');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: '1',
      name: 'Carbon Sequestration Predictor',
      type: 'prediction',
      status: 'active',
      accuracy: 0.94,
      lastTrained: new Date(Date.now() - 1000 * 60 * 60 * 24),
      predictions: 15420,
      confidence: 0.89
    },
    {
      id: '2',
      name: 'Regeneration Optimizer',
      type: 'optimization',
      status: 'training',
      accuracy: 0.87,
      lastTrained: new Date(Date.now() - 1000 * 60 * 60 * 2),
      predictions: 8920,
      confidence: 0.76
    },
    {
      id: '3',
      name: 'Biodiversity Analyzer',
      type: 'analysis',
      status: 'active',
      accuracy: 0.91,
      lastTrained: new Date(Date.now() - 1000 * 60 * 60 * 12),
      predictions: 12450,
      confidence: 0.82
    },
    {
      id: '4',
      name: 'Impact Report Generator',
      type: 'generation',
      status: 'active',
      accuracy: 0.96,
      lastTrained: new Date(Date.now() - 1000 * 60 * 60 * 6),
      predictions: 6750,
      confidence: 0.93
    }
  ]);

  const [innovationMetrics, setInnovationMetrics] = useState<InnovationMetric[]>([
    {
      category: 'Prediction Accuracy',
      value: 92.4,
      change: 2.1,
      trend: 'up',
      description: 'Average accuracy across all AI models'
    },
    {
      category: 'Optimization Efficiency',
      value: 15.7,
      change: -0.3,
      trend: 'down',
      description: 'Percentage improvement in resource allocation'
    },
    {
      category: 'Innovation Velocity',
      value: 8.2,
      change: 1.8,
      trend: 'up',
      description: 'New insights generated per day'
    },
    {
      category: 'Impact Measurement',
      value: 98.1,
      change: 0.5,
      trend: 'up',
      description: 'Accuracy of real-world impact predictions'
    }
  ]);

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      title: 'Optimal Reforestation Timing',
      type: 'opportunity',
      confidence: 0.92,
      impact: 'high',
      description: 'AI analysis shows 23% higher survival rates for tree planting in early spring across temperate regions.',
      recommendations: [
        'Schedule major reforestation projects for March-April',
        'Prioritize fast-growing species in optimal conditions',
        'Allocate 30% more budget to spring planting initiatives'
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
    },
    {
      id: '2',
      title: 'Carbon Credit Price Volatility Risk',
      type: 'risk',
      confidence: 0.88,
      impact: 'medium',
      description: 'Predictive models indicate 15% price fluctuation risk in Q2 due to market saturation.',
      recommendations: [
        'Implement dynamic pricing strategy',
        'Diversify credit portfolio across regions',
        'Consider hedging instruments for price stability'
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8)
    },
    {
      id: '3',
      title: 'Biodiversity Corridor Optimization',
      type: 'optimization',
      confidence: 0.95,
      impact: 'high',
      description: 'AI optimization suggests 40% more efficient wildlife corridors with 12% cost reduction.',
      recommendations: [
        'Redesign corridor network using AI recommendations',
        'Focus on high-connectivity pathways',
        'Implement adaptive management based on wildlife movement data'
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12)
    },
    {
      id: '4',
      title: 'Climate Impact Acceleration',
      type: 'prediction',
      confidence: 0.89,
      impact: 'high',
      description: 'Models predict 25% faster carbon sequestration in urban green spaces with smart irrigation.',
      recommendations: [
        'Deploy IoT sensors for real-time soil monitoring',
        'Implement AI-driven irrigation systems',
        'Scale urban greening initiatives by 200%'
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16)
    }
  ]);

  const tabs = [
    { id: 'models', label: 'AI Models', icon: Brain },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'automation', label: 'Automation', icon: Zap }
  ];

  const ModelCard: React.FC<{ model: AIModel }> = ({ model }) => {
    const statusColors = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      training: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      idle: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      error: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const typeIcons = {
      prediction: TrendingUp,
      optimization: Target,
      analysis: BarChart3,
      generation: Sparkles
    };

    const TypeIcon = typeIcons[model.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{model.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{model.type}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[model.status]}`}>
            {model.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{(model.accuracy * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{(model.confidence * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Predictions</span>
            <span className="font-medium">{model.predictions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Trained</span>
            <span className="font-medium">{model.lastTrained.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
            Retrain
          </button>
          <button className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
            Configure
          </button>
        </div>
      </motion.div>
    );
  };

  const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
    const typeColors = {
      opportunity: 'bg-green-500/10 text-green-500 border-green-500/20',
      risk: 'bg-red-500/10 text-red-500 border-red-500/20',
      optimization: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      prediction: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };

    const impactColors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[insight.type]}`}>
                {insight.type.toUpperCase()}
              </div>
              <span className={`text-xs font-medium ${impactColors[insight.impact]}`}>
                {insight.impact.toUpperCase()} IMPACT
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Confidence: {(insight.confidence * 100).toFixed(1)}%</span>
              <span>{insight.timestamp.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-foreground text-sm">Recommendations:</h4>
          <ul className="space-y-1">
            {insight.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
            Implement
          </button>
          <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm">
            Dismiss
          </button>
        </div>
      </motion.div>
    );
  };

  const MetricCard: React.FC<{ metric: InnovationMetric }> = ({ metric }) => {
    const trendIcons = {
      up: ArrowUp,
      down: ArrowDown,
      stable: Minus
    };

    const trendColors = {
      up: 'text-green-500',
      down: 'text-red-500',
      stable: 'text-muted-foreground'
    };

    const TrendIcon = trendIcons[metric.trend];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{metric.category}</h3>
          <div className={`flex items-center space-x-1 ${trendColors[metric.trend]}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
          </div>
        </div>

        <div className="text-3xl font-bold text-primary mb-2">
          {typeof metric.value === 'number' && metric.value < 1
            ? `${(metric.value * 100).toFixed(1)}%`
            : metric.value.toLocaleString()
          }
        </div>

        <p className="text-sm text-muted-foreground">{metric.description}</p>
      </motion.div>
    );
  };

  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setAiModels(prev => prev.map(model => ({
        ...model,
        predictions: model.predictions + Math.floor(Math.random() * 10)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Innovation Hub</h1>
              <p className="text-muted-foreground mt-1">Intelligent insights and automated optimization</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isAutoRefresh
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {isAutoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="text-sm text-muted-foreground">
                  {isAutoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                </span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Brain className="w-4 h-4 inline mr-2" />
                Train New Model
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'models' | 'insights' | 'analytics' | 'automation')}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'models' && (
            <motion.div
              key="models"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Model Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {aiModels.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Models</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {(aiModels.reduce((acc, m) => acc + m.accuracy, 0) / aiModels.length * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {aiModels.reduce((acc, m) => acc + m.predictions, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Predictions</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {aiModels.filter(m => m.status === 'training').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Training Models</p>
                </div>
              </div>

              {/* AI Models Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Insights Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Lightbulb className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {aiInsights.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Insights</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {aiInsights.filter(i => i.impact === 'high').length}
                  </div>
                  <p className="text-sm text-muted-foreground">High Impact</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {(aiInsights.reduce((acc, i) => acc + i.confidence, 0) / aiInsights.length * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-6">
                {aiInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Innovation Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {innovationMetrics.map((metric) => (
                  <MetricCard key={metric.category} metric={metric} />
                ))}
              </div>

              {/* Analytics Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Model Performance Trends</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Performance charts would be displayed here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Innovation Impact Distribution</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Impact distribution charts would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'automation' && (
            <motion.div
              key="automation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Automation Rules */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Active Automations</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Auto Credit Verification', status: 'active', triggers: 1247 },
                      { name: 'Risk Assessment Alerts', status: 'active', triggers: 89 },
                      { name: 'Price Optimization', status: 'paused', triggers: 0 },
                      { name: 'Report Generation', status: 'active', triggers: 456 }
                    ].map((automation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{automation.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {automation.triggers} triggers this week
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            automation.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-sm capitalize">{automation.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation Performance */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Automation Performance</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-medium">98.7%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.7%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Time Saved</span>
                        <span className="font-medium">2,450 hours</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Error Reduction</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.2%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create New Automation */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Create New Automation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border border-border/50 rounded-lg hover:bg-muted transition-colors text-left">
                    <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Workflow Automation</h4>
                    <p className="text-sm text-muted-foreground">Automate business processes</p>
                  </button>

                  <button className="p-4 border border-border/50 rounded-lg hover:bg-muted transition-colors text-left">
                    <Target className="w-8 h-8 text-red-500 mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Alert System</h4>
                    <p className="text-sm text-muted-foreground">Set up intelligent alerts</p>
                  </button>

                  <button className="p-4 border border-border/50 rounded-lg hover:bg-muted transition-colors text-left">
                    <RotateCcw className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Data Pipeline</h4>
                    <p className="text-sm text-muted-foreground">Automate data processing</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIInnovationHub;