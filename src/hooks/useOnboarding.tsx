import { useContext } from 'react';
import { OnboardingContext } from '@/context/OnboardingContext';
import type { OnboardingContextType } from '@/context/OnboardingContext';

export type { OnboardingContextType };

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
