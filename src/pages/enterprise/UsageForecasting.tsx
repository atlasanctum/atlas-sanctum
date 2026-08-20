import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const MOCK_FORECASTS = [
  { metric:'api_calls',     currentUsage:7420,  projectedUsage:9800,  limit:10000, trend:'increasing', confidence:0.87,
    projectedOverageDate: new Date(Date.now()+12*86400000).toISOString(),
    recommendations:['At current growth rate, you will exceed your api_calls limit around '+new Date(Date.now()+12*86400000).toDateString()+'.','Enable response caching to reduce redundant API calls.'] },
  { metric:'storage',       currentUsage:18,    projectedUsage:22,    limit:50,    trend:'stable',     confidence:0.72,
    projectedOverageDate:null, recommendations:['storage usage is within healthy bounds.'] },
  { metric:'team_members',  currentUsage:3,     projectedUsage:3,     limit:5,     trend:'stable',     confidence:0.95,
    projectedOverageDate:null, recommendations:['team_members usage is within healthy bounds.'] },
];

const MOCK_BUDGETS = [
  { metric:'api_calls',    monthlyBudget:10000, alertThresholds:[0.75,0.9,1.0] },
  { metric:'storage',      monthlyBudget:50,    alertThresholds:[0.75,0.9,1.0] },
  { metric:'team_members', monthlyBudget:5,     alertThresholds:[0.9,1.0] },
];

const trendIcon = (t: string) =>
  t==='increasing' ? <TrendingUp className="w-4 h-4 text-amber-500"/> :
  t==='decreasing' ? <TrendingDown className="w-4 h-4 text-emerald-500"/> :
  <Minus className="w-4 h-4 text-muted-foreground"/>;

const trendColor = (t: string) =>
  t==='increasing' ? 'text-amber-600' : t==='decreasing' ? 'text-emerald-600' : 'text-muted-foreground';

const metricLabel: Record<string,string> = {
  api_calls:'API Calls', storage:'Storage (GB)', team_members:'Team Members',
};

export default function UsageForecasting() {
  const { toast } = useToast();
  const [forecasts, setForecasts] = useState<any[]>(MOCK_FORECASTS);
  const [budgets, setBudgets] = useState<any[]>(MOCK_BUDGETS);
  const [editing, setEditing] = useState<string|null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  const token = () => localStorage.getItem('token') ?? '';

  useEffect(() => {
    fetch('/api/billing/forecasts', { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r => r.ok ? r.json() : null).then(d => d && setForecasts(d.data)).catch(()=>{});
    fetch('/api/billing/budgets', { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r => r.ok ? r.json() : null).then(d => d && setBudgets(d.data)).catch(()=>{});
  }, []);

  const saveBudget = async (metric: string) => {
    const val = Number(budgetInput);
    if (!val || val <= 0) { toast({ title:'Enter a valid budget', variant:'destructive' }); return; }
    try {
      await fetch('/api/billing/budgets', {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
        body: JSON.stringify({ metric, monthlyBudget:val }),
      });
    } catch {}
    setBudgets(b => b.map(x => x.metric===metric ? { ...x, monthlyBudget:val } : x));
    toast({ title:'Budget updated' });
    setEditing(null); setBudgetInput('');
  };

  const getBudget = (metric: string) => budgets.find(b=>b.metric===metric);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Usage Forecasting</h1>
        <p className="text-muted-foreground">30-day projections and budget management for your plan limits.</p>
      </motion.div>

      <div className="space-y-6">
        {forecasts.map((f, i) => {
          const budget = getBudget(f.metric);
          const usagePct = f.limit > 0 ? (f.currentUsage / f.limit) * 100 : 0;
          const projPct  = f.limit > 0 ? (f.projectedUsage / f.limit) * 100 : 0;
          const budgetPct = budget?.monthlyBudget > 0 ? (f.currentUsage / budget.monthlyBudget) * 100 : 0;

          return (
            <motion.div key={f.metric} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}>
              <Card className={f.projectedOverageDate ? 'border-amber-500/30' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{metricLabel[f.metric] ?? f.metric}</CardTitle>
                    <div className="flex items-center gap-2">
                      {trendIcon(f.trend)}
                      <span className={`text-sm font-medium ${trendColor(f.trend)}`}>{f.trend}</span>
                      <Badge variant="outline" className="text-xs">{(f.confidence*100).toFixed(0)}% confidence</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current vs limit */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Current usage</span>
                      <span className="font-medium">{f.currentUsage.toLocaleString()} / {f.limit > 0 ? f.limit.toLocaleString() : '∞'}</span>
                    </div>
                    <Progress value={Math.min(usagePct, 100)} className="h-2"/>
                  </div>

                  {/* 30-day projection */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Projected (30 days)</span>
                      <span className={`font-medium ${projPct > 90 ? 'text-amber-600' : ''}`}>
                        {f.projectedUsage.toLocaleString()}
                        {f.limit > 0 && ` (${projPct.toFixed(0)}%)`}
                      </span>
                    </div>
                    <Progress value={Math.min(projPct, 100)}
                      className={`h-2 ${projPct > 90 ? '[&>div]:bg-amber-500' : ''}`}/>
                  </div>

                  {/* Budget */}
                  {budget && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Budget utilisation</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{budgetPct.toFixed(0)}% of {budget.monthlyBudget.toLocaleString()}</span>
                          <button onClick={() => { setEditing(f.metric); setBudgetInput(String(budget.monthlyBudget)); }}
                            className="text-muted-foreground hover:text-foreground">
                            <Settings className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>
                      {editing === f.metric ? (
                        <div className="flex gap-2 mt-1">
                          <Input type="number" className="h-8 text-sm" value={budgetInput}
                            onChange={e=>setBudgetInput(e.target.value)}
                            onKeyDown={e=>e.key==='Enter'&&saveBudget(f.metric)}/>
                          <Button size="sm" className="h-8" onClick={()=>saveBudget(f.metric)}>Save</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={()=>setEditing(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Progress value={Math.min(budgetPct, 100)}
                          className={`h-2 ${budgetPct > 90 ? '[&>div]:bg-red-500' : budgetPct > 75 ? '[&>div]:bg-amber-500' : ''}`}/>
                      )}
                    </div>
                  )}

                  {/* Overage warning */}
                  {f.projectedOverageDate && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Projected to exceed limit around <strong>{new Date(f.projectedOverageDate).toDateString()}</strong>
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-1">
                    {f.recommendations.map((r: string, ri: number) => (
                      <p key={ri} className="text-xs text-muted-foreground">· {r}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
