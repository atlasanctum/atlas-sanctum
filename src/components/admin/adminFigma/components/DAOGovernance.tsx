import React from 'react';
import { Users, Vote, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const votingActivity = [
  { week: 'Week 1', proposals: 12, votes: 3240 },
  { week: 'Week 2', proposals: 15, votes: 4120 },
  { week: 'Week 3', proposals: 18, votes: 4890 },
  { week: 'Week 4', proposals: 14, votes: 3870 },
];

const proposalTypes = [
  { name: 'Treasury Allocation', value: 35, color: '#10b981' },
  { name: 'Ethical Guidelines', value: 28, color: '#3b82f6' },
  { name: 'Impact Metrics', value: 22, color: '#8b5cf6' },
  { name: 'Partnership Approval', value: 15, color: '#f59e0b' },
];

const activeProposals = [
  {
    id: 'PROP-089',
    title: 'Allocate $500K to Amazon Rainforest Carbon Credits',
    category: 'Treasury',
    proposer: 'ReFi Alliance DAO',
    votesFor: 8420,
    votesAgainst: 1230,
    totalVotes: 9650,
    quorum: 10000,
    status: 'Active',
    timeLeft: '2 days',
    ethicalScore: 94,
  },
  {
    id: 'PROP-090',
    title: 'Update AI Moral Ontology Framework v2.0',
    category: 'Ethics',
    proposer: 'Ethical AI Consortium',
    votesFor: 12340,
    votesAgainst: 890,
    totalVotes: 13230,
    quorum: 10000,
    status: 'Active',
    timeLeft: '4 days',
    ethicalScore: 98,
  },
  {
    id: 'PROP-091',
    title: 'Partnership with Ocean Guardian Network',
    category: 'Partnership',
    proposer: 'Marine Conservation DAO',
    votesFor: 6780,
    votesAgainst: 2140,
    totalVotes: 8920,
    quorum: 10000,
    status: 'Active',
    timeLeft: '5 days',
    ethicalScore: 91,
  },
];

const recentDecisions = [
  {
    id: 'PROP-086',
    title: 'Increase Biodiversity Token Allocation by 20%',
    result: 'Passed',
    votesFor: 15240,
    votesAgainst: 3120,
    impact: 'High positive impact on ecosystem protection',
    executed: '3 days ago',
  },
  {
    id: 'PROP-087',
    title: 'Establish Community Health Impact Fund',
    result: 'Passed',
    votesFor: 13890,
    votesAgainst: 2340,
    impact: 'Funding allocated to 5 community health initiatives',
    executed: '5 days ago',
  },
  {
    id: 'PROP-088',
    title: 'Modify Carbon Credit Validation Criteria',
    result: 'Rejected',
    votesFor: 4230,
    votesAgainst: 8760,
    impact: 'Proposal withdrawn, current criteria maintained',
    executed: '7 days ago',
  },
];

const daoMembers = [
  { role: 'Active Voters', count: 2847, change: '+124' },
  { role: 'Proposal Creators', count: 342, change: '+18' },
  { role: 'Delegates', count: 156, change: '+7' },
  { role: 'Stewards', count: 45, change: '+2' },
];

export function DAOGovernance() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          DAO Governance
        </h1>
        <p className="text-gray-600">
          Democratic decision-making and ethical oversight for regenerative initiatives
        </p>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">Active Proposals</span>
            <Vote className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl text-blue-900">23</p>
          <p className="text-xs text-blue-600 mt-1">+5 this week</p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-700">Total Votes Cast</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl text-emerald-900">156.2K</p>
          <p className="text-xs text-emerald-600 mt-1">This month</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700">DAO Members</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl text-purple-900">3,390</p>
          <p className="text-xs text-purple-600 mt-1">+151 this month</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-700">Avg Ethical Score</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl text-amber-900">94.3</p>
          <p className="text-xs text-amber-600 mt-1">Proposal quality</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voting Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Voting Activity (Last 4 Weeks)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={votingActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="proposals" fill="#3b82f6" name="Proposals" />
              <Bar dataKey="votes" fill="#10b981" name="Votes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Proposal Types */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Proposal Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={proposalTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {proposalTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Proposals */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Active Proposals</h3>
        <div className="space-y-4">
          {activeProposals.map((proposal) => {
            const percentFor = (proposal.votesFor / proposal.totalVotes) * 100;
            const percentAgainst = (proposal.votesAgainst / proposal.totalVotes) * 100;
            const quorumProgress = (proposal.totalVotes / proposal.quorum) * 100;

            return (
              <div
                key={proposal.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500">{proposal.id}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {proposal.category}
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                        Ethical Score: {proposal.ethicalScore}
                      </span>
                    </div>
                    <h4 className="text-sm mb-2">{proposal.title}</h4>
                    <p className="text-xs text-gray-500">Proposed by: {proposal.proposer}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                      <Clock className="w-3 h-3" />
                      {proposal.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Vote Progress */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-600">For: {proposal.votesFor.toLocaleString()} ({percentFor.toFixed(1)}%)</span>
                    <span className="text-red-600">Against: {proposal.votesAgainst.toLocaleString()} ({percentAgainst.toFixed(1)}%)</span>
                  </div>
                  <div className="flex gap-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${percentFor}%` }}
                    ></div>
                    <div
                      className="bg-red-500 transition-all"
                      style={{ width: `${percentAgainst}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Quorum Progress: {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}</span>
                    <span>{quorumProgress.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${quorumProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm">
                    Vote For
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm">
                    Vote Against
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm">
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Recent Governance Decisions</h3>
        <div className="space-y-3">
          {recentDecisions.map((decision) => (
            <div
              key={decision.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{decision.id}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        decision.result === 'Passed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {decision.result}
                    </span>
                  </div>
                  <h4 className="text-sm mb-2">{decision.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{decision.impact}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-emerald-600">For: {decision.votesFor.toLocaleString()}</span>
                    <span className="text-red-600">Against: {decision.votesAgainst.toLocaleString()}</span>
                    <span>Executed: {decision.executed}</span>
                  </div>
                </div>
                {decision.result === 'Passed' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-4" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DAO Membership */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">DAO Membership Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {daoMembers.map((member, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">{member.role}</p>
              <p className="text-2xl text-blue-900 mb-1">{member.count.toLocaleString()}</p>
              <p className="text-xs text-emerald-600">{member.change} this month</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
