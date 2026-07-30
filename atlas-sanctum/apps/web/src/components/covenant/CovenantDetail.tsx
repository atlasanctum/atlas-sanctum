/**
 * Atlas Sanctum Covenant Detail Page
 * Shows covenant conditions, eligibility checks, and execution controls
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  Activity,
  Clock
} from 'lucide-react';

interface CovenantCheck {
  riskThresholdMet: boolean;
  reserveVerified: boolean;
  sufficientBalance: boolean;
  covenantArmed: boolean;
  cooldownPassed: boolean;
  eligible: boolean;
}

interface CovenantDetailProps {
  covenant: {
    id: string;
    title: string;
    description: string;
    regionId: string;
    triggerType: string;
    minRiskScore: number;
    reserveRequiredUsd: number;
    payoutAmountUsd: number;
    autoExecute: boolean;
    status: string;
    createdAt: string;
  };
  eligibility: CovenantCheck;
  currentRiskScore: number;
  onExecute: () => void;
  onArm: () => void;
}

export function CovenantDetail({
  covenant,
  eligibility,
  currentRiskScore,
  onExecute,
  onArm,
}: CovenantDetailProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-slate-500',
      armed: 'bg-blue-500',
      triggered: 'bg-yellow-500',
      executed: 'bg-purple-500',
      verified: 'bg-green-500',
      failed: 'bg-red-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  const CheckItem = ({ 
    label, 
    passed, 
    description 
  }: { 
    label: string; 
    passed: boolean; 
    description: string;
  }) => (
    <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
      {passed ? (
        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
      ) : (
        <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
      )}
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <Badge variant={passed ? 'default' : 'destructive'}>
        {passed ? 'Passed' : 'Failed'}
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
          <span>Covenants</span>
          <span>/</span>
          <span>{covenant.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{covenant.title}</h1>
            <p className="text-slate-400 mt-2">{covenant.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full ${getStatusColor(covenant.status)}`}>
              {covenant.status.toUpperCase()}
            </div>
            {covenant.status === 'draft' && (
              <Button onClick={onArm} className="bg-blue-600 hover:bg-blue-700">
                Arm Covenant
              </Button>
            )}
            {eligibility.eligible && covenant.status === 'armed' && (
              <Button onClick={onExecute} className="bg-green-600 hover:bg-green-700">
                Execute Covenant
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Covenant Conditions */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Covenant Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Trigger Type</p>
                <p className="text-lg font-medium mt-1">{covenant.triggerType}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Region</p>
                <p className="text-lg font-medium mt-1">{covenant.regionId}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Minimum Risk Score</p>
                <p className="text-lg font-medium mt-1">{covenant.minRiskScore}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Reserve Required</p>
                <p className="text-lg font-medium mt-1">
                  ${covenant.reserveRequiredUsd.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Payout Amount</p>
                <p className="text-lg font-medium mt-1 text-green-400">
                  ${covenant.payoutAmountUsd.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Auto Execute</p>
                <p className="text-lg font-medium mt-1">
                  {covenant.autoExecute ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Eligibility Checks */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Live Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <CheckItem
                label="Risk Threshold Met"
                passed={eligibility.riskThresholdMet}
                description={`Current: ${currentRiskScore} / Required: ${covenant.minRiskScore}`}
              />
              <CheckItem
                label="Reserve Verified"
                passed={eligibility.reserveVerified}
                description="Onchain proof valid"
              />
              <CheckItem
                label="Sufficient Balance"
                passed={eligibility.sufficientBalance}
                description={`Required: $${covenant.reserveRequiredUsd.toLocaleString()}`}
              />
              <CheckItem
                label="Covenant Armed"
                passed={eligibility.covenantArmed}
                description="Ready for execution"
              />
              <CheckItem
                label="Cooldown Passed"
                passed={eligibility.cooldownPassed}
                description="No recent executions"
              />
            </div>
            
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Eligible for Execution</span>
                {eligibility.eligible ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400" />
                )}
              </div>
              {!eligibility.eligible && (
                <p className="text-sm text-slate-400 mt-2">
                  All conditions must be met to execute
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Thermometer */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Current Risk Score</span>
                <span className="font-bold">{currentRiskScore}</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full ${
                    currentRiskScore < 30 ? 'bg-green-500' :
                    currentRiskScore < 55 ? 'bg-yellow-500' :
                    currentRiskScore < 75 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${currentRiskScore}%` }}
                />
                <div 
                  className="absolute top-0 h-full w-0.5 bg-white"
                  style={{ left: `${covenant.minRiskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low (0-29)</span>
                <span>Medium (30-54)</span>
                <span>High (55-74)</span>
                <span>Critical (75-100)</span>
              </div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400">Threshold</p>
              <p className="text-2xl font-bold">{covenant.minRiskScore}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Execution History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No executions yet</p>
            <p className="text-sm mt-1">
              Execution history will appear here after covenant is triggered
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
