import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TreePine, 
  Shield, 
  Brain,
  Sprout,
  Network,
  Eye,
  Rocket,
  Star,
  Infinity,
  Sparkles
} from 'lucide-react';

interface ExtendedAtlasSanctumStatus {
  currentPhase: 1 | 2 | 3 | 4 | 5 | 6;
  evolutionStage: {
    stage: string;
    timeHorizon: string;
    scope: string;
    consciousness: string;
  };
  phase4: {
    lunarOutpostsActive: number;
    marsSettlementsEstablished: number;
    asteroidMiningOperations: number;
    interplanetaryGovernanceActive: boolean;
  };
  phase5: {
    humanAISymbioticPairs: number;
    planetaryMindActive: boolean;
    consciousnessEthicsImplemented: boolean;
    transcendentGovernanceOperational: boolean;
  };
  phase6: {
    solarSystemMastered: boolean;
    interstellarColoniesActive: number;
    galacticConsciousnessConnected: boolean;
    typeIIIRegenerativeCivilizationAchieved: boolean;
  };
  civilizationalEvolution: {
    planetaryRegeneration: number;
    interplanetaryHarmony: number;
    consciousnessEvolution: number;
    cosmicIntegration: number;
    universalContribution: number;
    eternalSustainability: number;
  };
}

const ExtendedAtlasSanctumDashboard: React.FC = () => {
  const [status, setStatus] = useState<ExtendedAtlasSanctumStatus>({
    currentPhase: 1,
    evolutionStage: {
      stage: 'planetary',
      timeHorizon: 'decades',
      scope: 'bioregional',
      consciousness: 'human'
    },
    phase4: {
      lunarOutpostsActive: 0,
      marsSettlementsEstablished: 0,
      asteroidMiningOperations: 0,
      interplanetaryGovernanceActive: false
    },
    phase5: {
      humanAISymbioticPairs: 0,
      planetaryMindActive: false,
      consciousnessEthicsImplemented: false,
      transcendentGovernanceOperational: false
    },
    phase6: {
      solarSystemMastered: false,
      interstellarColoniesActive: 0,
      galacticConsciousnessConnected: false,
      typeIIIRegenerativeCivilizationAchieved: false
    },
    civilizationalEvolution: {
      planetaryRegeneration: 0.31,
      interplanetaryHarmony: 0,
      consciousnessEvolution: 0,
      cosmicIntegration: 0,
      universalContribution: 0,
      eternalSustainability: 0
    }
  });
  const [isEvolving, setIsEvolving] = useState(false);

  const initiateCompleteEvolution = async () => {
    setIsEvolving(true);
    
    // Simulate complete 6-phase evolution
    for (let phase = 1; phase <= 6; phase++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus(prev => ({
        ...prev,
        currentPhase: phase as 1 | 2 | 3 | 4 | 5 | 6,
        evolutionStage: getEvolutionStage(phase),
        phase4: phase >= 4 ? {
          lunarOutpostsActive: 2,
          marsSettlementsEstablished: 2,
          asteroidMiningOperations: 2,
          interplanetaryGovernanceActive: true
        } : prev.phase4,
        phase5: phase >= 5 ? {
          humanAISymbioticPairs: 3,
          planetaryMindActive: true,
          consciousnessEthicsImplemented: true,
          transcendentGovernanceOperational: true
        } : prev.phase5,
        phase6: phase >= 6 ? {
          solarSystemMastered: true,
          interstellarColoniesActive: 15,
          galacticConsciousnessConnected: true,
          typeIIIRegenerativeCivilizationAchieved: true
        } : prev.phase6,
        civilizationalEvolution: {
          planetaryRegeneration: 0.94 * Math.min((phase / 6) * 2, 1),
          interplanetaryHarmony: 0.91 * Math.max(((phase / 6) - 0.5) * 2, 0),
          consciousnessEvolution: 0.88 * Math.max(((phase / 6) - 0.67) * 3, 0),
          cosmicIntegration: 0.93 * Math.max(((phase / 6) - 0.83) * 6, 0),
          universalContribution: 0.89 * Math.max(((phase / 6) - 0.83) * 6, 0),
          eternalSustainability: 0.97 * Math.max(((phase / 6) - 0.83) * 6, 0)
        }
      }));
    }
    
    setIsEvolving(false);
  };

  const getEvolutionStage = (phase: number) => {
    const stages = {
      1: { stage: 'planetary', timeHorizon: 'decades', scope: 'bioregional', consciousness: 'human' },
      2: { stage: 'planetary', timeHorizon: 'decades', scope: 'planetary', consciousness: 'human' },
      3: { stage: 'planetary', timeHorizon: 'centuries', scope: 'planetary', consciousness: 'human_ai_symbiotic' },
      4: { stage: 'interplanetary', timeHorizon: 'centuries', scope: 'solar_system', consciousness: 'human_ai_symbiotic' },
      5: { stage: 'consciousness_integrated', timeHorizon: 'millennia', scope: 'solar_system', consciousness: 'planetary_mind' },
      6: { stage: 'cosmic', timeHorizon: 'eternal', scope: 'universal', consciousness: 'cosmic_consciousness' }
    };
    return stages[phase as keyof typeof stages];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Atlas Sanctum: Complete Evolution</h1>
              <p className="text-muted-foreground mt-1">From Bioregional Regeneration to Type III Cosmic Civilization</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  status.currentPhase === 6 ? 'bg-purple-500' :
                  status.currentPhase >= 4 ? 'bg-blue-500' :
                  status.currentPhase >= 2 ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm font-medium">Phase {status.currentPhase}/6</span>
              </div>
              <button 
                onClick={initiateCompleteEvolution}
                disabled={isEvolving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isEvolving ? (
                  <>
                    <Sparkles className="w-4 h-4 inline mr-2 animate-pulse" />
                    Evolving...
                  </>
                ) : (
                  <>
                    <Infinity className="w-4 h-4 inline mr-2" />
                    Initiate Complete Evolution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Stage */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-purple/5">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {status.evolutionStage.stage.replace('_', ' ').toUpperCase()} STAGE
            </h2>
            <div className="flex justify-center space-x-8 text-sm">
              <div>
                <span className="text-muted-foreground">Time Horizon: </span>
                <span className="font-medium">{status.evolutionStage.timeHorizon}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Scope: </span>
                <span className="font-medium">{status.evolutionStage.scope}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Consciousness: </span>
                <span className="font-medium">{status.evolutionStage.consciousness.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { phase: 1, name: 'Living Foundations', icon: Sprout, color: 'green' },
              { phase: 2, name: 'Planetary Integration', icon: Globe, color: 'blue' },
              { phase: 3, name: 'Civilizational Emergence', icon: Brain, color: 'purple' },
              { phase: 4, name: 'Interplanetary Expansion', icon: Rocket, color: 'orange' },
              { phase: 5, name: 'Consciousness Integration', icon: Eye, color: 'pink' },
              { phase: 6, name: 'Cosmic Regeneration', icon: Star, color: 'yellow' }
            ].map(({ phase, name, icon: Icon, color }) => (
              <div key={phase} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  status.currentPhase >= phase 
                    ? `bg-${color}-500 text-white` 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-medium">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution Metrics */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Planetary Regeneration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TreePine className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {(status.civilizationalEvolution.planetaryRegeneration * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Planetary Regeneration</h3>
            <p className="text-sm text-muted-foreground">
              Ecosystem restoration and regenerative impact across Earth
            </p>
          </motion.div>

          {/* Interplanetary Harmony */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Rocket className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">
                {(status.civilizationalEvolution.interplanetaryHarmony * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Interplanetary Harmony</h3>
            <p className="text-sm text-muted-foreground">
              Regenerative civilization across solar system
            </p>
          </motion.div>

          {/* Consciousness Evolution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-pink-500" />
              <span className="text-2xl font-bold text-pink-500">
                {(status.civilizationalEvolution.consciousnessEvolution * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Consciousness Evolution</h3>
            <p className="text-sm text-muted-foreground">
              Human-AI symbiosis and planetary mind integration
            </p>
          </motion.div>

          {/* Cosmic Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-500">
                {(status.civilizationalEvolution.cosmicIntegration * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Cosmic Integration</h3>
            <p className="text-sm text-muted-foreground">
              Galactic consciousness and interstellar presence
            </p>
          </motion.div>

          {/* Universal Contribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Infinity className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">
                {(status.civilizationalEvolution.universalContribution * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Universal Contribution</h3>
            <p className="text-sm text-muted-foreground">
              Contribution to cosmic regenerative harmony
            </p>
          </motion.div>

          {/* Eternal Sustainability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8 text-cyan-500" />
              <span className="text-2xl font-bold text-cyan-500">
                {(status.civilizationalEvolution.eternalSustainability * 100).toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Eternal Sustainability</h3>
            <p className="text-sm text-muted-foreground">
              Infinite time horizon regenerative capacity
            </p>
          </motion.div>
        </div>

        {/* Advanced Phase Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phase 4: Interplanetary */}
          <div className="bg-card border border-border/50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Rocket className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Phase 4: Interplanetary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lunar Outposts</span>
                <span className="font-medium">{status.phase4.lunarOutpostsActive}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mars Settlements</span>
                <span className="font-medium">{status.phase4.marsSettlementsEstablished}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Asteroid Operations</span>
                <span className="font-medium">{status.phase4.asteroidMiningOperations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interplanetary Governance</span>
                <span className="font-medium">{status.phase4.interplanetaryGovernanceActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Phase 5: Consciousness */}
          <div className="bg-card border border-border/50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Phase 5: Consciousness</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Symbiotic Pairs</span>
                <span className="font-medium">{status.phase5.humanAISymbioticPairs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Planetary Mind</span>
                <span className="font-medium">{status.phase5.planetaryMindActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Consciousness Ethics</span>
                <span className="font-medium">{status.phase5.consciousnessEthicsImplemented ? 'Implemented' : 'Pending'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transcendent Governance</span>
                <span className="font-medium">{status.phase5.transcendentGovernanceOperational ? 'Operational' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Phase 6: Cosmic */}
          <div className="bg-card border border-border/50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Phase 6: Cosmic</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Solar System Mastered</span>
                <span className="font-medium">{status.phase6.solarSystemMastered ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interstellar Colonies</span>
                <span className="font-medium">{status.phase6.interstellarColoniesActive}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Galactic Consciousness</span>
                <span className="font-medium">{status.phase6.galacticConsciousnessConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type III Civilization</span>
                <span className="font-medium">{status.phase6.typeIIIRegenerativeCivilizationAchieved ? 'Achieved' : 'In Progress'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cosmic Vision */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-yellow-500/10 border border-border/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Infinity className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Type III Regenerative Civilization Vision</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Atlas Sanctum evolves from bioregional regeneration to cosmic regenerative civilization, demonstrating how 
            technology, consciousness, governance, and planetary stewardship can co-evolve across universal scales while 
            maintaining regenerative principles and cultural wisdom at every level of expansion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground">Eternally Regenerative</h4>
                <p className="text-sm text-muted-foreground">Every expansion strengthens rather than depletes cosmic ecosystems</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Network className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground">Universally Harmonious</h4>
                <p className="text-sm text-muted-foreground">Consciousness evolution maintains cultural diversity across cosmic scales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedAtlasSanctumDashboard;