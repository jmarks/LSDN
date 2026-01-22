import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface OnboardingStep {
    id: string;
    name: string;
    isRequired: boolean;
}

export interface OnboardingState {
    completedSteps: string[];
    currentStep: string;
    isOnboardingComplete: boolean;
}

const defaultSteps: OnboardingStep[] = [
    { id: 'auth', name: 'Authentication', isRequired: true },
    { id: 'profile', name: 'Profile Completion', isRequired: true },
    { id: 'preferences', name: 'Preferences', isRequired: true },
    { id: 'payment', name: 'Payment Setup', isRequired: false },
    { id: 'welcome', name: 'Welcome', isRequired: true }
];

const STORAGE_KEY = 'onboardingState';

interface OnboardingContextType {
    steps: OnboardingStep[];
    state: OnboardingState;
    completeStep: (stepId: string) => void;
    uncompleteStep: (stepId: string) => void;
    syncWithUser: (user: any) => void;
    resetOnboarding: () => void;
    getProgressPercentage: () => number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [steps] = useState<OnboardingStep[]>(defaultSteps);
    const [state, setState] = useState<OnboardingState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            completedSteps: [],
            currentStep: 'auth',
            isOnboardingComplete: false
        };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const checkOnboardingComplete = useCallback((completedSteps: string[]) => {
        return steps.every(step => !step.isRequired || completedSteps.includes(step.id));
    }, [steps]);

    const completeStep = useCallback((stepId: string) => {
        setState(prev => {
            if (prev.completedSteps.includes(stepId)) return prev;
            const newCompleted = [...prev.completedSteps, stepId];
            return {
                ...prev,
                completedSteps: newCompleted,
                isOnboardingComplete: checkOnboardingComplete(newCompleted)
            };
        });
    }, [checkOnboardingComplete]);

    const uncompleteStep = useCallback((stepId: string) => {
        setState(prev => ({
            ...prev,
            completedSteps: prev.completedSteps.filter(id => id !== stepId),
            isOnboardingComplete: false
        }));
    }, []);

    const syncWithUser = useCallback((user: any) => {
        if (!user) return;
        setState(prev => {
            const completed = [...prev.completedSteps];
            let changed = false;

            // Auth is obviously complete if we have a user
            if (!completed.includes('auth')) {
                completed.push('auth');
                changed = true;
            }

            // Profile check - only requires name, bio, and age
            const hasProfile = !!(
                user.firstName?.trim() &&
                user.lastName?.trim() &&
                user.bio?.trim() &&
                (user.dateOfBirth || (user.age && user.age > 0))
            );
            if (hasProfile && !completed.includes('profile')) {
                completed.push('profile');
                changed = true;
            }

            // Preferences check
            if (user.interests?.length > 0 && !completed.includes('preferences')) {
                completed.push('preferences');
                changed = true;
            }

            if (changed) {
                return {
                    ...prev,
                    completedSteps: completed,
                    isOnboardingComplete: checkOnboardingComplete(completed)
                };
            }
            return prev;
        });
    }, [checkOnboardingComplete]);

    const resetOnboarding = useCallback(() => {
        setState({
            completedSteps: [],
            currentStep: 'auth',
            isOnboardingComplete: false
        });
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const getProgressPercentage = useCallback(() => {
        const required = steps.filter(s => s.isRequired);
        const done = required.filter(s => state.completedSteps.includes(s.id));
        return required.length ? Math.round((done.length / required.length) * 100) : 100;
    }, [steps, state.completedSteps]);

    return (
        <OnboardingContext.Provider value={{
            steps, state, completeStep, uncompleteStep, syncWithUser, resetOnboarding, getProgressPercentage
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboardingContext = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboardingContext must be used within an OnboardingProvider');
    }
    return context;
};
