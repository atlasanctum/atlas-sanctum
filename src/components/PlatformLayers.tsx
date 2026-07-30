import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Shield, 
  Repeat, 
  Database, 
  BookOpen, 
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Network,
  Sparkles
} from "lucide-react";

const layers = [
  {
    number: "01",
    title: "Infinite Purpose & Ethical Governance",
    description: "Decentralized AI-driven decision-making grounded in universal ethics, ensuring transparent governance through DAO participation.",
    detailedDescription: "The foundational layer that ensures all platform decisions align with regenerative principles. Through moral AI protocols and decentralized autonomous organization (DAO) governance, we create a values-driven framework where ethical considerations are embedded in every transaction and decision. This layer protects sacred lands, ensures intergenerational equity, and maintains 67% indigenous representation in bioregional ethics councils.",
    icon: Shield,
    color: "from-primary to-ocean",
    features: ["Moral AI Protocols", "DAO Governance", "Values Engine", "Ethical Frameworks", "Sacred Land Protection"],
    metrics: {
      label: "Governance Participants",
      value: "12,450+",
      subtext: "Active DAO members"
    },
    relatedPages: ["/governance"]
  },
  {
    number: "02",
    title: "Regenerative Value Exchange",
    description: "Seamless exchange of regenerative assets including carbon credits, ecosystem restoration credits, and cultural preservation funds.",
    detailedDescription: "A blockchain-powered marketplace enabling transparent, verifiable trading of Regenerative Impact Units (RIUs). This layer connects buyers and sellers through AI-powered oracles that validate real-world impact, ensuring every credit represents genuine ecological restoration. Smart contracts automatically execute trades, manage escrow, and enforce quality standards across 24.5M circulating RIUs.",
    icon: Repeat,
    color: "from-ocean to-earth",
    features: ["Blockchain Records", "AI-Powered Oracles", "Living Smart Contracts", "RIU Trading", "Impact Verification"],
    metrics: {
      label: "Trading Volume",
      value: "$1.84B",
      subtext: "Total value exchanged"
    },
    relatedPages: ["/marketplace"]
  },
  {
    number: "03",
    title: "Data Integration & Metrics Engine",
    description: "Measure real-world regenerative impact across agriculture, oceanic, healthcare, and circular economy sectors.",
    detailedDescription: "Real-time planetary measurement through satellite data (Sentinel-2, Landsat), IoT sensors, and ground verification. This layer tracks CO₂ sequestration, soil carbon, biodiversity indices, and ecosystem health with 95% confidence intervals. Advanced AI forecasting models predict 25-year impact trajectories, enabling data-driven decision-making for regenerative projects worldwide.",
    icon: Database,
    color: "from-earth to-accent",
    features: ["Big Data Analytics", "AI Forecasting", "Ecosystem Mapping", "Satellite Integration", "IoT Sensor Networks"],
    metrics: {
      label: "Data Points",
      value: "15,000+",
      subtext: "IoT sensors active"
    },
    relatedPages: ["/measurements", "/bioregions"]
  },
  {
    number: "04",
    title: "Cultural & Knowledge Impact",
    description: "Build and share a global knowledge ecosystem through impact stories, collaboration, and ethical AI research.",
    detailedDescription: "A living library of regenerative practices, indigenous wisdom, and impact narratives that preserve cultural heritage while accelerating global learning. This layer connects communities, shares success stories, and builds collective intelligence through collaborative research and ethical AI tools. It ensures traditional knowledge is honored and integrated into modern regenerative solutions.",
    icon: BookOpen,
    color: "from-accent to-sunset",
    features: ["Impact Stories", "Global Hub", "AI Library", "Cultural Preservation", "Knowledge Sharing"],
    metrics: {
      label: "Knowledge Assets",
      value: "8,500+",
      subtext: "Stories & resources"
    },
    relatedPages: ["/outreach"]
  },
  {
    number: "05",
    title: "Global Impact Economy",
    description: "Enable financial flows supporting regenerative businesses through impact investing, DeFi, and microfinance.",
    detailedDescription: "The economic engine that channels capital toward regenerative enterprises through impact investing, decentralized finance (DeFi), and microfinance platforms. This layer enables farmers to access $205K-$565K annual income, supports regenerative agriculture projects, and creates sustainable financial models that reward long-term ecological restoration. It bridges traditional finance with regenerative impact.",
    icon: TrendingUp,
    color: "from-sunset to-primary",
    features: ["Impact Marketplace", "Sustainable Finance", "Microfinance Platform", "DeFi Integration", "Impact Bonds"],
    metrics: {
      label: "Value Generated",
      value: "$4.2B",
      subtext: "Economic impact"
    },
    relatedPages: ["/marketplace", "/regenerative-agriculture"]
  },
 /**    {
    number: "06",
    title: "Cardano Layer",
    description: "Probabilistic Civilization Infrastructure (PCI) - A probability-native civilization stack that models uncertainty and future viability.",
    detailedDescription: "Built on top of Cardano (philosophically and technically), this layer evolves Atlas Sanctum from a measurement engine into a probability-native civilization stack. It introduces Probabilistic Value Units (PVUs) weighted by long-term survival likelihood, regenerative markets for trading ecological futures, and adaptive governance curves that adjust automatically as probabilities shift. The Atlas Probabilistic Oracle (APO) runs Monte Carlo-style civilization simulations to publish risk heatmaps and inform capital flows.",
    icon: Calculator,
    color: "from-purple-500 to-indigo-600",
    features: ["Probabilistic Value Units", "Regeneration Markets", "Adaptive Governance", "Scenario Trees", "Probability Curves"],
    metrics: {
      label: "Simulation Runs",
      value: "10,000+",
      subtext: "Monte Carlo simulations"
    },
    relatedPages: ["/cardano-layer"]
  } */
]; 

const PlatformLayers = () => {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  return (
    <section id="layers" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-ocean/5 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="text-primary font-medium tracking-wider uppercase text-xs sm:text-sm">
            Platform Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Six Layers of{" "}
            <span className="text-gradient">Regeneration</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0 text-center">
            A multi-layered ecosystem designed to preserve humanity and the planet,
            blending impact finance with ethical technology.
          </p>
        </motion.div>

        {/* Layers Grid */}
        <div className="space-y-4 sm:space-y-6">
          {layers.map((layer, index) => {
            const isExpanded = expandedLayer === index;
            
            return (
              <motion.div
                key={layer.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div 
                  className="relative bg-card-gradient border border-border/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-glow overflow-hidden cursor-pointer glass-panel"
                  onClick={() => setExpandedLayer(isExpanded ? null : index)}
                >
                  {/* Gradient Line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b ${layer.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${layer.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 relative z-10">
                    {/* Number & Icon */}
                    <div className="flex items-center gap-3 sm:gap-6 lg:w-48 flex-shrink-0">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors">
                        {layer.number}
                      </span>
                      <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <layer.icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2 sm:mb-3">
                        <h3 className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {layer.title}
                        </h3>
                        <button
                          className="lg:hidden flex-shrink-0 mt-1"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                        {layer.description}
                      </p>

                      {/* Metrics */}
                      {layer.metrics && (
                        <div className="flex items-center gap-4 mb-3 sm:mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl sm:text-2xl font-display font-bold text-foreground">
                                {layer.metrics.value}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {layer.metrics.label}
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              {layer.metrics.subtext}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                        {layer.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 text-xs sm:text-sm text-muted-foreground border border-border/50 whitespace-nowrap group-hover:border-primary/30 transition-colors"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-border/30 mt-4">
                              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                                {layer.detailedDescription}
                              </p>
                              
                              {/* Related Pages Links */}
                              {layer.relatedPages && layer.relatedPages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {layer.relatedPages.map((page) => (
                                    <a
                                      key={page}
                                      href={page}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs sm:text-sm font-medium hover:bg-primary/20 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span>Explore</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Arrow - Desktop */}
                    <div className="hidden lg:flex items-center flex-shrink-0">
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Layer Connection Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-muted/30 border border-border/30">
            <Network className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Each layer interconnects to create a unified regenerative ecosystem
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformLayers;
