import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const DataMetricsEngine = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-8xl font-black text-emerald-500 mb-4">03</div>
          <h1 className="text-6xl font-black mb-6">DATA INTEGRATION & METRICS ENGINE</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Real-World Impact Measurement</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Measure regenerative impact across agriculture, oceanic, healthcare, and circular economy sectors with precision.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">15,000+</div>
            <div className="text-sm text-slate-400">IoT Sensors Active</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">1.2TB</div>
            <div className="text-sm text-slate-400">Daily Data Processed</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-purple-400 mb-2">99.7%</div>
            <div className="text-sm text-slate-400">Prediction Accuracy</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-amber-400 mb-2">47ms</div>
            <div className="text-sm text-slate-400">Real-time Processing</div>
          </div>
        </div>

        {/* Core Components */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "Big Data Analytics",
              icon: "📊",
              description: "Process massive datasets from multiple sources to extract actionable insights for regenerative impact.",
              features: ["Real-time stream processing", "Machine learning pipelines", "Pattern recognition", "Anomaly detection"]
            },
            {
              title: "AI Forecasting",
              icon: "🔮",
              description: "Predictive models for climate patterns, ecosystem health, and regenerative project outcomes.",
              features: ["Climate modeling", "Ecosystem predictions", "Risk assessment", "Impact projections"]
            },
            {
              title: "Ecosystem Mapping",
              icon: "🗺️",
              description: "Comprehensive mapping of global ecosystems with real-time health monitoring and change detection.",
              features: ["Biodiversity tracking", "Habitat mapping", "Species monitoring", "Ecosystem connectivity"]
            },
            {
              title: "Satellite Integration",
              icon: "🛰️",
              description: "Multi-satellite constellation providing continuous Earth observation and environmental monitoring.",
              features: ["Sentinel-2 imagery", "Landsat data", "MODIS integration", "Hyperspectral analysis"]
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

        {/* Real-time Dashboard */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Global Monitoring Dashboard</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Live Environmental Data</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-emerald-400 font-semibold">Forest Coverage</div>
                      <div className="text-sm text-slate-400">Amazon Basin</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">87.3%</div>
                      <div className="text-xs text-emerald-400">+0.2% this month</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-blue-400 font-semibold">Ocean pH</div>
                      <div className="text-sm text-slate-400">Pacific Monitoring</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">8.12</div>
                      <div className="text-xs text-blue-400">Stable</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div>
                      <div className="text-purple-400 font-semibold">Soil Carbon</div>
                      <div className="text-sm text-slate-400">Agricultural Zones</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">2.8%</div>
                      <div className="text-xs text-purple-400">+0.1% YoY</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-4">AI Predictions</h4>
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="text-emerald-400 font-semibold mb-2">Reforestation Success</div>
                    <div className="text-sm text-slate-400">94% probability of target achievement</div>
                    <div className="text-xs text-emerald-400 mt-1">Based on current growth rates</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-semibold mb-2">Climate Risk</div>
                    <div className="text-sm text-slate-400">Low risk for next 6 months</div>
                    <div className="text-xs text-blue-400 mt-1">Weather pattern analysis</div>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 font-semibold mb-2">Biodiversity Index</div>
                    <div className="text-sm text-slate-400">Projected 12% increase by 2025</div>
                    <div className="text-xs text-purple-400 mt-1">Species recovery modeling</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IoT Sensor Network */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">IoT Sensor Networks</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                type: "Soil Sensors",
                count: "4,200",
                metrics: ["pH levels", "Moisture content", "Carbon density", "Nutrient analysis"],
                icon: "🌱"
              },
              {
                type: "Air Quality",
                count: "2,800",
                metrics: ["CO₂ levels", "Particulate matter", "Ozone concentration", "Pollutant tracking"],
                icon: "🌬️"
              },
              {
                type: "Water Monitoring",
                count: "3,600",
                metrics: ["pH balance", "Dissolved oxygen", "Temperature", "Pollution levels"],
                icon: "💧"
              },
              {
                type: "Biodiversity",
                count: "4,400",
                metrics: ["Species count", "Migration patterns", "Habitat health", "Population dynamics"],
                icon: "🦋"
              }
            ].map((sensor, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center hover-lift">
                <div className="text-4xl mb-4">{sensor.icon}</div>
                <h4 className="text-xl font-bold text-emerald-500 mb-2">{sensor.type}</h4>
                <div className="text-2xl font-bold text-white mb-4">{sensor.count}</div>
                <div className="text-sm text-slate-400 mb-4">Active Sensors</div>
                <div className="space-y-1">
                  {sensor.metrics.map((metric, j) => (
                    <div key={j} className="text-xs text-slate-400">• {metric}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Integrated Data Sources</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-blue-500 mb-4">Satellite Data</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• Sentinel-2 (ESA)</div>
                  <div>• Landsat 8/9 (NASA)</div>
                  <div>• MODIS Terra/Aqua</div>
                  <div>• Planet Labs</div>
                  <div>• Custom microsatellites</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-emerald-500 mb-4">Ground Sensors</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• IoT sensor networks</div>
                  <div>• Weather stations</div>
                  <div>• Soil monitoring</div>
                  <div>• Water quality sensors</div>
                  <div>• Air quality monitors</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-purple-500 mb-4">External APIs</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div>• Climate data services</div>
                  <div>• Government databases</div>
                  <div>• Research institutions</div>
                  <div>• NGO monitoring</div>
                  <div>• Community reports</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Access Real-Time Data</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Get instant access to global environmental data and AI-powered insights for your regenerative projects.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/measurements" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                View Dashboard
              </Link>
              <Link to="/cultural-knowledge-impact" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                Next Layer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default DataMetricsEngine;