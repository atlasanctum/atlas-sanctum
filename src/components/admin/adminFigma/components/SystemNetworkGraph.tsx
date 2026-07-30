import React, { useEffect, useRef, useState } from 'react';
import { Activity, Zap } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'ai' | 'blockchain' | 'dao' | 'finance' | 'impact';
  x: number;
  y: number;
  status: 'active' | 'processing' | 'idle';
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

const nodes: Node[] = [
  { id: 'ai1', label: 'Carbon AI', type: 'ai', x: 150, y: 100, status: 'active' },
  { id: 'ai2', label: 'Ethical Engine', type: 'ai', x: 150, y: 250, status: 'processing' },
  { id: 'bc1', label: 'Carbon Credits', type: 'blockchain', x: 350, y: 100, status: 'active' },
  { id: 'bc2', label: 'Impact Tokens', type: 'blockchain', x: 350, y: 250, status: 'active' },
  { id: 'dao1', label: 'Governance', type: 'dao', x: 550, y: 175, status: 'active' },
  { id: 'fi1', label: 'ReFi Pool', type: 'finance', x: 750, y: 100, status: 'active' },
  { id: 'fi2', label: 'Treasury', type: 'finance', x: 750, y: 250, status: 'processing' },
  { id: 'im1', label: 'Impact Metrics', type: 'impact', x: 950, y: 175, status: 'active' },
];

const connections: Connection[] = [
  { from: 'ai1', to: 'bc1', active: true },
  { from: 'ai2', to: 'bc2', active: true },
  { from: 'ai1', to: 'dao1', active: false },
  { from: 'ai2', to: 'dao1', active: true },
  { from: 'bc1', to: 'fi1', active: true },
  { from: 'bc2', to: 'fi2', active: true },
  { from: 'dao1', to: 'fi1', active: true },
  { from: 'dao1', to: 'fi2', active: false },
  { from: 'fi1', to: 'im1', active: true },
  { from: 'fi2', to: 'im1', active: true },
];

export function SystemNetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pulseOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      pulseOffset += 0.02;

      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          if (conn.active) {
            const pulse = Math.sin(pulseOffset) * 0.3 + 0.7;
            ctx.strokeStyle = `rgba(16, 185, 129, ${pulse * 0.6})`;
            ctx.lineWidth = 2;
            
            // Draw flowing particles
            const progress = (pulseOffset % (Math.PI * 2)) / (Math.PI * 2);
            const particleX = fromNode.x + (toNode.x - fromNode.x) * progress;
            const particleY = fromNode.y + (toNode.y - fromNode.y) * progress;
            
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
            ctx.lineWidth = 1;
          }
          
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode === node.id;
        const baseRadius = 30;
        const radius = isHovered ? baseRadius + 5 : baseRadius;
        
        // Outer glow for active nodes
        if (node.status === 'active' || node.status === 'processing') {
          const glowPulse = Math.sin(pulseOffset * 2) * 0.3 + 0.7;
          const gradient = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius + 15);
          
          const color = node.type === 'ai' ? '139, 92, 246' :
                       node.type === 'blockchain' ? '59, 130, 246' :
                       node.type === 'dao' ? '16, 185, 129' :
                       node.type === 'finance' ? '245, 158, 11' :
                       '20, 184, 166';
          
          gradient.addColorStop(0, `rgba(${color}, ${glowPulse * 0.4})`);
          gradient.addColorStop(1, `rgba(${color}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 15, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        const nodeColor = node.type === 'ai' ? '#8b5cf6' :
                         node.type === 'blockchain' ? '#3b82f6' :
                         node.type === 'dao' ? '#10b981' :
                         node.type === 'finance' ? '#f59e0b' :
                         '#14b8a6';

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner processing indicator
        if (node.status === 'processing') {
          const spinAngle = pulseOffset * 3;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius - 8, spinAngle, spinAngle + Math.PI);
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = 'white';
        ctx.font = isHovered ? 'bold 12px Inter' : '11px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 30;
    });

    setHoveredNode(hoveredNode?.id || null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          Living Systems Network
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Real-time data flow</span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={1100}
        height={350}
        className="w-full rounded-lg cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />

      <div className="grid grid-cols-5 gap-2 mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>AI Engine</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Blockchain</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>DAO</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Finance</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
          <span>Impact</span>
        </div>
      </div>
    </div>
  );
}
