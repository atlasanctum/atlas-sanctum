import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, BarChart3, Target, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const models = [
  { name: 'Climate Risk Forecaster', accuracy: 94.2, horizon: '12 months', domain: 'Climate', status: 'live' },
  { name: 'Food Security Predictor', accuracy: 89.7, horizon: '6 months', domain: 'Agriculture', status: 'live' },
  { name: 'Economic Resilience Index', accuracy: 87.3, horizon: '24 months', domain: 'Economy', status: 'live' },
  { name: 'Pandemic Early Warning', accuracy: 91.8, horizon: '3 months', domain: 'Health', status: 'live' },
  { name: 'Governance Stability Score', accuracy: 83.5, horizon: '18 months', domain: 'Governance', status: 'beta' },
  { name: 'Biodiversity Loss Forecast', accuracy: 88.1, horizon: '36 months', domain: 'Ecosystem', status: 'live' },
];

const forecasts = [
  { metric: 'Global Temperature Anomaly', current: '+1.4°C', predicted: '+1.6°C', confidence: 92, trend: 'up' },
  { metric: 'Food Insecurity Index', current: '28.4%', predicted: '31.2%', confidence: 87, trend: 'up' },
  { metric: 'Renewable Energy Share', current: '34%', predicted: '41%', confidence: 94, trend: 'up' },
  { metric: 'Deforestation Rate', current: '4.2M ha/yr', predicted: '3.8M ha/yr', confidence: 79, trend: 'down' },
];

export default function PredictiveAnalytics() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">Phase 2</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Predictive Analytics</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            AI-powered forecasting models trained on global datasets to predict climate, economic, health, and governance outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Brain, label: 'Active Models', value: '24', color: 'text-purple-500' },
            { icon: BarChart3, label: 'Avg Accuracy', value: '91.2%', color: 'text-emerald-500' },
            { icon: Target, label: 'Predictions/Day', value: '840K', color: 'text-blue-500' },
            { icon: AlertTriangle, label: 'Active Alerts', value: '17', color: 'text-amber-500' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Prediction Models</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {models.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">{model.name}</span>
                    <Badge variant={model.status === 'live' ? 'default' : 'secondary'} className="text-xs">
                      {model.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{model.domain} · {model.horizon}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${model.accuracy}%` }} />
                      </div>
                      <span>{model.accuracy}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> 12-Month Forecasts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {forecasts.map((f, i) => (
                <motion.div
                  key={f.metric}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <p className="font-medium text-sm text-foreground mb-2">{f.metric}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Now: </span>
                      <span className="font-medium">{f.current}</span>
                    </div>
                    <div className={f.trend === 'up' ? 'text-amber-600' : 'text-emerald-600'}>
                      → {f.predicted}
                    </div>
                    <Badge variant="outline" className="text-xs">{f.confidence}% conf.</Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
