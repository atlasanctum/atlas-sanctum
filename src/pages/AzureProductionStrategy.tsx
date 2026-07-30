import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AzureProductionStrategy = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">AZURE PRODUCTION STRATEGY</h1>
          <h2 className="text-3xl text-blue-500 mb-8">Enterprise-Grade Cloud Infrastructure</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Scalable, secure, and globally distributed production deployment on Microsoft Azure
          </p>
        </div>

        {/* Infrastructure Architecture */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Infrastructure Architecture</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold text-blue-500 mb-4">Global Distribution</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Primary: East US 2</div>
                <div>Secondary: West Europe</div>
                <div>Tertiary: Southeast Asia</div>
                <div>CDN: 150+ Edge Locations</div>
              </div>
            </div>
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-emerald-500 mb-4">High Availability</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>99.99% SLA Guarantee</div>
                <div>Multi-Zone Deployment</div>
                <div>Auto-Failover</div>
                <div>Zero-Downtime Updates</div>
              </div>
            </div>
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-purple-500 mb-4">Enterprise Security</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div>Azure AD Integration</div>
                <div>Key Vault Secrets</div>
                <div>Network Security Groups</div>
                <div>DDoS Protection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Services */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Core Azure Services</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                service: "Azure Kubernetes Service (AKS)",
                purpose: "Container orchestration for microservices",
                config: "3-node cluster per region, auto-scaling 1-100 nodes",
                cost: "$2,400/month",
                features: ["Pod autoscaling", "Cluster autoscaling", "Azure CNI networking", "RBAC integration"]
              },
              {
                service: "Azure Database for PostgreSQL",
                purpose: "Primary database with PostGIS for geospatial data",
                config: "Flexible Server, 32 vCores, 128GB RAM, 2TB storage",
                cost: "$1,800/month",
                features: ["Read replicas", "Point-in-time recovery", "Automated backups", "High availability"]
              },
              {
                service: "Azure Cosmos DB",
                purpose: "Global NoSQL database for real-time data",
                config: "Multi-region, 10,000 RU/s provisioned throughput",
                cost: "$3,200/month",
                features: ["Global distribution", "Multi-model API", "Automatic scaling", "99.999% availability"]
              },
              {
                service: "Azure Redis Cache",
                purpose: "Distributed caching and session storage",
                config: "Premium P3, 26GB, clustering enabled",
                cost: "$800/month",
                features: ["Redis clustering", "Data persistence", "Geo-replication", "VNet integration"]
              },
              {
                service: "Azure Storage Account",
                purpose: "Blob storage for files, images, and backups",
                config: "Premium LRS, 50TB capacity, CDN enabled",
                cost: "$1,200/month",
                features: ["Hot/Cool/Archive tiers", "Lifecycle management", "Encryption at rest", "Geo-redundancy"]
              },
              {
                service: "Azure Application Gateway",
                purpose: "Load balancer with WAF protection",
                config: "Standard_v2, 2 instances, SSL termination",
                cost: "$600/month",
                features: ["Web Application Firewall", "SSL offloading", "URL-based routing", "Health probes"]
              }
            ].map((service, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-blue-500">{service.service}</h4>
                  <div className="text-emerald-400 font-bold">{service.cost}</div>
                </div>
                <p className="text-slate-400 mb-4">{service.purpose}</p>
                <div className="bg-blue-500/10 px-4 py-2 rounded-lg mb-4 border border-blue-500/20">
                  <span className="text-blue-400 text-sm">{service.config}</span>
                </div>
                <div className="space-y-1">
                  {service.features.map((feature, j) => (
                    <div key={j} className="text-sm text-slate-400">• {feature}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Pipeline */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">CI/CD Pipeline</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-2xl">📝</div>
                <h4 className="text-lg font-bold text-blue-500">Source Control</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>Azure DevOps Repos</div>
                  <div>Git Flow Strategy</div>
                  <div>Branch Protection</div>
                  <div>Code Reviews</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-2xl">🔨</div>
                <h4 className="text-lg font-bold text-emerald-500">Build & Test</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>Azure Pipelines</div>
                  <div>Docker Multi-stage</div>
                  <div>Unit & Integration Tests</div>
                  <div>Security Scanning</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-2xl">📦</div>
                <h4 className="text-lg font-bold text-purple-500">Artifact Storage</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>Azure Container Registry</div>
                  <div>Vulnerability Scanning</div>
                  <div>Image Signing</div>
                  <div>Retention Policies</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-2xl">🚀</div>
                <h4 className="text-lg font-bold text-amber-500">Deployment</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>Blue-Green Strategy</div>
                  <div>Canary Releases</div>
                  <div>Automated Rollback</div>
                  <div>Health Checks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring & Observability */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Monitoring & Observability</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                tool: "Azure Monitor",
                purpose: "Comprehensive monitoring and alerting",
                metrics: ["Application performance", "Infrastructure health", "Custom business metrics", "Log analytics"],
                alerts: "50+ alert rules configured"
              },
              {
                tool: "Application Insights",
                purpose: "APM for application performance monitoring",
                metrics: ["Response times", "Failure rates", "Dependency tracking", "User analytics"],
                alerts: "Smart detection enabled"
              },
              {
                tool: "Azure Log Analytics",
                purpose: "Centralized logging and log analysis",
                metrics: ["Application logs", "Security logs", "Audit trails", "Performance counters"],
                alerts: "Custom KQL queries"
              },
              {
                tool: "Azure Security Center",
                purpose: "Security posture management",
                metrics: ["Vulnerability assessments", "Compliance scores", "Threat detection", "Security recommendations"],
                alerts: "Real-time threat alerts"
              }
            ].map((tool, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <h4 className="text-xl font-bold text-blue-500 mb-4">{tool.tool}</h4>
                <p className="text-slate-400 mb-4">{tool.purpose}</p>
                <div className="space-y-2 mb-4">
                  {tool.metrics.map((metric, j) => (
                    <div key={j} className="text-sm text-slate-400">• {metric}</div>
                  ))}
                </div>
                <div className="bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                  <span className="text-emerald-400 text-sm font-semibold">{tool.alerts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Strategy */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Security Strategy</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Identity & Access",
                icon: "🔐",
                measures: [
                  "Azure AD Premium P2",
                  "Multi-factor authentication",
                  "Conditional access policies",
                  "Privileged Identity Management",
                  "Just-in-time access"
                ]
              },
              {
                category: "Network Security",
                icon: "🛡️",
                measures: [
                  "Virtual Network isolation",
                  "Network Security Groups",
                  "Azure Firewall Premium",
                  "DDoS Protection Standard",
                  "Private endpoints"
                ]
              },
              {
                category: "Data Protection",
                icon: "🔒",
                measures: [
                  "Encryption at rest (AES-256)",
                  "Encryption in transit (TLS 1.3)",
                  "Azure Key Vault HSM",
                  "Customer-managed keys",
                  "Data classification"
                ]
              }
            ].map((security, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{security.icon}</div>
                  <h4 className="text-xl font-bold text-purple-500">{security.category}</h4>
                </div>
                <div className="space-y-2">
                  {security.measures.map((measure, j) => (
                    <div key={j} className="text-sm text-slate-400">• {measure}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scaling Strategy */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Auto-Scaling Strategy</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-emerald-500 mb-4">Horizontal Scaling</h4>
                <div className="space-y-3">
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="font-semibold text-emerald-400 mb-2">AKS Pod Autoscaling</div>
                    <div className="text-sm text-slate-400">CPU over 70% or Memory over 80% triggers scale-out</div>
                  </div>
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="font-semibold text-emerald-400 mb-2">Cluster Autoscaling</div>
                    <div className="text-sm text-slate-400">Automatic node provisioning based on pod demand</div>
                  </div>
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="font-semibold text-emerald-400 mb-2">Database Read Replicas</div>
                    <div className="text-sm text-slate-400">Auto-create replicas when read load over 80%</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-500 mb-4">Vertical Scaling</h4>
                <div className="space-y-3">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="font-semibold text-blue-400 mb-2">Database Scaling</div>
                    <div className="text-sm text-slate-400">Auto-scale compute and storage based on utilization</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="font-semibold text-blue-400 mb-2">Redis Cache Scaling</div>
                    <div className="text-sm text-slate-400">Upgrade tiers automatically during peak traffic</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="font-semibold text-blue-400 mb-2">Storage Scaling</div>
                    <div className="text-sm text-slate-400">Auto-expand storage when utilization over 85%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Optimization */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Cost Optimization</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-emerald-400 mb-2">$12,500</div>
              <div className="text-sm text-slate-400 mb-2">Monthly Infrastructure Cost</div>
              <div className="text-xs text-emerald-400">30% savings with reserved instances</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-blue-400 mb-2">85%</div>
              <div className="text-sm text-slate-400 mb-2">Resource Utilization</div>
              <div className="text-xs text-blue-400">Optimized through auto-scaling</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">$0.08</div>
              <div className="text-sm text-slate-400 mb-2">Cost per API Request</div>
              <div className="text-xs text-purple-400">Including all infrastructure</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-black text-amber-400 mb-2">40%</div>
              <div className="text-sm text-slate-400 mb-2">Dev/Test Savings</div>
              <div className="text-xs text-amber-400">Auto-shutdown policies</div>
            </div>
          </div>
        </div>

        {/* Disaster Recovery */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Disaster Recovery Plan</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-emerald-500 mb-4">RTO: 15 minutes</h4>
                <div className="text-sm text-slate-400">Recovery Time Objective for critical services</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💾</div>
                <h4 className="text-xl font-bold text-blue-500 mb-4">RPO: 5 minutes</h4>
                <div className="text-sm text-slate-400">Recovery Point Objective for data loss</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h4 className="text-xl font-bold text-purple-500 mb-4">Auto-Failover</h4>
                <div className="text-sm text-slate-400">Automated failover to secondary region</div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="font-semibold text-white mb-2">Backup Strategy</div>
                <div className="text-sm text-slate-400">
                  Database: Continuous backup with 35-day retention<br/>
                  Files: Geo-redundant storage with versioning<br/>
                  Configuration: Infrastructure as Code in Git
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="font-semibold text-white mb-2">Testing Schedule</div>
                <div className="text-sm text-slate-400">
                  Monthly: Automated DR testing<br/>
                  Quarterly: Full failover simulation<br/>
                  Annually: Complete disaster recovery drill
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Ready for Production</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Enterprise-grade Azure infrastructure ready to scale from thousands to millions of users globally.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/contact" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Deploy to Production
              </Link>
              <Link to="/innovations" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-blue-500/30">
                View Architecture
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default AzureProductionStrategy;