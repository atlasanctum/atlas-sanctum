import { motion } from "framer-motion";
import { ArrowRight, Mail, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-regenerative scroll-mt-16">
      {/* Soft Grid */}
      <div className="absolute inset-0 bg-soft-grid opacity-[0.05] pointer-events-none" />
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-ocean/10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center glass-panel border border-border/40 p-10 md:p-16 rounded-3xl"
        >
          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join the{" "}
            <span className="text-gradient">Regenerative</span>
            <br />
            Revolution
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-center">
            Be part of the world's largest ecosystem for regenerating land, 
            oceans, and human flourishing. Together, we scale to trillions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button variant="hero" size="xl" asChild>
              <a href="/auth">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="/contact">
                <Mail className="w-5 h-5 mr-2" />
                Talk to Sales
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-16">
            No credit card required • SOC2-minded controls • Guided onboarding
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6">
            <a 
              href="#" 
              className="w-12 h-12 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 pt-12 border-t border-border/50"
        >
          <p className="text-center text-muted-foreground text-sm mb-8">
            Trusted by leading organizations worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {["UN Climate", "World Bank", "WEF", "WWF", "IUCN"].map((org) => (
              <span 
                key={org}
                className="text-lg md:text-xl font-display font-semibold text-muted-foreground"
              >
                {org}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
