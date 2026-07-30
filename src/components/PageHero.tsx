import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type Easing } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badgeText?: string;
  stats?: Array<{ value: string; label: string }>;
}

const PageHero = ({ 
  title, 
  subtitle, 
  ctaText = "Get Started", 
  ctaLink = "/auth",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "/",
  badgeText = "Regenerative Platform",
  stats 
}: PageHeroProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 75]);
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
      const x = (clientX / window.innerWidth - 0.5) * 15;
      const y = (clientY / window.innerHeight - 0.5) * 15;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const easeInOut: Easing = "easeInOut";

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-regenerative pt-20"
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        style={{ opacity }}
      />

      {/* Parallax Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
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
        className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-primary/30 blur-3xl"
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
        className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-accent/20 blur-3xl"
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
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
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
        <div className="max-w-4xl mx-auto text-center">
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
              {badgeText}
            </span>
          </motion.div>

          {/* Main Headline with staggered animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
          >
            <motion.span 
              className="block text-foreground"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {title}
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {subtitle}
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
                <Link to={ctaLink}>
                  {ctaText}
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
                <Link to={secondaryCtaLink}>
                  {secondaryCtaText}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Row with staggered reveal */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
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
                      delay: 1.4 + index * 0.1 
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
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

export default PageHero;
