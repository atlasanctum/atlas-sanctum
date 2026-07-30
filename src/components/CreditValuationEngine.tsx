import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { ValuationModel, ImpactBreakdown } from "@/types/marketplace";
import { Zap, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

interface CreditValuationEngineProps {
  valuation: ValuationModel | null;
  isLoading?: boolean;
}

// Helper to compute impact breakdown
const computeImpactBreakdown = (valuation: ValuationModel): ImpactBreakdown => {
  const totalWeight = valuation.impact_co2_weight + valuation.impact_biodiversity_weight + valuation.impact_health_weight;

  return {
    co2_component: {
      value: 100,
      weight: valuation.impact_co2_weight,
      contribution: (valuation.impact_co2_weight / totalWeight) * (valuation.weighted_impact_score || 0),
    },
    biodiversity_component: {
      value: 100,
      weight: valuation.impact_biodiversity_weight,
      contribution: (valuation.impact_biodiversity_weight / totalWeight) * (valuation.weighted_impact_score || 0),
    },
    health_component: {
      value: 100,
      weight: valuation.impact_health_weight,
      contribution: (valuation.impact_health_weight / totalWeight) * (valuation.weighted_impact_score || 0),
    },
    final_score: valuation.weighted_impact_score || 0,
    confidence_interval: [
      valuation.confidence_lower_bound || 0,
      valuation.confidence_upper_bound || 100,
    ],
    reversal_risk_adjusted_price: valuation.final_credit_price || 0,
  };
};

export const CreditValuationEngine: React.FC<CreditValuationEngineProps> = ({
  valuation,
  isLoading = false,
}) => {
  // Sample valuation data
  const sampleValuation: ValuationModel = {
    id: "val-1",
    project_id: "project-1",
    impact_co2_weight: 0.45,
    impact_biodiversity_weight: 0.35,
    impact_health_weight: 0.2,
    weighted_impact_score: 78.5,
    confidence_score: 0.92,
    confidence_upper_bound: 85.2,
    confidence_lower_bound: 71.8,
    reversal_risk_percent: 8.5,
    reversal_risk_decay_rate: 0.95,
    permanence_bond_percent: 2.5,
    base_credit_price: 25.0,
    dynamic_price_multiplier: 2.8,
    final_credit_price: 70.0,
    last_recomputed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const displayValuation = valuation || sampleValuation;
  const breakdown = useMemo(() => computeImpactBreakdown(displayValuation), [displayValuation]);

  // Reversal risk decay curve
  const decayData = Array.from({ length: 25 }, (_, year) => ({
    year: year,
    remaining_risk: (displayValuation.reversal_risk_percent * Math.pow(displayValuation.reversal_risk_decay_rate, year)).toFixed(2),
    price_retention: ((1 - (displayValuation.reversal_risk_percent / 100) * Math.pow(1 - displayValuation.reversal_risk_decay_rate, year)) * 100).toFixed(1),
  }));

  // Impact score components
  const impactComponentsData = [
    { name: "CO₂ Impact", value: breakdown.co2_component.contribution.toFixed(1) },
    { name: "Biodiversity", value: breakdown.biodiversity_component.contribution.toFixed(1) },
    { name: "Health Impact", value: breakdown.health_component.contribution.toFixed(1) },
  ];

  // Weight distribution pie
  const weightData = [
    { name: "CO₂ (45%)", value: displayValuation.impact_co2_weight * 100 },
    { name: "Biodiversity (35%)", value: displayValuation.impact_biodiversity_weight * 100 },
    { name: "Health (20%)", value: displayValuation.impact_health_weight * 100 },
  ];

  const COLORS = ["#10b981", "#06b6d4", "#f59e0b"];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Valuation Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-b from-slate-200 to-slate-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Impact Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{breakdown.final_score.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Confidence Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{((displayValuation.confidence_score ?? 0) * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">95% CI</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Reversal Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{displayValuation.reversal_risk_percent.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Annual decay rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Final Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${breakdown.reversal_risk_adjusted_price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Per credit</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="impact">Impact Scoring</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* Impact Scoring Tab */}
        <TabsContent value="impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Variable Impact Scoring</CardTitle>
              <CardDescription>Weighted combination of CO₂, biodiversity, and health metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weight Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Component Weights</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CO₂ Impact</span>
                        <span className="font-bold text-emerald-600">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Biodiversity</span>
                        <span className="font-bold text-blue-600">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "35%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Health Impact</span>
                        <span className="font-bold text-amber-600">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: "20%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={weightData} cx="50%" cy="50%" labelLine={false} label={({ name }) => name} outerRadius={80} fill="#8884d8" dataKey="value">
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => typeof value === 'number' ? `${value.toFixed(1)}%` : `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Component Contributions */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Impact Score Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={impactComponentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mathematical Formula */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <h4 className="font-semibold text-sm mb-3">Calculation Formula</h4>
                <div className="space-y-2 font-mono text-xs text-slate-700">
                  <p>Impact_Score = </p>
                  <p className="ml-4">
                    (CO₂_Score × 0.45) + <br />
                    (Biodiversity_Score × 0.35) + <br />
                    (Health_Score × 0.20)
                  </p>
                  <p className="mt-3">
                    Result: <span className="font-bold text-purple-600">{breakdown.final_score.toFixed(1)} / 100</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confidence Tab */}
        <TabsContent value="confidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confidence-Weighted Credits</CardTitle>
              <CardDescription>Uncertainty quantification with 95% confidence intervals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Confidence Metrics */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Confidence Level</span>
                      <span className="font-bold text-blue-600">{((displayValuation.confidence_score ?? 0) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                        style={{ width: `${(displayValuation.confidence_score ?? 0) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Score: {breakdown.final_score.toFixed(1)} (±{((breakdown.confidence_interval[1] - breakdown.confidence_interval[0]) / 2).toFixed(1)})
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">95% Confidence Interval</h4>
                    <p className="text-sm text-blue-800">
                      Lower Bound: <span className="font-bold">{breakdown.confidence_interval[0].toFixed(1)}</span>
                    </p>
                    <p className="text-sm text-blue-800">
                      Upper Bound: <span className="font-bold">{breakdown.confidence_interval[1].toFixed(1)}</span>
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-emerald-50">
                    <h4 className="font-semibold text-sm text-emerald-900 mb-2">Credit Issuance</h4>
                    <p className="text-sm text-emerald-800">
                      Conservative Estimate: <span className="font-bold">{breakdown.confidence_interval[0].toFixed(0)} credits</span>
                    </p>
                    <p className="text-sm text-emerald-800 mt-1">
                      Maximum Estimate: <span className="font-bold">{breakdown.confidence_interval[1].toFixed(0)} credits</span>
                    </p>
                  </div>
                </div>

                {/* Confidence Sources */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Confidence Drivers</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-semibold text-muted-foreground">Data Source Quality</p>
                      <p className="text-xs text-slate-700 mt-1">Satellite imagery (Sentinel-2): +95%</p>
                      <p className="text-xs text-slate-700">Soil probes validated: +8%</p>
                      <p className="text-xs text-slate-700">eDNA sequencing: +6%</p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-semibold text-muted-foreground">Measurement Frequency</p>
                      <p className="text-xs text-slate-700 mt-1">Monthly validation: +10%</p>
                      <p className="text-xs text-slate-700">Cross-verification: +5%</p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-semibold text-muted-foreground">Historical Data</p>
                      <p className="text-xs text-slate-700 mt-1">24+ months tracking: +12%</p>
                      <p className="text-xs text-slate-700">Baseline established: +8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reversal Risk & Permanence</CardTitle>
              <CardDescription>Time-based decay function for long-term valuation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-sm text-orange-900">Initial Reversal Risk</h4>
                  <p className="text-2xl font-bold text-orange-600">{displayValuation.reversal_risk_percent.toFixed(2)}%</p>
                  <p className="text-xs text-orange-700 mt-2">Probability of carbon loss in year 1</p>
                </div>

                <div className="p-4 border rounded-lg bg-amber-50">
                  <h4 className="font-semibold text-sm text-amber-900">Decay Rate</h4>
                  <p className="text-2xl font-bold text-amber-600">{(displayValuation.reversal_risk_decay_rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-amber-700 mt-2">Annual risk reduction factor</p>
                </div>

                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-sm text-green-900">Permanence Bond</h4>
                  <p className="text-2xl font-bold text-green-600">{displayValuation.permanence_bond_percent.toFixed(1)}%</p>
                  <p className="text-xs text-green-700 mt-2">Reserved for reversal coverage</p>
                </div>
              </div>

              {/* Decay Curve */}
              <div>
                <h3 className="font-semibold mb-4">Reversal Risk Decay Over 25 Years</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={decayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="remaining_risk" stroke="#ef4444" strokeWidth={2} name="Risk %" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="price_retention" stroke="#10b981" strokeWidth={2} name="Price Retention %" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Mitigation */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Risk Mitigation Strategies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Active Management</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>✓ Monthly measurement validation</li>
                      <li>✓ Real-time anomaly detection</li>
                      <li>✓ Rapid intervention protocols</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Financial Insurance</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>✓ {displayValuation.permanence_bond_percent}% permanence bond held in escrow</li>
                      <li>✓ Reversal coverage fund</li>
                      <li>✓ Insurance agreements</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Legal Protection</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>✓ Land trust covenants</li>
                      <li>✓ Conservation easements</li>
                      <li>✓ Perpetual agreements</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Verification Oversight</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                      <li>✓ Third-party audits</li>
                      <li>✓ Multi-source verification</li>
                      <li>✓ Public transparency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Pricing Model</CardTitle>
              <CardDescription>Base price adjusted for impact, confidence, and risk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing Breakdown */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Base Credit Price</span>
                    <span className="text-2xl font-bold text-blue-600">${(displayValuation.base_credit_price ?? 0).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">Market standard for verified carbon credits</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">×</p>
                    <p className="text-sm font-semibold text-purple-600">{displayValuation.dynamic_price_multiplier.toFixed(1)}x</p>
                    <p className="text-xs text-muted-foreground">Impact Multiplier</p>
                  </div>
                </div>

                <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-900">Final Credit Price</span>
                    <span className="text-3xl font-bold text-green-600">${breakdown.reversal_risk_adjusted_price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    {displayValuation.dynamic_price_multiplier.toFixed(1)}x premium reflects {breakdown.final_score.toFixed(0)}/100 impact score
                  </p>
                </div>
              </div>

              {/* Price Factors */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Price Adjustment Factors</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Impact Score Multiplier</span>
                      <span className="font-bold">{(breakdown.final_score / 50).toFixed(2)}x</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Score of {breakdown.final_score.toFixed(0)}/100 = {(breakdown.final_score / 50).toFixed(2)}x multiplier
                    </p>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Confidence Adjustment</span>
                      <span className="font-bold">{(displayValuation.confidence_score ?? 0).toFixed(3)}x</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((displayValuation.confidence_score ?? 0) * 100).toFixed(0)}% confidence = {(displayValuation.confidence_score ?? 0).toFixed(3)}x multiplier
                    </p>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Bioregional Multiplier</span>
                      <span className="font-bold">2.8x</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Amazon Basin with indigenous stewardship and high biodiversity value
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Over Time */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Price Trajectory (Reversal Risk Adjusted)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={decayData.map((d) => ({
                      year: d.year,
                      price: ((displayValuation.final_credit_price ?? 0) * (parseFloat(d.price_retention) / 100)).toFixed(2),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} name="Price/Credit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreditValuationEngine;
