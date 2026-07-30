import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  Network,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface PaymentProcessAnimationProps {
  paymentMethod: 'paystack' | 'paypal' | 'stripe' | 'coinbase' | 'wallet';
  isProcessing: boolean;
  onComplete?: () => void;
}

const PaymentProcessAnimation: React.FC<PaymentProcessAnimationProps> = ({
  paymentMethod,
  isProcessing,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0);
      setIsSuccess(false);
      
      const step1 = setTimeout(() => setCurrentStep(1), 800);
      const step2 = setTimeout(() => setCurrentStep(2), 1600);
      const step3 = setTimeout(() => setCurrentStep(3), 2400);
      const complete = setTimeout(() => {
        setIsSuccess(true);
        if (onComplete) onComplete();
      }, 3000);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(complete);
      };
    }
  }, [isProcessing, onComplete]);

  const paymentIcons = {
    paystack: CreditCard,
    paypal: Wallet,
    stripe: CreditCard,
    coinbase: Network,
    wallet: Network
  };

  const paymentNames = {
    paystack: 'Paystack',
    paypal: 'PayPal',
    stripe: 'Stripe',
    coinbase: 'Coinbase',
    wallet: 'MetaMask'
  };

  const PaymentIcon = paymentIcons[paymentMethod];

  const steps = [
    {
      icon: paymentMethod === 'wallet' ? Network : CreditCard,
      title: 'Connecting to ' + paymentNames[paymentMethod],
      description: 'Establishing secure connection'
    },
    {
      icon: ShieldCheck,
      title: 'Verifying Payment',
      description: 'Checking transaction details'
    },
    {
      icon: paymentMethod === 'wallet' ? Wallet : CreditCard,
      title: 'Processing Payment',
      description: 'Completing the transaction'
    },
    {
      icon: CheckCircle2,
      title: 'Payment Successful',
      description: 'Your transaction is complete'
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-8"
          >
            {/* Main Animation */}
            <div className="relative flex justify-center items-center h-32">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
              
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  currentStep === 3 ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                }`}>
                  {currentStep === 3 ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <PaymentIcon className="w-8 h-8" />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div>
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
                    <ArrowRight className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Connection Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-green-500' : 'bg-primary animate-pulse'}`} />
              <span>
                {isSuccess ? 'Connection Complete' : 'Establishing Secure Connection...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isProcessing && isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your transaction has been completed successfully
            </p>
          </div>
          <div className="flex justify-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Secure Transaction
            </span>
          </div>
        </motion.div>
      )}

      {!isProcessing && !isSuccess && (
        <div className="text-center py-8 text-muted-foreground">
          <PaymentIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Click "Pay Now" to proceed with your payment</p>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessAnimation;
