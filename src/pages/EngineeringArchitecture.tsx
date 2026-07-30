import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const EngineeringArchitecture = () => {
  const [activeLayer, setActiveLayer] = useState('foundation');
  const [selectedMetric, setSelectedMetric] = useState('consensus');

  const layers = {
    foundation: { name: 'Protocol & Systems', color: 'red', icon: '🏗️' },
    economic: { name: 'Smart Contract & Economic', color: 'emerald', icon: '🎯' },
    ai: { name: 'AI & Data', color: 'blue', icon: '🧠' },
    iot: { name: 'IoT & Sensing', color: 'purple', icon: '🛰️' },
    platform: { name: 'Platform & Reliability', color: 'orange', icon: '☁️' },
    security: { name: 'Security & Adversarial', color: 'red', icon: '🛡️' },
    interface: { name: 'Interface & Ethics', color: 'green', icon: '🎨' },
    civilizational: { name: 'Civilizational Integrators', color: 'gradient', icon: '🌌' }
  };

  const metrics = {
    consensus: { value: '99.97%', label: 'Byzantine Fault Tolerance', trend: '+0.03%' },
    latency: { value: '47ms', label: 'Cross-Chain Settlement', trend: '-12ms' },
    throughput: { value: '847K', label: 'TPS Sustained', trend: '+23%' },
    uptime: { value: '99.99%', label: 'Multi-Cloud Availability', trend: '+0.01%' },
    security: { value: '0', label: 'Critical Vulnerabilities', trend: 'Maintained' },
    coverage: { value: '94.7%', label: 'Global Sensor Coverage', trend: '+2.1%' }
  };

  return (
    <Layout>
      <div className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">⚡</div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Engineering Architecture
            </h1>
            <p className="text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Civilizational-scale engineering for regenerative systems. Building invariants, not features.
              Designing for graceful degradation across wars, outages, and network partitions.
            </p>
          </div>

          {/* Real-Time Metrics Dashboard */}
          <div className="mb-20">
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8 text-center">🔥 Live System Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Object.entries(metrics).map(([key, metric]) => (
                  <div 
                    key={key}
                    className={`bg-slate-800/50 p-4 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                      selectedMetric === key ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    onClick={() => setSelectedMetric(key)}
                  >
                    <div className="text-2xl font-bold text-emerald-400">{metric.value}</div>
                    <div className="text-sm text-slate-400 mb-2">{metric.label}</div>
                    <div className="text-xs text-emerald-500">{metric.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Layer Navigator */}
          <div className="mb-20">
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8 text-center">🎛️ Architecture Layers</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {Object.entries(layers).map(([key, layer]) => (
                  <button
                    key={key}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeLayer === key 
                        ? `bg-${layer.color}-500/20 text-${layer.color}-400 ring-2 ring-${layer.color}-500` 
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setActiveLayer(key)}
                  >
                    {layer.icon} {layer.name}
                  </button>
                ))}
              </div>
              <div className="text-center text-slate-400">
                Click layers above to explore detailed implementations
              </div>
            </div>
          </div>

          {/* Foundation Layer - Enhanced */}
          {activeLayer === 'foundation' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-3xl">🏗️</div>
                  <div>
                    <h2 className="text-4xl font-bold text-red-400">Foundation: Protocol & Systems Engineers</h2>
                    <p className="text-xl text-slate-400">Think in invariants, not features. Design rules that never break.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-red-400 mb-4">Distributed Systems</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Consensus algorithms (PBFT, Raft)</li>
                      <li>• Fault tolerance design</li>
                      <li>• Network partition handling</li>
                      <li>• Byzantine failure recovery</li>
                    </ul>
                    <div className="text-sm text-emerald-400">99.97% Byzantine fault tolerance</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-red-400 mb-4">Blockchain Protocol</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Zero-knowledge proofs</li>
                      <li>• Identity primitives</li>
                      <li>• Cryptographic guarantees</li>
                      <li>• State machine design</li>
                    </ul>
                    <div className="text-sm text-emerald-400">47ms cross-chain settlement</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-red-400 mb-4">Cryptography</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Multi-party computation</li>
                      <li>• Homomorphic encryption</li>
                      <li>• Threshold signatures</li>
                      <li>• Privacy-preserving proofs</li>
                    </ul>
                    <div className="text-sm text-emerald-400">256-bit quantum-resistant</div>
                  </div>
                </div>

                {/* Technical Deep Dive */}
                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-red-400 mb-6">🔬 Technical Implementation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-slate-300 mb-4">Consensus Protocol Stack</h4>
                      <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm">
                        <div className="text-emerald-400">// Hybrid Consensus Implementation</div>
                        <div className="text-slate-300">class RegenerativeConsensus {`{`}</div>
                        <div className="text-slate-300 ml-4">pbft: PracticalByzantineFT</div>
                        <div className="text-slate-300 ml-4">raft: RaftConsensus</div>
                        <div className="text-slate-300 ml-4">zkProofs: ZKSNARKValidator</div>
                        <div className="text-slate-300">{`}`}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-300 mb-4">Invariant Guarantees</h4>
                      <ul className="space-y-2 text-slate-300">
                        <li>• <span className="text-emerald-400">Safety:</span> No conflicting states</li>
                        <li>• <span className="text-blue-400">Liveness:</span> Progress guaranteed</li>
                        <li>• <span className="text-purple-400">Availability:</span> 99.99% uptime</li>
                        <li>• <span className="text-orange-400">Consistency:</span> Global state sync</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Layer - Enhanced */}
          {activeLayer === 'economic' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl">🎯</div>
                  <div>
                    <h2 className="text-4xl font-bold text-emerald-400">Smart Contract & Economic Engineers</h2>
                    <p className="text-xl text-slate-400">Economists with compilers. Mechanism design at scale.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4">Mechanism Design</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Game theory implementation</li>
                      <li>• Incentive alignment protocols</li>
                      <li>• Anti-gaming mechanisms</li>
                      <li>• Economic security models</li>
                    </ul>
                    <div className="text-sm text-emerald-400">Nash equilibrium verified</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4">Regenerative Logic</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Carbon tokens (ungameable)</li>
                      <li>• Impact bonds (speculation-resistant)</li>
                      <li>• DAOs (capture-resistant)</li>
                      <li>• Value flow optimization</li>
                    </ul>
                    <div className="text-sm text-emerald-400">$2.4B locked value</div>
                  </div>
                </div>

                {/* Economic Models */}
                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-6">💰 Economic Architecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/30 p-6 rounded-xl">
                      <h4 className="text-lg font-bold text-emerald-400 mb-4">Token Economics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">RIU Supply</span>
                          <span className="text-emerald-400">24.5M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Staking APY</span>
                          <span className="text-emerald-400">12.4%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Burn Rate</span>
                          <span className="text-emerald-400">2.1%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/30 p-6 rounded-xl">
                      <h4 className="text-lg font-bold text-blue-400 mb-4">Bonding Curves</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Base Price</span>
                          <span className="text-blue-400">$25</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Price</span>
                          <span className="text-blue-400">$67</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Price Elasticity</span>
                          <span className="text-blue-400">0.73</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/30 p-6 rounded-xl">
                      <h4 className="text-lg font-bold text-purple-400 mb-4">Governance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Proposals</span>
                          <span className="text-purple-400">847</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Participation</span>
                          <span className="text-purple-400">73.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Quorum</span>
                          <span className="text-purple-400">67%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI & Data Layer - Enhanced */}
          {activeLayer === 'ai' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">🧠</div>
                  <div>
                    <h2 className="text-4xl font-bold text-blue-400">AI & Data Engineers</h2>
                    <p className="text-xl text-slate-400">Planetary-scale intelligence. Truth from uncertainty.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">ML Infrastructure</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Distributed training</li>
                      <li>• Model versioning</li>
                      <li>• A/B testing frameworks</li>
                      <li>• Feature stores</li>
                    </ul>
                    <div className="text-sm text-emerald-400">847K models deployed</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">Oracles & Forecasting</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Anomaly detection</li>
                      <li>• Causal inference</li>
                      <li>• Uncertainty quantification</li>
                      <li>• Multi-source validation</li>
                    </ul>
                    <div className="text-sm text-emerald-400">94.7% accuracy</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">Epistemology</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Knowledge representation</li>
                      <li>• Confidence intervals</li>
                      <li>• Bias detection</li>
                      <li>• Truth consensus</li>
                    </ul>
                    <div className="text-sm text-emerald-400">95% confidence intervals</div>
                  </div>
                </div>

                {/* AI Pipeline Visualization */}
                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-blue-400 mb-6">🤖 AI Processing Pipeline</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">📡</div>
                      <div className="text-sm font-bold">Data Ingestion</div>
                      <div className="text-xs text-slate-400">2.4TB/day</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🧹</div>
                      <div className="text-sm font-bold">Data Cleaning</div>
                      <div className="text-xs text-slate-400">97.3% quality</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm font-bold">Model Training</div>
                      <div className="text-xs text-slate-400">847 models</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🔮</div>
                      <div className="text-sm font-bold">Predictions</div>
                      <div className="text-xs text-slate-400">94.7% accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IoT & Sensing Layer */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl">🛰️</div>
                <div>
                  <h2 className="text-4xl font-bold text-purple-400">IoT, Geospatial & Remote Sensing</h2>
                  <p className="text-xl text-slate-400">Bridge silicon and soil. Make the planet legible to machines.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-purple-400 mb-4">Sensor Networks</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Edge device orchestration</li>
                    <li>• Sensor calibration protocols</li>
                    <li>• Signal integrity validation</li>
                    <li>• Real-time ingestion pipelines</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-purple-400 mb-4">Satellite Integration</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Multi-spectral analysis</li>
                    <li>• Temporal change detection</li>
                    <li>• Ground truth correlation</li>
                    <li>• Atmospheric correction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Platform & Reliability Layer */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-3xl">☁️</div>
                <div>
                  <h2 className="text-4xl font-bold text-orange-400">Cloud, Platform & Reliability</h2>
                  <p className="text-xl text-slate-400">Graceful degradation, not uptime theater. Plan for wars and outages.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-orange-400 mb-4">Multi-Cloud Architecture</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Cross-cloud failover</li>
                    <li>• Data sovereignty compliance</li>
                    <li>• Edge compute distribution</li>
                    <li>• Latency optimization</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-orange-400 mb-4">Site Reliability</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Chaos engineering</li>
                    <li>• Circuit breakers</li>
                    <li>• Load shedding</li>
                    <li>• Observability stack</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-orange-400 mb-4">Disaster Recovery</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Network partition tolerance</li>
                    <li>• Regulation shift adaptation</li>
                    <li>• War-time operations</li>
                    <li>• Data replication strategies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Adversarial Layer */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center text-3xl">🛡️</div>
                <div>
                  <h2 className="text-4xl font-bold text-red-400">Security, Privacy & Adversarial</h2>
                  <p className="text-xl text-slate-400">Think like attackers. Nation-states, cartels, and governance capture.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-red-400 mb-4">Threat Modeling</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Nation-state adversaries</li>
                    <li>• Financial cartel attacks</li>
                    <li>• Data poisoning defense</li>
                    <li>• Oracle manipulation prevention</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-red-400 mb-4">Zero-Trust Architecture</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Identity verification</li>
                    <li>• Least privilege access</li>
                    <li>• Continuous monitoring</li>
                    <li>• Governance capture resistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Interface & Ethics Layer */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-3xl">🎨</div>
                <div>
                  <h2 className="text-4xl font-bold text-green-400">Product & Interface Engineers</h2>
                  <p className="text-xl text-slate-400">Ethical literacy. Dashboards shape behavior. Design shapes reality.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-green-400 mb-4">Ethical Interface Design</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Behavioral impact analysis</li>
                    <li>• Complexity without lies</li>
                    <li>• Cognitive load optimization</li>
                    <li>• Accessibility compliance</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-green-400 mb-4">Human-Planetary Interface</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Multi-scale visualization</li>
                    <li>• Uncertainty representation</li>
                    <li>• Cultural context adaptation</li>
                    <li>• Decision support systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Civilizational Integrators - Enhanced */}
          {activeLayer === 'civilizational' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl border-2 border-gradient-to-r from-emerald-500 to-purple-600">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center text-3xl">🌌</div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                      Civilizational Integrators
                    </h2>
                    <p className="text-xl text-slate-400">Systems philosophers with GitHub accounts. Connective tissue across domains.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/20 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4">Cross-Domain Fluency</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• AI + Ethics integration</li>
                      <li>• Finance + Ecology synthesis</li>
                      <li>• Governance + Code alignment</li>
                      <li>• Culture + Technology bridge</li>
                    </ul>
                    <div className="text-sm text-emerald-400">12 domain intersections</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">Systems Thinking</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Feedback loop analysis</li>
                      <li>• Emergent behavior prediction</li>
                      <li>• Unintended consequence modeling</li>
                      <li>• Long-term stability design</li>
                    </ul>
                    <div className="text-sm text-blue-400">847 feedback loops mapped</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-purple-400 mb-4">Regenerative Alignment</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Intelligence → Regeneration</li>
                      <li>• Power → Stewardship</li>
                      <li>• Capital → Life-serving</li>
                      <li>• Legacy system design</li>
                    </ul>
                    <div className="text-sm text-purple-400">25-year stability horizon</div>
                  </div>
                </div>

                {/* Integration Matrix */}
                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent mb-6">
                    🔗 Integration Matrix
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🧠</div>
                      <div className="text-sm font-bold">AI Ethics</div>
                      <div className="text-xs text-emerald-400">94% alignment</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">💰</div>
                      <div className="text-sm font-bold">Regen Finance</div>
                      <div className="text-xs text-blue-400">$2.4B aligned</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🏛️</div>
                      <div className="text-sm font-bold">Code Governance</div>
                      <div className="text-xs text-purple-400">73% participation</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🌍</div>
                      <div className="text-sm font-bold">Cultural Tech</div>
                      <div className="text-xs text-orange-400">45 languages</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Engineering Challenge - Enhanced */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl bg-gradient-to-r from-slate-900/50 to-emerald-900/20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-6 text-emerald-400">The Core Engineering Challenge</h2>
                <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  "The hardest engineering problem isn't blockchain or AI. It's ensuring that intelligence, 
                  power, and capital compound toward regeneration instead of extraction—even when the 
                  original builders are gone."
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-800/30 p-8 rounded-xl">
                  <h4 className="text-2xl font-bold text-emerald-400 mb-4">Engineering for Eternity</h4>
                  <ul className="space-y-3 text-slate-300">
                    <li>• Self-sustaining incentive structures</li>
                    <li>• Anti-corruption mechanisms</li>
                    <li>• Evolutionary adaptation protocols</li>
                    <li>• Regenerative value preservation</li>
                  </ul>
                </div>
                <div className="bg-slate-800/30 p-8 rounded-xl">
                  <h4 className="text-2xl font-bold text-blue-400 mb-4">Beyond Code Substrates</h4>
                  <ul className="space-y-3 text-slate-300">
                    <li>• Incentive architecture</li>
                    <li>• Narrative engineering</li>
                    <li>• Trust infrastructure</li>
                    <li>• Temporal design patterns</li>
                  </ul>
                </div>
              </div>

              {/* Engineering Principles */}
              <div className="bg-slate-900/50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-emerald-400 mb-6">🎯 Core Engineering Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">⚙️</div>
                    <h4 className="font-bold text-emerald-400 mb-2">Invariant Design</h4>
                    <p className="text-sm text-slate-400">Rules that never break, even under extreme conditions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🔄</div>
                    <h4 className="font-bold text-blue-400 mb-2">Graceful Degradation</h4>
                    <p className="text-sm text-slate-400">Systems that fail safely and recover automatically</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌱</div>
                    <h4 className="font-bold text-purple-400 mb-2">Regenerative Alignment</h4>
                    <p className="text-sm text-slate-400">Every component serves life and planetary health</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">♾️</div>
                    <h4 className="font-bold text-orange-400 mb-2">Temporal Resilience</h4>
                    <p className="text-sm text-slate-400">Designed to outlast the original builders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Engineering Team Structure */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl">
              <h2 className="text-4xl font-bold mb-8 text-center">👥 Engineering Team Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-red-400 mb-4">Protocol Engineers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team Size</span>
                      <span className="text-red-400">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Experience</span>
                      <span className="text-red-400">8.4 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">PhD Rate</span>
                      <span className="text-red-400">67%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-emerald-400 mb-4">Economic Engineers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team Size</span>
                      <span className="text-emerald-400">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Experience</span>
                      <span className="text-emerald-400">6.7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Econ PhD Rate</span>
                      <span className="text-emerald-400">75%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-blue-400 mb-4">AI Engineers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team Size</span>
                      <span className="text-blue-400">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Experience</span>
                      <span className="text-blue-400">5.2 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ML PhD Rate</span>
                      <span className="text-blue-400">42%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  <h4 className="text-lg font-bold text-purple-400 mb-4">Integrators</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team Size</span>
                      <span className="text-purple-400">6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Experience</span>
                      <span className="text-purple-400">12.1 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cross-Domain</span>
                      <span className="text-purple-400">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link 
              to="/innovations" 
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              ← Critical Innovations
            </Link>
            <Link 
              to="/end-to-end-experience" 
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              End-to-End Experience →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EngineeringArchitecture;