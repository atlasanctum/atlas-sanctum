/**
 * Atlas Sanctum — Developer Marketplace
 * Plugin discovery, installation, and management for AI models,
 * sensors, wallets, dashboards, and data connectors.
 */

import React, { useState } from 'react';
import {
  Badge,
  MetricCard,
  SectionHeader,
  EmptyState,
  StatusDot,
  EthicsScore,
} from '../../../packages/ui/src/index';

// ─── Types ────────────────────────────────────────────────────────────────────

type PluginCategory = 'ai_model' | 'sensor' | 'wallet' | 'dashboard' | 'data_connector' | 'governance';
type PluginStatus   = 'stable' | 'beta' | 'experimental' | 'deprecated';

interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  authorDID: string;
  category: PluginCategory;
  status: PluginStatus;
  version: string;
  ethicsScore: number;
  downloads: number;
  stars: number;
  license: string;
  tags: string[];
  repoUrl?: string;
  docsUrl?: string;
  verified: boolean;
  installedAt?: number;
}

// ─── Mock Registry ────────────────────────────────────────────────────────────

const PLUGINS: Plugin[] = [
  {
    id: 'plugin-earth2studio',
    name: 'Earth2Studio Climate AI',
    description: 'NVIDIA Earth2Studio integration — run climate forecasting models directly in Atlas AI layers.',
    author: 'NVIDIA / Atlas Sanctum',
    authorDID: 'did:sanctum:org-nvidia-earth2',
    category: 'ai_model',
    status: 'stable',
    version: '1.2.0',
    ethicsScore: 0.91,
    downloads: 4820,
    stars: 312,
    license: 'Apache-2.0',
    tags: ['climate', 'forecasting', 'nvidia', 'earth2studio'],
    repoUrl: 'https://github.com/atlas-sanctum/earth2studio-plugin',
    docsUrl: 'https://docs.atlassanctum.com/plugins/earth2studio',
    verified: true,
  },
  {
    id: 'plugin-sentinel2',
    name: 'Sentinel-2 Satellite Connector',
    description: 'Real-time NDVI, land cover, and deforestation alerts from ESA Sentinel-2 via Copernicus API.',
    author: 'Atlas Sanctum Core',
    authorDID: 'did:sanctum:org-atlas-core',
    category: 'data_connector',
    status: 'stable',
    version: '2.0.1',
    ethicsScore: 0.95,
    downloads: 7340,
    stars: 489,
    license: 'Apache-2.0',
    tags: ['satellite', 'ndvi', 'sentinel', 'copernicus', 'deforestation'],
    verified: true,
  },
  {
    id: 'plugin-metamask-wallet',
    name: 'MetaMask Wallet Adapter',
    description: 'Connect MetaMask to Atlas Sanctum for carbon credit purchases, DAO voting, and on-chain verification.',
    author: 'Community',
    authorDID: 'did:sanctum:dev-metamask-adapter',
    category: 'wallet',
    status: 'stable',
    version: '1.5.3',
    ethicsScore: 0.82,
    downloads: 12100,
    stars: 701,
    license: 'MIT',
    tags: ['wallet', 'ethereum', 'metamask', 'web3'],
    verified: true,
  },
  {
    id: 'plugin-cosmos-wallet',
    name: 'Keplr Cosmos Wallet',
    description: 'Keplr wallet integration for sanctum-1 chain — stake, vote, and transact on the native Cosmos chain.',
    author: 'Atlas Sanctum Core',
    authorDID: 'did:sanctum:org-atlas-core',
    category: 'wallet',
    status: 'stable',
    version: '1.1.0',
    ethicsScore: 0.93,
    downloads: 5600,
    stars: 344,
    license: 'Apache-2.0',
    tags: ['wallet', 'cosmos', 'keplr', 'sanctum-1'],
    verified: true,
  },
  {
    id: 'plugin-iot-greengrass',
    name: 'AWS IoT Greengrass Sensor Bridge',
    description: 'Deploy Atlas sensor agents to edge devices via AWS IoT Greengrass v2. Supports 50+ sensor types.',
    author: 'Atlas Sanctum Core',
    authorDID: 'did:sanctum:org-atlas-core',
    category: 'sensor',
    status: 'stable',
    version: '1.0.4',
    ethicsScore: 0.88,
    downloads: 2980,
    stars: 198,
    license: 'Apache-2.0',
    tags: ['iot', 'greengrass', 'aws', 'sensor', 'edge'],
    verified: true,
  },
  {
    id: 'plugin-weaviate',
    name: 'Weaviate Vector Search',
    description: 'Semantic vector search over the Knowledge Commons using Weaviate. Enables AI-powered knowledge discovery.',
    author: 'Atlas Sanctum Core',
    authorDID: 'did:sanctum:org-atlas-core',
    category: 'data_connector',
    status: 'stable',
    version: '1.3.0',
    ethicsScore: 0.90,
    downloads: 3410,
    stars: 227,
    license: 'Apache-2.0',
    tags: ['vector', 'search', 'weaviate', 'knowledge', 'semantic'],
    verified: true,
  },
  {
    id: 'plugin-bioregion-dashboard',
    name: 'Bioregional Impact Dashboard',
    description: 'Interactive bioregional health dashboard with real-time sensor overlays, twin divergence alerts, and restoration timelines.',
    author: 'Community',
    authorDID: 'did:sanctum:dev-bioregion-dash',
    category: 'dashboard',
    status: 'beta',
    version: '0.9.2',
    ethicsScore: 0.87,
    downloads: 1820,
    stars: 143,
    license: 'MIT',
    tags: ['dashboard', 'bioregion', 'visualization', 'impact'],
    verified: false,
  },
  {
    id: 'plugin-langgraph-orchestrator',
    name: 'LangGraph Agent Orchestrator',
    description: 'Extend the Atlas AI council with custom LangGraph workflows. Add domain-specific agents with constitutional pre-flight.',
    author: 'Atlas Sanctum Core',
    authorDID: 'did:sanctum:org-atlas-core',
    category: 'ai_model',
    status: 'stable',
    version: '1.0.0',
    ethicsScore: 0.94,
    downloads: 2240,
    stars: 178,
    license: 'Apache-2.0',
    tags: ['langgraph', 'agents', 'ai', 'orchestration'],
    verified: true,
  },
  {
    id: 'plugin-chainlink-oracle',
    name: 'Chainlink Oracle Adapter',
    description: 'Bring verified off-chain environmental data on-chain via Chainlink. Supports carbon price feeds and biodiversity indices.',
    author: 'Community',
    authorDID: 'did:sanctum:dev-chainlink-oracle',
    category: 'data_connector',
    status: 'beta',
    version: '0.7.1',
    ethicsScore: 0.85,
    downloads: 1340,
    stars: 96,
    license: 'MIT',
    tags: ['chainlink', 'oracle', 'blockchain', 'carbon', 'price-feed'],
    verified: false,
  },
  {
    id: 'plugin-dao-governance',
    name: 'DAO Governance Studio',
    description: 'Full-featured governance UI for AtlasSanctumDAO — proposal creation, bioregional voting, indigenous veto tracking.',
    author: 'Atlas Sanctum Core',
    authorDID: 'did:sanctum:org-atlas-core',
    category: 'governance',
    status: 'stable',
    version: '1.2.0',
    ethicsScore: 0.96,
    downloads: 3890,
    stars: 267,
    license: 'Apache-2.0',
    tags: ['dao', 'governance', 'voting', 'proposals'],
    verified: true,
  },
];

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORIES: { value: PluginCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all',            label: 'All',            icon: '🌐' },
  { value: 'ai_model',       label: 'AI Models',      icon: '🧠' },
  { value: 'sensor',         label: 'Sensors',        icon: '📡' },
  { value: 'wallet',         label: 'Wallets',        icon: '💳' },
  { value: 'dashboard',      label: 'Dashboards',     icon: '📊' },
  { value: 'data_connector', label: 'Data',           icon: '🔌' },
  { value: 'governance',     label: 'Governance',     icon: '🏛' },
];

const STATUS_VARIANT: Record<PluginStatus, 'success' | 'info' | 'warning' | 'neutral'> = {
  stable:       'success',
  beta:         'info',
  experimental: 'warning',
  deprecated:   'neutral',
};

// ─── Plugin Card ──────────────────────────────────────────────────────────────

const PluginCard: React.FC<{ plugin: Plugin; onInstall: (id: string) => void; installed: boolean }> = ({
  plugin, onInstall, installed,
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 truncate">{plugin.name}</h3>
          {plugin.verified && (
            <span title="Verified by Atlas Sanctum" className="text-green-600 text-xs">✓</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge label={plugin.category.replace('_', ' ')} variant="neutral" />
          <Badge label={plugin.status} variant={STATUS_VARIANT[plugin.status]} />
          <Badge label={`v${plugin.version}`} variant="neutral" />
        </div>
      </div>
      <EthicsScore score={plugin.ethicsScore} showLabel={false} className="ml-3 shrink-0" />
    </div>

    <p className="text-xs text-gray-600 leading-relaxed">{plugin.description}</p>

    <div className="flex flex-wrap gap-1">
      {plugin.tags.slice(0, 4).map(t => (
        <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">{t}</span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>⬇ {plugin.downloads.toLocaleString()}</span>
        <span>★ {plugin.stars}</span>
        <span>{plugin.license}</span>
      </div>
      <div className="flex items-center gap-2">
        {plugin.docsUrl && (
          <a href={plugin.docsUrl} target="_blank" rel="noreferrer"
            className="text-xs text-sky-600 hover:underline">Docs</a>
        )}
        <button
          onClick={() => onInstall(plugin.id)}
          disabled={installed}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            installed
              ? 'bg-gray-100 text-gray-400 cursor-default'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {installed ? '✓ Installed' : 'Install'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Marketplace App ──────────────────────────────────────────────────────────

const PluginMarketplaceApp: React.FC = () => {
  const [category, setCategory] = useState<PluginCategory | 'all'>('all');
  const [search, setSearch]     = useState('');
  const [installed, setInstalled] = useState<Set<string>>(new Set());

  const handleInstall = (id: string) => setInstalled(prev => new Set([...prev, id]));

  const filtered = PLUGINS.filter(p => {
    const matchCat    = category === 'all' || p.category === category;
    const matchSearch = !search || [p.name, p.description, ...p.tags]
      .some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">🧩 Developer Marketplace</h1>
        <p className="text-xs text-gray-500">Extend Atlas Sanctum with verified plugins — AI models, sensors, wallets, dashboards, data connectors</p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Total Plugins"    value={PLUGINS.length}                                trend="up" trendValue="+8 this month" />
          <MetricCard label="Verified"         value={PLUGINS.filter(p => p.verified).length}        trend="stable" />
          <MetricCard label="Total Downloads"  value={PLUGINS.reduce((s, p) => s + p.downloads, 0).toLocaleString()} trend="up" trendValue="+22% MoM" />
          <MetricCard label="Installed"        value={installed.size} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search plugins…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value as PluginCategory | 'all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <section>
          <SectionHeader
            title="📦 Plugins"
            subtitle={`${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          />
          {filtered.length === 0 ? (
            <EmptyState icon="🔍" title="No plugins found" description="Try a different search or category." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(p => (
                <PluginCard
                  key={p.id}
                  plugin={p}
                  onInstall={handleInstall}
                  installed={installed.has(p.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Installed */}
        {installed.size > 0 && (
          <section>
            <SectionHeader title="✅ Installed Plugins" subtitle={`${installed.size} active`} />
            <div className="space-y-2">
              {PLUGINS.filter(p => installed.has(p.id)).map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <StatusDot status="online" />
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    <Badge label={`v${p.version}`} variant="neutral" />
                  </div>
                  <Badge label="active" variant="success" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default PluginMarketplaceApp;
