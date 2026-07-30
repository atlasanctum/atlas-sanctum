import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface GraphItem {
  id: string | number;
  title: string;
  type?: string;
  tags?: string[];
}

interface KnowledgeGraphProps {
  items?: GraphItem[];
}

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  category: string;
  size: number;
}

interface Link {
  source: string;
  target: string;
}

// Fallback data
const defaultNodes: Node[] = [
  { id: '1', x: 50, y: 50, label: 'Ethical AI', category: 'Ethics', size: 60 },
  { id: '2', x: 200, y: 150, label: 'Data Sovereignty', category: 'Policy', size: 50 },
  { id: '3', x: 350, y: 80, label: 'Indigenous Knowledge', category: 'Culture', size: 55 },
  { id: '4', x: 150, y: 300, label: 'Decentralized Tech', category: 'Tech', size: 45 },
  { id: '5', x: 400, y: 250, label: 'Bias Mitigation', category: 'Ethics', size: 40 },
  { id: '6', x: 500, y: 100, label: 'NLP', category: 'Tech', size: 35 },
];

const defaultLinks: Link[] = [
  { source: '1', target: '2' },
  { source: '1', target: '5' },
  { source: '2', target: '3' },
  { source: '2', target: '4' },
  { source: '3', target: '5' },
  { source: '3', target: '6' },
  { source: '5', target: '6' },
];

export const KnowledgeGraph = ({ items }: KnowledgeGraphProps) => {
  const { nodes, links } = useMemo(() => {
    if (!items || items.length === 0) {
      return { nodes: defaultNodes, links: defaultLinks };
    }

    // Simple deterministic layout generation for dynamic items
    const generateNodes = items.map((item, index) => {
      // Create a circular layout
      const angle = (index / items.length) * 2 * Math.PI;
      const radius = 150;
      const centerX = 300;
      const centerY = 200;
      
      return {
        id: item.id.toString(),
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        label: item.title.length > 20 ? item.title.substring(0, 18) + '...' : item.title,
        category: item.type || 'Resource',
        size: 40 + (Math.random() * 20), // varied size
        fullTitle: item.title
      };
    });

    // Create links between sequential nodes and some random cross-links
    const generateLinks: Link[] = [];
    for (let i = 0; i < generateNodes.length; i++) {
      // Link to next
      generateLinks.push({
        source: generateNodes[i].id,
        target: generateNodes[(i + 1) % generateNodes.length].id
      });
      
      // Link to center-ish (connect to first node as hub if many items)
      if (i > 1) {
         generateLinks.push({
            source: generateNodes[0].id,
            target: generateNodes[i].id
         });
      }
    }

    return { nodes: generateNodes, links: generateLinks };
  }, [items]);

  return (
    <div className="w-full h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-semibold">Topic Connections</h3>
        <p className="text-xs text-muted-foreground">
            {items ? `Visualizing ${items.length} research nodes` : 'Interactive visualization of research clusters'}
        </p>
      </div>
      
      <svg className="w-full h-full" viewBox="0 0 600 400">
        {/* Links */}
        {links.map((link, i) => {
          const source = nodes.find(n => n.id === link.source);
          const target = nodes.find(n => n.id === link.target);
          if (!source || !target) return null;
          return (
            <motion.line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              className="text-foreground"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.id}>
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="currentColor"
                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{node.fullTitle || node.label}</p>
                  <p className="text-xs text-muted-foreground">{node.category}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <motion.text
              x={node.x}
              y={node.y + node.size / 2 + 15}
              textAnchor="middle"
              className="text-[10px] fill-muted-foreground font-medium pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
};
