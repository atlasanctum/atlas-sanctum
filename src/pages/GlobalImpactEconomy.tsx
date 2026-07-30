import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const GlobalImpactEconomy = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-8xl font-black text-emerald-500 mb-4">05</div>
          <h1 className="text-6xl font-black mb-6">GLOBAL IMPACT ECONOMY</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Regenerative Financial Flows</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Enable financial flows supporting regenerative businesses through impact investing, DeFi, and microfinance.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">$4.2B</div>
            <div className="text-sm text-slate-400">Value Generated</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">156K</div>
            <div className="text-sm text-slate-400">Active Investors</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-purple-400 mb-2">8.7%</div>
            <div className="text-sm text-slate-400">Average Returns</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-amber-400 mb-2">2,847</div>
            <div className="text-sm text-slate-400">Funded Projects</div>
          </div>
        </div>

        {/* Core Components */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "Impact Marketplace",
              icon: "🏪",
              description: "Comprehensive marketplace for regenerative investments, connecting capital with verified impact projects.",
              features: ["Project listings", "Due diligence reports", "Impact verification", "Investor matching"]
            },
            {
              title: "Sustainable Finance",
              icon: "💰",
              description: "Traditional and innovative financing mechanisms designed for long-term regenerative impact.",
              features: ["Green bonds", "Blended finance", "Patient capital", "Impact measurement"]
            },
            {
              title: "Microfinance Platform",
              icon: "🏦",
              description: "Accessible microfinance solutions for small-scale regenerative projects and community initiatives.",
              features: ["Micro-loans", "Community lending", "Mobile payments", "Financial inclusion"]
            },
            {
              title: "DeFi Integration",
              icon: "⚡",
              description: "Decentralized finance protocols enabling automated, transparent, and efficient impact investing.",
              features: ["Yield farming", "Liquidity pools", "Automated market makers", "Governance tokens"]
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

        {/* Investment Opportunities */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Investment Opportunities</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                type: "Regenerative Agriculture",
                funding: "$1.2B",
                projects: 847,
                returns: "9.2%",
                risk: "Medium",
                description: "Sustainable farming practices that restore soil health and biodiversity",
                examples: ["Organic farming", "Agroforestry", "Rotational grazing", "Precision agriculture"]
              },
              {
                type: "Renewable Energy",
                funding: "$1.8B",
                projects: 623,
                returns: "8.5%",
                risk: "Low",
                description: "Clean energy projects reducing carbon emissions and providing energy access",
                examples: ["Solar installations", "Wind farms", "Hydroelectric", "Energy storage"]
              },
              {
                type: "Ecosystem Restoration",
                funding: "$1.2B",
                projects: 1377,
                returns: "7.8%",
                risk: "Medium-High",
                description: "Large-scale restoration of forests, wetlands, and marine ecosystems",
                examples: ["Reforestation", "Wetland restoration", "Coral reef recovery", "Habitat creation"]
              }
            ].map((opportunity, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-2xl font-bold text-emerald-500 mb-4">{opportunity.type}</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{opportunity.funding}</div>
                    <div className="text-xs text-slate-400">Total Funding</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{opportunity.projects}</div>
                    <div className="text-xs text-slate-400">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-400">{opportunity.returns}</div>
                    <div className="text-xs text-slate-400">Avg Returns</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${
                      opportunity.risk === 'Low' ? 'text-green-400' :
                      opportunity.risk === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>{opportunity.risk}</div>
                    <div className="text-xs text-slate-400">Risk Level</div>
                  </div>
                </div>
                <p className="text-slate-400 mb-4 text-sm">{opportunity.description}</p>
                <div className="space-y-1">
                  {opportunity.examples.map((example, j) => (
                    <div key={j} className="text-xs text-slate-500">• {example}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Bonds */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Regenerative Impact Bonds</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  type: "5-Year Green",
                  coupon: "3.8%",
                  term: "5 years",
                  available: "$50M",
                  minInvestment: "$1,000",
                  focus: "Renewable energy and efficiency projects"
                },
                {
                  type: "10-Year Blue",
                  coupon: "5.2%",
                  term: "10 years",
                  available: "$30M",
                  minInvestment: "$5,000",
                  focus: "Ocean and marine ecosystem restoration"
                },
                {
                  type: "Perpetual Impact",
                  coupon: "6.5%",
                  term: "Perpetual",
                  available: "$20M",
                  minInvestment: "$25,000",
                  focus: "Long-term regenerative agriculture"
                },
                {
                  type: "Community Bond",
                  coupon: "4.5%",
                  term: "7 years",
                  available: "$15M",
                  minInvestment: "$100",
                  focus: "Local community development projects"
                }
              ].map((bond, i) => (
                <div key={i} className="bg-slate-800/50 p-6 rounded-lg text-center">
                  <h4 className="text-lg font-bold text-emerald-500 mb-4">{bond.type}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-white">{bond.coupon}</div>
                      <div className="text-xs text-slate-400">Annual Coupon</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-400">{bond.term}</div>
                      <div className="text-xs text-slate-400">Maturity</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-400">{bond.available}</div>
                      <div className="text-xs text-slate-400">Available</div>
                    </div>
                    <div>
                      <div className="text-sm text-amber-400">{bond.minInvestment}</div>
                      <div className="text-xs text-slate-400">Min Investment</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">{bond.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DeFi Protocols */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">DeFi Integration</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-6">Yield Farming Pools</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                  <div>
                    <div className="text-emerald-400 font-semibold">RIU-ETH Pool</div>
                    <div className="text-sm text-slate-400">Regenerative Impact Units</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">12.4% APY</div>
                    <div className="text-xs text-emerald-400">$2.3M TVL</div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                  <div>
                    <div className="text-blue-400 font-semibold">CARBON-USDC Pool</div>
                    <div className="text-sm text-slate-400">Carbon Credit Tokens</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">8.7% APY</div>
                    <div className="text-xs text-blue-400">$1.8M TVL</div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                  <div>
                    <div className="text-purple-400 font-semibold">REGEN-DAI Pool</div>
                    <div className="text-sm text-slate-400">Regenerative Governance</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">15.2% APY</div>
                    <div className="text-xs text-purple-400">$1.1M TVL</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-6">Governance Tokens</h4>
              <div className="space-y-4">
                <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                  <div className="text-emerald-400 font-semibold mb-2">ATLAS Token</div>
                  <div className="text-sm text-slate-400 mb-2">Platform governance and staking rewards</div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Price:</span>
                    <span className="text-xs text-emerald-400">$4.27 (+8.3%)</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <div className="text-blue-400 font-semibold mb-2">REGEN Token</div>
                  <div className="text-sm text-slate-400 mb-2">Regenerative project funding votes</div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Price:</span>
                    <span className="text-xs text-blue-400">$1.89 (+12.1%)</span>
                  </div>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">IMPACT Token</div>
                  <div className="text-sm text-slate-400 mb-2">Impact measurement and verification</div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Price:</span>
                    <span className="text-xs text-purple-400">$0.73 (+5.7%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Microfinance */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Microfinance Impact</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                metric: "Active Borrowers",
                value: "89,400",
                change: "+23%",
                description: "Small-scale farmers and entrepreneurs"
              },
              {
                metric: "Average Loan",
                value: "$847",
                change: "+8%",
                description: "Accessible financing for regenerative projects"
              },
              {
                metric: "Repayment Rate",
                value: "97.3%",
                change: "+1.2%",
                description: "High success rate with community support"
              },
              {
                metric: "Impact Score",
                value: "8.7/10",
                change: "+0.4",
                description: "Measured environmental and social impact"
              }
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400 mb-2">{stat.metric}</div>
                <div className="text-xs text-emerald-400 mb-3">{stat.change} vs last year</div>
                <div className="text-xs text-slate-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Join the Impact Economy</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Invest in regenerative projects that generate both financial returns and positive environmental impact.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/marketplace" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Start Investing
              </Link>
              <Link to="/ethical-governance" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                ← Back to Layer 1
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default GlobalImpactEconomy;