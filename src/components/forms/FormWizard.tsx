/**
 * FormWizard Component
 * Multi-step form wizard with progress tracking
 */

import React, { useState, useCallback } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  validation?: () => Promise<boolean> | boolean;
}

interface FormWizardProps {
  steps: WizardStep[];
  onComplete: (data: Record<string, unknown>) => void;
  initialData?: Record<string, unknown>;
  className?: string;
}

export function FormWizard({
  steps,
  onComplete,
  initialData = {},
  className = '',
}: FormWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isCurrentStepCompleted = completedSteps.has(currentStep.id);

  const updateFormData = useCallback((data: Partial<Record<string, unknown>>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const validateStep = useCallback(async (): Promise<boolean> => {
    if (currentStep.validation) {
      try {
        const isValid = await currentStep.validation();
        if (!isValid) {
          setErrors((prev) => ({
            ...prev,
            [currentStep.id]: 'Please fix the errors before continuing',
          }));
          return false;
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [currentStep.id]: 'Validation failed. Please check your inputs.',
        }));
        return false;
      }
    }
    setErrors((prev) => ({ ...prev, [currentStep.id]: '' }));
    return true;
  }, [currentStep]);

  const handleNext = useCallback(async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    setCompletedSteps((prev) => new Set(prev).add(currentStep.id));

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        await onComplete(formData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStep, formData, isLastStep, onComplete, validateStep]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const handleGoToStep = useCallback((index: number) => {
    // Only allow going back to completed steps or the immediate previous step
    if (index < currentStepIndex || (index === currentStepIndex - 1)) {
      setCurrentStepIndex(index);
    }
  }, [currentStepIndex]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      {/* Progress Steps */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleGoToStep(index)}
                  disabled={index > currentStepIndex && !isCompleted}
                  className={`flex items-center ${
                    index > currentStepIndex && !isCompleted
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-slate-500">{step.description}</p>
                    )}
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="text-slate-600 mt-1">{currentStep.description}</p>
          )}
        </div>

        {errors[currentStep.id] && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors[currentStep.id]}
          </div>
        )}

        <div className="min-h-[200px]">
          {React.isValidElement(currentStep.component) &&
            React.cloneElement(currentStep.component as React.ReactElement<any>, {
              formData,
              updateFormData,
              errors,
              setErrors,
            })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
        <button
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            isFirstStep || isSubmitting
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : isLastStep ? (
            <>
              Complete
              <Check className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Example usage hook for form data management
export function useFormWizard<T extends Record<string, unknown>>(
  initialData: T
): {
  formData: T;
  updateFormData: (data: Partial<T>) => void;
  resetForm: () => void;
} {
  const [formData, setFormData] = useState<T>(initialData);

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return { formData, updateFormData, resetForm };
}

export default FormWizard;
