import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const INTEREST_OPTIONS = [
    'Surfing', 'Hiking', 'Cooking', 'Wine Tasting', 'Live Music',
    'Art Galleries', 'Yoga', 'Coffee', 'Beach Walks', 'Board Games',
    'Craft Beer', 'Photography', 'Gardening', 'Cycling', 'Volunteering'
];

const Preferences: React.FC = () => {
    const navigate = useNavigate();
    const { completeStep } = useOnboarding();
    const { user, updateProfile } = useAuth();

    const [minAge, setMinAge] = useState(user?.ageRangeMin || 21);
    const [maxAge, setMaxAge] = useState(user?.ageRangeMax || 45);
    const [radius, setRadius] = useState(user?.radiusPreference || 15);
    const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                ageRangeMin: minAge,
                ageRangeMax: maxAge,
                radiusPreference: radius,
                interests: selectedInterests
            });

            completeStep('preferences');
            toast.success('Preferences saved!');
            navigate('/onboarding/welcome');
        } catch (error) {
            toast.error('Failed to save preferences');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold mb-2">Your Preferences</h2>
            <p className="text-gray-600 mb-8">Tell us who you're looking for and what you love.</p>

            <div className="space-y-8">
                {/* Age Range */}
                <div>
                    <label className="block text-lg font-medium mb-4">Age Range: {minAge} - {maxAge}</label>
                    <div className="flex gap-4">
                        <input
                            type="range" min="18" max="99" value={minAge}
                            onChange={(e) => setMinAge(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <input
                            type="range" min="18" max="99" value={maxAge}
                            onChange={(e) => setMaxAge(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Distance */}
                <div>
                    <label className="block text-lg font-medium mb-4">Max Distance: {radius} miles</label>
                    <input
                        type="range" min="1" max="100" value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Interests */}
                <div>
                    <label className="block text-lg font-medium mb-4">Interests</label>
                    <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map(interest => (
                            <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`px-4 py-2 rounded-full border transition-colors ${selectedInterests.includes(interest)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                                    }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default Preferences;
