import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';

export function OnboardingTour() {
  const {
    currentStep,
    isActive,
    currentStepData,
    progress,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    isLoading,
    steps,
  } = useOnboardingTour();

  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updatePosition = useCallback(() => {
    if (!currentStepData) return;

    const target = document.querySelector(currentStepData.target);
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);

      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const padding = 16;

      let top = 0;
      let left = 0;

      switch (currentStepData.placement) {
        case 'top':
          top = rect.top - tooltipHeight - padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - padding;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + padding;
          break;
        default:
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
      }

      // Keep within viewport
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));

      setTooltipPosition({ top, left });
    }
  }, [currentStepData]);

  useEffect(() => {
    if (isActive) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isActive, currentStep, updatePosition]);

  if (isLoading || !isActive || !currentStepData) return null;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Highlight Box */}
      <AnimatePresence mode="wait">
        {targetRect && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[101] pointer-events-none"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              boxShadow: '0 0 0 4px hsl(var(--primary)), 0 0 0 9999px rgba(0,0,0,0.6)',
              borderRadius: 12,
            }}
          />
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[102] w-80 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Progress */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipTour}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-foreground mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-muted-foreground hover:text-foreground gap-1"
            >
              <SkipForward className="w-4 h-4" />
              Skip tour
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button
                size="sm"
                onClick={isLastStep ? completeTour : nextStep}
                className="gap-1"
              >
                {isLastStep ? (
                  <>
                    Complete
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
