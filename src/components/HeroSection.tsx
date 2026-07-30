import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type Easing } from "framer-motion";
import { ArrowRight, Sparkles, Globe2, ShieldCheck, Gauge, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Smooth spring animations
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });
  const springY3 = useSpring(y3, { stiffness: 100, damping: 30 });

  // Mouse follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const easeInOut: Easing = "easeInOut";

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden bg-regenerative"
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        style={{ opacity }}
      />

      {/* Parallax Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        style={{ 
          y: springY1,
          x: mousePosition.x * 0.5,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: easeInOut,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/30 blur-3xl"
        style={{ 
          y: springY2,
          x: mousePosition.x * -0.3,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: easeInOut,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-accent/20 blur-3xl"
        style={{ y: springY3 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: easeInOut,
          delay: 2,
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Soft Grid Overlay */}
      <div className="absolute inset-0 bg-soft-grid opacity-[0.06] pointer-events-none" />

      <motion.div 
        className="container mx-auto px-4 sm:px-6 relative z-10"
        style={{ scale, opacity }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm mb-8 cursor-default"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
            </motion.div>
            <span className="text-sm text-muted-foreground">
              Regenerative Value Exchange • Powered by AI & Blockchain
            </span>
          </motion.div>

          {/* Main Headline with staggered animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-8"
          >
            <motion.span 
              className="block text-foreground"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Regenerating
            </motion.span>
            <motion.span 
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-gradient">
                Earth's Future
              </span>
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-center"
          >
            The world's first regenerative platform uniting ecosystems across land,
            oceans, and human health—scaling to trillion-dollar impact with an enduring ethical core.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                asChild
              >
                <Link to="/auth">
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 border-border/50 hover:bg-accent/10"
                asChild
              >
                <Link to="/contact">
                  <Globe2 className="w-4 h-4" />
                  Book a Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Conversion bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto mb-12"
          >
            {[
              { icon: ShieldCheck, text: "Verified impact with DAO-backed governance" },
              { icon: Gauge, text: "Live analytics & measurement you can trust" },
              { icon: Users, text: "Onboard teams, investors, and communities fast" },
            ].map((item, idx) => (
              <div
                key={item.text}
                className="flex items-center gap-3 justify-center bg-card/40 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground/90"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="leading-snug">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats Row with staggered reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "$2.4T", label: "Addressable Market", delay: 0 },
              { value: "150+", label: "Global Partners", delay: 0.1 },
              { value: "12M", label: "Hectares Protected", delay: 0.2 },
              { value: "99.9%", label: "Carbon Verified", delay: 0.3 },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + stat.delay }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="text-center p-4 md:p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default glass-panel"
              >
                <motion.div 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 1.4 + stat.delay 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-12"
          >
            
          
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;