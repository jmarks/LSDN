import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationMethodSelector.css';

const RegistrationMethodSelector: React.FC = () => {
    const navigate = useNavigate();

    const methods = [
        {
            id: 'email',
            name: 'Email Address',
            icon: '✉️',
            description: 'Standard account with email and password',
            active: true
        },
        {
            id: 'phone',
            name: 'Phone Number',
            icon: '📱',
            description: 'Register and sign in via SMS code',
            active: false
        },
        {
            id: 'google',
            name: 'Google',
            icon: '🌐',
            description: 'Fast registration using your Google account',
            active: false
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: '👥',
            description: 'Connect with your Facebook profile',
            active: false
        }
    ];

    return (
        <div className="registration-method-page">
            <div className="method-container">
                <h1>Create your account</h1>
                <p className="subtitle">Select your preferred registration method</p>

                <div className="method-grid">
                    {methods.map(method => (
                        <div
                            key={method.id}
                            className={`method-card ${!method.active ? 'pending' : ''}`}
                            onClick={() => method.active && navigate('/register')}
                        >
                            <div className="method-icon">{method.icon}</div>
                            <div className="method-info">
                                <h3>{method.name}</h3>
                                <p>{method.description}</p>
                            </div>
                            {!method.active && <span className="status-badge">Coming Soon</span>}
                            {method.active && <span className="arrow">→</span>}
                        </div>
                    ))}
                </div>

                <div className="footer-links">
                    Already have an account? <button onClick={() => navigate('/login')}>Login here</button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationMethodSelector;
