import { useState } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Zap, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useValuationModel,
  useDynamicCreditPrice,
  useImpactBreakdown,
  useReversalRiskDecay,
  useValuationConfidenceInterval,
  usePriceProjection,
} from '@/hooks/useValuationModel';

interface ValuationEngineWidgetProps {
  projectId: string;
}

export function ValuationEngineWidget({ projectId }: ValuationEngineWidgetProps) {
  const { data: valuation, isLoading } = useValuationModel(projectId);
  const { data: pricing } = useDynamicCreditPrice(projectId);
  const { data: impact } = useImpactBreakdown(projectId);
  const { data: riskDecay } = useReversalRiskDecay(projectId, 10);
  const { data: confidence } = useValuationConfidenceInterval(projectId);
  const { data: projection } = usePriceProjection(projectId);
  const [activeTab, setActiveTab] = useState<'impact' | 'price' | 'risk'>('impact');

  if (isLoading || !valuation) {
    return (
      <Card className="bg-card-gradient border-border/50">
        <CardHeader>
          <CardTitle>Valuation Engine</CardTitle>
          <CardDescription>Loading valuation model...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const impactData = impact ? [
    { name: 'CO₂ Impact', value: impact.co2_component.contribution, weight: `${(impact.co2_component.weight * 100).toFixed(0)}%` },
    { name: 'Biodiversity', value: impact.biodiversity_component.contribution, weight: `${(impact.biodiversity_component.weight * 100).toFixed(0)}%` },
    { name: 'Health', value: impact.health_component.contribution, weight: `${(impact.health_component.weight * 100).toFixed(0)}%` },
  ] : [];

  return (
    <Card className="bg-card-gradient border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Valuation Engine</CardTitle>
            <CardDescription>Dynamic credit pricing & impact scoring</CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            {(valuation.confidence_score || 0) * 100 > 85 ? '✓ Confident' : '⚠ Review'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="p-4 rounded-lg bg-background/50 border border-border/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Base Price</span>
              <Badge variant="outline" className="text-xs">Original</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">${pricing?.base_price.toFixed(2) || 'N/A'}</p>
            <p className="text-xs text-muted-foreground mt-2">per credit</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Dynamic Price</span>
              <Badge className="bg-primary text-primary-foreground text-xs">
                {pricing && pricing.price_change_percent > 0 ? '↑' : '↓'}
                {Math.abs(pricing?.price_change_percent || 0).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">${pricing?.final_price.toFixed(2) || 'N/A'}</p>
            <p className="text-xs text-muted-foreground mt-2">Adjusted for impact</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-background/50 border border-border/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {confidence?.confidence_level.toFixed(1) || 'N/A'}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Data quality</p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          {(['impact', 'price', 'risk'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'impact' ? 'Impact Score' : tab === 'price' ? 'Price Model' : 'Risk Analysis'}
            </button>
          ))}
        </div>

        {/* Impact Tab */}
        {activeTab === 'impact' && impact && (
          <motion.div
            key="impact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Overall Score */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Weighted Impact Score</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">{impact.final_score.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Confidence interval: {impact.confidence_interval[0].toFixed(1)} - {impact.confidence_interval[1].toFixed(1)}
              </p>
            </div>

            {/* Component Breakdown */}
            <div className="space-y-3">
              {impactData.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">{item.value.toFixed(1)}</span>
                      <Badge variant="outline" className="text-xs">{item.weight}</Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${(item.value / 100) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Formula Display */}
            <div className="p-3 bg-muted/50 rounded-lg border border-border/30 text-xs font-mono text-muted-foreground space-y-1">
              <p>Score = (CO₂ × {(impact.co2_component.weight).toFixed(2)}) + (Bio × {(impact.biodiversity_component.weight).toFixed(2)}) + (Health × {(impact.health_component.weight).toFixed(2)})</p>
              <p>= ({impact.co2_component.value.toFixed(1)} × 0.40) + ({impact.biodiversity_component.value.toFixed(1)} × 0.30) + ({impact.health_component.value.toFixed(1)} × 0.30)</p>
              <p className="text-primary font-bold">= {impact.final_score.toFixed(1)}/100</p>
            </div>
          </motion.div>
        )}

        {/* Price Model Tab */}
        {activeTab === 'price' && projection && (
          <motion.div
            key="price"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Price Range */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-background/50 rounded-lg border border-border/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Worst Case</p>
                <p className="text-lg font-bold text-destructive">${projection.worst_case.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="text-lg font-bold text-primary">${projection.current_price.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-border/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Best Case</p>
                <p className="text-lg font-bold text-green-600">${projection.best_case.toFixed(2)}</p>
              </div>
            </div>

            {/* Price Projection Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={projection.projected_prices}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Projected Price"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Price Multipliers */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Price Adjustments:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: 'Impact', value: pricing?.multipliers.impact, color: 'text-blue-600' },
                  { label: 'Confidence', value: pricing?.multipliers.confidence, color: 'text-amber-600' },
                  { label: 'Risk', value: pricing?.multipliers.risk, color: 'text-orange-600' },
                ].map((m) => (
                  <div key={m.label} className="p-2 bg-muted/50 rounded border border-border/30 text-center">
                    <p className="text-muted-foreground mb-1">{m.label}</p>
                    <p className={`font-bold ${m.color}`}>{m.value?.toFixed(2)}×</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 'risk' && riskDecay && (
          <motion.div
            key="risk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Risk Gauge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Current Risk</span>
                  <Shield className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-orange-600">{riskDecay.current_risk.toFixed(2)}%</p>
                <Badge variant="outline" className="mt-2 text-xs">{riskDecay.current_risk < 5 ? 'Low' : 'Moderate'}</Badge>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">10-Year Risk</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600">{riskDecay.future_risk.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ↓ {riskDecay.risk_reduction_percent.toFixed(1)}% improvement
                </p>
              </div>
            </div>

            {/* Permanence Score */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">10-Year Permanence Score</span>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${riskDecay.permanence_score}%` }}
                    />
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">{riskDecay.permanence_score.toFixed(0)}%</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Credits become more valuable with age</p>
            </div>

            {/* Permanence Bond */}
            <div className="p-3 bg-muted/50 rounded-lg border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Permanence Bond Locked</span>
                <p className="text-lg font-bold text-foreground">{riskDecay.permanence_bond_amount.toFixed(1)}%</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Credits held in escrow to guarantee permanence</p>
            </div>

            {/* Risk Disclaimer */}
            <div className="p-3 bg-yellow-500/10 border border-yellow-200 rounded flex items-start gap-2 text-xs text-yellow-900">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Risk adjustments based on project type and historical data. Actual risk may vary.</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
