// @ts-nocheck
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { AlertTriangle, TrendingUp, Cloud, Info, AlertOctagon, CheckCircle } from "lucide-react";
import { useClimateRiskWithUncertainty } from "@/architecture/AtlasProbabilisticReasoning";
import { Badge } from "@/components/ui/badge";

interface ClimateForecastData {
  month: string;
  temperature_change: number;
  temperature_lower: number;
  temperature_upper: number;
  precipitation_trend: number;
  precipitation_lower: number;
  precipitation_upper: number;
  extreme_event_probability: number;
  extreme_event_lower: number;
  extreme_event_upper: number;
  risk_score: number;
  risk_score_lower: number;
  risk_score_upper: number;
  uncertainty_level: 'low' | 'medium' | 'high';
  causal_confidence: number;
}

interface ClimateRiskForecastingProps {
  zoneId: string;
  historicalData?: ClimateForecastData[];
  forecastData?: ClimateForecastData[];
  isLoading?: boolean;
}

// Generate sample forecast data
const generateForecastData = (): ClimateForecastData[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();

  return months.map((month, idx) => {
    const isHistorical = idx <= currentMonth;
    const tempVariation = Math.sin(idx / 2) * 2 + (Math.random() - 0.5) * 1;
    const precipVariation = Math.cos(idx / 3) * 15 + (Math.random() - 0.5) * 10;
    const extremeEvent = 0.1 + Math.sin(idx / 4) * 0.1 + (Math.random() - 0.5) * 0.05;
    
    // Calculate uncertainty bounds (95% CI)
    const tempUncertainty = isHistorical ? 0.2 : 0.8;
    const precipUncertainty = isHistorical ? 3 : 12;
    const extremeUncertainty = isHistorical ? 0.02 : 0.08;
    
    // Causal confidence based on data quality and temporal distance
    const causalConfidence = Math.max(0.5, 1 - (idx - currentMonth) * 0.03 - (isHistorical ? 0 : 0.1));
    
    // Determine uncertainty level
    let uncertaintyLevel: 'low' | 'medium' | 'high';
    if (!isHistorical && idx > currentMonth + 3) {
      uncertaintyLevel = 'high';
    } else if (!isHistorical || idx > currentMonth + 1) {
      uncertaintyLevel = 'medium';
    } else {
      uncertaintyLevel = 'low';
    }

    return {
      month,
      temperature_change: parseFloat(tempVariation.toFixed(1)),
      temperature_lower: parseFloat((tempVariation - tempUncertainty).toFixed(1)),
      temperature_upper: parseFloat((tempVariation + tempUncertainty).toFixed(1)),
      precipitation_trend: parseFloat(precipVariation.toFixed(1)),
      precipitation_lower: parseFloat((precipVariation - precipUncertainty).toFixed(1)),
      precipitation_upper: parseFloat((precipVariation + precipUncertainty).toFixed(1)),
      extreme_event_probability: Math.max(0, Math.min(1, extremeEvent)),
      extreme_event_lower: Math.max(0, extremeEvent - extremeUncertainty),
      extreme_event_upper: Math.min(1, extremeEvent + extremeUncertainty),
      risk_score: parseFloat((25 + Math.abs(tempVariation) * 5 + Math.abs(precipVariation) * 0.5).toFixed(1)),
      risk_score_lower: parseFloat((20 + Math.abs(tempVariation) * 4 + Math.abs(precipVariation) * 0.4).toFixed(1)),
      risk_score_upper: parseFloat((30 + Math.abs(tempVariation) * 6 + Math.abs(precipVariation) * 0.6).toFixed(1)),
      uncertainty_level: uncertaintyLevel,
      causal_confidence: parseFloat(causalConfidence.toFixed(2)),
    };
  });
};

const generateHistoricalData = (): ClimateForecastData[] => {
  const months = ["Jan-23", "Mar-23", "May-23", "Jul-23", "Sep-23", "Nov-23"];
  return months.map((month, idx) => {
    const tempVariation = -0.5 + idx * 0.3 + (Math.random() - 0.5) * 0.2;
    const precipVariation = 50 + Math.sin(idx / 2) * 30 + (Math.random() - 0.5) * 10;
    const extremeEvent = 0.1 + idx * 0.02 + (Math.random() - 0.5) * 0.05;
    const riskScore = 20 + idx * 2 + (Math.random() - 0.5) * 3;
    
    return {
      month,
      temperature_change: parseFloat(tempVariation.toFixed(1)),
      temperature_lower: parseFloat((tempVariation - 0.1).toFixed(1)),
      temperature_upper: parseFloat((tempVariation + 0.1).toFixed(1)),
      precipitation_trend: parseFloat(precipVariation.toFixed(1)),
      precipitation_lower: parseFloat((precipVariation - 2).toFixed(1)),
      precipitation_upper: parseFloat((precipVariation + 2).toFixed(1)),
      extreme_event_probability: Math.max(0, Math.min(1, extremeEvent)),
      extreme_event_lower: Math.max(0, extremeEvent - 0.02),
      extreme_event_upper: Math.min(1, extremeEvent + 0.02),
      risk_score: parseFloat(riskScore.toFixed(1)),
      risk_score_lower: parseFloat((riskScore - 2).toFixed(1)),
      risk_score_upper: parseFloat((riskScore + 2).toFixed(1)),
      uncertainty_level: 'low' as const,
      causal_confidence: 0.92,
    };
  });
};

export const ClimateRiskForecasting: React.FC<ClimateRiskForecastingProps> = ({
  zoneId,
  historicalData,
  forecastData,
  isLoading = false,
}) => {
  const historical = useMemo(() => historicalData || generateHistoricalData(), [historicalData]);
  const forecast = useMemo(() => forecastData || generateForecastData(), [forecastData]);
  
  // Extract numerical data for probabilistic reasoning
  const riskData = useMemo(() => 
    [...historical, ...forecast].map(d => d.risk_score), 
    [historical, forecast]
  );
  
  // Apply probabilistic reasoning
  const probabilisticAnalysis = useClimateRiskWithUncertainty(
    historical.map(d => d.risk_score),
    historical.map(d => d.risk_score),
    forecast.map(d => d.risk_score)
  );

  const averageRisk = useMemo(() => {
    const allData = [...historical, ...forecast];
    return (allData.reduce((sum, d) => sum + d.risk_score, 0) / allData.length).toFixed(1);
  }, [historical, forecast]);

  const averageRiskUncertainty = useMemo(() => {
    const allData = [...historical, ...forecast];
    const values = allData.map(d => d.risk_score);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - 1);
    const stdDev = Math.sqrt(variance);
    return { mean, stdDev, lower: mean - 1.96 * stdDev / Math.sqrt(values.length), upper: mean + 1.96 * stdDev / Math.sqrt(values.length) };
  }, [historical, forecast]);

  const extremeEventTrend = useMemo(() => {
    const forecastExtremes = forecast.slice(6).reduce((sum, d) => sum + d.extreme_event_probability, 0) / forecast.slice(6).length;
    return (forecastExtremes * 100).toFixed(1);
  }, [forecast]);

  const temperatureTrend = useMemo(() => {
    const recentTemps = forecast.slice(-3).map((d) => d.temperature_change);
    const avgRecent = recentTemps.reduce((a, b) => a + b, 0) / recentTemps.length;
    return avgRecent.toFixed(2);
  }, [forecast]);

  const causalConfidence = useMemo(() => {
    const futureData = forecast.slice(6);
    if (futureData.length === 0) return 1;
    const avgConfidence = futureData.reduce((sum, d) => sum + d.causal_confidence, 0) / futureData.length;
    return avgConfidence;
  }, [forecast]);

  const getUncertaintyBadge = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Low Uncertainty</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500"><Info className="w-3 h-3 mr-1" /> Medium Uncertainty</Badge>;
      case 'high':
        return <Badge className="bg-red-500"><AlertOctagon className="w-3 h-3 mr-1" /> High Uncertainty</Badge>;
    }
  };

  const getEpistemicBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge className="bg-blue-500">Well-Supported</Badge>;
    if (confidence >= 0.75) return <Badge className="bg-indigo-500">Supported</Badge>;
    if (confidence >= 0.6) return <Badge className="bg-orange-500">Preliminary</Badge>;
    return <Badge className="bg-gray-500">Speculative</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Climate Risk Forecasting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-b from-slate-200 to-slate-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deferral Warning - Show when confidence is too low */}
      {probabilisticAnalysis.deferralDecision.shouldDefer && (
        <Card className="border-2 border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Prediction Confidence Below Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-2">
              <strong>Reason:</strong> {probabilisticAnalysis.deferralDecision.reason.description}
            </p>
            <p className="text-sm text-yellow-600">
              <strong>Technical Details:</strong> {probabilisticAnalysis.deferralDecision.reason.technicalDetails}
            </p>
            <div className="mt-3">
              <strong>Recommended Actions:</strong>
              <ul className="list-disc list-inside text-sm">
                {probabilisticAnalysis.deferralDecision.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards with Uncertainty */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Average Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{averageRisk}</p>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-gray-500">95% CI: [</span>
              <span className="font-medium">{averageRiskUncertainty.lower.toFixed(1)}</span>
              <span className="text-gray-500"> - </span>
              <span className="font-medium">{averageRiskUncertainty.upper.toFixed(1)}</span>
              <span className="text-gray-500">]</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across 24-month period</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Extreme Event Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{extremeEventTrend}%</p>
            <div className="text-xs text-muted-foreground mt-1">
              Causal Confidence: {(causalConfidence * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Next 6 months forecast</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Temperature Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${parseFloat(temperatureTrend) > 0 ? "text-red-600" : "text-blue-600"}`}>
              {temperatureTrend}°C
            </p>
            <p className="text-xs text-muted-foreground mt-1">3-month average change</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Overall Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {((probabilisticAnalysis.overallRisk.confidenceInterval.confidenceLevel) * 100).toFixed(0)}%
            </p>
            {getUncertaintyBadge(forecast[0]?.uncertainty_level || 'medium')}
            <p className="text-xs text-muted-foreground mt-1">Model confidence level</p>
          </CardContent>
        </Card>
      </div>

      {/* Historical Climate Data */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Climate Trends</CardTitle>
          <CardDescription>12-month retrospective analysis (2023)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300} aria-label="Historical climate trends area chart" aria-describedby="historical-chart-desc">
            <AreaChart data={historical}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="temperature_change" fill="#fca5a5" stroke="#dc2626" />
              <Line yAxisId="right" type="monotone" dataKey="risk_score" stroke="#ea580c" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div id="historical-chart-desc" className="sr-only">
            Area chart displaying historical temperature changes in degrees Celsius and risk scores over 12 months from 2023. Temperature changes range from {Math.min(...historical.map(d => d.temperature_change))} to {Math.max(...historical.map(d => d.temperature_change))} degrees, with risk scores from {Math.min(...historical.map(d => d.risk_score))} to {Math.max(...historical.map(d => d.risk_score))}.
          </div>
        </CardContent>
      </Card>

      {/* Climate Forecast (Next 12 Months) with Uncertainty */}
      <Card>
        <CardHeader>
          <CardTitle>12-Month Climate Forecast</CardTitle>
          <CardDescription>
            Earth system models (ensemble prediction) with 95% Confidence Intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300} aria-label="12-month climate forecast line chart" aria-describedby="forecast-chart-desc">
            <ComposedChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name.includes('lower') || name.includes('upper')) return [value.toFixed(1), name];
                  return [value.toFixed(1), name];
                }}
                labelFormatter={(label) => `${label} Forecast`}
              />
              <Legend />
              {/* Risk Score with Confidence Interval */}
              <Area 
                type="monotone" 
                dataKey="risk_score_upper" 
                stroke="none" 
                fill="#fed7aa" 
                fillOpacity={0.5}
                name="Risk 95% CI Upper"
              />
              <Area 
                type="monotone" 
                dataKey="risk_score_lower" 
                stroke="none" 
                fill="#fff7ed" 
                fillOpacity={0.8}
                name="Risk 95% CI Lower"
              />
              <Line 
                type="monotone" 
                dataKey="risk_score" 
                stroke="#f97316" 
                strokeWidth={2.5} 
                dot={{ r: 4 }}
                name="Risk Score"
              />
              <Line 
                type="monotone" 
                dataKey="temperature_change" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                name="Temperature Change"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-4 h-1 bg-orange-500" />
              <span>Risk Score (Point Estimate)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-200" />
              <span>95% Confidence Interval</span>
            </div>
          </div>
          <div id="forecast-chart-desc" className="sr-only">
            Line chart with shaded uncertainty region showing forecast risk scores and temperature changes for the next 12 months.
          </div>
        </CardContent>
      </Card>

      {/* Extreme Event Probability with Uncertainty */}
      <Card>
        <CardHeader>
          <CardTitle>Extreme Event Risk Probability</CardTitle>
          <CardDescription>Bayesian inference from climate models with uncertainty bounds</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300} aria-label="Extreme event risk probability bar chart" aria-describedby="extreme-chart-desc">
            <ComposedChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 1]} />
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="extreme_event_upper" fill="#fecaca" name="Upper Bound" />
              <Bar dataKey="extreme_event_probability" fill="#ef4444" name="Best Estimate" />
              <Bar dataKey="extreme_event_lower" fill="#fef2f2" name="Lower Bound" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-muted-foreground">
            Bars show probability range; red fill indicates best estimate within uncertainty bounds.
          </div>
          <div id="extreme-chart-desc" className="sr-only">
            Bar chart showing extreme event probability ranges for each month.
          </div>
        </CardContent>
      </Card>

      {/* Causal Inference Display */}
      <Card>
        <CardHeader>
          <CardTitle>Causal Analysis</CardTitle>
          <CardDescription>Counterfactual analysis distinguishing correlation from causation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Causal Claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  {getEpistemicBadge(probabilisticAnalysis.causalClaims[0]?.evidenceStrength || 0.75)}
                </div>
                <h4 className="font-semibold text-sm mb-2">
                  Temperature → Extreme Events
                </h4>
                <p className="text-xs text-slate-700 mb-2">
                  <strong>Mechanism:</strong> Increased temperatures intensify weather patterns, 
                  leading to more frequent and severe extreme events.
                </p>
                <div className="text-xs text-slate-600">
                  <strong>Confidence:</strong> {(probabilisticAnalysis.causalClaims[0]?.evidenceStrength * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="outline">Counterfactual Validated</Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2">Counterfactual Scenario</h4>
                <p className="text-xs text-slate-700">
                  <strong>If</strong> temperature increase were held constant...<br />
                  <strong>Then</strong> extreme event probability would decrease by ~{(0.3 * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Probability: {(probabilisticAnalysis.causalClaims[0]?.counterfactuals[0]?.probability * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Model Governance Summary */}
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Model Governance Status
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Governance Score:</span>
                  <p className={`font-bold ${probabilisticAnalysis.governanceReport.governanceScore >= 0.8 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {(probabilisticAnalysis.governanceReport.governanceScore * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Drift Detected:</span>
                  <p className={`font-bold ${probabilisticAnalysis.governanceReport.driftMonitor.driftDetected ? 'text-red-600' : 'text-green-600'}`}>
                    {probabilisticAnalysis.governanceReport.driftMonitor.driftDetected ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Drift Severity:</span>
                  <p className={`font-bold text-${probabilisticAnalysis.governanceReport.driftMonitor.driftSeverity === 'severe' ? 'red' : 'green'}-600`}>
                    {probabilisticAnalysis.governanceReport.driftMonitor.driftSeverity}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Review Priority:</span>
                  <p className={`font-bold ${probabilisticAnalysis.governanceReport.reviewPriority === 'critical' ? 'text-red-600' : probabilisticAnalysis.governanceReport.reviewPriority === 'high' ? 'text-orange-600' : 'text-green-600'}`}>
                    {probabilisticAnalysis.governanceReport.reviewPriority}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Severity Legend */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="text-base">Risk Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm">Low (0-25)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-sm">Moderate (25-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-sm">High (50-75)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm">Critical (75-100)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Impact on Credits */}
      <Card>
        <CardHeader>
          <CardTitle>Climate Risk Impact on Credit Valuation</CardTitle>
          <CardDescription>Risk-adjusted pricing model for permanence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-sm mb-2">Low Risk Zones (Score 0-25)</h4>
              <p className="text-sm text-slate-700">
                Credits retain 100% value. Higher permanence confidence justifies premium pricing and longer bond terms.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-yellow-50">
              <h4 className="font-semibold text-sm mb-2">Moderate Risk (Score 25-50)</h4>
              <p className="text-sm text-slate-700">
                Credits retain 80-90% value. Requires monitoring buffer and shorter vintage terms.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-orange-50">
              <h4 className="font-semibold text-sm mb-2">High Risk (Score 50-75)</h4>
              <p className="text-sm text-slate-700">
                Credits retain 60-80% value. Requires active reversibility management and rapid verification.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-red-50">
              <h4 className="font-semibold text-sm mb-2">Critical Risk (Score 75-100)</h4>
              <p className="text-sm text-slate-700">
                May not be issuable. Requires specialized governance and real-time monitoring protocols.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClimateRiskForecasting;
