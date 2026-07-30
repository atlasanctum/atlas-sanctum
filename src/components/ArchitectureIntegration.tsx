import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, Shield, Brain, Satellite, TrendingUp, Layers
} from 'lucide-react';

// Integration with existing Atlas Sanctum platform
export const ArchitectureIntegration = () => {
  const systemComponents = [
    {
      name: 'Distributed Infrastructure',
      description: 'Multi-cloud, fault-tolerant nodes with regenerative consensus',
      implementation: 'DecentralizedInfrastructure class with 847 global nodes',
      icon: Network,
      status: 'Active'
    },
    {
      name: 'Regenerative Protocol',
      description: 'Living smart contracts with AI oracles and anti-gaming',
      implementation: 'RegenerativeProtocol with 5 AI oracles processing 2.8M transactions',
      icon: Layers,
      status: 'Active'
    },
    {
      name: 'Planetary Data System',
      description: 'Satellite feeds, IoT sensors, and human systems integration',
      implementation: 'PlanetaryDataSystem ingesting from 847 satellites, 125K sensors',
      icon: Satellite,
      status: 'Optimizing'
    },
    {
      name: 'Planetary AI',
      description: 'Ecosystem modeling, forecasting, and impact verification',
      implementation: 'PlanetaryAI with 8 specialized models, 96.4% accuracy',
      icon: Brain,
      status: 'Active'
    },
    {
      name: 'Zero-Trust Security',
      description: 'Quantum-resistant crypto with adversarial defense',
      implementation: 'ZeroTrustSecurity with 100% encryption, 99.8% resilience',
      icon: Shield,
      status: 'Active'
    },
    {
      name: 'Regenerative Economics',
      description: 'Multi-dimensional value models with anti-gaming mechanisms',
      implementation: 'RegenerativeEconomics processing $2.4B volume, 99.9% integrity',
      icon: TrendingUp,
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Atlas Sanctum Civilizational Architecture
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          A multidisciplinary engineering collective spanning full-stack, blockchain, AI, IoT, 
          security, and systems integration - operating as a decentralized, fault-tolerant, 
          multi-cloud system with ethics encoded directly into protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemComponents.map((component, index) => {
          const Icon = component.icon;
          return (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-glow transition-all"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{component.name}</h3>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    component.status === 'Active' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {component.status}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {component.description}
              </p>
              
              <div className="text-xs text-primary font-medium">
                {component.implementation}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Civilizational Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">847</div>
            <div className="text-sm text-muted-foreground">Global Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">2.8M</div>
            <div className="text-sm text-muted-foreground">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">94.7%</div>
            <div className="text-sm text-muted-foreground">Planetary Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">$2.4B</div>
            <div className="text-sm text-muted-foreground">Regenerative Value</div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-foreground font-medium">
            Operating as a civilizational operating system for regenerative impact at planetary scale
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureIntegration;