import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const CriticalInnovations = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">CRITICAL INNOVATIONS</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Engineering Excellence Across All Domains</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Multi-disciplinary engineering approach to build the world's most advanced regenerative platform
          </p>
        </div>

        {/* Full Stack Engineering */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">🌐</div>
            <h3 className="text-4xl font-bold text-emerald-500">Full Stack Engineering</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: "Real-Time Impact Dashboard",
                innovation: "WebGL-powered 3D Earth visualization with live satellite feeds",
                tech: "React Three Fiber + WebGL + WebRTC",
                impact: "10x user engagement, real-time global impact tracking"
              },
              {
                component: "Micro-Frontend Architecture", 
                innovation: "Domain-driven micro-frontends with shared design system",
                tech: "Module Federation + Nx + Storybook",
                impact: "50% faster development, independent team scaling"
              },
              {
                component: "Progressive Web App",
                innovation: "Offline-first carbon tracking with background sync",
                tech: "Service Workers + IndexedDB + Push API",
                impact: "Works in remote areas, 90% mobile adoption"
              },
              {
                component: "Edge Computing CDN",
                innovation: "Geo-distributed API responses under 50ms globally",
                tech: "Cloudflare Workers + Edge Functions",
                impact: "Sub-50ms response times worldwide"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-white mb-3">{item.component}</h4>
                <p className="text-slate-400 mb-4">{item.innovation}</p>
                <div className="bg-emerald-500/10 px-4 py-2 rounded-lg mb-3 border border-emerald-500/20">
                  <span className="text-emerald-400 text-sm font-mono">{item.tech}</span>
                </div>
                <div className="text-sm text-blue-400 font-semibold">{item.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Engineering */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">🤖</div>
            <h3 className="text-4xl font-bold text-blue-500">AI Engineering</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: "Satellite Image Analysis",
                innovation: "Computer vision for deforestation detection with 99.7% accuracy",
                tech: "YOLOv8 + Transformer + CUDA",
                impact: "Real-time forest monitoring, fraud prevention"
              },
              {
                component: "Carbon Credit Pricing AI",
                innovation: "Multi-modal LLM predicting credit values 30 days ahead",
                tech: "GPT-4 + Time Series + Reinforcement Learning",
                impact: "15% better pricing accuracy, $50M+ value capture"
              },
              {
                component: "Impact Verification Oracle",
                innovation: "Autonomous verification using IoT + satellite + social data",
                tech: "Ensemble ML + Graph Neural Networks",
                impact: "95% automated verification, 80% cost reduction"
              },
              {
                component: "Regenerative AI Assistant",
                innovation: "Domain-specific LLM trained on climate science papers",
                tech: "Fine-tuned Llama 2 + RAG + Vector DB",
                impact: "Expert-level climate advice, 24/7 support"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-white mb-3">{item.component}</h4>
                <p className="text-slate-400 mb-4">{item.innovation}</p>
                <div className="bg-blue-500/10 px-4 py-2 rounded-lg mb-3 border border-blue-500/20">
                  <span className="text-blue-400 text-sm font-mono">{item.tech}</span>
                </div>
                <div className="text-sm text-purple-400 font-semibold">{item.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Development */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">⛓️</div>
            <h3 className="text-4xl font-bold text-purple-500">Blockchain Development</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: "RIU Token Standard",
                innovation: "ERC-1155 with built-in carbon accounting and retirement logic",
                tech: "Solidity + OpenZeppelin + Chainlink",
                impact: "Programmable carbon credits, automated compliance"
              },
              {
                component: "Cross-Chain Bridge",
                innovation: "Seamless RIU transfers across Ethereum, Polygon, Arbitrum",
                tech: "LayerZero + Hyperlane + ZK Proofs",
                impact: "Multi-chain liquidity, 90% lower gas fees"
              },
              {
                component: "DAO Governance Protocol",
                innovation: "Quadratic voting with reputation-weighted proposals",
                tech: "Governor Bravo + Snapshot + IPFS",
                impact: "Democratic decision-making, community ownership"
              },
              {
                component: "Carbon Oracle Network",
                innovation: "Decentralized price feeds from 50+ data sources",
                tech: "Chainlink + Band Protocol + Custom Oracles",
                impact: "Tamper-proof pricing, market transparency"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-white mb-3">{item.component}</h4>
                <p className="text-slate-400 mb-4">{item.innovation}</p>
                <div className="bg-purple-500/10 px-4 py-2 rounded-lg mb-3 border border-purple-500/20">
                  <span className="text-purple-400 text-sm font-mono">{item.tech}</span>
                </div>
                <div className="text-sm text-emerald-400 font-semibold">{item.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Systems Architecture */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-2xl">🏗️</div>
            <h3 className="text-4xl font-bold text-amber-500">Systems Architecture</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: "Event-Driven Microservices",
                innovation: "CQRS + Event Sourcing for 100% audit trail",
                tech: "Apache Kafka + Redis + Docker + K8s",
                impact: "99.99% uptime, infinite scalability"
              },
              {
                component: "Multi-Region Deployment",
                innovation: "Active-active setup across 6 continents",
                tech: "AWS + GCP + Azure + Terraform",
                impact: "Global <50ms latency, disaster recovery"
              },
              {
                component: "Auto-Scaling Infrastructure",
                innovation: "Predictive scaling based on carbon market volatility",
                tech: "Kubernetes HPA + KEDA + Prometheus",
                impact: "Handle 1000x traffic spikes, 60% cost savings"
              },
              {
                component: "Zero-Trust Security",
                innovation: "mTLS + RBAC + Zero-knowledge authentication",
                tech: "Istio + Vault + SPIFFE/SPIRE",
                impact: "Enterprise-grade security, SOC2 compliance"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-white mb-3">{item.component}</h4>
                <p className="text-slate-400 mb-4">{item.innovation}</p>
                <div className="bg-amber-500/10 px-4 py-2 rounded-lg mb-3 border border-amber-500/20">
                  <span className="text-amber-400 text-sm font-mono">{item.tech}</span>
                </div>
                <div className="text-sm text-blue-400 font-semibold">{item.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Engineering */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-2xl">🗄️</div>
            <h3 className="text-4xl font-bold text-cyan-500">Database Engineering</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: "Time-Series Carbon Data",
                innovation: "InfluxDB cluster storing 1TB+ daily satellite measurements",
                tech: "InfluxDB + Grafana + Telegraf",
                impact: "Real-time analytics, 10-year historical data"
              },
              {
                component: "Geospatial Project Database",
                innovation: "PostGIS with R-tree indexing for sub-second polygon queries",
                tech: "PostgreSQL + PostGIS + pgBouncer",
                impact: "Instant geographic searches, boundary detection"
              },
              {
                component: "Graph Relationship Engine",
                innovation: "Neo4j tracking impact relationships across ecosystems",
                tech: "Neo4j + Cypher + Graph Algorithms",
                impact: "Complex impact modeling, fraud detection"
              },
              {
                component: "Distributed Cache Layer",
                innovation: "Redis Cluster with intelligent cache warming",
                tech: "Redis Cluster + Sentinel + Lua Scripts",
                impact: "Sub-millisecond reads, 99.9% cache hit rate"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-white mb-3">{item.component}</h4>
                <p className="text-slate-400 mb-4">{item.innovation}</p>
                <div className="bg-cyan-500/10 px-4 py-2 rounded-lg mb-3 border border-cyan-500/20">
                  <span className="text-cyan-400 text-sm font-mono">{item.tech}</span>
                </div>
                <div className="text-sm text-purple-400 font-semibold">{item.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Engineering */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center text-2xl">🔗</div>
            <h3 className="text-4xl font-bold text-rose-500">Protocol Engineering</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                component: "Carbon Credit Protocol",
                innovation: "Standardized RIU protocol with automatic retirement",
                tech: "EIP-2535 + Diamond Pattern + Upgradeable Proxies",
                impact: "Industry standard, interoperable credits"
              },
              {
                component: "Impact Measurement Protocol",
                innovation: "Decentralized verification using cryptographic proofs",
                tech: "zk-SNARKs + Merkle Trees + IPFS",
                impact: "Trustless verification, privacy-preserving data"
              },
              {
                component: "Regenerative Finance Protocol",
                innovation: "Automated yield farming for carbon credit staking",
                tech: "Compound V3 + Aave + Custom AMM",
                impact: "Passive income for holders, liquidity provision"
              },
              {
                component: "Cross-Protocol Bridge",
                innovation: "Universal adapter for existing carbon standards",
                tech: "Adapter Pattern + Registry + Multi-sig",
                impact: "Legacy system integration, market unification"
              }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-white mb-3">{item.component}</h4>
                <p className="text-slate-400 mb-4">{item.innovation}</p>
                <div className="bg-rose-500/10 px-4 py-2 rounded-lg mb-3 border border-rose-500/20">
                  <span className="text-rose-400 text-sm font-mono">{item.tech}</span>
                </div>
                <div className="text-sm text-emerald-400 font-semibold">{item.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Innovation Metrics */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Innovation Impact Metrics</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-emerald-400 mb-2">99.7%</div>
              <div className="text-sm text-slate-400">AI Accuracy</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-blue-400 mb-2">&lt;50ms</div>
              <div className="text-sm text-slate-400">Global Latency</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">99.99%</div>
              <div className="text-sm text-slate-400">Uptime SLA</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-amber-400 mb-2">1000x</div>
              <div className="text-sm text-slate-400">Scale Capacity</div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Diagram */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Technical Architecture</h3>
          <div className="glass p-12 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-emerald-500">Frontend Layer</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">React + TypeScript</div>
                  <div className="bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">Three.js + WebGL</div>
                  <div className="bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">PWA + Service Workers</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-blue-500">Backend Layer</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-500/10 px-3 py-2 rounded border border-blue-500/20">Node.js + Express</div>
                  <div className="bg-blue-500/10 px-3 py-2 rounded border border-blue-500/20">Python + FastAPI</div>
                  <div className="bg-blue-500/10 px-3 py-2 rounded border border-blue-500/20">Go + gRPC</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-purple-500">Blockchain Layer</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-purple-500/10 px-3 py-2 rounded border border-purple-500/20">Ethereum + Solidity</div>
                  <div className="bg-purple-500/10 px-3 py-2 rounded border border-purple-500/20">Polygon + Arbitrum</div>
                  <div className="bg-purple-500/10 px-3 py-2 rounded border border-purple-500/20">Chainlink Oracles</div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="text-slate-400">Unified by Event-Driven Architecture + Kubernetes + Multi-Cloud</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Join Our Engineering Team</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Build the future of regenerative technology. Work on cutting-edge problems that matter for the planet.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/contact" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Join Our Team
              </Link>
              <Link to="/architecture" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                View Architecture
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default CriticalInnovations;