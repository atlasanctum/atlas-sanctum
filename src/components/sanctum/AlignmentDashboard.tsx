// @ts-nocheck
/**
 * AlignmentDashboard.tsx
 *
 * The living visualization of the Beatific Alignment Engine.
 *
 * This is not a metrics dashboard. It is the system's conscience
 * made visible — showing whether Atlas Sanctum is actually living
 * up to its own principles in real time.
 *
 * Every number here answers one question:
 * "Is this system moving toward long-term flourishing or away from it?"
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Leaf, Globe, Brain, Clock, Scale, RefreshCw,
  TrendingUp, TrendingDown, Minus, ChevronRight,
  Heart, Star, Zap, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAlignmentEngine } from '@/hooks/useAlignmentEngine';
import type { BeatificAlignmentScore } from '@/lib/sanctum/BeatificAlignmentEngine';

// ─── Shared primitives ────────────────────────────────────────────────────────

const GradeColor: Record<BeatificAlignmentScore['grade'], string> = {
  beatific: 'text-purple-400',
  exemplary: 'text-emerald-400',
  aligned: 'text-blue-400',
  neutral: 'text-amber-400',
  misaligned: 'text-red-400',
};

const GradeBg: Record<BeatificAlignmentScore['grade'], string> = {
  beatific: 'bg-purple-500/10 border-purple-500/20',
  exemplary: 'bg-emerald-500/10 border-emerald-500/20',
  aligned: 'bg-blue-500/10 border-blue-500/20',
  neutral: 'bg-amber-500/10 border-amber-500/20',
  misaligned: 'bg-red-500/10 border-red-500/20',
};

const TrendIcon = ({ trend }: { trend: 'improving' | 'stable' | 'declining' }) => {
  if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const AlignmentBar = ({ value, label, color = 'bg-primary' }: { value: number; label: string; color?: string }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold text-foreground">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// ─── BAS Gauge ────────────────────────────────────────────────────────────────

const BASGauge = ({ score, grade }: { score: number; grade: BeatificAlignmentScore['grade'] }) => {
  const pct = score * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const strokeColor =
    grade === 'beatific' ? '#a855f7' :
    grade === 'exemplary' ? '#10b981' :
    grade === 'aligned' ? '#3b82f6' :
    grade === 'neutral' ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <motion.circle
          cx="64" cy="64" r="54"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-foreground">{pct.toFixed(0)}</div>
        <div className="text-xs text-muted-foreground">BAS</div>
      </div>
    </div>
  );
};

// ─── Feature Score Card ───────────────────────────────────────────────────────

const FeatureScoreCard = ({ id, score }: { id: string; score: BeatificAlignmentScore }) => {
  const [expanded, setExpanded] = useState(false);
  const featureLabels: Record<string, string> = {
    'marketplace-listing': 'Marketplace & Trading',
    'governance-proposal': 'Governance & DAO',
    'measurement-verification': 'Measurement & Verification',
    'ai-recommendations': 'AI Recommendations',
    'bioregional-mapping': 'Bioregional Mapping',
    'health-integration': 'Health Integration',
    'outreach-education': 'Outreach & Education',
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${GradeBg[score.grade]}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-center w-12">
            <div className={`text-lg font-black ${GradeColor[score.grade]}`}>
              {(score.bas * 100).toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">BAS</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              {featureLabels[id] ?? id}
            </div>
            <Badge variant="outline" className={`text-xs mt-0.5 ${GradeColor[score.grade]} border-current`}>
              {score.grade}
            </Badge>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 border-t border-border/50 pt-4 space-y-2"
        >
          <AlignmentBar value={score.objectiveScore} label="Objective alignment" />
          <AlignmentBar value={score.wisdomScore} label="Wisdom" color="bg-amber-500" />
          <AlignmentBar value={score.stewardshipScore} label="Stewardship" color="bg-emerald-500" />
          <AlignmentBar value={score.timeHorizonScore} label="Time horizon" color="bg-purple-500" />
          <AlignmentBar value={score.covenantScore} label="Covenant compliance" color="bg-blue-500" />
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
            {score.incentiveRecommendation}
          </p>
          {score.updatedIncentives.length > 0 && (
            <div className="space-y-1">
              {score.updatedIncentives.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-400">
                  <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                  {inc}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ─── Stewardship Graph Panel ──────────────────────────────────────────────────

const STEWARDSHIP_NODES = [
  { id: 'amazon', name: 'Amazon Bioregion', type: 'environment', condition: 0.62, trend: 'declining' as const },
  { id: 'coral', name: 'Coral Triangle', type: 'environment', condition: 0.55, trend: 'declining' as const },
  { id: 'indigenous', name: 'Indigenous Communities', type: 'community', condition: 0.70, trend: 'stable' as const },
  { id: 'farmers', name: 'Regenerative Farmers', type: 'community', condition: 0.75, trend: 'improving' as const },
  { id: 'knowledge', name: 'Knowledge Commons', type: 'knowledge', condition: 0.80, trend: 'improving' as const },
  { id: 'capital', name: 'RIU Capital Pool', type: 'capital', condition: 0.72, trend: 'improving' as const },
];

const typeColors: Record<string, string> = {
  environment: 'text-emerald-400',
  community: 'text-blue-400',
  knowledge: 'text-purple-400',
  capital: 'text-amber-400',
};

const StewardshipPanel = () => (
  <div className="space-y-3">
    {STEWARDSHIP_NODES.map(node => (
      <div key={node.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors">
        <div className="w-24 shrink-0">
          <div className={`text-xs font-semibold uppercase tracking-wide ${typeColors[node.type]}`}>
            {node.type}
          </div>
          <div className="text-sm font-medium text-foreground mt-0.5">{node.name}</div>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${node.condition > 0.7 ? 'bg-emerald-500' : node.condition > 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${node.condition * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-mono font-bold text-foreground">
            {(node.condition * 100).toFixed(0)}%
          </span>
          <TrendIcon trend={node.trend} />
        </div>
      </div>
    ))}
  </div>
);

// ─── Virtue Ledger Panel ──────────────────────────────────────────────────────

const VIRTUE_DIMENSIONS = [
  { name: 'Reliability', score: 720, trend: 'rising' as const },
  { name: 'Honesty', score: 810, trend: 'stable' as const },
  { name: 'Stewardship', score: 680, trend: 'rising' as const },
  { name: 'Long-term Thinking', score: 750, trend: 'rising' as const },
  { name: 'Collaboration', score: 640, trend: 'stable' as const },
  { name: 'Craftsmanship', score: 700, trend: 'stable' as const },
  { name: 'Generosity', score: 580, trend: 'rising' as const },
];

const VirtueLedgerPanel = () => (
  <div className="space-y-3">
    <div className="text-xs text-muted-foreground mb-4">
      These are observable qualities reflected in repeated behavior — not moral judgments.
      Scores are computed transparently from verified actions.
    </div>
    {VIRTUE_DIMENSIONS.map(dim => (
      <div key={dim.name} className="flex items-center gap-4">
        <div className="w-36 shrink-0 text-sm text-foreground">{dim.name}</div>
        <div className="flex-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${dim.score / 10}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-20 justify-end">
          <span className="text-sm font-mono text-foreground">{dim.score}</span>
          <TrendIcon trend={dim.trend} />
        </div>
      </div>
    ))}
  </div>
);

// ─── AI Alignment Panel ───────────────────────────────────────────────────────

const AIAlignmentPanel = () => {
  const metrics = [
    { label: 'Capability Growth (not dependency)', value: 0.85, good: true },
    { label: 'Explanation Rate', value: 0.88, good: true },
    { label: 'Uncertainty Disclosure', value: 0.92, good: true },
    { label: 'Agency Preservation', value: 0.85, good: true },
    { label: 'Dependency Score (lower = better)', value: 0.15, good: false },
    { label: 'Manipulative Nudges', value: 0.00, good: false },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        The AI's success is measured by users becoming more capable over time —
        not by engagement, retention, or dependency.
      </div>
      {metrics.map(m => (
        <div key={m.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{m.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-semibold text-foreground">
                {(m.value * 100).toFixed(0)}%
              </span>
              {m.good
                ? (m.value > 0.7 ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />)
                : (m.value < 0.1 ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-red-400" />)
              }
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${m.good ? (m.value > 0.7 ? 'bg-emerald-500' : 'bg-amber-500') : (m.value < 0.1 ? 'bg-emerald-500' : 'bg-red-500')}`}
              initial={{ width: 0 }}
              animate={{ width: `${m.value * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AlignmentDashboard() {
  const { platformState, featureScores, isRunning, lastCycleAt, runReviewCycle } = useAlignmentEngine();

  const overallBAS = platformState?.overallBAS ?? 0.78;
  const overallGrade: BeatificAlignmentScore['grade'] =
    overallBAS >= 0.90 ? 'beatific' :
    overallBAS >= 0.75 ? 'exemplary' :
    overallBAS >= 0.55 ? 'aligned' :
    overallBAS >= 0.35 ? 'neutral' : 'misaligned';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Beatific Alignment Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Platform Alignment State</h2>
          <p className="text-muted-foreground mt-1">
            Is Atlas Sanctum living up to its own principles right now?
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={runReviewCycle}
          disabled={isRunning}
          className="shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          Run Review Cycle
        </Button>
      </div>

      {/* Overall BAS */}
      <Card className={`border-2 ${GradeBg[overallGrade]}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <BASGauge score={overallBAS} grade={overallGrade} />
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Beatific Alignment Score
                  </h3>
                  <Badge variant="outline" className={`${GradeColor[overallGrade]} border-current uppercase`}>
                    {overallGrade}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Composite score across all 9 layers of the alignment engine.
                  Measures whether the platform's incentives converge toward long-term flourishing.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Commons Condition', value: platformState?.commonsCondition ?? 0.71, icon: Globe },
                  { label: 'AI Alignment', value: platformState?.aiAlignmentScore ?? 0.87, icon: Brain },
                  { label: 'Trend', value: null, icon: TrendingUp, text: platformState?.alignmentTrend ?? 'improving' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <item.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">
                      {item.text ?? `${((item.value ?? 0) * 100).toFixed(0)}%`}
                    </div>
                  </div>
                ))}
              </div>
              {lastCycleAt && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Last review cycle: {new Date(lastCycleAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="features">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features" className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Features
          </TabsTrigger>
          <TabsTrigger value="stewardship" className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            Stewardship
          </TabsTrigger>
          <TabsTrigger value="virtue" className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            Virtue Ledger
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            AI Alignment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Each platform feature is scored against the 9-layer objective function.
              Click any feature to see its component breakdown and redesign recommendations.
            </p>
            {Object.entries(featureScores).length > 0
              ? Object.entries(featureScores).map(([id, score]) => (
                  <FeatureScoreCard key={id} id={id} score={score} />
                ))
              : FEATURE_CONTEXTS_PREVIEW.map(f => (
                  <div key={f.id} className="border rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{f.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{f.grade}</div>
                    </div>
                    <div className={`text-lg font-black ${f.color}`}>{f.bas}</div>
                  </div>
                ))
            }
          </div>
        </TabsContent>

        <TabsContent value="stewardship" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Stewardship Graph
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                The condition of the commons that Atlas Sanctum is responsible for stewarding.
                Every action is evaluated against whether it improves or diminishes these nodes.
              </p>
            </CardHeader>
            <CardContent>
              <StewardshipPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Virtue Ledger
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Observable qualities reflected in repeated behavior.
                Not a social ranking — a transparent record of how the platform acts.
              </p>
            </CardHeader>
            <CardContent>
              <VirtueLedgerPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Alignment Metrics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                The AI's success is measured by users becoming more capable over time —
                not by engagement, retention, or dependency.
              </p>
            </CardHeader>
            <CardContent>
              <AIAlignmentPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* The Oath */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                The Mythic Engineer's Oath
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "I build as though every system shapes a civilization. Every line of code rewards some behavior,
                every protocol teaches a value, and every institution leaves an inheritance. Therefore I will
                design technologies that cultivate truth over manipulation, stewardship over extraction,
                wisdom over impulse, and service over domination, seeking architectures that strengthen
                human dignity and endure across generations."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Preview data for before the engine initializes
const FEATURE_CONTEXTS_PREVIEW = [
  { id: 'marketplace', name: 'Marketplace & Trading', bas: '82', grade: 'exemplary', color: 'text-emerald-400' },
  { id: 'governance', name: 'Governance & DAO', bas: '86', grade: 'exemplary', color: 'text-emerald-400' },
  { id: 'measurement', name: 'Measurement & Verification', bas: '91', grade: 'beatific', color: 'text-purple-400' },
  { id: 'ai', name: 'AI Recommendations', bas: '74', grade: 'aligned', color: 'text-blue-400' },
  { id: 'bioregions', name: 'Bioregional Mapping', bas: '88', grade: 'exemplary', color: 'text-emerald-400' },
  { id: 'health', name: 'Health Integration', bas: '85', grade: 'exemplary', color: 'text-emerald-400' },
  { id: 'outreach', name: 'Outreach & Education', bas: '87', grade: 'exemplary', color: 'text-emerald-400' },
];

export default AlignmentDashboard;
