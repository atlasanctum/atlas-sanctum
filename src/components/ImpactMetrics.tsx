import { motion } from "framer-motion";
import { 
  TreePine, 
  Waves, 
  Heart, 
  Recycle,
  TrendingUp,
  Users
} from "lucide-react";

const metrics = [
  {
    icon: TreePine,
    value: "12.4M",
    unit: "Hectares",
    label: "Land Restored",
    change: "+23%",
    color: "text-earth"
  },
  {
    icon: Waves,
    value: "847K",
    unit: "km²",
    label: "Ocean Protected",
    change: "+18%",
    color: "text-ocean"
  },
  {
    icon: Heart,
    value: "2.8M",
    unit: "Lives",
    label: "Health Improved",
    change: "+45%",
    color: "text-sunset"
  },
  {
    icon: Recycle,
    value: "94%",
    unit: "Rate",
    label: "Circular Economy",
    change: "+12%",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    value: "$4.2B",
    unit: "USD",
    label: "Value Generated",
    change: "+67%",
    color: "text-accent"
  },
  {
    icon: Users,
    value: "156",
    unit: "Nations",
    label: "Global Reach",
    change: "+8%",
    color: "text-aurora"
  }
];

const ImpactMetrics = () => {
  return (
    <section id="impact" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />

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
          <span className="text-accent font-medium tracking-wider uppercase text-xs sm:text-sm">
            Real-Time Impact
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Measuring{" "}
            <span className="text-gradient-gold">Regeneration</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            Transparent, verifiable metrics powered by AI oracles and IoT sensors
            tracking our collective impact across all ecosystems.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div
                className="relative bg-card-gradient border border-border/50 rounded-lg sm:rounded-2xl p-4 sm:p-8 hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary transition-all duration-500 hover:shadow-glow h-full glass-panel"
                role="region"
                aria-label={`${metric.label}: ${metric.value} ${metric.unit}`}
              >
                {/* Icon */}
                <div className={`w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-muted/50 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform ${metric.color}`}>
                  <metric.icon className="w-5 sm:w-7 h-5 sm:h-7" aria-hidden="true" />
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-muted-foreground text-base sm:text-lg">
                    {metric.unit}
                  </span>
                </div>

                {/* Label */}
                <p className="text-muted-foreground text-base sm:text-lg mb-3 sm:mb-4">
                  {metric.label}
                </p>

                {/* Change Indicator */}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs sm:text-sm font-medium" aria-label={`${metric.change} change`}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground text-xs sm:text-sm">vs last year</span>
                </div>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-12 px-4 sm:px-0"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-muted-foreground text-sm sm:text-base">
            Live data from 15,000+ IoT sensors worldwide
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
