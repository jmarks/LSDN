import React, { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import EmailVerification from './pages/EmailVerification'
import Profile from './pages/Profile'
import ProfileCompletion from './pages/ProfileCompletion'
import RegistrationMethodSelector from './pages/RegistrationMethodSelector'
import PackageShop from './pages/PackageShop'
import Welcome from './pages/Welcome'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'
import Matches from './pages/Matches'
import Bookings from './pages/Bookings'
import Messages from './pages/Messages'
import Dashboard from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'
import { ShoppingCartProvider } from './contexts/ShoppingCartContext'

// Simple Error Boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#fff5f5', color: '#c53030', minHeight: '100vh' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>The application encountered an error. Please try refreshing or clearing your cache.</p>
          <pre style={{ textAlign: 'left', marginTop: '1rem', padding: '1rem', background: '#eee', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.href = '/'} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}>
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route component that checks authentication and onboarding state
const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth()
  const { state } = useOnboarding()
  const location = useLocation()

  if (loading) {
    console.log('[ProtectedRoute] Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('[ProtectedRoute] Auth status:', { isAuthenticated, userId: user?.id });

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />
  }

  // Check if user has completed all required steps
  const { isOnboardingComplete, completedSteps } = state;

  console.log('[ProtectedRoute] Path check:', {
    pathname: location.pathname,
    isOnboardingComplete,
    completedSteps
  });

  if (!isOnboardingComplete) {
    if (!completedSteps.includes('auth')) {
      if (location.pathname !== '/auth') {
        return <Navigate to="/auth" replace />
      }
    } else if (!completedSteps.includes('profile')) {
      if (location.pathname !== '/onboarding/profile') {
        return <Navigate to="/onboarding/profile" replace />
      }
    } else if (!completedSteps.includes('purchase')) {
      if (location.pathname !== '/onboarding/shop' &&
        location.pathname !== '/onboarding/cart' &&
        location.pathname !== '/onboarding/checkout') {
        return <Navigate to="/onboarding/shop" replace />
      }
    }
  }

  return <Outlet />
}

// Onboarding Route component that checks authentication
const OnboardingRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  const { state } = useOnboarding()
  const location = useLocation()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('[OnboardingRoute] Status:', {
    isAuthenticated,
    isOnboardingComplete: state.isOnboardingComplete,
    pathname: location.pathname
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // If onboarding is already complete, redirect to main app ONLY if not on an onboarding page
  // Wait, if they ARE complete, they shouldn't be here at all.
  if (state.isOnboardingComplete) {
    console.log('[OnboardingRoute] Already complete, redirecting from', location.pathname, 'to /dashboard');
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

function App() {
  const { loading, isAuthenticated, user } = useAuth()
  const { state, syncWithUser } = useOnboarding()
  const location = useLocation()

  // Sync onboarding state whenever user data changes
  useEffect(() => {
    if (user) {
      console.log('[App] Syncing onboarding with user');
      syncWithUser(user);
    }
  }, [user, syncWithUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('[App] Rendering main structure');
  return (
    <ErrorBoundary>
      <div className="App" style={{ border: '2px solid red' }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        <ShoppingCartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<RegistrationMethodSelector />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/verify" element={<EmailVerification />} />

            {/* Onboarding routes */}
            <Route element={<OnboardingRoute />}>
              <Route path="/onboarding/profile" element={<ProfileCompletion />} />
              <Route path="/onboarding/welcome" element={<Welcome />} />
              <Route path="/onboarding/shop" element={<PackageShop />} />
              <Route path="/onboarding/cart" element={<ShoppingCart />} />
              <Route path="/onboarding/checkout" element={<Checkout />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/matches" element={<Layout><Matches /></Layout>} />
              <Route path="/schedule" element={<Layout><Bookings /></Layout>} />
              <Route path="/messages" element={<Layout><Messages /></Layout>} />
              <Route path="/messages/:userId" element={<Layout><Messages /></Layout>} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ShoppingCartProvider>
      </div>
    </ErrorBoundary>
  )
}

export default App
