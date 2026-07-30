import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, CheckCircle2, AlertCircle, TrendingUp, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const recommendations = [
  {
    id: 1,
    title: 'Accelerate Mangrove Restoration in Southeast Asia',
    impact: 'High',
    confidence: 94,
    domain: 'Climate',
    rationale: 'Satellite data shows 23% decline in mangrove coverage. Restoration yields 4x carbon sequestration vs. inland forests.',
    actions: ['Fund 3 restoration projects', 'Partner with local NGOs', 'Monitor via satellite'],
  },
  {
    id: 2,
    title: 'Implement Drought-Resistant Crop Programs in Sahel',
    impact: 'Critical',
    confidence: 89,
    domain: 'Agriculture',
    rationale: 'Predictive models indicate 40% rainfall reduction by 2027. Early intervention reduces food insecurity by 60%.',
    actions: ['Deploy seed banks', 'Train 10K farmers', 'Establish water harvesting'],
  },
  {
    id: 3,
    title: 'Strengthen Urban Heat Island Mitigation in Lagos',
    impact: 'Medium',
    confidence: 82,
    domain: 'Health',
    rationale: 'Urban temperatures 4.2°C above rural baseline. Green infrastructure reduces heat-related mortality by 35%.',
    actions: ['Plant 500K trees', 'Install cool roofs', 'Create green corridors'],
  },
];

const impactColor: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

export default function DecisionIntelligence() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Phase 3</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Decision Intelligence</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            AI-synthesized recommendations with explainable reasoning — turning complex global data into clear, actionable decisions for leaders and policymakers.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Lightbulb, label: 'Active Recommendations', value: '47' },
            { icon: Target, label: 'Decisions Supported', value: '1,240' },
            { icon: CheckCircle2, label: 'Outcomes Tracked', value: '892' },
            { icon: TrendingUp, label: 'Avg Impact Score', value: '8.4/10' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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

        <div className="space-y-6">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary flex-shrink-0" />
                      {rec.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={impactColor[rec.impact]}>{rec.impact}</Badge>
                      <Badge variant="secondary">{rec.domain}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${rec.confidence}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground">{rec.confidence}% confidence</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{rec.rationale}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rec.actions.map((action) => (
                      <div key={action} className="flex items-center gap-1.5 text-xs bg-muted/50 rounded-full px-3 py-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {action}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="hero" size="sm">Adopt Recommendation</Button>
                    <Button variant="outline" size="sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      View Full Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
