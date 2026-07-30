import { motion } from "framer-motion";
import { 
  Cpu, 
  Lock, 
  Cloud, 
  Zap,
  Network,
  Eye
} from "lucide-react";

const technologies = [
  {
    icon: Network,
    title: "Blockchain Layer",
    description: "Ethereum & Polkadot-based infrastructure for immutable records and decentralized applications.",
    tags: ["Smart Contracts", "Carbon Tokens", "DeFi"]
  },
  {
    icon: Cpu,
    title: "AI & Machine Learning",
    description: "Real-time ecosystem analysis, predictive modeling, and optimization algorithms.",
    tags: ["AI Oracles", "Pattern Recognition", "Forecasting"]
  },
  {
    icon: Lock,
    title: "Security & Privacy",
    description: "Zero-Knowledge Proofs ensuring privacy without compromising transparency.",
    tags: ["ZKPs", "Encryption", "Secure Compute"]
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Scalable hosting on AWS, Google Cloud, and Azure with decentralized storage.",
    tags: ["Multi-Cloud", "IPFS", "Edge Computing"]
  },
  {
    icon: Eye,
    title: "IoT Integration",
    description: "Global sensor network providing real-time environmental data feeds.",
    tags: ["Satellites", "Sensors", "Real-Time Data"]
  },
  {
    icon: Zap,
    title: "API Ecosystem",
    description: "Open-source APIs enabling third-party integrations and ecosystem growth.",
    tags: ["REST", "GraphQL", "Webhooks"]
  }
];

const TechnologyStack = () => {
  return (
    <section id="technology" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <span className="text-ocean font-medium tracking-wider uppercase text-xs sm:text-sm">
            Technology Stack
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Built for{" "}
            <span className="text-gradient">Scale & Trust</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0 text-center">
            Enterprise-grade infrastructure combining the latest in blockchain,
            AI, and cloud technology to power global regeneration.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-card border border-border/50 rounded-lg sm:rounded-2xl p-4 sm:p-8 h-full hover:border-primary/30 transition-all duration-500 hover:shadow-glow overflow-hidden glass-panel">
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-ocean/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform border border-primary/20">
                  <tech.icon className="w-5 sm:w-7 h-5 sm:h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="relative font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {tech.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  {tech.description}
                </p>

                {/* Tags */}
                <div className="relative flex flex-wrap gap-2">
                  {tech.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground border border-border/50 group-hover:border-primary/20 group-hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 md:mt-20 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-card-gradient border border-border/50 glass-panel"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex-1">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                Decentralized by Design
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                Our architecture ensures no single point of failure, with data distributed
                across global nodes and verified through consensus mechanisms.
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br from-primary to-ocean border-2 border-background flex items-center justify-center text-xs text-primary-foreground font-medium"
                    >
                      N{i + 1}
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground text-xs sm:text-sm">
                  4,000+ global nodes
                </span>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64">
                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-ocean flex items-center justify-center shadow-glow">
                  <Network className="w-10 h-10 text-primary-foreground" />
                </div>
                {/* Orbiting Nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={angle}
                    className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(100px) rotate(-${angle}deg)`
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </motion.div>
                ))}
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                  <circle 
                    cx="128" 
                    cy="128" 
                    r="100" 
                    fill="none" 
                    stroke="hsl(var(--border))" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyStack;
