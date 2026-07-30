/**
 * Atlas Sanctum Governance — Main App Component
 * Browse proposals, cast votes, view constitutional health.
 */

import React, { useEffect, useState } from 'react';
import { AtlasSanctumClient, GovernanceProposal, GovernanceTally } from '../../../packages/sdk/index';

const client = new AtlasSanctumClient({
  apiUrl: import.meta.env?.VITE_API_URL ?? 'http://localhost:3001',
  token:  import.meta.env?.VITE_API_TOKEN,
});

const STATUS_STYLES: Record<string, string> = {
  draft:        'bg-gray-100 text-gray-600',
  deliberation: 'bg-yellow-100 text-yellow-700',
  voting:       'bg-blue-100 text-blue-700',
  passed:       'bg-green-100 text-green-700',
  rejected:     'bg-red-100 text-red-600',
  vetoed:       'bg-orange-100 text-orange-700',
};

function ProposalCard({ proposal }: { proposal: GovernanceProposal }) {
  const deadline = new Date(proposal.votingDeadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[proposal.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {proposal.status.toUpperCase()}
        </span>
        <span className="text-xs text-gray-400">{proposal.type.replace('_', ' ')}</span>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{proposal.title}</h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{proposal.description}</p>
      <div className="text-xs text-gray-400 mb-3 italic border-l-2 border-green-200 pl-2">
        7-gen impact: {proposal.sevenGenerationImpact.slice(0, 80)}…
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {proposal.status === 'voting' ? `${daysLeft}d left` : `By ${deadline.toLocaleDateString()}`}
        </span>
        {proposal.status === 'voting' && (
          <div className="flex gap-1">
            <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Yes</button>
            <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">No</button>
            <button className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">Abstain</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GovernanceApp() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.governance.listProposals().then(r => {
      if (r.ok) setProposals(r.data.data);
      setLoading(false);
    });
  }, []);

  const statuses = ['all', 'voting', 'deliberation', 'passed', 'rejected'];
  const filtered = statusFilter === 'all' ? proposals : proposals.filter(p => p.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Governance Studio</h1>
        <p className="text-sm text-gray-500">Constitutional proposals, voting, and DAO governance</p>
      </header>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
            }`}
          >
            {s === 'all' ? 'All Proposals' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button className="ml-auto text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700">
          + New Proposal
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse h-48 bg-gray-100 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(p => <ProposalCard key={p.id} proposal={p} />)}
          {!filtered.length && (
            <div className="col-span-2 text-center py-12 text-gray-400">No proposals found.</div>
          )}
        </div>
      )}
    </div>
  );
}
