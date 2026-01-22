import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    updatingProfile: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: any) => Promise<{ success: boolean; error?: string }>;
    updateProfile: (userData: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);

    const fetchUserProfile = useCallback(async (token: string) => {
        try {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setUser(result.data.user);
                    setIsAuthenticated(true);
                }
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await fetchUserProfile(token);
        }
    }, [fetchUserProfile]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token);
        } else {
            setLoading(false);
        }
    }, [fetchUserProfile]);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (result.success) {
                localStorage.setItem('token', result.data.token);
                setUser(result.data.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: result.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const register = async (userData: any) => {
        try {
            setError(null);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const result = await response.json();
            if (result.success) {
                localStorage.setItem('token', result.data.token);
                setUser(result.data.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: result.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const updateProfile = async (userData: any) => {
        try {
            setError(null);
            setUpdatingProfile(true);
            console.log('Sending profile update:', userData);

            const token = localStorage.getItem('token');
            if (!token) return { success: false, error: 'Auth required' };

            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();
            console.log('Profile update response:', result);

            if (response.ok) {
                setUser(result.data.user);
                return { success: true };
            } else {
                const errorMsg = result.message || (result.error?.details?.[0]?.message) || 'Update failed';
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: 'Network error' };
        } finally {
            setUpdatingProfile(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated, user, loading, updatingProfile, error,
            login, register, updateProfile, logout, refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
