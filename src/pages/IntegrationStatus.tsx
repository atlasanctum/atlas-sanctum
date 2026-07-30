/**
 * IntegrationStatus — live dashboard showing AI + Blockchain + Backend connectivity.
 * Route: /integration-status
 */

import { useEffect, useState } from 'react';
import { useAI } from '@/contexts/AIContext';
import { useBlockchainContext } from '@/contexts/BlockchainContext';
import { CheckCircle, XCircle, Loader2, Cpu, Link, Server, Zap } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'ok' | 'error' | 'loading' | 'disabled';
  detail: string;
}

export default function IntegrationStatus() {
  const ai = useAI();
  const blockchain = useBlockchainContext();
  const [backendStatus, setBackendStatus] = useState<'ok' | 'error' | 'loading'>('loading');

  useEffect(() => {
    fetch('/health')
      .then(r => r.ok ? setBackendStatus('ok') : setBackendStatus('error'))
      .catch(() => setBackendStatus('error'));
  }, []);

  const services: ServiceStatus[] = [
    {
      name: 'Backend API (Express :4000)',
      status: backendStatus,
      detail: backendStatus === 'ok' ? 'Connected — /health 200' : backendStatus === 'loading' ? 'Probing…' : 'Unreachable — start backend with: cd backend && npm run dev',
    },
    {
      name: 'AI Service (/api/v2/ai)',
      status: ai.isLoading ? 'loading' : ai.isAvailable ? 'ok' : 'error',
      detail: ai.isLoading
        ? 'Initialising…'
        : ai.isAvailable
        ? `Active — ${ai.insights.length} insights loaded`
        : 'Unavailable',
    },
    {
      name: 'Atlas Sanctum AI (/api/v3/sanctum/ai)',
      status: ai.isAvailable ? 'ok' : 'disabled',
      detail: '13-layer orchestrator — available via /sanctum/ai route',
    },
    {
      name: 'Blockchain (Web3 Wallet)',
      status: blockchain.account ? 'ok' : blockchain.error ? 'error' : 'disabled',
      detail: blockchain.account
        ? `Connected: ${blockchain.account.slice(0, 6)}…${blockchain.account.slice(-4)} | RIU: ${parseFloat(blockchain.riuBalance).toFixed(2)}`
        : blockchain.error || 'No wallet connected — click Connect Wallet',
    },
    {
      name: 'Smart Contracts',
      status: import.meta.env.VITE_CONTRACT_RIU_TOKEN ? 'ok' : 'disabled',
      detail: import.meta.env.VITE_CONTRACT_RIU_TOKEN
        ? `RIU Token: ${import.meta.env.VITE_CONTRACT_RIU_TOKEN.slice(0, 10)}…`
        : 'Set VITE_CONTRACT_* env vars to enable on-chain features',
    },
    {
      name: 'WebSocket (Socket.io)',
      status: backendStatus === 'ok' ? 'ok' : 'disabled',
      detail: 'Real-time price alerts, governance events, marketplace updates',
    },
  ];

  const icon = (s: ServiceStatus['status']) => {
    if (s === 'ok') return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (s === 'error') return <XCircle className="w-5 h-5 text-red-400" />;
    if (s === 'loading') return <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />;
    return <XCircle className="w-5 h-5 text-slate-500" />;
  };

  const badge = (s: ServiceStatus['status']) => ({
    ok: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    error: 'bg-red-400/10 text-red-400 border-red-400/30',
    loading: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    disabled: 'bg-slate-700/30 text-slate-500 border-slate-600/30',
  }[s]);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Integration Status</h1>
            <p className="text-slate-400 text-sm">AI + Blockchain + Backend connectivity</p>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((svc) => (
            <div
              key={svc.name}
              className={`flex items-center gap-4 p-4 rounded-xl border ${badge(svc.status)}`}
            >
              {icon(svc.status)}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{svc.name}</div>
                <div className="text-xs text-slate-400 truncate">{svc.detail}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${badge(svc.status)}`}>
                {svc.status}
              </span>
            </div>
          ))}
        </div>

        {/* Wallet connect */}
        {!blockchain.account && (
          <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-sm text-slate-300 mb-3">Connect a Web3 wallet to enable on-chain RIU trading and NFT minting.</p>
            <button
              onClick={blockchain.connect}
              disabled={blockchain.isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {blockchain.isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
              {blockchain.isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
            {blockchain.error && <p className="mt-2 text-xs text-red-400">{blockchain.error}</p>}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: 'AI Insights', href: '/ai-insights', icon: Cpu },
            { label: 'Blockchain Verification', href: '/blockchain-verification', icon: Link },
            { label: 'Sanctum AI', href: '/sanctum/ai', icon: Server },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 text-sm transition-colors"
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
