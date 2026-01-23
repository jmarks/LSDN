import React from 'react';
import { useOnboardingContext } from '../contexts/OnboardingContext';
import './OnboardingProgressBar.css';

const OnboardingProgressBar: React.FC = () => {
    const { steps, state, getProgressPercentage } = useOnboardingContext();

    if (state.isOnboardingComplete) return null;

    const percentage = getProgressPercentage();
    const currentIndex = steps.findIndex(s => s.id === state.currentStep);

    return (
        <div className="onboarding-progress-container">
            <div className="onboarding-progress-wrapper">
                <div className="onboarding-steps">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${steps.length > 1 && currentIndex >= 0
                                ? (currentIndex / (steps.length - 1)) * 100
                                : 0}%`
                        }}
                    ></div>
                    {steps.map((step, index) => {
                        const isCompleted = state.completedSteps.includes(step.id);
                        const isActive = step.id === state.currentStep;

                        return (
                            <div
                                key={step.id}
                                className={`onboarding-step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                            >
                                <div className="step-dot">
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                <div className="step-label">{step.name}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="percentage-text">{percentage}% Complete</div>
            </div>
        </div>
    );
};

export default OnboardingProgressBar;
