import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if token exists and validate on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Here you would typically validate the token with the backend
      // For now, we'll just set isAuthenticated to true if token exists
      // In a real app, you should verify the token with /api/auth/me endpoint
      setIsAuthenticated(true);
      // To fix the App.tsx condition, we need to set a minimal user object
      // In a real app, you would fetch user data from /api/auth/me
      setUser({ id: 'temp', email: 'unknown' });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('Error during login:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.data.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Handle validation errors specifically
        if (result.error?.details) {
          const validationErrors = result.error.details.map((err: any) => err.message).join('. ');
          return { success: false, error: validationErrors };
        }
        return { success: false, error: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateProfile = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const { data } = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Profile update failed' }));
        return { success: false, error: errorData.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    updateProfile,
    logout,
  };
};