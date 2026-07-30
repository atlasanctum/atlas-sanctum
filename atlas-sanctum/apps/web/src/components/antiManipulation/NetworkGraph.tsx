/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Network Graph View
 * 
 * Interactive graph visualization for forensic teams
 */

import React, { useState, useEffect } from 'react';

interface GraphNode {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  x?: number;
  y?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight?: number;
}

interface RiskPath {
  path: string[];
  reason: string;
  score: number;
}

interface NetworkGraphProps {
  entityId?: string;
}

export default function NetworkGraph({ entityId }: NetworkGraphProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [riskPaths, setRiskPaths] = useState<RiskPath[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showRiskPaths, setShowRiskPaths] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching graph data
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data - in production, fetch from API
      setNodes([
        { id: 'vendor_001', name: 'Alpha Supply Ltd', type: 'vendor', riskScore: 87, x: 400, y: 300 },
        { id: 'vendor_002', name: 'Beta Services Ltd', type: 'vendor', riskScore: 76, x: 200, y: 200 },
        { id: 'vendor_003', name: 'Gamma Logistics', type: 'vendor', riskScore: 65, x: 600, y: 200 },
        { id: 'person_001', name: 'John Kamau', type: 'person', riskScore: 45, x: 300, y: 400 },
        { id: 'person_002', name: 'Mary Wanjiku', type: 'person', riskScore: 52, x: 500, y: 400 },
        { id: 'account_001', name: 'Business Account 1234', type: 'account', riskScore: 82, x: 400, y: 150 },
        { id: 'account_002', name: 'Savings Account 5678', type: 'account', riskScore: 35, x: 150, y: 350 },
        { id: 'device_001', name: 'Phone +254700123456', type: 'device', riskScore: 78, x: 650, y: 350 }
      ]);

      setEdges([
        { source: 'vendor_001', target: 'person_001', type: 'director_of' },
        { source: 'vendor_002', target: 'person_001', type: 'director_of' },
        { source: 'vendor_001', target: 'account_001', type: 'paid_to' },
        { source: 'vendor_002', target: 'account_001', type: 'paid_to' },
        { source: 'vendor_001', target: 'device_001', type: 'shares_device' },
        { source: 'vendor_002', target: 'device_001', type: 'shares_device' },
        { source: 'person_001', target: 'account_002', type: 'owns' },
        { source: 'person_002', target: 'vendor_003', type: 'director_of' },
        { source: 'vendor_003', target: 'account_001', type: 'paid_to' }
      ]);

      setRiskPaths([
        {
          path: ['vendor_001', 'person_001', 'vendor_002'],
          reason: 'Shared beneficial owner',
          score: 0.85
        },
        {
          path: ['vendor_001', 'device_001', 'vendor_002'],
          reason: 'Shared device usage',
          score: 0.72
        },
        {
          path: ['vendor_001', 'account_001', 'vendor_002'],
          reason: 'Shared bank account',
          score: 0.68
        }
      ]);

      setLoading(false);
    };

    fetchData();
  }, [entityId]);

  const getNodeColor = (type: string, riskScore: number) => {
    if (riskScore >= 80) return '#ef4444'; // red
    if (riskScore >= 60) return '#f97316'; // orange
    if (riskScore >= 40) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const getNodeShape = (type: string) => {
    switch (type) {
      case 'vendor': return 'circle';
      case 'person': return 'square';
      case 'account': return 'diamond';
      case 'device': return 'triangle';
      default: return 'circle';
    }
  };

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'director_of': return '#3b82f6'; // blue
      case 'paid_to': return '#10b981'; // green
      case 'shares_device': return '#f59e0b'; // amber
      case 'owns': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  };

  const filteredEdges = filterType === 'all' 
    ? edges 
    : edges.filter(e => e.type === filterType);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Network Graph</h1>
        <p className="text-gray-600">Interactive entity relationship visualization</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by Edge Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="director_of">Director Of</option>
              <option value="paid_to">Paid To</option>
              <option value="shares_device">Shares Device</option>
              <option value="owns">Owns</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showRiskPaths"
              checked={showRiskPaths}
              onChange={(e) => setShowRiskPaths(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showRiskPaths" className="text-sm text-gray-700">
              Show Risk Paths
            </label>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Normal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Entity Network</h2>
          <div className="bg-gray-100 rounded-lg p-4 min-h-96 relative">
            {/* SVG Graph */}
            <svg width="100%" height="400" viewBox="0 0 800 500">
              {/* Edges */}
              {filteredEdges.map((edge, index) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                return (
                  <line
                    key={`edge-${index}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={getEdgeColor(edge.type)}
                    strokeWidth={2}
                    strokeDasharray={edge.type === 'shares_device' ? '5,5' : 'none'}
                  />
                );
              })}

              {/* Risk Paths */}
              {showRiskPaths && riskPaths.map((path, pathIndex) => (
                <g key={`path-${pathIndex}`}>
                  {path.path.map((nodeId, nodeIndex) => {
                    if (nodeIndex === path.path.length - 1) return null;
                    const sourceNode = nodes.find(n => n.id === nodeId);
                    const targetNode = nodes.find(n => n.id === path.path[nodeIndex + 1]);
                    if (!sourceNode || !targetNode) return null;

                    return (
                      <line
                        key={`path-edge-${pathIndex}-${nodeIndex}`}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke="#ef4444"
                        strokeWidth={4}
                        strokeOpacity={0.5}
                      />
                    );
                  })}
                </g>
              ))}

              {/* Nodes */}
              {nodes.map((node) => (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {getNodeShape(node.type) === 'circle' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={selectedNode === node.id ? 25 : 20}
                      fill={getNodeColor(node.type, node.riskScore)}
                      stroke={selectedNode === node.id ? '#1e40af' : '#fff'}
                      strokeWidth={selectedNode === node.id ? 3 : 2}
                    />
                  )}
                  {getNodeShape(node.type) === 'square' && (
                    <rect
                      x={(node.x || 0) - 18}
                      y={(node.y || 0) - 18}
                      width={36}
                      height={36}
                      fill={getNodeColor(node.type, node.riskScore)}
                      stroke={selectedNode === node.id ? '#1e40af' : '#fff'}
                      strokeWidth={selectedNode === node.id ? 3 : 2}
                    />
                  )}
                  {getNodeShape(node.type) === 'diamond' && (
                    <polygon
                      points={`${node.x},${(node.y || 0) - 20} ${(node.x || 0) + 20},${node.y} ${node.x},${(node.y || 0) + 20} ${(node.x || 0) - 20},${node.y}`}
                      fill={getNodeColor(node.type, node.riskScore)}
                      stroke={selectedNode === node.id ? '#1e40af' : '#fff'}
                      strokeWidth={selectedNode === node.id ? 3 : 2}
                    />
                  )}
                  {getNodeShape(node.type) === 'triangle' && (
                    <polygon
                      points={`${node.x},${(node.y || 0) - 20} ${(node.x || 0) + 20},${(node.y || 0) + 15} ${(node.x || 0) - 20},${(node.y || 0) + 15}`}
                      fill={getNodeColor(node.type, node.riskScore)}
                      stroke={selectedNode === node.id ? '#1e40af' : '#fff'}
                      strokeWidth={selectedNode === node.id ? 3 : 2}
                    />
                  )}
                  <text
                    x={node.x}
                    y={(node.y || 0) + 35}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#374151"
                  >
                    {node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name}
                  </text>
                </g>
              ))}
            </svg>

            <div className="absolute bottom-4 left-4 text-xs text-gray-500">
              Click on nodes to select • Drag to pan • Scroll to zoom
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected Node Info */}
          {selectedNode && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Entity</h3>
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium">{node.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium">{node.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Risk Score</span>
                      <span className={`font-medium ${
                        node.riskScore >= 80 ? 'text-red-600' :
                        node.riskScore >= 60 ? 'text-orange-600' :
                        'text-yellow-600'
                      }`}>
                        {node.riskScore}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <button className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Risk Paths */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suspicious Paths</h3>
            <div className="space-y-4">
              {riskPaths.map((path, index) => (
                <div key={index} className="p-3 border border-red-200 bg-red-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-800">Path {index + 1}</span>
                    <span className="text-xs text-red-600">Score: {(path.score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-sm text-red-700 mb-2">{path.reason}</div>
                  <div className="text-xs text-red-600">
                    {path.path.join(' → ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700">Director Of</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">Paid To</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-700">Shares Device</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-700">Owns</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div className="w-4 h-1 bg-red-500"></div>
                <span className="text-sm text-gray-700">Suspicious Path</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Expand Network
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Show Hidden Hubs
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Timeline Replay
              </button>
              <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                Export Graph
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
