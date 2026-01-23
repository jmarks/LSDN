import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { completeStep } = useOnboarding();

    const handleFinish = () => {
        completeStep('welcome');
        navigate('/onboarding/shop');
    };

    return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
            <div className="mb-8 flex justify-center">
                <div className="bg-blue-100 p-6 rounded-full">
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <h2 className="text-4xl font-bold mb-4">You're All Set!</h2>
            <p className="text-xl text-gray-600 mb-12">
                Welcome to Local Singles Date Night. Your profile is ready, and we've found some amazing local restaurants for your first date.
            </p>

            <div className="space-y-6 mb-12 text-left bg-gray-50 p-8 rounded-2xl">
                <h3 className="font-bold text-lg mb-4">What's Next?</h3>
                <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</div>
                    <p className="text-gray-700">Browse nearby restaurants and their special date night packages.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</div>
                    <p className="text-gray-700">Find someone you'd like to meet and propose a date at a specific time.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</div>
                    <p className="text-gray-700">Once they accept, your table is booked and you can start chatting!</p>
                </div>
            </div>

            <button
                onClick={handleFinish}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                Start Exploring
            </button>
        </div>
    );
};

export default Welcome;
