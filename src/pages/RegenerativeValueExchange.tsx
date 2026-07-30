import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const RegenerativeValueExchange = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-8xl font-black text-emerald-500 mb-4">02</div>
          <h1 className="text-6xl font-black mb-6">REGENERATIVE VALUE EXCHANGE</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Seamless Asset Exchange</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Exchange regenerative assets including carbon credits, ecosystem restoration credits, and cultural preservation funds.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">$1.84B</div>
            <div className="text-sm text-slate-400">Trading Volume</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">24.5M</div>
            <div className="text-sm text-slate-400">RIUs in Circulation</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-purple-400 mb-2">99.9%</div>
            <div className="text-sm text-slate-400">Transaction Success Rate</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-amber-400 mb-2">2.3s</div>
            <div className="text-sm text-slate-400">Average Settlement Time</div>
          </div>
        </div>

        {/* Core Components */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "Blockchain Records",
              icon: "⛓️",
              description: "Immutable ledger recording all transactions with full transparency and cryptographic security.",
              features: ["SHA-256 encryption", "Immutable transaction history", "Multi-signature validation", "Cross-chain compatibility"]
            },
            {
              title: "AI-Powered Oracles",
              icon: "🔮",
              description: "Real-time data feeds from satellites, IoT sensors, and verified sources to ensure accurate pricing.",
              features: ["Satellite data integration", "IoT sensor networks", "Price discovery algorithms", "Anomaly detection"]
            },
            {
              title: "Living Smart Contracts",
              icon: "📜",
              description: "Self-executing contracts that adapt to changing conditions while maintaining security and compliance.",
              features: ["Adaptive logic", "Automated execution", "Compliance checking", "Upgrade mechanisms"]
            },
            {
              title: "RIU Trading",
              icon: "💱",
              description: "Regenerative Impact Units (RIUs) representing verified environmental and social impact.",
              features: ["Impact verification", "Fractional ownership", "Automated retirement", "Impact scoring"]
            }
          ].map((component, i) => (
            <div key={i} className="glass p-8 rounded-2xl hover-lift">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{component.icon}</div>
                <h3 className="text-2xl font-bold text-emerald-500">{component.title}</h3>
              </div>
              <p className="text-slate-400 mb-6">{component.description}</p>
              <div className="space-y-2">
                {component.features.map((feature, j) => (
                  <div key={j} className="bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                    <span className="text-emerald-400 text-sm">• {feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trading Interface */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Live Trading Dashboard</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">$82.10</div>
                <div className="text-sm text-slate-400">Current RIU Price</div>
                <div className="text-xs text-emerald-400">+5.2% (24h)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">156,789</div>
                <div className="text-sm text-slate-400">Daily Volume</div>
                <div className="text-xs text-blue-400">+12.8% vs yesterday</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">2,847</div>
                <div className="text-sm text-slate-400">Active Traders</div>
                <div className="text-xs text-purple-400">+8.3% (7d)</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Recent Transactions</h4>
                <div className="space-y-2">
                  {[
                    { type: "Buy", amount: "1,250 RIU", price: "$82.10", time: "2 min ago" },
                    { type: "Sell", amount: "890 RIU", price: "$82.05", time: "5 min ago" },
                    { type: "Buy", amount: "2,100 RIU", price: "$82.15", time: "8 min ago" }
                  ].map((tx, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                      <div className={`text-sm font-semibold ${tx.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type} {tx.amount}
                      </div>
                      <div className="text-sm text-slate-400">{tx.price}</div>
                      <div className="text-xs text-slate-500">{tx.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Impact Verification</h4>
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="text-emerald-400 font-semibold mb-2">✓ Satellite Verified</div>
                    <div className="text-sm text-slate-400">Real-time forest coverage monitoring</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-semibold mb-2">✓ IoT Confirmed</div>
                    <div className="text-sm text-slate-400">Soil carbon measurements validated</div>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 font-semibold mb-2">✓ Community Approved</div>
                    <div className="text-sm text-slate-400">Local stakeholder consensus achieved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Types */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Tradeable Assets</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                type: "Carbon Credits",
                icon: "🌱",
                volume: "$847M",
                description: "Verified CO₂ removal and avoidance credits",
                examples: ["Forest restoration", "Renewable energy", "Soil sequestration", "Ocean blue carbon"]
              },
              {
                type: "Biodiversity Credits",
                icon: "🦋",
                volume: "$523M",
                description: "Ecosystem restoration and species protection",
                examples: ["Habitat restoration", "Species reintroduction", "Pollinator corridors", "Marine sanctuaries"]
              },
              {
                type: "Cultural Preservation",
                icon: "🏛️",
                volume: "$467M",
                description: "Indigenous knowledge and cultural heritage",
                examples: ["Traditional practices", "Sacred site protection", "Language preservation", "Artisan support"]
              }
            ].map((asset, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{asset.icon}</div>
                  <h4 className="text-2xl font-bold text-emerald-500">{asset.type}</h4>
                  <div className="text-xl font-bold text-white mt-2">{asset.volume}</div>
                  <div className="text-sm text-slate-400">Annual Volume</div>
                </div>
                <p className="text-slate-400 mb-4">{asset.description}</p>
                <div className="space-y-2">
                  {asset.examples.map((example, j) => (
                    <div key={j} className="text-sm text-slate-400">• {example}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Start Trading</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Join the regenerative economy. Trade verified impact assets and contribute to global restoration efforts.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/marketplace" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Open Trading Account
              </Link>
              <Link to="/data-metrics-engine" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                Next Layer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default RegenerativeValueExchange;