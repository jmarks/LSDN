import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../contexts/AuthContext';
import NavigationBar from '../components/NavigationBar';
import './Dashboard.css';

interface DashboardData {
    stats: {
        totalDatesPurchased: number;
        totalDatesUsed: number;
        datesRemaining: number;
        upcomingCount: number;
        pendingInviteCount: number;
    };
    activePackages: any[];
    upcomingDates: any[];
    pendingInvites: any[];
    completedDates: any[];
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get('/api/dashboard/stats');
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="dashboard-loading">Loading your night... ✨</div>;

    return (
        <div className="dashboard-page">
            <NavigationBar />

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div className="welcome-text">
                        <h1>Hi, {user?.firstName} 👋</h1>
                        <p>Ready for your next amazing date night?</p>
                    </div>
                    <button className="btn-new-date" onClick={() => navigate('/matches')}>
                        Plan New Date
                    </button>
                </header>

                {/* Stats Grid */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{data?.stats.datesRemaining}</span>
                        <span className="stat-label">Dates Remaining</span>
                    </div>
                    <div className="stat-card highlight">
                        <span className="stat-value">{data?.stats.upcomingCount}</span>
                        <span className="stat-label">Upcoming Dates</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{data?.stats.pendingInviteCount}</span>
                        <span className="stat-label">Invites Pending</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{data?.stats.totalDatesPurchased}</span>
                        <span className="stat-label">Total Purchased</span>
                    </div>
                </section>

                <div className="dashboard-main-grid">
                    {/* Main Left Column */}
                    <div className="dashboard-column-main">
                        {/* Upcoming Section */}
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Upcoming Dates</h2>
                                <button onClick={() => navigate('/schedule')}>View Schedule</button>
                            </div>

                            {data?.upcomingDates.length === 0 ? (
                                <div className="empty-section-card">
                                    <p>No dates scheduled yet. Browse matches to start!</p>
                                    <button onClick={() => navigate('/matches')} className="btn-secondary">Explore Matches</button>
                                </div>
                            ) : (
                                <div className="dates-list">
                                    {data?.upcomingDates.map(date => (
                                        <div key={date.id} className="date-card">
                                            <div className="date-time">
                                                <span className="month">{new Date(date.bookingTime).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="day">{new Date(date.bookingTime).getDate()}</span>
                                            </div>
                                            <div className="date-info">
                                                <h3>Dinner with {date.userB?.id === user?.id ? date.userA?.firstName : date.userB?.firstName}</h3>
                                                <p>📍 {date.restaurant?.name}</p>
                                                <span className="time-pill">
                                                    {new Date(date.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <button className="btn-details">Details</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Active Packages */}
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Active Packages</h2>
                                <button onClick={() => navigate('/onboarding/shop')}>Buy More</button>
                            </div>
                            <div className="packages-horizontal-list">
                                {data?.activePackages.map(pkg => (
                                    <div key={pkg.id} className="package-mini-card">
                                        <div className="pkg-header">
                                            <span className="restaurant-name">{pkg.package.restaurant.name}</span>
                                            <span className="usage">{pkg.datesUsed}/{pkg.datesPurchased} Used</span>
                                        </div>
                                        <h4>{pkg.package.name}</h4>
                                        <div className="progress-mini">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${(pkg.datesUsed / pkg.datesPurchased) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Right Column */}
                    <div className="dashboard-column-side">
                        {/* Pending Invites */}
                        <section className="dashboard-section">
                            <h2>Pending Invites</h2>
                            <div className="invites-list">
                                {data?.pendingInvites.length === 0 ? (
                                    <p className="empty-hint">No pending invites. Matches you invite will appear here!</p>
                                ) : (
                                    data?.pendingInvites.map(invite => (
                                        <div key={invite.id} className="invite-item">
                                            <div className="invite-avatar">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.userB?.id || 'anon'}`} alt="Avatar" />
                                            </div>
                                            <div className="invite-body">
                                                <strong>{invite.userB?.firstName}</strong>
                                                <span>Invited to {invite.restaurant?.name}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Promotions / Ad */}
                        <div className="promo-card">
                            <h3>Refer a Friend</h3>
                            <p>Get a free date night when you refer 3 friends to LSDN!</p>
                            <button className="btn-promo">Get Invite Link</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
