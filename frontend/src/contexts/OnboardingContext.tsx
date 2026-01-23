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
    { id: 'auth', name: 'Registration', isRequired: true },
    { id: 'profile', name: 'Profile Detail', isRequired: true },
    { id: 'purchase', name: 'Package Purchase', isRequired: true }
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
        console.log('[OnboardingContext] Initializing state...');
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : null;
            console.log('[OnboardingContext] Loaded from localStorage:', parsed);
            return parsed || {
                completedSteps: [],
                currentStep: 'auth',
                isOnboardingComplete: false
            };
        } catch (error) {
            console.error('[OnboardingContext] Error loading onboarding state:', error);
            return {
                completedSteps: [],
                currentStep: 'auth',
                isOnboardingComplete: false
            };
        }
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
            console.log('[OnboardingContext] Step completed:', stepId, 'New completed list:', newCompleted);
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
            const completed: string[] = [];

            console.log('[OnboardingContext] Syncing with user:', {
                id: user.id,
                hasPhoto: !!(user.profilePhotoUrl || user.avatarId),
                hasInterests: user.interests?.length
            });

            // Auth check
            if (user.id) {
                completed.push('auth');
            }

            // Profile check - mandatory photo/avatar, name, bio, interests
            const hasProfile = !!(
                (user.profilePhotoUrl || user.avatarId) &&
                user.firstName?.trim() &&
                user.lastName?.trim() &&
                user.bio?.trim() &&
                user.interests?.length >= 3
            );

            if (hasProfile) {
                completed.push('profile');
            }

            // Purchase check
            if (user.packages?.length > 0) {
                completed.push('purchase');
            }

            // Check if anything actually changed to avoid re-renders
            const isDifferent =
                completed.length !== prev.completedSteps.length ||
                !completed.every(s => prev.completedSteps.includes(s));

            if (isDifferent) {
                const complete = checkOnboardingComplete(completed);
                console.log('[OnboardingContext] State updated via sync. Complete:', complete, 'Steps:', completed);
                return {
                    ...prev,
                    completedSteps: completed,
                    isOnboardingComplete: complete
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
