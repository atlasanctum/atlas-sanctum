import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const RVXInnovations = () => {
  const [activeInnovation, setActiveInnovation] = useState('craft');

  const innovations = {
    craft: {
      number: '1️⃣',
      title: 'Autonomous Data Intelligence',
      subtitle: 'Beyond CRUD → CRAFT',
      icon: '🌐',
      color: 'emerald',
      transformation: 'From: CRUD → To: CRAFT (Create, Relate, Analyze, Forecast, Transmute)',
      metrics: { efficiency: '340%', lag: '-78%', accuracy: '94.7%' }
    },
    cognitive: {
      number: '2️⃣',
      title: 'Cognitive Finance Layer',
      subtitle: 'Conscious Capital Allocation',
      icon: '🧠',
      color: 'blue',
      transformation: 'From: Rule-based finance → To: Conscious capital allocation',
      metrics: { bias: '-67%', efficiency: '245%', optimization: '89%' }
    },
    interoperable: {
      number: '3️⃣',
      title: 'Interoperable Regenerative Ledgers',
      subtitle: 'Universal Climate Network',
      icon: '🌍',
      color: 'purple',
      transformation: 'From: Isolated blockchain systems → To: Interoperable Climate Ledgers',
      metrics: { networks: '47', trust: '96%', duplication: '-84%' }
    },
    adaptive: {
      number: '4️⃣',
      title: 'Adaptive MRV Ecosystems',
      subtitle: 'MRV-as-a-Service',
      icon: '🌱',
      color: 'green',
      transformation: 'From: Static MRV → To: Adaptive MRV-as-a-Service',
      metrics: { realtime: '99.2%', community: '73%', granularity: '12x' }
    },
    token: {
      number: '5️⃣',
      title: 'Token Engineering',
      subtitle: 'Dynamic Regenerative Incentives',
      icon: '⚖️',
      color: 'orange',
      transformation: 'From: Fixed rewards → To: Dynamic, algorithmic regenerative incentives',
      metrics: { alignment: '91%', bubbles: '-95%', yield: '12.4%' }
    },
    governance: {
      number: '6️⃣',
      title: 'Human–AI Co-Governance',
      subtitle: 'Participatory Decision Ecosystems',
      icon: '🤝',
      color: 'pink',
      transformation: 'From: Centralized governance → To: Participatory, AI-augmented decision ecosystems',
      metrics: { participation: '73.2%', equity: '89%', manipulation: '-97%' }
    },
    twins: {
      number: '7️⃣',
      title: 'Regenerative Digital Twins',
      subtitle: 'Living Ecosystem Simulations',
      icon: '💫',
      color: 'cyan',
      transformation: 'From: Static project dashboards → To: Living digital twins of ecosystems',
      metrics: { visibility: '100%', confidence: '87%', engagement: '234%' }
    },
    quantum: {
      number: '8️⃣',
      title: 'Quantum-Enhanced Finance',
      subtitle: 'Planetary Intelligence Networks',
      icon: '🔮',
      color: 'violet',
      transformation: 'From: Classical computation → To: Quantum optimization of ecological networks',
      metrics: { complexity: '∞', scale: 'Global', integrity: '100%' }
    }
  };

  return (
    <Layout>
      <div className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              RVX Innovations
            </h1>
            <p className="text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              8 Transformative Innovations for the Regenerative Value Exchange.
              From CRUD to CRAFT. From static to living. From extraction to regeneration.
            </p>
          </div>

          {/* Innovation Navigator */}
          <div className="mb-20">
            <div className="glass p-8 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8 text-center">🎯 Innovation Layers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(innovations).map(([key, innovation]) => (
                  <button
                    key={key}
                    className={`p-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                      activeInnovation === key 
                        ? `bg-${innovation.color}-500/20 text-${innovation.color}-400 ring-2 ring-${innovation.color}-500` 
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setActiveInnovation(key)}
                  >
                    <div className="text-2xl mb-2">{innovation.icon}</div>
                    <div className="text-sm">{innovation.number}</div>
                    <div className="text-xs">{innovation.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CRAFT - Autonomous Data Intelligence */}
          {activeInnovation === 'craft' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl">🌐</div>
                  <div>
                    <h2 className="text-4xl font-bold text-emerald-400">1️⃣ Autonomous Data Intelligence</h2>
                    <p className="text-xl text-slate-400">Beyond CRUD → CRAFT (Create, Relate, Analyze, Forecast, Transmute)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4">🔗 AI-Driven Relational Mapping</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• ML models dynamically relate ecological data</li>
                      <li>• Social and economic data integration</li>
                      <li>• Systems-level insights generation</li>
                      <li>• Context-aware data interactions</li>
                    </ul>
                    <div className="text-sm text-emerald-400">340% efficiency increase</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4">🔮 Predictive Modeling Engines</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Climate impact forecasting</li>
                      <li>• Regeneration yield predictions</li>
                      <li>• ROI modeling under conditions</li>
                      <li>• Risk-opportunity analysis</li>
                    </ul>
                    <div className="text-sm text-emerald-400">94.7% forecast accuracy</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-emerald-400 mb-4">⚡ Transmutation Layer</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Raw data → decision signals</li>
                      <li>• Auto-triggering fund disbursement</li>
                      <li>• Capital pool rebalancing</li>
                      <li>• Self-learning ecosystems</li>
                    </ul>
                    <div className="text-sm text-emerald-400">78% lag reduction</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-emerald-400 mb-6">🧬 CRAFT Architecture</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="text-sm font-bold text-emerald-400">CREATE</div>
                      <div className="text-xs text-slate-400">Generate insights</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🔗</div>
                      <div className="text-sm font-bold text-blue-400">RELATE</div>
                      <div className="text-xs text-slate-400">Connect data points</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm font-bold text-purple-400">ANALYZE</div>
                      <div className="text-xs text-slate-400">Extract patterns</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🔮</div>
                      <div className="text-sm font-bold text-orange-400">FORECAST</div>
                      <div className="text-xs text-slate-400">Predict outcomes</div>
                    </div>
                    <div className="text-slate-400">→</div>
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm font-bold text-red-400">TRANSMUTE</div>
                      <div className="text-xs text-slate-400">Execute actions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cognitive Finance Layer */}
          {activeInnovation === 'cognitive' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">🧠</div>
                  <div>
                    <h2 className="text-4xl font-bold text-blue-400">2️⃣ Cognitive Finance Layer</h2>
                    <p className="text-xl text-slate-400">From Rule-based finance → Conscious capital allocation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">🤖 Cognitive Smart Contracts</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Embedded AI clauses</li>
                      <li>• Learning from disbursements</li>
                      <li>• Outcome-based optimization</li>
                      <li>• Ethical decision frameworks</li>
                    </ul>
                    <div className="text-sm text-blue-400">245% efficiency gain</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">📈 Dynamic Impact Scoring</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Continuous recalibration</li>
                      <li>• Verified outcome integration</li>
                      <li>• Multi-dimensional metrics</li>
                      <li>• Real-time adjustments</li>
                    </ul>
                    <div className="text-sm text-blue-400">89% optimization rate</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-blue-400 mb-4">🔄 Autonomous Rebalancing</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Real-time liquidity movement</li>
                      <li>• Highest regenerative ROI focus</li>
                      <li>• Risk-adjusted allocation</li>
                      <li>• Self-correcting mechanisms</li>
                    </ul>
                    <div className="text-sm text-blue-400">67% bias reduction</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-blue-400 mb-6">🧠 AI Steward Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/30 p-6 rounded-xl">
                      <h4 className="text-lg font-bold text-blue-400 mb-4">Capital Allocation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">AI Decisions</span>
                          <span className="text-blue-400">847/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Success Rate</span>
                          <span className="text-blue-400">94.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bias Score</span>
                          <span className="text-green-400">0.03</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/30 p-6 rounded-xl">
                      <h4 className="text-lg font-bold text-emerald-400 mb-4">Impact Optimization</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Projects Optimized</span>
                          <span className="text-emerald-400">2,847</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ROI Improvement</span>
                          <span className="text-emerald-400">+245%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Risk Reduction</span>
                          <span className="text-emerald-400">-67%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/30 p-6 rounded-xl">
                      <h4 className="text-lg font-bold text-purple-400 mb-4">Ethical Compliance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Ethics Score</span>
                          <span className="text-purple-400">97.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Community Consent</span>
                          <span className="text-purple-400">100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Transparency</span>
                          <span className="text-purple-400">Full</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interoperable Regenerative Ledgers */}
          {activeInnovation === 'interoperable' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl">🌍</div>
                  <div>
                    <h2 className="text-4xl font-bold text-purple-400">3️⃣ Interoperable Regenerative Ledgers</h2>
                    <p className="text-xl text-slate-400">The "Swift Network" of regenerative finance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-purple-400 mb-4">🌉 Cross-Chain Bridges</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Carbon token bridges</li>
                      <li>• Biodiversity token transfers</li>
                      <li>• Multi-chain verification</li>
                      <li>• Atomic swaps</li>
                    </ul>
                    <div className="text-sm text-purple-400">47 networks connected</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-purple-400 mb-4">🆔 Universal Impact ID</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Regenerative UUIDs</li>
                      <li>• Cross-platform identity</li>
                      <li>• Impact history tracking</li>
                      <li>• Standardized protocols</li>
                    </ul>
                    <div className="text-sm text-purple-400">96% trust score</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-purple-400 mb-4">📋 Open API Governance</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• TNFD compliance standards</li>
                      <li>• Auditable data frameworks</li>
                      <li>• Regulatory integration</li>
                      <li>• Global interoperability</li>
                    </ul>
                    <div className="text-sm text-purple-400">84% duplication reduction</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-purple-400 mb-6">🌐 Global Network Map</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">⛓️</div>
                      <div className="text-sm font-bold">Ethereum</div>
                      <div className="text-xs text-green-400">Connected</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🔷</div>
                      <div className="text-sm font-bold">Polygon</div>
                      <div className="text-xs text-green-400">Connected</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🌊</div>
                      <div className="text-sm font-bold">Solana</div>
                      <div className="text-xs text-green-400">Connected</div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl text-center">
                      <div className="text-2xl mb-2">🔗</div>
                      <div className="text-sm font-bold">Chainlink</div>
                      <div className="text-xs text-green-400">Connected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantum-Enhanced Finance */}
          {activeInnovation === 'quantum' && (
            <div className="mb-20">
              <div className="glass p-12 rounded-3xl border-2 border-violet-500/30">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-3xl">🔮</div>
                  <div>
                    <h2 className="text-4xl font-bold text-violet-400">8️⃣ Quantum-Enhanced Regenerative Finance</h2>
                    <p className="text-xl text-slate-400">Long-term pivot to planetary intelligence networks</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-violet-400 mb-4">🌡️ Quantum Climate Modeling</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Complex ecosystem modeling</li>
                      <li>• Quantum-assisted allocation</li>
                      <li>• Multi-variable optimization</li>
                      <li>• Planetary-scale insights</li>
                    </ul>
                    <div className="text-sm text-violet-400">∞ complexity handling</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-violet-400 mb-4">🎯 Microproject Optimization</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Thousands of projects</li>
                      <li>• Optimal capital distribution</li>
                      <li>• Quantum algorithms</li>
                      <li>• Global coordination</li>
                    </ul>
                    <div className="text-sm text-violet-400">Global scale achieved</div>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold text-violet-400 mb-4">🔐 Quantum-Secure Ledgers</h4>
                    <ul className="space-y-2 text-slate-300 mb-4">
                      <li>• Long-term data integrity</li>
                      <li>• Post-quantum cryptography</li>
                      <li>• Immutable records</li>
                      <li>• Future-proof security</li>
                    </ul>
                    <div className="text-sm text-violet-400">100% integrity guarantee</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-violet-400 mb-6">⚛️ Quantum Computing Pipeline</h3>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔮</div>
                    <p className="text-lg text-slate-300">
                      "Unlocks complex systems-level insights impossible with classical computation.
                      Ensures RVX scales globally without losing accuracy or trust."
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/30 p-6 rounded-xl text-center">
                      <div className="text-2xl mb-2">🌍</div>
                      <h4 className="font-bold text-violet-400 mb-2">Ecosystem Modeling</h4>
                      <p className="text-sm text-slate-400">Quantum simulation of planetary interdependencies</p>
                    </div>
                    <div className="bg-slate-800/30 p-6 rounded-xl text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-bold text-blue-400 mb-2">Optimization Engine</h4>
                      <p className="text-sm text-slate-400">Quantum algorithms for capital allocation</p>
                    </div>
                    <div className="bg-slate-800/30 p-6 rounded-xl text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <h4 className="font-bold text-emerald-400 mb-2">Security Layer</h4>
                      <p className="text-sm text-slate-400">Post-quantum cryptographic protection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Innovation Summary Table */}
          <div className="mb-20">
            <div className="glass p-12 rounded-3xl">
              <h2 className="text-4xl font-bold mb-8 text-center">🧩 Transformative Innovation Matrix</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-300">Innovation Layer</th>
                      <th className="text-left p-4 text-slate-300">Transformation</th>
                      <th className="text-left p-4 text-slate-300">Operational Value</th>
                      <th className="text-left p-4 text-slate-300">Key Metric</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-emerald-400 font-bold">CRAFT Data Intelligence</td>
                      <td className="p-4 text-slate-300">CRUD → Living data ecosystems</td>
                      <td className="p-4 text-slate-300">Self-learning impact infrastructure</td>
                      <td className="p-4 text-emerald-400">340% efficiency</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-blue-400 font-bold">Cognitive Finance</td>
                      <td className="p-4 text-slate-300">Rule-based → AI capital stewards</td>
                      <td className="p-4 text-slate-300">Ethical, adaptive fund management</td>
                      <td className="p-4 text-blue-400">67% bias reduction</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-purple-400 font-bold">Interoperable Ledgers</td>
                      <td className="p-4 text-slate-300">Isolated → Multi-chain connectivity</td>
                      <td className="p-4 text-slate-300">Universal trust & liquidity</td>
                      <td className="p-4 text-purple-400">47 networks</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-green-400 font-bold">Adaptive MRV</td>
                      <td className="p-4 text-slate-300">Static → Real-time verification</td>
                      <td className="p-4 text-slate-300">Efficiency & community engagement</td>
                      <td className="p-4 text-green-400">99.2% real-time</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-orange-400 font-bold">Token Engineering</td>
                      <td className="p-4 text-slate-300">Fixed → Dynamic incentive design</td>
                      <td className="p-4 text-slate-300">Regenerative economic alignment</td>
                      <td className="p-4 text-orange-400">95% bubble prevention</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-pink-400 font-bold">AI-Co-Governance</td>
                      <td className="p-4 text-slate-300">Centralized → Inclusive digital democracy</td>
                      <td className="p-4 text-slate-300">Transparency & equity</td>
                      <td className="p-4 text-pink-400">73.2% participation</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="p-4 text-cyan-400 font-bold">Digital Twins</td>
                      <td className="p-4 text-slate-300">Static → Immersive ecosystem modeling</td>
                      <td className="p-4 text-slate-300">Visibility & investor trust</td>
                      <td className="p-4 text-cyan-400">234% engagement</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-violet-400 font-bold">Quantum Optimization</td>
                      <td className="p-4 text-slate-300">Classical → Complex systems finance</td>
                      <td className="p-4 text-slate-300">Long-term planetary intelligence</td>
                      <td className="p-4 text-violet-400">∞ complexity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link 
              to="/regenerative-value-exchange" 
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              ← Regenerative Value Exchange
            </Link>
            <Link 
              to="/engineering-architecture" 
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Engineering Architecture →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RVXInnovations;