import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const BusinessModel = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">BUSINESS MODEL</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Trillion-Dollar Regenerative Economy</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Multi-revenue stream platform capturing value across the entire regenerative ecosystem
          </p>
        </div>

        {/* Revenue Streams */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Revenue Streams</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Transaction Fees",
                revenue: "$184M/year",
                margin: "2.5%",
                description: "Commission on RIU trading, bond sales, and marketplace transactions",
                growth: "+67% YoY"
              },
              {
                title: "SaaS Subscriptions",
                revenue: "$96M/year", 
                margin: "85%",
                description: "Enterprise dashboards, API access, and analytics platforms",
                growth: "+45% YoY"
              },
              {
                title: "Verification Services",
                revenue: "$52M/year",
                margin: "70%", 
                description: "Carbon credit verification, impact auditing, and certification",
                growth: "+89% YoY"
              },
              {
                title: "Data & Analytics",
                revenue: "$38M/year",
                margin: "90%",
                description: "Environmental data licensing, predictive models, and insights",
                growth: "+156% YoY"
              },
              {
                title: "Financial Products",
                revenue: "$127M/year",
                margin: "45%",
                description: "Green bonds, impact loans, and regenerative investment funds",
                growth: "+78% YoY"
              },
              {
                title: "Consulting & Advisory",
                revenue: "$29M/year",
                margin: "65%",
                description: "Sustainability strategy, carbon accounting, and ESG compliance",
                growth: "+34% YoY"
              }
            ].map((stream, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-emerald-500">{stream.title}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{stream.revenue}</div>
                    <div className="text-sm text-emerald-400">{stream.margin} margin</div>
                  </div>
                </div>
                <p className="text-slate-400 mb-4">{stream.description}</p>
                <div className="bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                  <span className="text-emerald-400 font-semibold">{stream.growth}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="glass p-8 rounded-2xl inline-block">
              <div className="text-4xl font-black text-emerald-400 mb-2">$526M</div>
              <div className="text-xl text-white">Total Annual Revenue</div>
              <div className="text-emerald-400 mt-2">68% Gross Margin</div>
            </div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Market Opportunity</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-emerald-400 mb-4">$2.4T</div>
              <div className="text-xl font-bold mb-2">Total Addressable Market</div>
              <div className="text-slate-400">Global carbon & ESG market by 2030</div>
            </div>
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-blue-400 mb-4">$847B</div>
              <div className="text-xl font-bold mb-2">Serviceable Market</div>
              <div className="text-slate-400">Regenerative & nature-based solutions</div>
            </div>
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-purple-400 mb-4">$156B</div>
              <div className="text-xl font-bold mb-2">Obtainable Market</div>
              <div className="text-slate-400">Platform-addressable opportunity</div>
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Customer Segments</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                segment: "Enterprise (Fortune 500)",
                size: "2,500 companies",
                revenue: "$285M/year",
                ltv: "$450K",
                description: "Large corporations with net-zero commitments and ESG mandates"
              },
              {
                segment: "Mid-Market Companies",
                size: "15,000 companies", 
                revenue: "$156M/year",
                ltv: "$85K",
                description: "Growing businesses seeking sustainability solutions and compliance"
              },
              {
                segment: "Financial Institutions",
                size: "850 institutions",
                revenue: "$67M/year",
                ltv: "$280K",
                description: "Banks, funds, and insurers integrating climate risk and green finance"
              },
              {
                segment: "Government & NGOs",
                size: "450 organizations",
                revenue: "$18M/year",
                ltv: "$120K",
                description: "Public sector and nonprofits driving policy and conservation"
              }
            ].map((customer, i) => (
              <div key={i} className="glass p-8 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-emerald-500">{customer.segment}</h4>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{customer.revenue}</div>
                    <div className="text-sm text-slate-400">LTV: {customer.ltv}</div>
                  </div>
                </div>
                <div className="text-slate-400 mb-4">{customer.description}</div>
                <div className="bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                  <span className="text-blue-400 font-semibold">{customer.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Economics */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Unit Economics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-emerald-400 mb-2">$2,450</div>
              <div className="text-sm text-slate-400">Customer Acquisition Cost</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-blue-400 mb-2">$89,500</div>
              <div className="text-sm text-slate-400">Customer Lifetime Value</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">36.5x</div>
              <div className="text-sm text-slate-400">LTV/CAC Ratio</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-amber-400 mb-2">8.2 mo</div>
              <div className="text-sm text-slate-400">Payback Period</div>
            </div>
          </div>
        </div>

        {/* Growth Strategy */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Growth Strategy</h3>
          <div className="space-y-8">
            {[
              {
                phase: "Phase 1: Foundation (2025)",
                target: "$50M ARR",
                focus: "Core platform, enterprise customers, marketplace launch",
                metrics: "500 enterprise clients, 10K projects verified"
              },
              {
                phase: "Phase 2: Scale (2026-2027)", 
                target: "$200M ARR",
                focus: "Global expansion, API ecosystem, financial products",
                metrics: "2,500 enterprise clients, 50K projects, 25 countries"
              },
              {
                phase: "Phase 3: Dominance (2028-2030)",
                target: "$750M ARR", 
                focus: "AI automation, regulatory partnerships, IPO preparation",
                metrics: "10K+ clients, 200K projects, global market leader"
              }
            ].map((phase, i) => (
              <div key={i} className="glass p-8 rounded-2xl">
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  <div>
                    <h4 className="text-xl font-bold text-emerald-500 mb-2">{phase.phase}</h4>
                    <div className="text-2xl font-black text-white">{phase.target}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-slate-400">{phase.focus}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">{phase.metrics}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Competitive Moats</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                moat: "Network Effects",
                strength: "Very Strong",
                description: "More projects attract more buyers; more buyers attract more projects"
              },
              {
                moat: "Data Monopoly", 
                strength: "Strong",
                description: "Proprietary satellite data and IoT sensor network creates barriers"
              },
              {
                moat: "Regulatory Capture",
                strength: "Strong", 
                description: "First-mover advantage in setting industry standards and compliance"
              },
              {
                moat: "Technology IP",
                strength: "Medium",
                description: "AI verification algorithms and blockchain infrastructure patents"
              }
            ].map((advantage, i) => (
              <div key={i} className="glass p-8 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-emerald-500">{advantage.moat}</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    advantage.strength === 'Very Strong' ? 'bg-emerald-500/20 text-emerald-400' :
                    advantage.strength === 'Strong' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {advantage.strength}
                  </div>
                </div>
                <p className="text-slate-400">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Projections */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">5-Year Financial Projections</h3>
          <div className="glass p-8 rounded-2xl overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="py-4 text-slate-400">Metric</th>
                  <th className="py-4 text-center">2025</th>
                  <th className="py-4 text-center">2026</th>
                  <th className="py-4 text-center">2027</th>
                  <th className="py-4 text-center">2028</th>
                  <th className="py-4 text-center">2029</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: "Revenue", values: ["$52M", "$127M", "$284M", "$567M", "$892M"] },
                  { metric: "Gross Margin", values: ["65%", "68%", "71%", "73%", "75%"] },
                  { metric: "EBITDA Margin", values: ["12%", "18%", "25%", "32%", "38%"] },
                  { metric: "Customers", values: ["850", "2.1K", "4.8K", "9.2K", "15.6K"] },
                  { metric: "Employees", values: ["245", "520", "980", "1.6K", "2.4K"] }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-4 font-semibold text-white">{row.metric}</td>
                    {row.values.map((value, j) => (
                      <td key={j} className="py-4 text-center text-emerald-400 font-bold">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Ready to Scale Regeneration?</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Join the trillion-dollar regenerative economy. Partner with us to build the future of sustainable business.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/contact" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Partner With Us
              </Link>
              <Link to="/marketplace" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default BusinessModel;