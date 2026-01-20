import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import AuthSelection from './pages/AuthSelection'
import Register from './pages/Register'
import Login from './pages/Login'
import EmailVerification from './pages/EmailVerification'
import Profile from './pages/Profile'
import ProfileCompletion from './pages/ProfileCompletion'
import Discover from './pages/Discover'
import Packages from './pages/Packages'
import Matches from './pages/Matches'
import Bookings from './pages/Bookings'
import Messages from './pages/Messages'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import { useAuth } from './hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'

// Protected Route component that checks authentication and onboarding state
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  const { state } = useOnboarding()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // If onboarding is not complete, redirect to appropriate step
  if (!state.isOnboardingComplete) {
    // If profile step not completed, redirect to profile completion
    if (!state.completedSteps.includes('profile')) {
      return <Navigate to="/onboarding/profile" replace />
    }
    // If other required steps not completed, redirect to appropriate step
    if (!state.completedSteps.includes('preferences')) {
      return <Navigate to="/onboarding/preferences" replace />
    }
    if (!state.completedSteps.includes('welcome')) {
      return <Navigate to="/onboarding/welcome" replace />
    }
  }

  return <Outlet />
}

// Onboarding Route component that checks authentication
const OnboardingRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  const { state } = useOnboarding()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // If onboarding is already complete, redirect to main app
  if (state.isOnboardingComplete) {
    return <Navigate to="/discover" replace />
  }

  return <Outlet />
}

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="App">
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
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthSelection />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify" element={<EmailVerification />} />

        {/* Onboarding routes */}
        <Route element={<OnboardingRoute />}>
          <Route path="/onboarding/profile" element={<ProfileCompletion />} />
          <Route path="/onboarding/preferences" element={<div>Preferences Page (To be implemented)</div>} />
          <Route path="/onboarding/payment" element={<div>Payment Setup Page (To be implemented)</div>} />
          <Route path="/onboarding/welcome" element={<div>Welcome Page (To be implemented)</div>} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/discover" element={<Layout><Discover /></Layout>} />
          <Route path="/packages" element={<Layout><Packages /></Layout>} />
          <Route path="/cart" element={<Layout><ShoppingCart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
          <Route path="/matches" element={<Layout><Matches /></Layout>} />
          <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
          <Route path="/messages" element={<Layout><Messages /></Layout>} />
          <Route path="/messages/:userId" element={<Layout><Messages /></Layout>} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
