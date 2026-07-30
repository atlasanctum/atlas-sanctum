import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { 
  TrendingUp, 
  Brain, 
  Target,
  Calendar,
  BarChart3,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from './ui/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  Legend,
  Bar,
  ComposedChart
} from 'recharts';

interface Forecast {
  period: string;
  actual?: number;
  predicted: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
  factors?: { name: string; impact: number }[];
}

interface ScenarioAnalysis {
  scenario: string;
  probability: number;
  impact: number;
  outcome: number;
  recommendations: string[];
}

export const PredictiveAnalytics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('impact-score');
  const [forecastHorizon, setForecastHorizon] = useState('3-months');
  const [selectedModel, setSelectedModel] = useState('ensemble');

  const forecasts: Forecast[] = [
    { period: 'Jan', actual: 78, predicted: 79, confidence: 0.95, upperBound: 84, lowerBound: 74 },
    { period: 'Feb', actual: 80, predicted: 81, confidence: 0.93, upperBound: 86, lowerBound: 76 },
    { period: 'Mar', actual: 82, predicted: 81, confidence: 0.92, upperBound: 86, lowerBound: 76 },
    { period: 'Apr', predicted: 84, confidence: 0.90, upperBound: 90, lowerBound: 78 },
    { period: 'May', predicted: 87, confidence: 0.88, upperBound: 94, lowerBound: 80 },
    { period: 'Jun', predicted: 89, confidence: 0.85, upperBound: 97, lowerBound: 81 },
  ];

  const impactFactors = [
    { name: 'Seasonal Trends', impact: 0.35, trend: 'positive' },
    { name: 'Resource Allocation', impact: 0.28, trend: 'positive' },
    { name: 'Weather Patterns', impact: 0.18, trend: 'neutral' },
    { name: 'Policy Changes', impact: 0.12, trend: 'positive' },
    { name: 'Market Conditions', impact: 0.07, trend: 'negative' },
  ];

  const scenarios: ScenarioAnalysis[] = [
    {
      scenario: 'Optimistic Growth',
      probability: 0.35,
      impact: 92,
      outcome: 15,
      recommendations: [
        'Increase resource allocation to high-performing sectors',
        'Expand data collection infrastructure',
        'Implement advanced ML models for optimization'
      ]
    },
    {
      scenario: 'Baseline Projection',
      probability: 0.50,
      impact: 85,
      outcome: 8,
      recommendations: [
        'Maintain current investment levels',
        'Focus on data quality improvements',
        'Monitor key performance indicators closely'
      ]
    },
    {
      scenario: 'Conservative Estimate',
      probability: 0.15,
      impact: 79,
      outcome: 2,
      recommendations: [
        'Identify and address underperforming areas',
        'Increase validation and quality checks',
        'Consider reallocation of resources'
      ]
    },
  ];

  const modelAccuracy = {
    'ensemble': { accuracy: 94.2, mae: 2.1, rmse: 3.4 },
    'neural-network': { accuracy: 92.8, mae: 2.5, rmse: 3.9 },
    'random-forest': { accuracy: 91.5, mae: 2.8, rmse: 4.2 },
    'arima': { accuracy: 88.3, mae: 3.5, rmse: 5.1 },
  };

  const currentModel = modelAccuracy[selectedModel as keyof typeof modelAccuracy];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-500" />
              Predictive Analytics & Forecasting
            </CardTitle>
            <CardDescription>
              Advanced ML models for trend prediction and scenario analysis
            </CardDescription>
          </div>
          <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
            <TabsTrigger value="factors">Impact Factors</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-4">
            {/* Controls */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Metric</Label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact-score">Total Impact Score</SelectItem>
                    <SelectItem value="carbon">Carbon Sequestered</SelectItem>
                    <SelectItem value="biodiversity">Biodiversity Index</SelectItem>
                    <SelectItem value="healthcare">Healthcare Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Forecast Horizon</Label>
                <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">ML Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ensemble">Ensemble (Recommended)</SelectItem>
                    <SelectItem value="neural-network">Neural Network</SelectItem>
                    <SelectItem value="random-forest">Random Forest</SelectItem>
                    <SelectItem value="arima">ARIMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Model Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-xs text-muted-foreground mb-1">Model Accuracy</div>
                <div className="text-2xl font-bold text-green-600">{currentModel.accuracy}%</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-xs text-muted-foreground mb-1">Mean Absolute Error</div>
                <div className="text-2xl font-bold">{currentModel.mae}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border">
                <div className="text-xs text-muted-foreground mb-1">RMSE</div>
                <div className="text-2xl font-bold">{currentModel.rmse}</div>
              </div>
            </div>

            {/* Forecast Chart */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Forecast Visualization</Label>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={forecasts}>
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stroke="none"
                    fill="url(#colorConfidence)"
                    name="Confidence Interval"
                  />
                  <Area
                    type="monotone"
                    dataKey="lowerBound"
                    stroke="none"
                    fill="url(#colorConfidence)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                    name="Predicted"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Summary */}
            <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Forecast Summary</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Based on the {selectedModel.replace('-', ' ')} model with {currentModel.accuracy}% accuracy
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Expected Growth:</span>
                      <span className="font-semibold ml-2 text-green-600">+12.8%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Confidence:</span>
                      <span className="font-semibold ml-2">89.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border bg-muted/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{scenario.scenario}</h4>
                      <Badge 
                        variant="outline"
                        className={cn(
                          index === 0 ? 'text-green-600 border-green-500/20' :
                          index === 1 ? 'text-blue-600 border-blue-500/20' :
                          'text-orange-600 border-orange-500/20'
                        )}
                      >
                        {index === 0 ? <CheckCircle2 className="h-3 w-3 mr-1" /> :
                         index === 1 ? <Target className="h-3 w-3 mr-1" /> :
                         <AlertTriangle className="h-3 w-3 mr-1" />}
                        {(scenario.probability * 100).toFixed(0)}% Probability
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Projected Impact</div>
                    <div className="text-2xl font-bold">{scenario.impact}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">vs Current</div>
                    <div className={cn(
                      "text-2xl font-bold",
                      scenario.outcome > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {scenario.outcome > 0 ? '+' : ''}{scenario.outcome}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                    <Progress value={scenario.probability * 100} className="h-2 mt-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Recommendations</Label>
                  <ul className="space-y-1">
                    {scenario.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="factors" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Key Impact Factors</Label>
              {impactFactors.map((factor, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{factor.name}</h4>
                    <Badge 
                      variant="outline"
                      className={cn(
                        factor.trend === 'positive' ? 'text-green-600' :
                        factor.trend === 'negative' ? 'text-red-600' :
                        'text-gray-600'
                      )}
                    >
                      {factor.trend}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Impact Weight</span>
                      <span className="font-semibold">{(factor.impact * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={factor.impact * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="space-y-3">
              {Object.entries(modelAccuracy).map(([model, stats]) => (
                <div 
                  key={model}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    selectedModel === model 
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/20 hover:bg-muted/40"
                  )}
                  onClick={() => setSelectedModel(model)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm capitalize">
                        {model.replace('-', ' ')}
                      </h4>
                      {model === 'ensemble' && (
                        <Badge className="mt-1 text-xs">Recommended</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">MAE:</span>
                      <span className="font-semibold ml-2">{stats.mae}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">RMSE:</span>
                      <span className="font-semibold ml-2">{stats.rmse}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
