import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ 
  value, 
  className = '', 
  decimals = 0, 
  prefix = '', 
  suffix = '',
  duration = 1
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [spring]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString();

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
}
