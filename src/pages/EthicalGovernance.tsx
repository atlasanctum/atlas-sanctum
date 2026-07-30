import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const EthicalGovernance = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-8xl font-black text-emerald-500 mb-4">01</div>
          <h1 className="text-6xl font-black mb-6">INFINITE PURPOSE & ETHICAL GOVERNANCE</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Decentralized AI-Driven Decision Making</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Grounded in universal ethics, ensuring transparent governance through DAO participation and moral AI protocols.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">12,450+</div>
            <div className="text-sm text-slate-400">Active DAO Members</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">67%</div>
            <div className="text-sm text-slate-400">Indigenous Representation</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-purple-400 mb-2">99.7%</div>
            <div className="text-sm text-slate-400">Ethical AI Accuracy</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-amber-400 mb-2">156</div>
            <div className="text-sm text-slate-400">Sacred Sites Protected</div>
          </div>
        </div>

        {/* Core Components */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "Moral AI Protocols",
              icon: "🤖",
              description: "AI systems trained on universal ethical principles, ensuring all decisions align with regenerative values and human dignity.",
              features: ["Ethical decision trees", "Bias detection algorithms", "Value alignment scoring", "Moral reasoning engine"]
            },
            {
              title: "DAO Governance",
              icon: "🗳️",
              description: "Decentralized autonomous organization with quadratic voting, ensuring democratic participation in all major decisions.",
              features: ["Quadratic voting system", "Proposal submission", "Transparent voting records", "Supermajority requirements"]
            },
            {
              title: "Values Engine",
              icon: "💎",
              description: "Core value system that guides all platform decisions, prioritizing regeneration, equity, and long-term thinking.",
              features: ["Regenerative principles", "Equity frameworks", "Long-term optimization", "Cultural sensitivity"]
            },
            {
              title: "Sacred Land Protection",
              icon: "🏔️",
              description: "Special protocols for indigenous lands and sacred sites, ensuring cultural preservation and community consent.",
              features: ["Indigenous consent protocols", "Cultural impact assessment", "Sacred site mapping", "Community benefit sharing"]
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

        {/* Governance Process */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Governance Process</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-5 gap-8 text-center">
              {[
                { step: "1", title: "Proposal", desc: "Community submits proposals" },
                { step: "2", title: "Review", desc: "Ethics Council evaluates" },
                { step: "3", title: "Discussion", desc: "Open community debate" },
                { step: "4", title: "Vote", desc: "Quadratic voting period" },
                { step: "5", title: "Execute", desc: "Smart contract implementation" }
              ].map((phase, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-emerald-400">
                    {phase.step}
                  </div>
                  <h4 className="text-lg font-bold text-white">{phase.title}</h4>
                  <p className="text-sm text-slate-400">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ethics Council */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Bioregional Ethics Councils</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { region: "Americas", members: 12, indigenous: 8, decisions: 247 },
              { region: "Europe/Africa", members: 12, indigenous: 9, decisions: 189 },
              { region: "Asia/Pacific", members: 12, indigenous: 7, decisions: 203 }
            ].map((council, i) => (
              <div key={i} className="glass p-8 rounded-2xl text-center">
                <h4 className="text-2xl font-bold text-emerald-500 mb-4">{council.region}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-white">{council.members}</div>
                    <div className="text-sm text-slate-400">Total Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400">{council.indigenous}</div>
                    <div className="text-sm text-slate-400">Indigenous Leaders</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400">{council.decisions}</div>
                    <div className="text-sm text-slate-400">Decisions Made</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Join the Governance</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Participate in shaping the future of regenerative governance. Your voice matters in building ethical AI and sustainable systems.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/governance" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Join DAO
              </Link>
              <Link to="/regenerative-value-exchange" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                Next Layer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default EthicalGovernance;