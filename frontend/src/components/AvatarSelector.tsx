import React from 'react';
import './AvatarSelector.css';

const PRESET_AVATARS = [
    { id: 'adventurer', name: 'Adventurer' },
    { id: 'artist', name: 'Artist' },
    { id: 'chef', name: 'Chef' },
    { id: 'gamer', name: 'Gamer' },
    { id: 'musician', name: 'Musician' },
    { id: 'nature', name: 'Nature Lover' },
    { id: 'scholar', name: 'Scholar' },
    { id: 'athlete', name: 'Athlete' },
    { id: 'techie', name: 'Tech Enthusiast' },
    { id: 'traveler', name: 'World Traveler' },
    { id: 'reader', name: 'Bookworm' },
    { id: 'yogi', name: 'Yogi' }
];

interface AvatarSelectorProps {
    onSelect: (avatarId: string) => void;
    selectedAvatarId?: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onSelect, selectedAvatarId }) => {
    return (
        <div className="avatar-selector-container">
            <p className="avatar-selector-title">Or pick an avatar to represent you</p>
            <div className="avatar-grid">
                {PRESET_AVATARS.map((avatar) => (
                    <div
                        key={avatar.id}
                        className={`avatar-option ${selectedAvatarId === avatar.id ? 'selected' : ''}`}
                        onClick={() => onSelect(avatar.id)}
                        title={avatar.name}
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar.id}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                            alt={avatar.name}
                        />
                        {selectedAvatarId === avatar.id && <div className="avatar-check">✓</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvatarSelector;
