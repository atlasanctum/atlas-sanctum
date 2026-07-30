import React, { useState } from 'react';
import { Network, Zap, CheckCircle, Activity, Code } from 'lucide-react';

interface Subgraph {
  id: string;
  name: string;
  service: string;
  status: 'healthy' | 'degraded' | 'offline';
  latency: number;
  requests: number;
  uptime: number;
  version: string;
}

export function GraphQLFederation() {
  const [selectedSubgraph, setSelectedSubgraph] = useState<Subgraph | null>(null);

  const subgraphs: Subgraph[] = [
    {
      id: '1',
      name: 'Carbon Service',
      service: 'carbon-api',
      status: 'healthy',
      latency: 45,
      requests: 234567,
      uptime: 99.98,
      version: 'v2.4.1',
    },
    {
      id: '2',
      name: 'Finance Service',
      service: 'defi-api',
      status: 'healthy',
      latency: 52,
      requests: 189432,
      uptime: 99.96,
      version: 'v3.1.0',
    },
    {
      id: '3',
      name: 'Governance Service',
      service: 'dao-api',
      status: 'healthy',
      latency: 38,
      requests: 145890,
      uptime: 99.99,
      version: 'v1.8.2',
    },
    {
      id: '4',
      name: 'Analytics Service',
      service: 'metrics-api',
      status: 'healthy',
      latency: 61,
      requests: 298765,
      uptime: 99.95,
      version: 'v2.0.3',
    },
    {
      id: '5',
      name: 'Identity Service',
      service: 'auth-api',
      status: 'healthy',
      latency: 28,
      requests: 412389,
      uptime: 99.99,
      version: 'v4.2.0',
    },
  ];

  const exampleQuery = `query GetUserImpactDashboard {
  user(id: "user123") @auth {
    id
    name
    # From Identity Service
    profile {
      avatar
      bio
    }
    # From Carbon Service
    carbonImpact {
      totalOffset
      projects {
        name
        location
        impact
      }
    }
    # From Finance Service
    treasury {
      balance
      transactions {
        amount
        type
      }
    }
    # From Governance Service
    daoParticipation {
      proposalsVoted
      votingPower
    }
  }
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Network className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          GraphQL Federation
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Unified API gateway for microservices architecture
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Network className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Single Graph, Multiple Services</h3>
            <p className="text-sm opacity-90 mb-3">
              Apollo Federation unifies 5 independent microservices into one GraphQL API. Query across all services with a single request - the gateway handles the coordination.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Apollo Federation</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Microservices</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Type-Safe</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Real-Time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Active Subgraphs</p>
          <p className="text-2xl">{subgraphs.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Requests/Day</p>
          <p className="text-2xl">{(subgraphs.reduce((sum, s) => sum + s.requests, 0) / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Avg Latency</p>
          <p className="text-2xl">{Math.round(subgraphs.reduce((sum, s) => sum + s.latency, 0) / subgraphs.length)}ms</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Uptime</p>
          <p className="text-2xl">99.97%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg">Federated Subgraphs</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {subgraphs.map((subgraph) => (
            <div key={subgraph.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedSubgraph(subgraph)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm">{subgraph.name}</h4>
                    <code className="text-xs text-gray-500">{subgraph.service}</code>
                  </div>
                  <p className="text-xs text-gray-600">Version {subgraph.version}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  subgraph.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' :
                  subgraph.status === 'degraded' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {subgraph.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                <div>
                  <p className="mb-1">Latency</p>
                  <p className="text-lg text-gray-900">{subgraph.latency}ms</p>
                </div>
                <div>
                  <p className="mb-1">Requests</p>
                  <p className="text-lg text-gray-900">{(subgraph.requests / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="mb-1">Uptime</p>
                  <p className="text-lg text-gray-900">{subgraph.uptime}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-600" />
          Example Federated Query
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-emerald-400">{exampleQuery}</pre>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          This single query fetches data from 4 different microservices. The federation gateway automatically routes sub-queries to the appropriate services and merges the results.
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Architecture Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-sm mb-2">Independent Scaling</h4>
            <p className="text-xs text-gray-600">
              Each service scales independently based on load. High-traffic services get more resources.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-sm mb-2">Team Autonomy</h4>
            <p className="text-xs text-gray-600">
              Teams own their subgraphs, deploy independently, and iterate faster without coordination overhead.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-sm mb-2">Type Safety</h4>
            <p className="text-xs text-gray-600">
              Schema composition ensures type safety across all services with compile-time validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
