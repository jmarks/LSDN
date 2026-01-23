import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import './NavigationBar.css';

const NavigationBar: React.FC = () => {
    const { user, logout } = useAuthContext();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) return null;

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: '🏠' },
        { path: '/restaurants', label: 'Browse', icon: '🍽️' },
        { path: '/matches', label: 'Matches', icon: '👥' },
        { path: '/schedule', label: 'Dates', icon: '📅' },
        { path: '/messages', label: 'Chat', icon: '💬', badge: 2 },
        { path: '/profile', label: 'Profile', icon: '👤' }
    ];

    if (isMobile) {
        return (
            <nav className="mobile-bottom-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </NavLink>
                ))}
            </nav>
        );
    }

    return (
        <nav className="desktop-top-nav">
            <div className="nav-brand" onClick={() => navigate('/dashboard')}>
                <span className="brand-logo">💜</span>
                <span className="brand-name">LSDN</span>
            </div>

            <div className="desktop-nav-links">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="desktop-nav-actions">
                <NavLink to="/support" className="support-link">Contact Support</NavLink>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </nav>
    );
};

export default NavigationBar;
