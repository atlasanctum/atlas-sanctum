import { useState, useEffect, createContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { UserSegment, UserSegmentConfig, OnboardingStep } from '@/types/userSegments';
import { USER_SEGMENTS } from '@/types/userSegments';

interface OnboardingState {
  currentStep: number;
  completedSteps: string[];
  selectedSegment: UserSegment | null;
  onboardingData: Record<string, unknown>;
  isOnboardingComplete: boolean;
}

export interface OnboardingContextType {
  onboardingState: OnboardingState;
  startOnboarding: (segment: UserSegment) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (stepId: string, data?: Record<string, unknown>) => void;
  skipStep: (stepId: string) => void;
  updateOnboardingData: (data: Record<string, unknown>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  getSegmentConfig: () => UserSegmentConfig | null;
  getCurrentStepConfig: () => OnboardingStep | null;
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentStep: 0,
    completedSteps: [],
    selectedSegment: null,
    onboardingData: {},
    isOnboardingComplete: false,
  });

  useEffect(() => {
    if (user) {
      const savedOnboarding = localStorage.getItem(`onboarding_${user.id}`);
      if (savedOnboarding) {
        try {
          setOnboardingState(JSON.parse(savedOnboarding));
        } catch (error) {
          console.error('Failed to parse saved onboarding data:', error);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && onboardingState.selectedSegment) {
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingState));
    }
  }, [onboardingState, user]);

  const startOnboarding = (segment: UserSegment) => {
    setOnboardingState({ currentStep: 0, completedSteps: [], selectedSegment: segment, onboardingData: {}, isOnboardingComplete: false });
  };

  const nextStep = () => {
    const segmentConfig = USER_SEGMENTS[onboardingState.selectedSegment!];
    if (onboardingState.currentStep < segmentConfig.onboardingSteps.length - 1) {
      setOnboardingState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const previousStep = () => {
    if (onboardingState.currentStep > 0) {
      setOnboardingState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const completeStep = (stepId: string, data?: Record<string, unknown>) => {
    setOnboardingState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, stepId],
      onboardingData: { ...prev.onboardingData, ...data },
    }));
  };

  const skipStep = (stepId: string) => {
    setOnboardingState(prev => ({ ...prev, completedSteps: [...prev.completedSteps, stepId] }));
  };

  const updateOnboardingData = (data: Record<string, unknown>) => {
    setOnboardingState(prev => ({ ...prev, onboardingData: { ...prev.onboardingData, ...data } }));
  };

  const completeOnboarding = () => {
    setOnboardingState(prev => ({ ...prev, isOnboardingComplete: true }));
    if (user && onboardingState.selectedSegment) {
      localStorage.setItem('auth_user', JSON.stringify({ ...user, segment: onboardingState.selectedSegment, onboardingCompleted: true }));
    }
  };

  const resetOnboarding = () => {
    setOnboardingState({ currentStep: 0, completedSteps: [], selectedSegment: null, onboardingData: {}, isOnboardingComplete: false });
    if (user) localStorage.removeItem(`onboarding_${user.id}`);
  };

  const getSegmentConfig = (): UserSegmentConfig | null => {
    if (!onboardingState.selectedSegment) return null;
    return USER_SEGMENTS[onboardingState.selectedSegment];
  };

  const getCurrentStepConfig = (): OnboardingStep | null => {
    const segmentConfig = getSegmentConfig();
    if (!segmentConfig) return null;
    return segmentConfig.onboardingSteps[onboardingState.currentStep] || null;
  };

  return (
    <OnboardingContext.Provider value={{
      onboardingState, startOnboarding, nextStep, previousStep,
      completeStep, skipStep, updateOnboardingData, completeOnboarding,
      resetOnboarding, getSegmentConfig, getCurrentStepConfig,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};
