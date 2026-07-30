import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const EndToEndExperience = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">END-TO-END USER EXPERIENCE</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Fortune 500 Technology Excellence</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Comprehensive platform architecture inspired by Apple, Google, Microsoft, Amazon, and Tesla's best practices.
          </p>
        </div>

        {/* Fortune 500 Inspirations */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Fortune 500 Inspirations</h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { company: "Apple", focus: "User Experience", inspiration: "Seamless, intuitive design with premium feel" },
              { company: "Google", focus: "AI & Search", inspiration: "Intelligent data processing and discovery" },
              { company: "Microsoft", focus: "Enterprise Scale", inspiration: "Azure-grade infrastructure and security" },
              { company: "Amazon", focus: "Marketplace", inspiration: "Frictionless commerce and logistics" },
              { company: "Tesla", focus: "Innovation", inspiration: "Sustainable technology and automation" }
            ].map((company, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center hover-lift">
                <h4 className="text-lg font-bold text-emerald-500 mb-2">{company.company}</h4>
                <div className="text-sm text-blue-400 mb-3">{company.focus}</div>
                <p className="text-xs text-slate-400">{company.inspiration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Model Excellence */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Business Model Excellence</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-emerald-500 mb-6">Revenue Optimization</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Freemium Model (Spotify/Slack)</div>
                  <div className="text-sm text-slate-400">Free tier with premium features driving conversion</div>
                  <div className="text-emerald-400 text-sm mt-1">$0 → $29/month → $99/month</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Marketplace Commission (Amazon)</div>
                  <div className="text-sm text-slate-400">2.5% transaction fees on carbon credit trades</div>
                  <div className="text-blue-400 text-sm mt-1">$1.84B volume × 2.5% = $46M annual</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">SaaS Subscriptions (Microsoft)</div>
                  <div className="text-sm text-slate-400">Enterprise dashboards and API access</div>
                  <div className="text-purple-400 text-sm mt-1">85% gross margin, $96M ARR</div>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-blue-500 mb-6">Customer Acquisition</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Viral Growth (Tesla Referrals)</div>
                  <div className="text-sm text-slate-400">Impact sharing drives organic user acquisition</div>
                  <div className="text-emerald-400 text-sm mt-1">K-factor: 1.3, 30% organic growth</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Content Marketing (HubSpot)</div>
                  <div className="text-sm text-slate-400">Educational content on regenerative practices</div>
                  <div className="text-blue-400 text-sm mt-1">850K+ students, 40% conversion</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Partnership Channel (Salesforce)</div>
                  <div className="text-sm text-slate-400">NGO and government partnerships</div>
                  <div className="text-purple-400 text-sm mt-1">60% of enterprise deals</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frontend Excellence */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Frontend Excellence</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold text-emerald-500 mb-4">Apple-Inspired Design</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div>• Minimalist, premium interface</div>
                <div>• Consistent design system</div>
                <div>• Micro-interactions and animations</div>
                <div>• Dark mode with glass morphism</div>
                <div>• Accessibility-first approach</div>
              </div>
              <div className="mt-4 text-xs text-emerald-400">React + TypeScript + Tailwind</div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-blue-500 mb-4">Google-Level Performance</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div>• Sub-100ms page load times</div>
                <div>• Progressive Web App (PWA)</div>
                <div>• Edge caching and CDN</div>
                <div>• Lazy loading and code splitting</div>
                <div>• Core Web Vitals optimization</div>
              </div>
              <div className="mt-4 text-xs text-blue-400">Vite + Service Workers + Edge Functions</div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-xl font-bold text-purple-500 mb-4">Mobile-First Experience</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div>• Responsive across all devices</div>
                <div>• Touch-optimized interactions</div>
                <div>• Offline-first functionality</div>
                <div>• Native app performance</div>
                <div>• Biometric authentication</div>
              </div>
              <div className="mt-4 text-xs text-purple-400">React Native + Expo + Capacitor</div>
            </div>
          </div>
        </div>

        {/* API Excellence */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">API Excellence</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-6">GraphQL Federation (Netflix)</h4>
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="text-emerald-400 font-semibold mb-2">Unified API Gateway</div>
                    <div className="text-sm text-slate-400">Single endpoint for all client needs</div>
                    <div className="text-xs text-emerald-400 mt-1">Reduces over-fetching by 60%</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-semibold mb-2">Real-time Subscriptions</div>
                    <div className="text-sm text-slate-400">Live updates for trading and monitoring</div>
                    <div className="text-xs text-blue-400 mt-1">WebSocket + Server-Sent Events</div>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 font-semibold mb-2">Type-Safe Schema</div>
                    <div className="text-sm text-slate-400">Auto-generated TypeScript types</div>
                    <div className="text-xs text-purple-400 mt-1">Zero runtime type errors</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-6">API Performance (Stripe)</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-white font-semibold">Response Time</div>
                      <div className="text-sm text-slate-400">P99 latency</div>
                    </div>
                    <div className="text-emerald-400 font-bold">47ms</div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-white font-semibold">Throughput</div>
                      <div className="text-sm text-slate-400">Requests per second</div>
                    </div>
                    <div className="text-blue-400 font-bold">50K RPS</div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-white font-semibold">Uptime</div>
                      <div className="text-sm text-slate-400">SLA guarantee</div>
                    </div>
                    <div className="text-purple-400 font-bold">99.99%</div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-white font-semibold">Cache Hit Rate</div>
                      <div className="text-sm text-slate-400">Redis + CDN</div>
                    </div>
                    <div className="text-amber-400 font-bold">97.3%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Excellence */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Backend Excellence</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-emerald-500 mb-6">Microservices Architecture (Amazon)</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Service Mesh (Istio)</div>
                  <div className="text-sm text-slate-400">Traffic management, security, observability</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Event-Driven Architecture</div>
                  <div className="text-sm text-slate-400">Apache Kafka for real-time data streaming</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">CQRS + Event Sourcing</div>
                  <div className="text-sm text-slate-400">Complete audit trail and scalability</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Circuit Breakers</div>
                  <div className="text-sm text-slate-400">Fault tolerance and graceful degradation</div>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-blue-500 mb-6">AI/ML Pipeline (Google)</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">MLOps Platform</div>
                  <div className="text-sm text-slate-400">Automated model training and deployment</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Feature Store</div>
                  <div className="text-sm text-slate-400">Centralized feature management</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">Model Serving</div>
                  <div className="text-sm text-slate-400">Real-time inference with auto-scaling</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">A/B Testing</div>
                  <div className="text-sm text-slate-400">Continuous model improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Excellence */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Database Excellence</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">🗄️</div>
              <h4 className="text-xl font-bold text-emerald-500 mb-4">Multi-Model Database</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div>• PostgreSQL for ACID transactions</div>
                <div>• MongoDB for document storage</div>
                <div>• Neo4j for relationship graphs</div>
                <div>• InfluxDB for time-series data</div>
                <div>• Redis for caching and sessions</div>
              </div>
              <div className="mt-4 text-xs text-emerald-400">Polyglot persistence strategy</div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold text-blue-500 mb-4">Global Distribution</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div>• Multi-region replication</div>
                <div>• Read replicas in 6 regions</div>
                <div>• Automatic failover</div>
                <div>• Geo-partitioned data</div>
                <div>• Edge caching layers</div>
              </div>
              <div className="mt-4 text-xs text-blue-400">Sub-50ms global latency</div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-purple-500 mb-4">Security & Compliance</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <div>• Encryption at rest (AES-256)</div>
                <div>• Encryption in transit (TLS 1.3)</div>
                <div>• Row-level security (RLS)</div>
                <div>• Audit logging and monitoring</div>
                <div>• GDPR/CCPA compliance</div>
              </div>
              <div className="mt-4 text-xs text-purple-400">SOC 2 Type II certified</div>
            </div>
          </div>
        </div>

        {/* User Journey Excellence */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Complete User Journey</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-5 gap-8 text-center">
              {[
                { step: "1", title: "Discovery", desc: "SEO-optimized landing, social proof", time: "30s" },
                { step: "2", title: "Onboarding", desc: "Progressive disclosure, guided tour", time: "2min" },
                { step: "3", title: "Activation", desc: "First value in 5 minutes", time: "5min" },
                { step: "4", title: "Engagement", desc: "Personalized dashboard, notifications", time: "Daily" },
                { step: "5", title: "Retention", desc: "Community, achievements, growth", time: "Long-term" }
              ].map((phase, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-emerald-400">
                    {phase.step}
                  </div>
                  <h4 className="text-lg font-bold text-white">{phase.title}</h4>
                  <p className="text-sm text-slate-400">{phase.desc}</p>
                  <div className="text-xs text-emerald-400">{phase.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Technology Stack</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <h4 className="text-lg font-bold text-emerald-500 mb-4">Frontend</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>React 18 + TypeScript</div>
                  <div>Next.js 14 (App Router)</div>
                  <div>Tailwind CSS + Framer Motion</div>
                  <div>React Query + Zustand</div>
                  <div>PWA + Service Workers</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-blue-500 mb-4">Backend</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>Node.js + Express</div>
                  <div>GraphQL + Apollo Server</div>
                  <div>Microservices + Docker</div>
                  <div>Kubernetes + Istio</div>
                  <div>Apache Kafka + Redis</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-purple-500 mb-4">Database</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>PostgreSQL + PostGIS</div>
                  <div>MongoDB Atlas</div>
                  <div>Neo4j AuraDB</div>
                  <div>InfluxDB Cloud</div>
                  <div>Redis Enterprise</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-amber-500 mb-4">Infrastructure</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>Azure Kubernetes Service</div>
                  <div>Azure Cosmos DB</div>
                  <div>Azure CDN + Front Door</div>
                  <div>Azure Monitor + Insights</div>
                  <div>GitHub Actions CI/CD</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Performance Metrics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { metric: "Page Load", value: "0.8s", target: "Google Core Web Vitals", status: "Excellent" },
              { metric: "API Response", value: "47ms", target: "P99 latency", status: "Excellent" },
              { metric: "Uptime", value: "99.99%", target: "SLA guarantee", status: "Enterprise" },
              { metric: "Conversion", value: "23.4%", target: "Visitor to user", status: "Industry Leading" }
            ].map((perf, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">{perf.value}</div>
                <div className="text-sm text-white mb-2">{perf.metric}</div>
                <div className="text-xs text-slate-400 mb-2">{perf.target}</div>
                <div className="text-xs text-emerald-400">{perf.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Experience the Future</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Built with Fortune 500 excellence standards. Experience enterprise-grade regenerative technology.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/dashboard" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Start Free Trial
              </Link>
              <Link to="/business-model" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                View Business Model
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default EndToEndExperience;