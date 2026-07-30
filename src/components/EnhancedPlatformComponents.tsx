import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  InteractiveButton, 
  AnimatedCounter, 
  AnimatedProgress, 
  InteractiveCard,
  StaggeredList,
  ToastNotification,
  LoadingSpinner
} from './Interactions';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Leaf, Users, Zap, Globe, Shield, 
  ShoppingCart, BarChart3, Target 
} from 'lucide-react';

// Enhanced Marketplace Card with Interactions
export const EnhancedMarketplaceCard: React.FC<{
  project: {
    title: string;
    price: number;
    available: number;
    location: string;
    type: string;
    impact: number;
  };
}> = ({ project }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowToast(true);
  };

  return (
    <>
      <InteractiveCard className="h-full">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <Badge variant="secondary">{project.type}</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per RIU</span>
              <span className="font-semibold">${project.price}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <AnimatedCounter value={project.available} suffix=" RIUs" />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Location</span>
              <span>{project.location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impact Score</span>
              <span className="font-semibold">{project.impact}%</span>
            </div>
            <AnimatedProgress value={project.impact} color="bg-green-500" />
          </div>

          <InteractiveButton
            onClick={handlePurchase}
            loading={isLoading}
            variant="primary"
            size="md"
          >
            <ShoppingCart className="w-4 h-4" />
            Purchase RIUs
          </InteractiveButton>
        </div>
      </InteractiveCard>

      <ToastNotification
        message="RIUs purchased successfully!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

// Interactive Dashboard Metrics
export const InteractiveDashboard: React.FC = () => {
  const metrics = [
    { 
      title: 'Total RIUs', 
      value: 24500000, 
      icon: Leaf, 
      color: 'text-green-500',
      suffix: '',
      change: '+12.5%'
    },
    { 
      title: 'Market Volume', 
      value: 1840000000, 
      icon: TrendingUp, 
      color: 'text-blue-500',
      prefix: '$',
      suffix: '',
      change: '+8.3%'
    },
    { 
      title: 'Active Users', 
      value: 25000, 
      icon: Users, 
      color: 'text-purple-500',
      suffix: '+',
      change: '+15.2%'
    },
    { 
      title: 'Projects', 
      value: 847, 
      icon: Target, 
      color: 'text-amber-500',
      suffix: '',
      change: '+5.7%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StaggeredList staggerDelay={0.1}>
        {metrics.map((metric, index) => (
          <InteractiveCard key={metric.title}>
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
              <Badge variant="outline" className="text-green-600 border-green-600">
                {metric.change}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </h3>
              <p className={`text-2xl font-bold ${metric.color}`}>
                <AnimatedCounter 
                  value={metric.value} 
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  decimals={metric.value > 1000000 ? 1 : 0}
                />
              </p>
            </div>
          </InteractiveCard>
        ))}
      </StaggeredList>
    </div>
  );
};

// Enhanced Feature Grid
export const InteractiveFeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Marketplace',
      description: 'Browse and purchase carbon credits',
      icon: ShoppingCart,
      color: 'text-green-500',
      href: '/marketplace'
    },
    {
      title: 'Analytics',
      description: 'Real-time environmental data',
      icon: BarChart3,
      color: 'text-blue-500',
      href: '/measurements'
    },
    {
      title: 'Governance',
      description: 'Democratic decision-making',
      icon: Users,
      color: 'text-purple-500',
      href: '/governance'
    },
    {
      title: 'Security',
      description: 'Blockchain verification',
      icon: Shield,
      color: 'text-amber-500',
      href: '/security'
    },
    {
      title: 'Global Impact',
      description: 'Worldwide scaling',
      icon: Globe,
      color: 'text-cyan-500',
      href: '/adoption'
    },
    {
      title: 'Innovation',
      description: 'Cutting-edge technology',
      icon: Zap,
      color: 'text-pink-500',
      href: '/architecture'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StaggeredList staggerDelay={0.15}>
        {features.map((feature) => (
          <InteractiveCard 
            key={feature.title}
            onClick={() => window.location.href = feature.href}
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
              
              <InteractiveButton variant="secondary" size="sm">
                Explore
              </InteractiveButton>
            </div>
          </InteractiveCard>
        ))}
      </StaggeredList>
    </div>
  );
};

// Loading State Component
export const PlatformLoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <LoadingSpinner size="lg" />
    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold">Loading Atlas Sanctum</h3>
      <p className="text-sm text-muted-foreground">Initializing regenerative systems...</p>
    </div>
  </div>
);

// Interactive Progress Tracker
export const ProgressTracker: React.FC<{
  steps: Array<{ title: string; completed: boolean; current?: boolean }>;
}> = ({ steps }) => (
  <div className="space-y-4">
    {steps.map((step, index) => (
      <motion.div
        key={step.title}
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step.completed 
            ? 'bg-green-500 text-white' 
            : step.current 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
        }`}>
          {step.completed ? '✓' : index + 1}
        </div>
        
        <div className="flex-1">
          <h4 className={`font-medium ${
            step.current ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {step.title}
          </h4>
        </div>
        
        {step.current && (
          <motion.div
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    ))}
  </div>
);