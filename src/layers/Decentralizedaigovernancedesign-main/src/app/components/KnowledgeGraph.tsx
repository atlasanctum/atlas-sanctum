import { useState, useEffect, useRef } from "react";
import { Network, Maximize2, Filter, Search, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface GraphNode {
  id: string;
  label: string;
  type: "proposal" | "member" | "topic" | "outcome" | "dependency";
  x: number;
  y: number;
  connections: string[];
  strength?: number;
}

interface KnowledgeGraphProps {
  focusProposalId?: string;
  onClose: () => void;
}

export function KnowledgeGraph({ focusProposalId, onClose }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filter, setFilter] = useState<"all" | "proposals" | "members" | "dependencies">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample knowledge graph data
  const nodes: GraphNode[] = [
    {
      id: "p1",
      label: "Privacy Voting",
      type: "proposal",
      x: 400,
      y: 300,
      connections: ["p2", "t1", "m1", "o1", "d1"],
      strength: 0.92,
    },
    {
      id: "p2",
      label: "UBI System",
      type: "proposal",
      x: 600,
      y: 250,
      connections: ["p1", "t2", "m2", "o2", "d2"],
      strength: 0.88,
    },
    {
      id: "p3",
      label: "AI Ethics Committee",
      type: "proposal",
      x: 500,
      y: 450,
      connections: ["t1", "t3", "m3", "o3"],
      strength: 0.96,
    },
    {
      id: "t1",
      label: "Privacy & Security",
      type: "topic",
      x: 250,
      y: 200,
      connections: ["p1", "p3"],
    },
    {
      id: "t2",
      label: "Economic Fairness",
      type: "topic",
      x: 750,
      y: 200,
      connections: ["p2"],
    },
    {
      id: "t3",
      label: "AI Governance",
      type: "topic",
      x: 650,
      y: 500,
      connections: ["p3"],
    },
    {
      id: "m1",
      label: "Sarah Chen",
      type: "member",
      x: 300,
      y: 350,
      connections: ["p1"],
    },
    {
      id: "m2",
      label: "Marcus W.",
      type: "member",
      x: 700,
      y: 300,
      connections: ["p2"],
    },
    {
      id: "m3",
      label: "Elena R.",
      type: "member",
      x: 450,
      y: 550,
      connections: ["p3"],
    },
    {
      id: "o1",
      label: "+34% Participation",
      type: "outcome",
      x: 200,
      y: 350,
      connections: ["p1"],
    },
    {
      id: "o2",
      label: "+45% Retention",
      type: "outcome",
      x: 800,
      y: 250,
      connections: ["p2"],
    },
    {
      id: "o3",
      label: "+67% Trust",
      type: "outcome",
      x: 600,
      y: 600,
      connections: ["p3"],
    },
    {
      id: "d1",
      label: "Tech Infrastructure",
      type: "dependency",
      x: 350,
      y: 150,
      connections: ["p1"],
    },
    {
      id: "d2",
      label: "Treasury Funding",
      type: "dependency",
      x: 650,
      y: 150,
      connections: ["p2"],
    },
  ];

  const getNodeColor = (type: string) => {
    switch (type) {
      case "proposal":
        return "#6366F1";
      case "member":
        return "#8B5CF6";
      case "topic":
        return "#EC4899";
      case "outcome":
        return "#10B981";
      case "dependency":
        return "#F59E0B";
      default:
        return "#9CA3AF";
    }
  };

  const getNodeSize = (node: GraphNode) => {
    if (node.type === "proposal") return node.strength ? 15 + node.strength * 10 : 20;
    return 12;
  };

  const filteredNodes = nodes.filter((node) => {
    if (filter === "proposals" && node.type !== "proposal") return false;
    if (filter === "members" && node.type !== "member") return false;
    if (filter === "dependencies" && node.type !== "dependency") return false;
    if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Draw graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    filteredNodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const targetNode = filteredNodes.find((n) => n.id === connId);
        if (targetNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = hoveredNode?.id === node.id || hoveredNode?.id === connId
            ? "rgba(99, 102, 241, 0.4)"
            : "rgba(156, 163, 175, 0.2)";
          ctx.lineWidth = hoveredNode?.id === node.id || hoveredNode?.id === connId ? 2 : 1;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    filteredNodes.forEach((node) => {
      const size = getNodeSize(node);
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node.type);
      ctx.fill();

      // Highlight
      if (isHovered || isSelected) {
        ctx.strokeStyle = isSelected ? "#1F2937" : getNodeColor(node.type);
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = "#1F2937";
      ctx.font = isHovered || isSelected ? "bold 12px sans-serif" : "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + size + 15);
    });
  }, [filteredNodes, hoveredNode, selectedNode]);

  // Handle mouse interaction
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = filteredNodes.find((node) => {
      const size = getNodeSize(node);
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= size;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredNode = filteredNodes.find((node) => {
      const size = getNodeSize(node);
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= size;
    });

    setHoveredNode(hoveredNode || null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6" />
              <h2>Knowledge Graph</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-100 text-sm">
            Visualize how proposals, members, and outcomes interconnect
          </p>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="proposals">Proposals</option>
                <option value="members">Members</option>
                <option value="dependencies">Dependencies</option>
              </select>
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="relative mb-4">
            <canvas
              ref={canvasRef}
              width={1000}
              height={650}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              className="w-full border border-gray-200 rounded-lg cursor-pointer bg-gray-50"
            />
            
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-200">
              <p className="text-xs font-medium mb-2">Node Types</p>
              <div className="space-y-1.5">
                {[
                  { type: "proposal", label: "Proposals", color: "#6366F1" },
                  { type: "member", label: "Members", color: "#8B5CF6" },
                  { type: "topic", label: "Topics", color: "#EC4899" },
                  { type: "outcome", label: "Outcomes", color: "#10B981" },
                  { type: "dependency", label: "Dependencies", color: "#F59E0B" },
                ].map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node Details */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                    />
                    <h4 className="font-medium">{selectedNode.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{selectedNode.type}</p>
                </div>
                {selectedNode.strength && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Strength</p>
                    <p className="text-2xl text-indigo-600">{(selectedNode.strength * 100).toFixed(0)}%</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Connected to {selectedNode.connections.length} nodes:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.connections.map((connId) => {
                      const connNode = nodes.find((n) => n.id === connId);
                      return connNode ? (
                        <button
                          key={connId}
                          onClick={() => setSelectedNode(connNode)}
                          className="px-2 py-1 bg-white border border-gray-200 rounded text-xs hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                          {connNode.label}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>

                {selectedNode.type === "proposal" && (
                  <div className="pt-3 border-t border-indigo-200">
                    <p className="text-xs text-gray-600 mb-2">Impact Analysis</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white rounded">
                        <p className="text-sm font-medium">12</p>
                        <p className="text-xs text-gray-600">Dependencies</p>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <p className="text-sm font-medium">8</p>
                        <p className="text-xs text-gray-600">Affected Topics</p>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <p className="text-sm font-medium">34</p>
                        <p className="text-xs text-gray-600">Stakeholders</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Insights */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-900 mb-1">AI Insights</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Privacy Voting has highest centrality score - critical proposal</li>
                  <li>• Strong clustering around Privacy & Security topic - community priority</li>
                  <li>• UBI System and Privacy Voting have indirect dependencies</li>
                  <li>• AI Ethics Committee connects to all major governance topics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
