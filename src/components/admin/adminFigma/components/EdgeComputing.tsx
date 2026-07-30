import React, { useState } from 'react';
import { Zap, Globe, TrendingDown, Server, MapPin } from 'lucide-react';

interface EdgeNode {
  id: string;
  location: string;
  region: string;
  lat: number;
  lng: number;
  status: 'healthy' | 'degraded' | 'offline';
  latency: number;
  requests: number;
  cpu: number;
  memory: number;
}

export function EdgeComputing() {
  const [selectedNode, setSelectedNode] = useState<EdgeNode | null>(null);

  const edgeNodes: EdgeNode[] = [
    {
      id: '1',
      location: 'San Francisco, USA',
      region: 'us-west',
      lat: 37.7749,
      lng: -122.4194,
      status: 'healthy',
      latency: 12,
      requests: 145230,
      cpu: 45,
      memory: 62,
    },
    {
      id: '2',
      location: 'New York, USA',
      region: 'us-east',
      lat: 40.7128,
      lng: -74.0060,
      status: 'healthy',
      latency: 15,
      requests: 198450,
      cpu: 52,
      memory: 68,
    },
    {
      id: '3',
      location: 'London, UK',
      region: 'eu-west',
      lat: 51.5074,
      lng: -0.1278,
      status: 'healthy',
      latency: 18,
      requests: 167890,
      cpu: 48,
      memory: 65,
    },
    {
      id: '4',
      location: 'Singapore',
      region: 'ap-southeast',
      lat: 1.3521,
      lng: 103.8198,
      status: 'healthy',
      latency: 22,
      requests: 134560,
      cpu: 41,
      memory: 58,
    },
    {
      id: '5',
      location: 'Sydney, Australia',
      region: 'ap-south',
      lat: -33.8688,
      lng: 151.2093,
      status: 'healthy',
      latency: 28,
      requests: 89340,
      cpu: 38,
      memory: 54,
    },
    {
      id: '6',
      location: 'São Paulo, Brazil',
      region: 'sa-east',
      lat: -23.5505,
      lng: -46.6333,
      status: 'healthy',
      latency: 35,
      requests: 76230,
      cpu: 44,
      memory: 61,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-100 text-emerald-700';
      case 'degraded':
        return 'bg-amber-100 text-amber-700';
      case 'offline':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalRequests = edgeNodes.reduce((sum, node) => sum + node.requests, 0);
  const avgLatency = Math.round(edgeNodes.reduce((sum, node) => sum + node.latency, 0) / edgeNodes.length);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
          Edge Computing Network
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Global edge infrastructure for lightning-fast performance
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Globe className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">10x Faster Global Performance</h3>
            <p className="text-sm opacity-90 mb-3">
              Our edge computing network deploys your data and compute to 300+ locations worldwide. Users connect to the nearest edge node for sub-50ms latency globally.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Cloudflare Workers</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">300+ Locations</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">&lt;50ms Latency</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">99.99% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Global Requests/Day</p>
          <p className="text-2xl">{totalRequests.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 23% vs yesterday</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Avg Latency</p>
          <p className="text-2xl">{avgLatency}ms</p>
          <p className="text-xs text-emerald-600 mt-1">↓ 15% improvement</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Edge Nodes</p>
          <p className="text-2xl">{edgeNodes.length}</p>
          <p className="text-xs text-gray-600 mt-1">All healthy</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Uptime</p>
          <p className="text-2xl">99.99%</p>
          <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Global Map Visualization */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg">Global Edge Network</h3>
        </div>
        <div className="relative bg-gradient-to-b from-blue-900 to-blue-950 p-8" style={{ height: '400px' }}>
          {/* Simplified world map representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-4xl" style={{ aspectRatio: '2/1' }}>
              {/* Edge nodes */}
              {edgeNodes.map((node) => {
                // Simple projection (not accurate, just for visualization)
                const x = ((node.lng + 180) / 360) * 100;
                const y = ((90 - node.lat) / 180) * 100;
                
                return (
                  <div
                    key={node.id}
                    className="absolute cursor-pointer group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Pulse ring */}
                    <div className="absolute inset-0 w-6 h-6 bg-emerald-400 rounded-full animate-ping opacity-75" />
                    
                    {/* Node marker */}
                    <div className={`relative w-6 h-6 rounded-full shadow-lg ${
                      node.status === 'healthy' ? 'bg-emerald-500' :
                      node.status === 'degraded' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap">
                        <div className="font-medium mb-1">{node.location}</div>
                        <div className="text-emerald-400">{node.latency}ms latency</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white text-xs">
            <div className="mb-2">Status:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span>Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span>Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edge Nodes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {edgeNodes.map((node) => (
          <div
            key={node.id}
            className={`bg-white rounded-lg p-4 shadow-sm border-2 transition-all cursor-pointer ${
              selectedNode?.id === node.id
                ? 'border-amber-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedNode(node)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm">{node.location}</h3>
                </div>
                <code className="text-xs text-gray-500">{node.region}</code>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(node.status)}`}>
                {node.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-center">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Latency</p>
                <p className="text-lg">{node.latency}ms</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Requests</p>
                <p className="text-lg">{(node.requests / 1000).toFixed(0)}K</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>CPU</span>
                  <span>{node.cpu}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      node.cpu > 80 ? 'bg-red-500' :
                      node.cpu > 60 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${node.cpu}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Memory</span>
                  <span>{node.memory}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      node.memory > 80 ? 'bg-red-500' :
                      node.memory > 60 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${node.memory}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Edge Computing Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-sm mb-2">10x Faster Response</h4>
            <p className="text-xs text-gray-600">
              Users connect to nearest edge node, reducing latency from 500ms+ to &lt;50ms globally
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-sm mb-2">Reduced Server Load</h4>
            <p className="text-xs text-gray-600">
              Static assets and API responses cached at edge, reducing origin server requests by 80%
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-sm mb-2">60% Cost Reduction</h4>
            <p className="text-xs text-gray-600">
              Pay only for compute at edge, eliminating expensive always-on servers and bandwidth costs
            </p>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Technical Architecture</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">⚡</div>
            <div>
              <p className="mb-1"><strong>Cloudflare Workers</strong></p>
              <p className="text-xs text-gray-600">Serverless JavaScript execution at 300+ global edge locations</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">💾</div>
            <div>
              <p className="mb-1"><strong>KV Storage</strong></p>
              <p className="text-xs text-gray-600">Global key-value store with eventual consistency</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">🗄️</div>
            <div>
              <p className="mb-1"><strong>Durable Objects</strong></p>
              <p className="text-xs text-gray-600">Strongly consistent coordination for real-time features</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">🔒</div>
            <div>
              <p className="mb-1"><strong>Zero Trust Security</strong></p>
              <p className="text-xs text-gray-600">Built-in DDoS protection, WAF, and bot management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
