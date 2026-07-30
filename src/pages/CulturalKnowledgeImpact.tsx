import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const CulturalKnowledgeImpact = () => (
  <Layout>
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-8xl font-black text-emerald-500 mb-4">04</div>
          <h1 className="text-6xl font-black mb-6">CULTURAL & KNOWLEDGE IMPACT</h1>
          <h2 className="text-3xl text-emerald-500 mb-8">Global Knowledge Ecosystem</h2>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Build and share knowledge through impact stories, collaboration, and ethical AI research for cultural preservation.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">8,500+</div>
            <div className="text-sm text-slate-400">Knowledge Assets</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">180+</div>
            <div className="text-sm text-slate-400">Cultural Narratives</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-purple-400 mb-2">45</div>
            <div className="text-sm text-slate-400">Languages Supported</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-black text-amber-400 mb-2">850K+</div>
            <div className="text-sm text-slate-400">Students Engaged</div>
          </div>
        </div>

        {/* Core Components */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "Impact Stories",
              icon: "📖",
              description: "Compelling narratives that showcase real-world regenerative impact and inspire global action.",
              features: ["Community testimonials", "Project documentaries", "Success case studies", "Visual storytelling"]
            },
            {
              title: "Global Hub",
              icon: "🌐",
              description: "Collaborative platform connecting regenerative practitioners, researchers, and communities worldwide.",
              features: ["Expert networks", "Collaboration tools", "Knowledge sharing", "Best practices"]
            },
            {
              title: "AI Library",
              icon: "🤖",
              description: "Comprehensive repository of AI models, algorithms, and tools for regenerative applications.",
              features: ["Open-source models", "Training datasets", "API access", "Research papers"]
            },
            {
              title: "Cultural Preservation",
              icon: "🏛️",
              description: "Digital preservation of indigenous knowledge, traditional practices, and cultural heritage.",
              features: ["Traditional knowledge", "Language preservation", "Cultural mapping", "Heritage protection"]
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

        {/* Featured Stories */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Featured Impact Stories</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Amazon Restoration Success",
                location: "Brazil",
                impact: "12,000 hectares restored",
                community: "Kayapó Indigenous Community",
                image: "🌳",
                description: "Traditional knowledge combined with modern technology to restore degraded rainforest."
              },
              {
                title: "Coral Reef Revival",
                location: "Great Barrier Reef",
                impact: "500 km² protected",
                community: "Marine Conservation Alliance",
                image: "🐠",
                description: "Innovative coral farming techniques bringing life back to bleached reef systems."
              },
              {
                title: "Regenerative Agriculture",
                location: "Kenya",
                impact: "50,000 farmers trained",
                community: "Maasai Cooperative",
                image: "🌾",
                description: "Ancient farming wisdom meets precision agriculture for sustainable food production."
              }
            ].map((story, i) => (
              <div key={i} className="glass p-8 rounded-2xl hover-lift">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{story.image}</div>
                  <h4 className="text-xl font-bold text-emerald-500 mb-2">{story.title}</h4>
                  <div className="text-sm text-slate-400">{story.location}</div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Impact:</span>
                    <span className="text-emerald-400 font-semibold">{story.impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Community:</span>
                    <span className="text-blue-400 font-semibold">{story.community}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{story.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Hub */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Global Knowledge Hub</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-6">Research Collaboration</h4>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-emerald-400 font-semibold">Climate Modeling Project</div>
                      <div className="text-xs text-slate-400">47 researchers</div>
                    </div>
                    <div className="text-sm text-slate-400">Advanced climate prediction models for regenerative planning</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-blue-400 font-semibold">Biodiversity AI Initiative</div>
                      <div className="text-xs text-slate-400">23 institutions</div>
                    </div>
                    <div className="text-sm text-slate-400">Machine learning for species identification and monitoring</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-purple-400 font-semibold">Traditional Knowledge Archive</div>
                      <div className="text-xs text-slate-400">156 communities</div>
                    </div>
                    <div className="text-sm text-slate-400">Digital preservation of indigenous ecological wisdom</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-6">Educational Programs</h4>
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                    <div className="text-emerald-400 font-semibold mb-2">Youth Climate Academy</div>
                    <div className="text-sm text-slate-400 mb-2">850,000+ students engaged globally</div>
                    <div className="text-xs text-emerald-400">Interactive climate education platform</div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 font-semibold mb-2">Regenerative Certification</div>
                    <div className="text-sm text-slate-400 mb-2">12,000+ professionals certified</div>
                    <div className="text-xs text-blue-400">Industry-recognized sustainability credentials</div>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <div className="text-purple-400 font-semibold mb-2">Community Workshops</div>
                    <div className="text-sm text-slate-400 mb-2">2,400+ workshops conducted</div>
                    <div className="text-xs text-purple-400">Local capacity building programs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Preservation */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">Cultural Preservation Initiative</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                category: "Languages",
                count: "45",
                description: "Indigenous languages documented and preserved",
                examples: ["Quechua", "Maasai", "Inuktitut", "Aboriginal languages"]
              },
              {
                category: "Practices",
                count: "230",
                description: "Traditional ecological practices recorded",
                examples: ["Permaculture", "Rotational grazing", "Forest gardening", "Water harvesting"]
              },
              {
                category: "Stories",
                count: "1,200",
                description: "Cultural narratives and oral histories",
                examples: ["Creation myths", "Seasonal cycles", "Animal wisdom", "Plant medicine"]
              },
              {
                category: "Artifacts",
                count: "3,400",
                description: "Digital preservation of cultural items",
                examples: ["Tools", "Artwork", "Ceremonial objects", "Traditional crafts"]
              }
            ].map((item, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center hover-lift">
                <div className="text-3xl font-black text-emerald-400 mb-2">{item.count}</div>
                <h4 className="text-lg font-bold text-white mb-3">{item.category}</h4>
                <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                <div className="space-y-1">
                  {item.examples.map((example, j) => (
                    <div key={j} className="text-xs text-slate-500">• {example}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Research Library */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold mb-12 text-center">AI Research Library</h3>
          <div className="glass p-8 rounded-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-emerald-500 mb-4">Open Models</h4>
                <div className="text-3xl font-bold text-white mb-2">127</div>
                <div className="text-sm text-slate-400 mb-4">AI models available</div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div>• Climate prediction</div>
                  <div>• Species identification</div>
                  <div>• Crop optimization</div>
                  <div>• Carbon modeling</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-blue-500 mb-4">Datasets</h4>
                <div className="text-3xl font-bold text-white mb-2">89</div>
                <div className="text-sm text-slate-400 mb-4">Training datasets</div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div>• Satellite imagery</div>
                  <div>• Sensor data</div>
                  <div>• Biodiversity records</div>
                  <div>• Climate data</div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-purple-500 mb-4">Research</h4>
                <div className="text-3xl font-bold text-white mb-2">456</div>
                <div className="text-sm text-slate-400 mb-4">Research papers</div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div>• Peer-reviewed studies</div>
                  <div>• Technical reports</div>
                  <div>• Case studies</div>
                  <div>• Best practices</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass p-12 rounded-3xl">
            <h3 className="text-4xl font-bold mb-6">Join the Knowledge Network</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Contribute to the global knowledge ecosystem. Share your stories, research, and cultural wisdom.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/outreach" className="btn-glow px-8 py-4 rounded-xl font-semibold text-lg">
                Share Your Story
              </Link>
              <Link to="/global-impact-economy" className="glass px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-500/30">
                Next Layer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default CulturalKnowledgeImpact;