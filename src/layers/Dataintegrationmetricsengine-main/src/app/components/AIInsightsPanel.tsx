import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AIInsight } from '../data/advancedMockData';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { cn } from './ui/utils';
import { Progress } from './ui/progress';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  maxDisplay?: number;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ 
  insights,
  maxDisplay = 6 
}) => {
  const displayedInsights = insights.slice(0, maxDisplay);
  
  const getTypeConfig = (type: AIInsight['type']) => {
    switch (type) {
      case 'optimization':
        return {
          icon: Target,
          color: 'text-purple-500',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          label: 'Optimization',
        };
      case 'anomaly':
        return {
          icon: AlertTriangle,
          color: 'text-orange-500',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          label: 'Anomaly',
        };
      case 'prediction':
        return {
          icon: TrendingUp,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          label: 'Prediction',
        };
      case 'recommendation':
        return {
          icon: Lightbulb,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          label: 'Recommendation',
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Machine learning analysis and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedInsights.map((insight) => {
            const config = getTypeConfig(insight.type);
            const Icon = config.icon;
            
            return (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-full mt-0.5", config.bg)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {config.label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {insight.sector}
                        </Badge>
                        {insight.actionable && (
                          <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                            Actionable
                          </Badge>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className={cn(
                          "text-lg font-bold",
                          insight.impact > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {insight.impact > 0 ? '+' : ''}{insight.impact}%
                        </div>
                        <div className="text-xs text-muted-foreground">Impact</div>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Confidence</span>
                          <span className="text-xs font-medium">{(insight.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={insight.confidence * 100} className="h-1.5" />
                      </div>
                      {insight.actionable && (
                        <Button size="sm" variant="outline" className="shrink-0">
                          Take Action
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {insights.length > maxDisplay && (
          <Button variant="ghost" className="w-full mt-4">
            View All {insights.length} Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
