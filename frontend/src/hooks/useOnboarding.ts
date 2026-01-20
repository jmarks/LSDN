import { useState, useEffect, useCallback } from 'react';

// Define the structure for onboarding steps
export interface OnboardingStep {
  id: string;
  name: string;
  isRequired: boolean;
}

// Define the onboarding state
export interface OnboardingState {
  completedSteps: string[];
  currentStep: string;
  isOnboardingComplete: boolean;
}

// Define default onboarding steps
const defaultSteps: OnboardingStep[] = [
  { id: 'auth', name: 'Authentication', isRequired: true },
  { id: 'profile', name: 'Profile Completion', isRequired: true },
  { id: 'preferences', name: 'Preferences', isRequired: true },
  { id: 'payment', name: 'Payment Setup', isRequired: false },
  { id: 'welcome', name: 'Welcome', isRequired: true }
];

// Local storage key for persisting onboarding state
const STORAGE_KEY = 'onboardingState';

export const useOnboarding = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);
  const [state, setState] = useState<OnboardingState>({
    completedSteps: [],
    currentStep: 'auth',
    isOnboardingComplete: false
  });

  // Load state from local storage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        setState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to parse onboarding state from local storage:', error);
      }
    }
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Check if all required steps have been completed
  const checkOnboardingComplete = useCallback(() => {
    const allRequiredStepsCompleted = steps.every(step => 
      !step.isRequired || state.completedSteps.includes(step.id)
    );
    
    if (allRequiredStepsCompleted && !state.isOnboardingComplete) {
      setState(prev => ({ ...prev, isOnboardingComplete: true }));
    }
  }, [steps, state.completedSteps, state.isOnboardingComplete]);

  // Mark a step as completed
  const completeStep = useCallback((stepId: string) => {
    if (!state.completedSteps.includes(stepId)) {
      setState(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, stepId]
      }));
    }
  }, [state.completedSteps]);

  // Mark a step as uncompleted (for backward navigation or error handling)
  const uncompleteStep = useCallback((stepId: string) => {
    setState(prev => ({
      ...prev,
      completedSteps: prev.completedSteps.filter(id => id !== stepId),
      isOnboardingComplete: false // If a step is uncompleted, onboarding is not complete
    }));
  }, []);

  // Navigate to the next step
  const nextStep = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === state.currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      setState(prev => ({ ...prev, currentStep: nextStepId }));
    }
  }, [steps, state.currentStep]);

  // Navigate to the previous step
  const previousStep = useCallback(() => {
    const currentIndex = steps.findIndex(step => step.id === state.currentStep);
    if (currentIndex > 0) {
      const previousStepId = steps[currentIndex - 1].id;
      setState(prev => ({ ...prev, currentStep: previousStepId }));
    }
  }, [steps, state.currentStep]);

  // Navigate to a specific step
  const goToStep = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setState(prev => ({ ...prev, currentStep: stepId }));
    }
  }, [steps]);

  // Check if a step has been completed
  const isStepCompleted = useCallback((stepId: string) => {
    return state.completedSteps.includes(stepId);
  }, [state.completedSteps]);

  // Check if a step is currently active
  const isStepActive = useCallback((stepId: string) => {
    return state.currentStep === stepId;
  }, [state.currentStep]);

  // Check if a step is accessible (all required previous steps completed)
  const isStepAccessible = useCallback((stepId: string) => {
    const targetIndex = steps.findIndex(step => step.id === stepId);
    
    // Check if all previous steps are completed (or not required)
    const previousSteps = steps.slice(0, targetIndex);
    return previousSteps.every(step => 
      !step.isRequired || state.completedSteps.includes(step.id)
    );
  }, [steps, state.completedSteps]);

  // Calculate progress percentage
  const getProgressPercentage = useCallback(() => {
    const requiredSteps = steps.filter(step => step.isRequired);
    const completedRequiredSteps = requiredSteps.filter(step => 
      state.completedSteps.includes(step.id)
    );
    
    if (requiredSteps.length === 0) return 100;
    return Math.round((completedRequiredSteps.length / requiredSteps.length) * 100);
  }, [steps, state.completedSteps]);

  // Calculate progress count (e.g., 2 of 5 steps completed)
  const getProgressCount = useCallback(() => {
    const requiredSteps = steps.filter(step => step.isRequired);
    const completedRequiredSteps = requiredSteps.filter(step => 
      state.completedSteps.includes(step.id)
    );
    
    return {
      current: completedRequiredSteps.length,
      total: requiredSteps.length
    };
  }, [steps, state.completedSteps]);

  // Reset the onboarding state (for testing or account deletion)
  const resetOnboarding = useCallback(() => {
    const initialState: OnboardingState = {
      completedSteps: [],
      currentStep: 'auth',
      isOnboardingComplete: false
    };
    
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Update onboarding state when completed steps change
  useEffect(() => {
    checkOnboardingComplete();
  }, [checkOnboardingComplete]);

  return {
    // Steps
    steps,
    setSteps,
    
    // State
    state,
    
    // Actions
    completeStep,
    uncompleteStep,
    nextStep,
    previousStep,
    goToStep,
    resetOnboarding,
    
    // Checkers
    isStepCompleted,
    isStepActive,
    isStepAccessible,
    
    // Progress
    getProgressPercentage,
    getProgressCount
  };
};

export default useOnboarding;
