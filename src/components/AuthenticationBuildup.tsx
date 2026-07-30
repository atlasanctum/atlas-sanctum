import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Eye,
  Fingerprint,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthenticationBuildupProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const AuthenticationBuildup: React.FC<AuthenticationBuildupProps> = ({
  isVisible,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && !isComplete) {
      setCurrentStep(0);
      
      const step1 = setTimeout(() => setCurrentStep(1), 800);
      const step2 = setTimeout(() => setCurrentStep(2), 1600);
      const step3 = setTimeout(() => setCurrentStep(3), 2400);
      const complete = setTimeout(() => {
        setIsComplete(true);
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }, 3000);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(complete);
      };
    } else if (!isVisible) {
      setIsComplete(false);
      setCurrentStep(0);
    }
  }, [isVisible, isComplete, onComplete]);

  const steps = [
    {
      icon: Lock,
      title: 'Securing Connection',
      description: 'Establishing encrypted connection',
      color: 'bg-blue-500'
    },
    {
      icon: ShieldCheck,
      title: 'Verifying Identity',
      description: 'Checking authentication status',
      color: 'bg-purple-500'
    },
    {
      icon: Eye,
      title: 'Biometric Scan',
      description: 'Analyzing user biometrics',
      color: 'bg-green-500'
    },
    {
      icon: Fingerprint,
      title: 'Access Granted',
      description: 'Authentication successful',
      color: 'bg-orange-500'
    }
  ];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md mx-auto p-6"
        >
          {/* Main Animation */}
          <div className="relative flex justify-center items-center h-40 mb-8">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
            
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return (
                    <Icon className={`w-12 h-12 ${
                      currentStep === 3 ? 'text-green-600' : 'text-primary'
                    }`} />
                  );
                })()}
              </div>
              
              {currentStep < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 border-4 border-primary/20 rounded-full"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute inset-0 border-4 border-t-primary border-r-primary rounded-full"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3 mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.5,
                  x: 0,
                  scale: index === currentStep ? 1.05 : 1
                }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  index <= currentStep 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted border border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  index < currentStep 
                    ? 'bg-green-100 text-green-600' 
                    : index === currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : index === currentStep ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {index < currentStep && (
                  <ArrowRight className="w-4 h-4 text-green-600" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {currentStep === 3 && !isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-3"
              >
                <h3 className="text-lg font-bold text-foreground">Authentication Complete!</h3>
                <p className="text-muted-foreground">Preparing to redirect to payment...</p>
                <div className="flex justify-center gap-1">
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual Retry Button */}
          {!isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="text-center"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentStep(0);
                  setIsComplete(false);
                }}
                className="border-border/50"
              >
                Retry Authentication
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthenticationBuildup;
