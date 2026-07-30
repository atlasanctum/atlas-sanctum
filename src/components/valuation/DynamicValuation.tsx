import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Calculator,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface ValuationModel {
  id: string;
  name: string;
  type: 'carbon' | 'biodiversity' | 'ecosystem' | 'social';
  methodology: string;
  parameters: ValuationParameter[];
  lastUpdated: Date;
  confidence: number;
  usage: number;
}

interface ValuationParameter {
  name: string;
  value: number;
  unit: string;
  weight: number;
  description: string;
}

interface AssetValuation {
  id: string;
  assetName: string;
  assetType: 'carbon_credit' | 'biodiversity_unit' | 'ecosystem_service' | 'social_impact';
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  marketPrice: number;
  intrinsicValue: number;
  riskAdjustedValue: number;
  lastValuation: Date;
  nextValuation: Date;
  factors: ValuationFactor[];
}

interface ValuationFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  value: number;
  description: string;
}

interface MarketIndicators {
  carbonPriceIndex: number;
  biodiversityPremium: number;
  riskFreeRate: number;
  inflationRate: number;
  marketVolatility: number;
  regulatoryIndex: number;
}

const DynamicValuation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'assets' | 'analytics' | 'forecasting'>('models');
  const [selectedModel, setSelectedModel] = useState<ValuationModel | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetValuation | null>(null);

  const [marketIndicators, setMarketIndicators] = useState<MarketIndicators>({
    carbonPriceIndex: 58.50,
    biodiversityPremium: 1.24,
    riskFreeRate: 0.035,
    inflationRate: 0.023,
    marketVolatility: 0.18,
    regulatoryIndex: 0.87
  });

  const [valuationModels, setValuationModels] = useState<ValuationModel[]>([
    {
      id: '1',
      name: 'Dynamic Carbon Valuation Model',
      type: 'carbon',
      methodology: 'Discounted Cash Flow with Climate Risk Adjustment',
      parameters: [
        { name: 'Discount Rate', value: 0.05, unit: '%', weight: 0.3, description: 'Time value of money adjustment' },
        { name: 'Risk Premium', value: 2.1, unit: '%', weight: 0.25, description: 'Climate risk compensation' },
        { name: 'Permanence Factor', value: 0.95, unit: 'multiplier', weight: 0.2, description: 'Long-term storage reliability' },
        { name: 'Additionality', value: 1.15, unit: 'multiplier', weight: 0.15, description: 'Beyond business-as-usual impact' },
        { name: 'Leakage Risk', value: 0.03, unit: '%', weight: 0.1, description: 'Displacement effect adjustment' }
      ],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
      confidence: 0.89,
      usage: 1247
    },
    {
      id: '2',
      name: 'Biodiversity Impact Valuation',
      type: 'biodiversity',
      methodology: 'Ecosystem Services Valuation Framework',
      parameters: [
        { name: 'Species Richness', value: 87, unit: 'index', weight: 0.4, description: 'Biodiversity diversity measure' },
        { name: 'Habitat Quality', value: 0.82, unit: 'index', weight: 0.3, description: 'Ecosystem health indicator' },
        { name: 'Connectivity', value: 0.71, unit: 'index', weight: 0.2, description: 'Landscape connectivity factor' },
        { name: 'Threat Level', value: 0.34, unit: 'index', weight: 0.1, description: 'Conservation urgency' }
      ],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12),
      confidence: 0.76,
      usage: 892
    },
    {
      id: '3',
      name: 'Social Impact Valuation',
      type: 'social',
      methodology: 'Social Return on Investment (SROI)',
      parameters: [
        { name: 'Job Creation', value: 2.4, unit: 'multiplier', weight: 0.35, description: 'Employment impact factor' },
        { name: 'Health Benefits', value: 1.8, unit: 'multiplier', weight: 0.25, description: 'Wellness improvement value' },
        { name: 'Education Access', value: 3.1, unit: 'multiplier', weight: 0.2, description: 'Learning opportunity value' },
        { name: 'Community Resilience', value: 2.2, unit: 'multiplier', weight: 0.2, description: 'Social capital enhancement' }
      ],
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 6),
      confidence: 0.82,
      usage: 654
    }
  ]);

  const [assetValuations, setAssetValuations] = useState<AssetValuation[]>([
    {
      id: '1',
      assetName: 'Amazon Reforestation Credit 2024',
      assetType: 'carbon_credit',
      currentValue: 65.50,
      previousValue: 62.80,
      change: 2.70,
      changePercent: 4.3,
      marketPrice: 68.20,
      intrinsicValue: 63.90,
      riskAdjustedValue: 61.40,
      lastValuation: new Date(Date.now() - 1000 * 60 * 60 * 24),
      nextValuation: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      factors: [
        { name: 'Carbon Price Trend', impact: 'positive', weight: 0.4, value: 3.2, description: 'Rising global carbon prices' },
        { name: 'Project Performance', impact: 'positive', weight: 0.3, value: 2.1, description: 'Above-target sequestration' },
        { name: 'Regulatory Risk', impact: 'negative', weight: 0.2, value: -1.5, description: 'Potential policy changes' },
        { name: 'Market Liquidity', impact: 'neutral', weight: 0.1, value: 0.3, description: 'Stable trading volume' }
      ]
    },
    {
      id: '2',
      assetName: 'Kenya Soil Carbon Unit',
      assetType: 'carbon_credit',
      currentValue: 52.80,
      previousValue: 54.10,
      change: -1.30,
      changePercent: -2.4,
      marketPrice: 51.90,
      intrinsicValue: 53.70,
      riskAdjustedValue: 50.20,
      lastValuation: new Date(Date.now() - 1000 * 60 * 60 * 48),
      nextValuation: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      factors: [
        { name: 'Drought Impact', impact: 'negative', weight: 0.35, value: -2.8, description: 'Reduced sequestration capacity' },
        { name: 'Technology Adoption', impact: 'positive', weight: 0.25, value: 1.9, description: 'Improved measurement methods' },
        { name: 'Community Engagement', impact: 'positive', weight: 0.25, value: 1.2, description: 'Strong local participation' },
        { name: 'Verification Costs', impact: 'negative', weight: 0.15, value: -0.8, description: 'Higher audit expenses' }
      ]
    },
    {
      id: '3',
      assetName: 'Coral Reef Biodiversity Unit',
      assetType: 'biodiversity_unit',
      currentValue: 125.40,
      previousValue: 118.90,
      change: 6.50,
      changePercent: 5.5,
      marketPrice: 128.70,
      intrinsicValue: 122.80,
      riskAdjustedValue: 119.60,
      lastValuation: new Date(Date.now() - 1000 * 60 * 60 * 72),
      nextValuation: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      factors: [
        { name: 'Ocean Health Index', impact: 'positive', weight: 0.4, value: 4.2, description: 'Improving marine conditions' },
        { name: 'Tourism Value', impact: 'positive', weight: 0.3, value: 3.1, description: 'Economic impact of healthy reefs' },
        { name: 'Restoration Success', impact: 'positive', weight: 0.2, value: 2.8, description: 'Coral growth exceeding targets' },
        { name: 'Climate Vulnerability', impact: 'negative', weight: 0.1, value: -1.6, description: 'Ocean warming risk' }
      ]
    }
  ]);

  const tabs = [
    { id: 'models', label: 'Valuation Models', icon: Calculator },
    { id: 'assets', label: 'Asset Valuations', icon: DollarSign },
    { id: 'analytics', label: 'Market Analytics', icon: BarChart3 },
    { id: 'forecasting', label: 'Price Forecasting', icon: TrendingUp }
  ];

  const ModelCard: React.FC<{ model: ValuationModel }> = ({ model }) => {
    const typeColors = {
      carbon: 'bg-green-500/10 text-green-500 border-green-500/20',
      biodiversity: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      ecosystem: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      social: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedModel(model)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{model.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{model.type}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[model.type]}`}>
            {model.type.toUpperCase()}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{model.methodology}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{(model.confidence * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-500">{model.usage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Uses</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-500">{model.parameters.length}</div>
            <p className="text-xs text-muted-foreground">Parameters</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Updated {model.lastUpdated.toLocaleDateString()}
        </div>
      </motion.div>
    );
  };

  const AssetCard: React.FC<{ asset: AssetValuation }> = ({ asset }) => {
    const typeColors = {
      carbon_credit: 'bg-green-500/10 text-green-500',
      biodiversity_unit: 'bg-blue-500/10 text-blue-500',
      ecosystem_service: 'bg-purple-500/10 text-purple-500',
      social_impact: 'bg-orange-500/10 text-orange-500'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedAsset(asset)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${typeColors[asset.assetType]}`}>
                {asset.assetType.replace('_', ' ').toUpperCase()}
              </div>
              <div className={`flex items-center space-x-1 ${
                asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {asset.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">{Math.abs(asset.changePercent)}%</span>
              </div>
            </div>
            <h3 className="font-semibold text-foreground">{asset.assetName}</h3>
            <p className="text-sm text-muted-foreground">
              Last valuation: {asset.lastValuation.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${asset.currentValue}</div>
            <div className={`text-sm font-medium ${
              asset.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {asset.change >= 0 ? '+' : ''}${asset.change}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm font-semibold text-foreground">${asset.marketPrice}</div>
            <p className="text-xs text-muted-foreground">Market Price</p>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-500">${asset.intrinsicValue}</div>
            <p className="text-xs text-muted-foreground">Intrinsic Value</p>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-purple-500">${asset.riskAdjustedValue}</div>
            <p className="text-xs text-muted-foreground">Risk Adjusted</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const FactorBadge: React.FC<{ factor: ValuationFactor }> = ({ factor }) => {
    const impactColors = {
      positive: 'bg-green-500/10 text-green-500 border-green-500/20',
      negative: 'bg-red-500/10 text-red-500 border-red-500/20',
      neutral: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };

    return (
      <div className={`flex items-center justify-between p-3 border rounded-lg ${impactColors[factor.impact]}`}>
        <div className="flex-1">
          <div className="font-medium text-foreground text-sm">{factor.name}</div>
          <div className="text-xs text-muted-foreground">{factor.description}</div>
        </div>
        <div className="text-right">
          <div className={`font-semibold ${
            factor.value >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {factor.value >= 0 ? '+' : ''}{factor.value}
          </div>
          <div className="text-xs text-muted-foreground">{factor.weight * 100}% weight</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dynamic Valuation Engine</h1>
              <p className="text-muted-foreground mt-1">Real-time asset valuation with AI-driven insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Market Active</span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Calculator className="w-4 h-4 inline mr-2" />
                Run Valuation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Indicators */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">${marketIndicators.carbonPriceIndex}</div>
              <div className="text-xs text-muted-foreground">Carbon Price Index</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{marketIndicators.biodiversityPremium}x</div>
              <div className="text-xs text-muted-foreground">Biodiversity Premium</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{(marketIndicators.riskFreeRate * 100).toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Risk-Free Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{(marketIndicators.inflationRate * 100).toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Inflation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{(marketIndicators.marketVolatility * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Market Volatility</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-500">{(marketIndicators.regulatoryIndex * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Regulatory Index</div>
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
                  onClick={() => setActiveTab(tab.id as 'models' | 'assets' | 'analytics' | 'forecasting')}
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
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {valuationModels.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Models</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {(valuationModels.reduce((acc, m) => acc + m.confidence, 0) / valuationModels.length * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {valuationModels.reduce((acc, m) => acc + m.usage, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Uses</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {valuationModels.reduce((acc, m) => acc + m.parameters.length, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Parameters</p>
                </div>
              </div>

              {/* Models Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {valuationModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>

              {/* Model Details Modal */}
              <AnimatePresence>
                {selectedModel && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedModel(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-foreground">{selectedModel.name}</h2>
                          <button
                            onClick={() => setSelectedModel(null)}
                            className="p-2 hover:bg-muted rounded-lg"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-muted-foreground mt-2">{selectedModel.methodology}</p>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Model Parameters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedModel.parameters.map((param, index) => (
                            <div key={index} className="p-4 border border-border/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-foreground">{param.name}</h4>
                                <span className="text-sm text-muted-foreground">{param.weight * 100}% weight</span>
                              </div>
                              <div className="text-2xl font-bold text-primary mb-1">
                                {param.value} {param.unit}
                              </div>
                              <p className="text-sm text-muted-foreground">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Asset Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${assetValuations.reduce((acc, a) => acc + a.currentValue, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Asset Value</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    +{(assetValuations.reduce((acc, a) => acc + a.changePercent, 0) / assetValuations.length).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {assetValuations.filter(a => a.marketPrice > a.intrinsicValue).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Overvalued Assets</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {Math.ceil((assetValuations.reduce((acc, a) => acc + (a.nextValuation.getTime() - Date.now()), 0) / assetValuations.length) / (1000 * 60 * 60 * 24))}
                  </div>
                  <p className="text-sm text-muted-foreground">Days to Next Valuation</p>
                </div>
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assetValuations.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>

              {/* Asset Details Modal */}
              <AnimatePresence>
                {selectedAsset && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedAsset(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-foreground">{selectedAsset.assetName}</h2>
                          <button
                            onClick={() => setSelectedAsset(null)}
                            className="p-2 hover:bg-muted rounded-lg"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-muted-foreground mt-2 capitalize">
                          {selectedAsset.assetType.replace('_', ' ')}
                        </p>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Valuation Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">${selectedAsset.currentValue}</div>
                            <p className="text-sm text-muted-foreground">Current Value</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">${selectedAsset.marketPrice}</div>
                            <p className="text-sm text-muted-foreground">Market Price</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">${selectedAsset.intrinsicValue}</div>
                            <p className="text-sm text-muted-foreground">Intrinsic Value</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">${selectedAsset.riskAdjustedValue}</div>
                            <p className="text-sm text-muted-foreground">Risk Adjusted</p>
                          </div>
                        </div>

                        {/* Valuation Factors */}
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">Valuation Factors</h3>
                          <div className="space-y-3">
                            {selectedAsset.factors.map((factor, index) => (
                              <FactorBadge key={index} factor={factor} />
                            ))}
                          </div>
                        </div>

                        {/* Valuation History */}
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">Valuation History</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                              <span className="text-muted-foreground">Previous Valuation</span>
                              <span className="font-medium">${selectedAsset.previousValue}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                              <span className="text-muted-foreground">Change</span>
                              <span className={`font-medium ${
                                selectedAsset.change >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {selectedAsset.change >= 0 ? '+' : ''}${selectedAsset.change} ({selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent}%)
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                              <span className="text-muted-foreground">Next Valuation</span>
                              <span className="font-medium">{selectedAsset.nextValuation.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Portfolio Performance</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Portfolio performance charts would be displayed here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Risk Analysis</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Risk analysis charts would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Market Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Carbon Price Momentum',
                      value: '+8.2%',
                      description: 'Strong upward trend in carbon pricing',
                      type: 'positive'
                    },
                    {
                      title: 'Volatility Alert',
                      value: 'High',
                      description: 'Increased market volatility detected',
                      type: 'warning'
                    },
                    {
                      title: 'Regulatory Impact',
                      value: '+12.5%',
                      description: 'New regulations boosting asset values',
                      type: 'positive'
                    }
                  ].map((insight, index) => (
                    <div key={index} className="p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        {insight.type === 'positive' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">{insight.value}</div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'forecasting' && (
            <motion.div
              key="forecasting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Price Forecasting Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Carbon Price Forecast',
                      current: 58.50,
                      prediction: 67.20,
                      change: '+14.9%',
                      confidence: 0.82,
                      timeframe: '6 months'
                    },
                    {
                      name: 'Biodiversity Premium',
                      current: 1.24,
                      prediction: 1.45,
                      change: '+16.9%',
                      confidence: 0.75,
                      timeframe: '12 months'
                    },
                    {
                      name: 'Regulatory Impact',
                      current: 0.87,
                      prediction: 0.94,
                      change: '+8.0%',
                      confidence: 0.91,
                      timeframe: '3 months'
                    }
                  ].map((forecast, index) => (
                    <div key={index} className="p-4 border border-border/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-3">{forecast.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current</span>
                          <span className="font-medium">{forecast.current}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Predicted</span>
                          <span className="font-medium text-primary">{forecast.prediction}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Change</span>
                          <span className="font-medium text-green-500">{forecast.change}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium">{(forecast.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Timeframe: {forecast.timeframe}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Scenario Analysis</h3>
                  <div className="space-y-4">
                    {[
                      { scenario: 'Optimistic Growth', probability: 0.25, impact: '+23.5%', description: 'Strong regulatory support and market adoption' },
                      { scenario: 'Moderate Growth', probability: 0.50, impact: '+12.8%', description: 'Steady market development with some challenges' },
                      { scenario: 'Conservative Growth', probability: 0.25, impact: '+5.2%', description: 'Slow adoption with regulatory hurdles' }
                    ].map((scenario, index) => (
                      <div key={index} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{scenario.scenario}</h4>
                          <span className="text-sm text-muted-foreground">{(scenario.probability * 100).toFixed(0)}% probability</span>
                        </div>
                        <div className="text-xl font-bold text-primary mb-1">{scenario.impact}</div>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Risk Factors</h3>
                  <div className="space-y-4">
                    {[
                      { factor: 'Policy Changes', risk: 'High', impact: 'Market volatility and price fluctuations' },
                      { factor: 'Technology Adoption', risk: 'Medium', impact: 'Measurement accuracy and verification costs' },
                      { factor: 'Market Liquidity', risk: 'Low', impact: 'Trading volume and price discovery' },
                      { factor: 'Climate Events', risk: 'High', impact: 'Asset performance and sequestration rates' }
                    ].map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{risk.factor}</div>
                          <div className="text-sm text-muted-foreground">{risk.impact}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.risk === 'High' ? 'bg-red-500/10 text-red-500' :
                          risk.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {risk.risk}
                        </div>
                      </div>
                    ))}
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

export default DynamicValuation;