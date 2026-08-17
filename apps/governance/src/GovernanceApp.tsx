/**
 * Atlas Sanctum — Governance App
 * DAO governance studio: proposals, voting, constitutional amendments,
 * covenant management, and seven-generation impact tracking.
 */

import React, { useState } from 'react';
import {
  Badge,
  MetricCard,
  SectionHeader,
  EmptyState,
  ProgressBar,
  EthicsScore,
} from '../../../packages/ui/src/index';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProposalStatus = 'draft' | 'deliberation' | 'voting' | 'passed' | 'rejected' | 'vetoed';
type ProposalType   = 'policy' | 'constitutional_amendment' | 'resource_allocation' | 'partnership';

interface Proposal {
  id: string;
  title: string;
  type: ProposalType;
  status: ProposalStatus;
  proposedBy: string;
  sevenGenerationImpact: string;
  affectedBioregions: string[];
  yesWeight: number;
  noWeight: number;
  abstainWeight: number;
  totalWeight: number;
  votingDeadline: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Amazon Basin Protection Corridor Act 2026',
    type: 'policy',
    status: 'voting',
    proposedBy: 'did:sanctum:council-amazon',
    sevenGenerationImpact: 'Protects 5M hectares for 175+ years, preserving carbon stocks and indigenous sovereignty.',
    affectedBioregions: ['amazon-basin', 'cerrado'],
    yesWeight: 6800, noWeight: 1200, abstainWeight: 400, totalWeight: 10000,
    votingDeadline: '2026-08-15',
  },
  {
    id: 'prop-002',
    title: 'Coral Triangle Emergency Response Protocol',
    type: 'resource_allocation',
    status: 'deliberation',
    proposedBy: 'did:sanctum:council-ocean',
    sevenGenerationImpact: 'Allocates $12M to coral restoration, protecting marine biodiversity for future generations.',
    affectedBioregions: ['coral-triangle'],
    yesWeight: 0, noWeight: 0, abstainWeight: 0, totalWeight: 10000,
    votingDeadline: '2026-09-01',
  },
  {
    id: 'prop-003',
    title: 'Indigenous Data Sovereignty Amendment',
    type: 'constitutional_amendment',
    status: 'passed',
    proposedBy: 'did:sanctum:indigenous-guardian-council',
    sevenGenerationImpact: 'Enshrines FPIC as a constitutional right, protecting indigenous knowledge for all future generations.',
    affectedBioregions: ['amazon-basin', 'congo-basin', 'himalayan-watershed'],
    yesWeight: 8900, noWeight: 300, abstainWeight: 200, totalWeight: 10000,
    votingDeadline: '2026-07-01',
  },
];

// ─── Proposal Card ────────────────────────────────────────────────────────────

const statusVariant: Record<ProposalStatus, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
  draft:        'neutral',
  deliberation: 'info',
  voting:       'warning',
  passed:       'success',
  rejected:     'critical',
  vetoed:       'critical',
};

const ProposalCard: React.FC<{ proposal: Proposal; onVote: (id: string, vote: 'yes' | 'no' | 'abstain') => void }> = ({
  proposal, onVote,
}) => {
  const totalVoted = proposal.yesWeight + proposal.noWeight + proposal.abstainWeight;
  const quorumPct  = (totalVoted / proposal.totalWeight) * 100;
  const yesPct     = totalVoted > 0 ? (proposal.yesWeight / totalVoted) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-4">
          <h3 className="text-base font-bold text-gray-900 mb-1">{proposal.title}</h3>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge label={proposal.type.replace('_', ' ')} variant="info" />
            <Badge label={proposal.status} variant={statusVariant[proposal.status]} />
            {proposal.affectedBioregions.map(b => (
              <Badge key={b} label={b} variant="neutral" />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 italic">
        🌱 Seven-generation impact: {proposal.sevenGenerationImpact}
      </p>

      {totalVoted > 0 && (
        <div className="mb-4 space-y-2">
          <ProgressBar label={`Quorum: ${quorumPct.toFixed(0)}% (50% required)`} value={quorumPct} color="#7c3aed" />
          <ProgressBar label={`Yes: ${yesPct.toFixed(0)}% (67% supermajority required)`} value={yesPct} color="#16a34a" />
        </div>
      )}

      {proposal.status === 'voting' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onVote(proposal.id, 'yes')}
            className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            ✓ Yes
          </button>
          <button
            onClick={() => onVote(proposal.id, 'no')}
            className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            ✗ No
          </button>
          <button
            onClick={() => onVote(proposal.id, 'abstain')}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors"
          >
            — Abstain
          </button>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400">
        Proposed by {proposal.proposedBy.slice(0, 30)}… · Deadline: {proposal.votingDeadline}
      </div>
    </div>
  );
};

// ─── Constitutional Health Panel ──────────────────────────────────────────────

const ConstitutionalHealthPanel: React.FC = () => (
  <section>
    <SectionHeader title="⚖️ Constitutional Health" subtitle="Covenant Code integrity" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <MetricCard label="Active Covenants" value={42} trend="up" trendValue="+3 this month" />
      <MetricCard label="Integrity Score" value="97.4" unit="%" trend="stable" />
      <MetricCard label="Critical Violations" value={0} />
      <MetricCard label="Pending Appeals" value={2} />
    </div>
    <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
      <EthicsScore score={0.974} />
      <div>
        <div className="text-sm font-semibold text-green-800">Constitutional Alignment: Excellent</div>
        <div className="text-xs text-green-600">All hard constraints satisfied. 0 ethics blocks in last 24h.</div>
      </div>
    </div>
  </section>
);

// ─── Governance App ───────────────────────────────────────────────────────────

const GovernanceApp: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [filter, setFilter] = useState<ProposalStatus | 'all'>('all');

  const handleVote = (id: string, vote: 'yes' | 'no' | 'abstain') => {
    setProposals(prev => prev.map(p => {
      if (p.id !== id) return p;
      const weight = 100;
      return {
        ...p,
        yesWeight:     vote === 'yes'     ? p.yesWeight + weight     : p.yesWeight,
        noWeight:      vote === 'no'      ? p.noWeight + weight      : p.noWeight,
        abstainWeight: vote === 'abstain' ? p.abstainWeight + weight : p.abstainWeight,
      };
    }));
  };

  const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">🏛 Governance Studio</h1>
        <p className="text-xs text-gray-500">Atlas Sanctum DAO — Constitutional Governance</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <ConstitutionalHealthPanel />

        <section>
          <SectionHeader
            title="📋 Proposals"
            subtitle={`${proposals.filter(p => p.status === 'voting').length} active votes`}
            action={
              <div className="flex gap-1">
                {(['all', 'voting', 'deliberation', 'passed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filter === s ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            }
          />

          {filtered.length === 0 ? (
            <EmptyState icon="🗳️" title="No proposals" description="No proposals match the current filter." />
          ) : (
            <div className="space-y-4">
              {filtered.map(p => (
                <ProposalCard key={p.id} proposal={p} onVote={handleVote} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default GovernanceApp;
