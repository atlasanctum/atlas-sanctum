import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LayerStatus {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  agentsOnline?: number;
  systemLearningScore?: number;
  pendingApprovals?: number;
  ledgerSize?: number;
}

interface SentinelSummary {
  systemHealthScore: number;
  activeAlerts: number;
  emergencies: number;
  observationsProcessed: number;
}

interface AuditSummary {
  chainIntegrity: boolean;
  ethicsBlockRate: number;
  complianceStatus: Record<string, boolean>;
}

interface HumanCollabSummary {
  pendingApprovals: number;
  civilizationalStakesPending: number;
  unacknowledgedOverrides: number;
  avgConfidenceOfPendingDecisions: number;
}

interface SystemStatus {
  timestamp: number;
  layers: Record<string, LayerStatus>;
  sentinel: SentinelSummary;
  audit: AuditSummary;
  humanCollaboration: HumanCollabSummary;
}

interface SentinelAlert {
  alertId: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  metric: string;
  source: string;
  message: string;
  deviationSigma: number;
  confidence: number;
  timestamp: number;
  requiresHumanReview: boolean;
}

interface ApprovalGate {
  gateId: string;
  domain: string;
  action: string;
  stakes: string;
  explanation: { summary: string; confidence: number; humanReadableScore: string };
  status: string;
  createdAt: number;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE = '/api/v3/sanctum/ai';

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    emergency: 'bg-red-600 text-white',
    critical: 'bg-orange-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
    operational: 'bg-emerald-500 text-white',
    degraded: 'bg-yellow-500 text-black',
    offline: 'bg-red-600 text-white',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[severity] ?? 'bg-gray-500 text-white'}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function LayerGrid({ layers }: { layers: Record<string, LayerStatus> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {Object.entries(layers).map(([num, layer]) => (
        <div key={num} className="border border-border rounded p-2 bg-card/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">L{num}</span>
            <SeverityBadge severity={layer.status} />
          </div>
          <p className="text-xs font-medium leading-tight">{layer.name}</p>
          {layer.agentsOnline !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">{layer.agentsOnline} agents</p>
          )}
          {layer.systemLearningScore !== undefined && (
            <div className="mt-1">
              <Progress value={layer.systemLearningScore} className="h-1" />
              <p className="text-xs text-muted-foreground">{layer.systemLearningScore}/100</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AlertRow({ alert, onEscalate }: { alert: SentinelAlert; onEscalate: (id: string) => void }) {
  return (
    <div className="border border-border rounded p-3 space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <span className="text-sm font-medium">{alert.metric}</span>
          <span className="text-xs text-muted-foreground">({alert.source})</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{alert.message}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs">
          {alert.deviationSigma.toFixed(1)}σ deviation · {(alert.confidence * 100).toFixed(0)}% confidence
        </span>
        {alert.requiresHumanReview && (
          <Button size="sm" variant="destructive" className="h-6 text-xs"
            onClick={() => onEscalate(alert.alertId)}>
            Escalate
          </Button>
        )}
      </div>
    </div>
  );
}

function ApprovalRow({ gate, onDecide }: {
  gate: ApprovalGate;
  onDecide: (id: string, decision: 'approve' | 'reject') => void;
}) {
  return (
    <div className="border border-border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={gate.stakes} />
          <span className="text-sm font-medium">{gate.domain}</span>
        </div>
        <span className="text-xs text-muted-foreground">{gate.explanation.humanReadableScore}</span>
      </div>
      <p className="text-xs">{gate.explanation.summary}</p>
      <p className="text-xs text-muted-foreground">Action: {gate.action}</p>
      <div className="flex gap-2">
        <Button size="sm" className="h-6 text-xs bg-emerald-600 hover:bg-emerald-700"
          onClick={() => onDecide(gate.gateId, 'approve')}>
          Approve
        </Button>
        <Button size="sm" variant="destructive" className="h-6 text-xs"
          onClick={() => onDecide(gate.gateId, 'reject')}>
          Reject
        </Button>
      </div>
    </div>
  );
}

// ─── Main Console ─────────────────────────────────────────────────────────────

export default function SanctumAIConsole() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [alerts, setAlerts] = useState<SentinelAlert[]>([]);
  const [pendingGates, setPendingGates] = useState<ApprovalGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    try {
      const [sys, sentinelData, approvalsData] = await Promise.all([
        apiFetch<SystemStatus>('/status'),
        apiFetch<{ emergencies: SentinelAlert[]; criticals: SentinelAlert[] }>('/sentinel/report'),
        apiFetch<{ gates: ApprovalGate[] }>('/approvals/pending'),
      ]);
      setStatus(sys);
      setAlerts([...sentinelData.emergencies, ...sentinelData.criticals]);
      setPendingGates(approvalsData.gates);
      setError(null);
      setLastRefresh(new Date());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleEscalate = async (alertId: string) => {
    try {
      await apiFetch(`/sentinel/escalate/${alertId}`, { method: 'POST' });
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDecide = async (gateId: string, decision: 'approve' | 'reject') => {
    try {
      await apiFetch(`/approve/${gateId}`, {
        method: 'POST',
        body: JSON.stringify({ decision, rationale: `Human ${decision} via console` }),
      });
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Initializing Atlas Sanctum AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Atlas Sanctum AI Console</h1>
          <p className="text-xs text-muted-foreground">
            13-Layer Regenerative Intelligence · Last updated {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-500">{error}</span>}
          <Button size="sm" variant="outline" onClick={refresh} className="h-7 text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {/* Top metrics */}
      {status && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">System Health</p>
              <p className="text-2xl font-bold text-emerald-500">
                {status.sentinel.systemHealthScore}
                <span className="text-sm font-normal">/100</span>
              </p>
              <Progress value={status.sentinel.systemHealthScore} className="h-1 mt-1" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Active Alerts</p>
              <p className={`text-2xl font-bold ${status.sentinel.activeAlerts > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                {status.sentinel.activeAlerts}
              </p>
              {status.sentinel.emergencies > 0 && (
                <p className="text-xs text-red-500">{status.sentinel.emergencies} emergency</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Pending Approvals</p>
              <p className={`text-2xl font-bold ${status.humanCollaboration.pendingApprovals > 0 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                {status.humanCollaboration.pendingApprovals}
              </p>
              {status.humanCollaboration.civilizationalStakesPending > 0 && (
                <p className="text-xs text-red-500">{status.humanCollaboration.civilizationalStakesPending} civilizational</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Audit Chain</p>
              <p className={`text-2xl font-bold ${status.audit.chainIntegrity ? 'text-emerald-500' : 'text-red-500'}`}>
                {status.audit.chainIntegrity ? '✓ Valid' : '✗ Broken'}
              </p>
              <p className="text-xs text-muted-foreground">
                Ethics block rate: {(status.audit.ethicsBlockRate * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="layers">
        <TabsList className="h-8">
          <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
          <TabsTrigger value="sentinel" className="text-xs">
            Sentinel {alerts.length > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-1 text-xs">{alerts.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="approvals" className="text-xs">
            Approvals {pendingGates.length > 0 && <span className="ml-1 bg-yellow-500 text-black rounded-full px-1 text-xs">{pendingGates.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="mt-3">
          {status && <LayerGrid layers={status.layers} />}
        </TabsContent>

        <TabsContent value="sentinel" className="mt-3 space-y-2">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No active critical alerts</p>
          ) : (
            alerts.map(alert => (
              <AlertRow key={alert.alertId} alert={alert} onEscalate={handleEscalate} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approvals" className="mt-3 space-y-2">
          {pendingGates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No pending approvals</p>
          ) : (
            pendingGates.map(gate => (
              <ApprovalRow key={gate.gateId} gate={gate} onDecide={handleDecide} />
            ))
          )}
        </TabsContent>

        <TabsContent value="compliance" className="mt-3">
          {status && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(status.audit.complianceStatus).map(([standard, compliant]) => (
                <div key={standard} className="border border-border rounded p-3 flex items-center justify-between">
                  <span className="text-xs font-medium">{standard.replace(/_/g, ' ')}</span>
                  <SeverityBadge severity={compliant ? 'operational' : 'critical'} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
