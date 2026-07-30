import React, { useState, useEffect } from 'react';

// ─── Dashboard Registry ───────────────────────────────────────────────────────

interface Dashboard {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;       // tailwind bg color class
  accent: string;      // tailwind text/border color
  port: number;
  dir: string;
  routes: string[];
  status: 'live' | 'starting' | 'offline';
  primaryUser: string;
  capabilities: string[];
}

const DASHBOARDS: Dashboard[] = [
  {
    id: 'mission-command',
    name: 'Mission Command',
    tagline: 'Operational Intelligence Platform',
    description: 'Palantir-grade mission coordination. Signals → Investigations → Simulations → Decisions → Operations → Learning. Full intelligence loop for humanitarian missions.',
    icon: '🎯',
    color: 'bg-indigo-950',
    accent: 'text-indigo-400 border-indigo-700',
    port: 5174,
    dir: 'src/dashboards/mission-command',
    routes: ['/', '/missions', '/signals', '/investigations', '/simulations', '/decisions', '/operations', '/learning', '/knowledge'],
    status: 'offline',
    primaryUser: 'Mission Leads · Field Coordinators · Analysts',
    capabilities: ['Signal monitoring', 'Investigation canvas', 'Scenario simulation', 'Decision governance', 'Operation tracking', 'Model learning'],
  },
  {
    id: 'planetary-pulse',
    name: 'Planetary Pulse',
    tagline: 'Earth Health Monitoring System',
    description: 'Real-time planetary vitals with live-updating metrics. Temperature anomaly, biodiversity index, ocean heat, CO₂, vegetation, freshwater stress. Globe visualization with tipping cascade alerts.',
    icon: '🌍',
    color: 'bg-cyan-950',
    accent: 'text-cyan-400 border-cyan-700',
    port: 5175,
    dir: 'src/dashboards/planetary-pulse',
    routes: ['/', '/vitals', '/tipping-points', '/simulation'],
    status: 'offline',
    primaryUser: 'Climate Scientists · Policymakers · UN Agencies',
    capabilities: ['Live planetary vitals', 'Tipping point cascade', 'Intervention simulator', 'Satellite feed', 'Ecosystem radar', 'Stress mapping'],
  },
  {
    id: 'trust-layer',
    name: 'Trust Layer',
    tagline: 'Regenerative Trust Infrastructure',
    description: 'Cryptographic trust scoring for sovereigns, institutions, corporations, and NGOs. Multi-source evidence validation, constitutional rule engine, trust exchange instruments, validator network.',
    icon: '🔐',
    color: 'bg-amber-950',
    accent: 'text-amber-400 border-amber-700',
    port: 5176,
    dir: 'src/dashboards/trust-layer',
    routes: ['/'],
    status: 'offline',
    primaryUser: 'Financial Institutions · Governments · Auditors',
    capabilities: ['Trust scoring engine', 'Evidence submission', 'Constitution rules', 'Trust exchange', 'Validator network', 'Entity comparison'],
  },
  {
    id: 'sentinel-hub',
    name: 'Sentinel Hub',
    tagline: 'Humanitarian Crisis Response',
    description: 'Real-time incident command for urban humanitarian crises. Kibera-optimized with incident feed, flood/disease/security tracking, AI alert system, safe zone management, resource dispatch.',
    icon: '🚨',
    color: 'bg-red-950',
    accent: 'text-red-400 border-red-700',
    port: 5177,
    dir: 'src/dashboards/sentinel-hub',
    routes: ['/', '/incidents', '/map', '/flood', '/disease', '/safe-zones', '/resources', '/ai-insights', '/audit'],
    status: 'offline',
    primaryUser: 'Emergency Responders · NGOs · Local Government',
    capabilities: ['Incident feed', 'Crisis map', 'Flood risk', 'Disease tracking', 'AI alerts', 'Resource dispatch'],
  },
  {
    id: 'terra-watch',
    name: 'Terra Watch',
    tagline: 'Ecosystem Intelligence Centre',
    description: 'Global environmental monitoring with AI assistant. Planetary health scores, satellite panel, threats console, biodiversity tracking, restoration progress.',
    icon: '🌿',
    color: 'bg-emerald-950',
    accent: 'text-emerald-400 border-emerald-700',
    port: 5178,
    dir: 'src/dashboards/terra-watch',
    routes: ['/', '/biodiversity', '/restoration', '/analytics'],
    status: 'offline',
    primaryUser: 'Ecologists · Restoration Organizations · Satellite Teams',
    capabilities: ['Global map', 'Planetary health', 'Satellite panel', 'Threats console', 'AI assistant', 'Biodiversity tracking'],
  },
  {
    id: 'sanctum-nexus-core',
    name: 'Sanctum Nexus',
    tagline: 'AI Governance & Agent Oversight',
    description: 'Constitutional AI governance layer. Agent coordination, human override workflows, policy management, ethical reasoning traces, governance proposals, health monitoring.',
    icon: '🤖',
    color: 'bg-violet-950',
    accent: 'text-violet-400 border-violet-700',
    port: 5179,
    dir: 'src/dashboards/sanctum-nexus-core',
    routes: ['/', '/agents', '/governance', '/health', '/overrides', '/policy', '/reasoning', '/workflows'],
    status: 'offline',
    primaryUser: 'AI Governance Teams · Ethics Boards · Platform Admins',
    capabilities: ['Agent oversight', 'Human overrides', 'Policy engine', 'Ethics reasoning', 'Governance proposals', 'System health'],
  },
  {
    id: 'sentinel-command',
    name: 'Sentinel Command',
    tagline: 'Strategic Intelligence & Risk',
    description: 'High-level strategic decision intelligence. Risk heatmaps, scenario comparison, strategic metrics, signal analysis, decision briefs, outcome reviews.',
    icon: '⚡',
    color: 'bg-orange-950',
    accent: 'text-orange-400 border-orange-700',
    port: 5180,
    dir: 'src/dashboards/sentinel-command',
    routes: ['/', '/command-center', '/recommendations', '/scenarios', '/decisions', '/outcomes'],
    status: 'offline',
    primaryUser: 'Executives · Strategic Advisors · Risk Officers',
    capabilities: ['Risk heatmap', 'Scenario studio', 'Strategic metrics', 'Signal list', 'Decision briefs', 'Outcome review'],
  },
  {
    id: 'moral-compass-dashboard',
    name: 'Moral Compass',
    tagline: 'Ethical Decision Analysis Engine',
    description: 'Multi-dimensional ethical analysis for complex decisions. Impact radar, tension heatmap, stakeholder weighting, what-if scenarios, temporal comparison, ethical tradeoff visualization.',
    icon: '⚖️',
    color: 'bg-rose-950',
    accent: 'text-rose-400 border-rose-700',
    port: 5181,
    dir: 'src/dashboards/moral-compass-dashboard',
    routes: ['/', '/analysis', '/comparison', '/scenarios'],
    status: 'offline',
    primaryUser: 'Ethics Boards · Policy Designers · Governance Councils',
    capabilities: ['Moral compass viz', 'Impact radar', 'Tension heatmap', 'Weight matrix', 'What-if editor', 'Scenario comparison'],
  },
];

// ─── API health check ─────────────────────────────────────────────────────────

function useApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then(r => setStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);
  return status;
}

function useDashboardStatus(port: number) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  useEffect(() => {
    fetch(`http://localhost:${port}`, { mode: 'no-cors' })
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
  }, [port]);
  return status;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DashboardCard({ d, onLaunch }: { d: Dashboard; onLaunch: (d: Dashboard) => void }) {
  const status = useDashboardStatus(d.port);
  const isOnline = status === 'online';

  return (
    <div className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all hover:scale-[1.01] ${d.color} ${d.accent.split(' ')[1]}`}>
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{d.icon}</span>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">{d.name}</h3>
              <p className={`text-xs mt-0.5 ${d.accent.split(' ')[0]}`}>{d.tagline}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 border ${
            isOnline
              ? 'text-emerald-400 border-emerald-700 bg-emerald-950/50'
              : 'text-slate-500 border-slate-700 bg-slate-900/50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            {status === 'checking' ? '…' : isOnline ? 'Running' : `Port ${d.port}`}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-3">
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{d.description}</p>
      </div>

      {/* Capabilities */}
      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        {d.capabilities.map(c => (
          <span key={c} className={`text-xs px-2 py-0.5 rounded-md border bg-slate-900/40 ${d.accent.split(' ')[1]} ${d.accent.split(' ')[0]} opacity-80`}>
            {c}
          </span>
        ))}
      </div>

      {/* Primary user */}
      <div className="px-5 pb-4 mt-auto">
        <p className="text-slate-600 text-xs">For: {d.primaryUser}</p>
      </div>

      {/* Actions */}
      <div className={`border-t ${d.accent.split(' ')[1]} px-5 py-3 flex gap-2`}>
        {isOnline ? (
          <>
            <a
              href={`http://localhost:${d.port}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center text-xs font-medium py-1.5 rounded-lg border ${d.accent} bg-slate-900/60 hover:bg-slate-800/60 transition-colors`}
            >
              Open ↗
            </a>
            <button
              onClick={() => onLaunch(d)}
              className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Preview
            </button>
          </>
        ) : (
          <div className="flex-1 text-center text-xs text-slate-500 py-1.5">
            Run: <code className="text-slate-400">cd {d.dir} && npm run dev -- --port {d.port}</code>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewModal({ d, onClose }: { d: Dashboard; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border-b border-slate-700">
        <span className="text-xl">{d.icon}</span>
        <div>
          <span className="text-white font-semibold text-sm">{d.name}</span>
          <span className="text-slate-400 text-xs ml-2">{d.tagline}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`http://localhost:${d.port}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded border border-slate-600 hover:border-slate-400 transition-colors"
          >
            Open full screen ↗
          </a>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-slate-700"
          >
            ×
          </button>
        </div>
      </div>
      {/* iframe */}
      <iframe
        src={`http://localhost:${d.port}`}
        className="flex-1 w-full border-0"
        title={d.name}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}

function PlatformStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {[
        { label: 'Dashboards', value: '8', sub: 'specialist interfaces' },
        { label: 'API Endpoints', value: '40+', sub: 'v2 REST + WebSocket' },
        { label: 'User Roles', value: '12+', sub: 'from farmers to nations' },
        { label: 'Core Missions', value: '∞', sub: 'planetary operating system' },
      ].map(s => (
        <div key={s.label} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
          <p className="text-emerald-400 font-bold text-2xl">{s.value}</p>
          <p className="text-white text-xs font-medium mt-0.5">{s.label}</p>
          <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Hub ─────────────────────────────────────────────────────────────────

export default function DashboardHub() {
  const [preview, setPreview] = useState<Dashboard | null>(null);
  const [filter, setFilter] = useState('');
  const apiStatus = useApiStatus();

  const filtered = DASHBOARDS.filter(d =>
    !filter ||
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.tagline.toLowerCase().includes(filter.toLowerCase()) ||
    d.capabilities.some(c => c.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top nav */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <a href="/" className="text-emerald-400 font-bold text-lg shrink-0">🌍 Atlas Sanctum</a>
          <span className="text-slate-700 text-xs hidden sm:block">Digital Public Infrastructure</span>
          <div className="ml-auto flex items-center gap-3">
            <a href="/prototype" className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded border border-slate-700 hover:border-slate-500 transition-colors">
              Marketplace Prototype
            </a>
            <span className={`text-xs flex items-center gap-1.5 ${
              apiStatus === 'online' ? 'text-emerald-400' : apiStatus === 'offline' ? 'text-red-400' : 'text-slate-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'offline' ? 'bg-red-400' : 'bg-slate-600'
              }`} />
              API {apiStatus === 'checking' ? '…' : apiStatus}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Platform Dashboard Hub</h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            8 specialist dashboards forming a planetary operating system for regenerative finance, 
            humanitarian response, environmental monitoring, and AI governance.
          </p>
        </div>

        <PlatformStats />

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filter dashboards by name, capability, or domain…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => (
            <DashboardCard key={d.id} d={d} onLaunch={setPreview} />
          ))}
        </div>

        {/* Quick launch guide */}
        <div className="mt-12 bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Quick Launch Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-xs mb-3">Start all dashboards at once:</p>
              <code className="block bg-slate-800 rounded-lg px-4 py-3 text-emerald-400 text-xs">
                ./start-prototype.sh --all
              </code>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-3">Start a specific dashboard:</p>
              <code className="block bg-slate-800 rounded-lg px-4 py-3 text-emerald-400 text-xs">
                cd src/dashboards/mission-command<br />
                npm install && npm run dev -- --port 5174
              </code>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-slate-500 text-xs">
              Each dashboard is a standalone Vite app. They run independently on separate ports and share the 
              Atlas Sanctum backend API at <code className="text-slate-400">http://localhost:4000/api</code>.
              The Preview button embeds the running dashboard directly in this page.
            </p>
          </div>
        </div>
      </main>

      {/* Preview modal */}
      {preview && <PreviewModal d={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
