import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  route?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="welcome"]',
    title: 'Welcome to Atlas Sanctum! 🌿',
    content: 'Let us show you around the platform and help you get started on your regenerative investment journey.',
    placement: 'bottom',
  },
  {
    id: 'stats',
    target: '[data-tour="stats"]',
    title: 'Your Impact Dashboard',
    content: 'Track your carbon credits, portfolio value, CO₂ offset, and active projects at a glance.',
    placement: 'bottom',
  },
  {
    id: 'quick-links',
    target: '[data-tour="quick-links"]',
    title: 'Quick Navigation',
    content: 'Access the marketplace, your portfolio, bioregions, and settings with one click.',
    placement: 'top',
  },
  {
    id: 'marketplace',
    target: '[data-tour="marketplace"]',
    title: 'Explore the Marketplace',
    content: 'Browse verified carbon credit projects from around the world and invest in planetary regeneration.',
    placement: 'right',
  },
  {
    id: 'notifications',
    target: '[data-tour="notifications"]',
    title: 'Stay Informed',
    content: 'Get real-time alerts for price changes, transaction updates, and portfolio milestones.',
    placement: 'bottom',
  },
];

export function useOnboardingTour() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load tour progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_tour_progress')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setCompletedSteps(data.completed_steps || []);
          setTourCompleted(data.tour_completed || false);
        } else {
          // Check localStorage for first-time users
          const localCompleted = localStorage.getItem(`tour_completed_${user.id}`);
          if (!localCompleted) {
            setIsActive(true);
          }
        }
      } catch (error) {
        console.error('Failed to load tour progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(async () => {
    const currentStepId = TOUR_STEPS[currentStep]?.id;
    
    if (currentStepId && !completedSteps.includes(currentStepId)) {
      const newCompleted = [...completedSteps, currentStepId];
      setCompletedSteps(newCompleted);
      
      if (user) {
        try {
          await supabase
            .from('user_tour_progress')
            .upsert({
              user_id: user.id,
              completed_steps: newCompleted,
              tour_completed: currentStep >= TOUR_STEPS.length - 1,
              completed_at: currentStep >= TOUR_STEPS.length - 1 ? new Date().toISOString() : null,
            }, { onConflict: 'user_id' });
        } catch (error) {
          console.error('Failed to save tour progress:', error);
        }
      }
    }

    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep, completedSteps, user]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(async () => {
    setIsActive(false);
    
    if (user) {
      localStorage.setItem(`tour_completed_${user.id}`, 'true');
      try {
        await supabase
          .from('user_tour_progress')
          .upsert({
            user_id: user.id,
            tour_skipped: true,
            completed_steps: completedSteps,
          }, { onConflict: 'user_id' });
      } catch (error) {
        console.error('Failed to save skip status:', error);
      }
    }
  }, [user, completedSteps]);

  const completeTour = useCallback(async () => {
    setIsActive(false);
    setTourCompleted(true);
    
    if (user) {
      localStorage.setItem(`tour_completed_${user.id}`, 'true');
      try {
        await supabase
          .from('user_tour_progress')
          .upsert({
            user_id: user.id,
            tour_completed: true,
            completed_steps: TOUR_STEPS.map(s => s.id),
            completed_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      } catch (error) {
        console.error('Failed to save completion:', error);
      }
    }
  }, [user]);

  return {
    currentStep,
    isActive,
    tourCompleted,
    isLoading,
    steps: TOUR_STEPS,
    currentStepData: TOUR_STEPS[currentStep],
    progress: ((currentStep + 1) / TOUR_STEPS.length) * 100,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
  };
}
