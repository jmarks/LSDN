import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Packages from './pages/Packages'
import Matches from './pages/Matches'
import Bookings from './pages/Bookings'
import Messages from './pages/Messages'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

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
        <Route path="/" element={!user ? <Home /> : <Navigate to="/discover" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/discover" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/discover" />} />
        
        {user && (
          <Route path="/" element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:userId" element={<Messages />} />
          </Route>
        )}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
