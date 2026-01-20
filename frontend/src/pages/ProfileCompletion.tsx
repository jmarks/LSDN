import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletion: React.FC = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const interests = [
    'Hiking',
    'Reading',
    'Cooking',
    'Traveling',
    'Photography',
    'Music',
    'Movies',
    'Fitness',
    'Art',
    'Sports',
    'Gaming',
    'Yoga',
    'Writing',
    'Gardening',
    'Dancing'
  ];

  const relationshipGoals = [
    'Long-term relationship',
    'Casual dating',
    'Making friends',
    'Networking',
    'Not sure yet'
  ];

  const filteredInterests = interests.filter(interest =>
    interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePicture(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(item => item !== goal)
        : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!firstName || !lastName || !age || !bio || selectedInterests.length === 0 || selectedGoals.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 18 || ageNum > 100) {
      alert('Age must be between 18 and 100');
      return;
    }

    if (bio.length > 500) {
      alert('Bio must be less than 500 characters');
      return;
    }

    // Here you would typically send the data to the backend
    console.log('Profile completion data:', {
      profilePicture,
      firstName,
      lastName,
      age: ageNum,
      bio,
      interests: selectedInterests,
      relationshipGoals: selectedGoals
    });

    // Navigate to main app after profile completion
    navigate('/discover');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-8 text-center">
            <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100 shadow-lg">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('profile-picture-input')?.click()}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              {profilePicture ? 'Change Photo' : 'Upload Photo'}
            </button>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Tell us about yourself (max 500 characters)"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {bio.length}/500 characters
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Interests</h2>
            <div className="relative mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Search interests..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedInterests.includes(interest)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Relationship Goals */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Relationship Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relationshipGoals.map(goal => (
                <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;
