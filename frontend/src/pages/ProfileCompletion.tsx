import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useOnboardingContext } from '../contexts/OnboardingContext';
import OnboardingProgressBar from '../components/OnboardingProgressBar';
import AvatarSelector from '../components/AvatarSelector';
import InterestTagInput from '../components/InterestTagInput';
import './ProfileCompletion.css';

const ProfileCompletion: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser, updateProfile } = useAuthContext();
  const { completeStep } = useOnboardingContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState<'upload' | 'avatar'>('upload');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestedIn, setInterestedIn] = useState<string[]>([]); // Gender preference
  const [connectionType, setConnectionType] = useState<string[]>([]); // Relationship type

  // Sync state when user data is loaded/available
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAge(user.age?.toString() || '');
      setBio(user.bio || '');
      setProfilePicture(user.profilePhotoUrl || null);
      setAvatarId(user.avatarId || null);
      setSelectedInterests(Array.isArray(user.interests) ? user.interests : []);
      setInterestedIn(Array.isArray(user.relationshipGoals) ?
        user.relationshipGoals.filter((g: string) => ['Men', 'Women', 'Non-binary', 'Everyone'].includes(g)) : []
      );
      setConnectionType(Array.isArray(user.relationshipGoals) ?
        user.relationshipGoals.filter((g: string) => !['Men', 'Women', 'Non-binary', 'Everyone'].includes(g)) : []
      );
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image too large. Max 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePicture(event.target.result as string);
          setAvatarId(null); // Clear avatar if photo is uploaded
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (id: string) => {
    setAvatarId(id);
    setProfilePicture(null); // Clear photo if avatar is selected
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required');
      return;
    }
    if (!profilePicture && !avatarId) {
      setError('Please upload a photo or select an avatar');
      return;
    }
    if (selectedInterests.length < 3) {
      setError('Please select at least 3 interest tags');
      return;
    }
    if (!bio.trim() || bio.length < 20) {
      setError('Bio must be at least 20 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateProfile({
        firstName,
        lastName,
        age: parseInt(age),
        bio,
        profilePhotoUrl: profilePicture,
        avatarId,
        interests: selectedInterests,
        relationshipGoals: [...interestedIn, ...connectionType],
        onboardingStep: 'profile'
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      await refreshUser();
      completeStep('profile');
      await refreshUser();
      completeStep('profile');
      navigate('/onboarding/welcome');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-page profile-completion">
      <OnboardingProgressBar />

      <div className="profile-form-card">
        <h1>Customize your profile</h1>
        <p className="subtitle">Let others know the real you</p>

        <form onSubmit={handleSubmit}>
          <section className="form-section photo-section">
            <label>Profile Appearance</label>
            <div className="photo-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${photoMode === 'upload' ? 'active' : ''}`}
                onClick={() => setPhotoMode('upload')}
              >
                Upload Photo
              </button>
              <button
                type="button"
                className={`mode-btn ${photoMode === 'avatar' ? 'active' : ''}`}
                onClick={() => setPhotoMode('avatar')}
              >
                Use Avatar
              </button>
            </div>

            <div className="photo-controls">
              <div className="current-photo-preview">
                {photoMode === 'upload' && profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : photoMode === 'avatar' && avatarId ? (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt="Avatar" />
                ) : (
                  <div className="placeholder-circle">👤</div>
                )}
              </div>

              <div className="photo-actions">
                {photoMode === 'upload' ? (
                  <>
                    <button
                      type="button"
                      className="btn-upload"
                      onClick={() => document.getElementById('photo-input')?.click()}
                    >
                      Choose Image
                    </button>
                    <input
                      id="photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </>
                ) : (
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Select an avatar below</div>
                )}
              </div>
            </div>

            {photoMode === 'avatar' && (
              <AvatarSelector
                selectedAvatarId={avatarId || undefined}
                onSelect={handleAvatarSelect}
              />
            )}
          </section>

          {/* Identity Section */}
          <section className="form-section">
            <div className="row">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Alex"
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="age">Your Age</label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Must be 18+"
                min="18"
              />
            </div>
          </section>

          {/* Bio Section */}
          <section className="form-section">
            <label htmlFor="bio">About You</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your story... What makes you unique?"
              rows={4}
            />
            <span className="char-count">{(bio || '').length}/500</span>
          </section>

          {/* Interests Section */}
          <section className="form-section">
            <label>Interests & Hobbies</label>
            <InterestTagInput
              selectedTags={selectedInterests}
              onChange={setSelectedInterests}
            />
          </section>

          {/* Connection Type Section */}
          <section className="form-section">
            <label>I am looking for...</label>
            <div className="goals-grid">
              {['Long-term Partner', 'New Friends', 'Casual Dating', 'Networking', 'Activity Partner'].map(option => (
                <label key={option} className="goal-chip">
                  <input
                    type="checkbox"
                    checked={connectionType.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) setConnectionType([...connectionType, option]);
                      else setConnectionType(connectionType.filter(g => g !== option));
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Goals Section */}
          <section className="form-section">
            <label>I am interested in meeting...</label>
            <div className="goals-grid">
              {['Men', 'Women', 'Non-binary', 'Everyone'].map(option => (
                <label key={option} className="goal-chip">
                  <input
                    type="checkbox"
                    checked={interestedIn.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) setInterestedIn([...interestedIn, option]);
                      else setInterestedIn(interestedIn.filter(g => g !== option));
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </section>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-profile-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving Profile...' : 'Save & Continue'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfileCompletion;
