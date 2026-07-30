import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Network, Shield, Brain, Layers, 
  Satellite, TrendingUp, Users, Sparkles
} from 'lucide-react';

interface ArchitecturalLayer {
  id: string;
  name: string;
  status: 'active' | 'initializing' | 'optimizing';
  metrics: Record<string, number>;
  components: string[];
}

export const CivilizationalArchitectureDashboard: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('overview');
  const [systemMetrics, setSystemMetrics] = useState<Record<string, any>>({});

  const architecturalLayers: ArchitecturalLayer[] = [
    {
      id: 'distributed',
      name: 'Distributed Infrastructure',
      status: 'active',
      metrics: { nodes: 847, uptime: 99.97, throughput: 125000 },
      components: ['Multi-Cloud Nodes', 'Fault Tolerance', 'Consensus Engine']
    },
    {
      id: 'protocol',
      name: 'Regenerative Protocol',
      status: 'active',
      metrics: { contracts: 12, oracles: 5, transactions: 2847392 },
      components: ['Living Contracts', 'AI Oracles', 'Anti-Gaming']
    },
    {
      id: 'planetary',
      name: 'Planetary Data System',
      status: 'optimizing',
      metrics: { satellites: 847, sensors: 125000, coverage: 94.7 },
      components: ['Satellite Feeds', 'IoT Networks', 'AI Processing']
    },
    {
      id: 'ai',
      name: 'Planetary AI',
      status: 'active',
      metrics: { models: 8, accuracy: 96.4, predictions: 1847392 },
      components: ['Ecosystem Models', 'Forecasting', 'Verification']
    },
    {
      id: 'security',
      name: 'Zero-Trust Security',
      status: 'active',
      metrics: { threats: 0, encryption: 100, resilience: 99.8 },
      components: ['Quantum Crypto', 'Privacy Protocols', 'Adversarial Defense']
    },
    {
      id: 'economics',
      name: 'Regenerative Economics',
      status: 'active',
      metrics: { valuations: 847392, volume: 2.4e9, integrity: 99.9 },
      components: ['Value Models', 'Anti-Gaming', 'Market Dynamics']
    },
    {
      id: 'interface',
      name: 'Ethical Interface',
      status: 'active',
      metrics: { users: 847392, satisfaction: 94.7, accessibility: 100 },
      components: ['Translation Engine', 'Cultural Adaptation', 'Ethical Literacy']
    },
    {
      id: 'evolution',
      name: 'Evolutionary Engine',
      status: 'optimizing',
      metrics: { adaptations: 1247, resilience: 97.3, learning: 89.4 },
      components: ['System Learning', 'Decadal Planning', 'Resilience Assessment']
    }
  ];

  const innovations = [
    {
      id: 'quantum',
      name: 'Quantum Ecosystem Modeling',
      description: '1024-qubit processors modeling parallel ecosystem scenarios',
      status: 'active',
      impact: 'Revolutionary ecosystem prediction accuracy'
    },
    {
      id: 'interplanetary',
      name: 'Interplanetary Network',
      description: 'Mars and Luna regeneration nodes established',
      status: 'expanding',
      impact: 'Multi-planetary regenerative civilization'
    },
    {
      id: 'consciousness',
      name: 'Consciousness Interface',
      description: 'Direct human-ecosystem communication via brainwave sync',
      status: 'beta',
      impact: 'Unprecedented human-nature connection'
    },
    {
      id: 'temporal',
      name: 'Temporal Regeneration',
      description: 'Multi-timeline ecosystem restoration modeling',
      status: 'research',
      impact: 'Time-aware regenerative strategies'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        globalNodes: 847 + Math.floor(Math.random() * 10),
        activeTransactions: 125000 + Math.floor(Math.random() * 5000),
        planetaryCoverage: 94.7 + Math.random() * 0.5,
        regenerativeValue: 2.4e9 + Math.random() * 1e8,
        systemHealth: 99.7 + Math.random() * 0.3
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const LayerCard: React.FC<{ layer: ArchitecturalLayer }> = ({ layer }) => {
    const statusColors = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      initializing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      optimizing: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };

    const icons = {
      distributed: Network,
      protocol: Layers,
      planetary: Satellite,
      ai: Brain,
      security: Shield,
      economics: TrendingUp,
      interface: Users,
      evolution: Sparkles
    };

    const Icon = icons[layer.id as keyof typeof icons] || Globe;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-glow transition-all cursor-pointer"
        onClick={() => setActiveLayer(layer.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{layer.name}</h3>
              <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[layer.status]}`}>
                {layer.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {Object.entries(layer.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-semibold text-primary">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              <div className="text-xs text-muted-foreground capitalize">{key}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {layer.components.map((component, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">{component}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const InnovationCard: React.FC<{ innovation: typeof innovations[0] }> = ({ innovation }) => {
    const statusColors = {
      active: 'bg-green-500/10 text-green-500',
      expanding: 'bg-blue-500/10 text-blue-500',
      beta: 'bg-yellow-500/10 text-yellow-500',
      research: 'bg-purple-500/10 text-purple-500'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground">{innovation.name}</h3>
          <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[innovation.status as keyof typeof statusColors]}`}>
            {innovation.status.toUpperCase()}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{innovation.description}</p>
        <div className="text-sm font-medium text-primary">{innovation.impact}</div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Atlas Sanctum Architecture</h1>
              <p className="text-muted-foreground mt-1">Civilizational Operating System</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{systemMetrics.systemHealth?.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{systemMetrics.globalNodes}</div>
                <div className="text-xs text-muted-foreground">Global Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{systemMetrics.planetaryCoverage?.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Planetary Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Layers */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Architectural Layers</h2>
          <p className="text-muted-foreground">Multidisciplinary engineering systems operating at civilizational scale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {architecturalLayers.map((layer) => (
            <LayerCard key={layer.id} layer={layer} />
          ))}
        </div>

        {/* Ambitious Innovations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Civilizational Innovations</h2>
          <p className="text-muted-foreground">Boundary-pushing expansions transforming regenerative potential</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {innovations.map((innovation) => (
            <InnovationCard key={innovation.id} innovation={innovation} />
          ))}
        </div>

        {/* System Integration Status */}
        <div className="bg-card border border-border/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">System Integration Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">✓</div>
              <h3 className="font-semibold text-foreground mb-2">Decentralized</h3>
              <p className="text-sm text-muted-foreground">No single point of failure across {systemMetrics.globalNodes} nodes</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">⚡</div>
              <h3 className="font-semibold text-foreground mb-2">Planetary Scale</h3>
              <p className="text-sm text-muted-foreground">Real-time data from satellites, sensors, and human systems</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">∞</div>
              <h3 className="font-semibold text-foreground mb-2">Decades Resilient</h3>
              <p className="text-sm text-muted-foreground">Evolutionary architecture adapting to civilizational shifts</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Architecture Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>• Ethics encoded in protocols and data flows</div>
              <div>• Zero-trust security with adversarial resilience</div>
              <div>• Human-centered interfaces without metric distortion</div>
              <div>• Regenerative economics with anti-gaming mechanisms</div>
              <div>• AI-powered oracles with verifiable impact metrics</div>
              <div>• Multi-species governance and cultural adaptation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivilizationalArchitectureDashboard;